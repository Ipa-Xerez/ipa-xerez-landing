import cron, { ScheduledTask } from "node-cron";
import { getDb } from "../db";
import {
  newsletterSchedules,
  newsletterTemplates,
  newsletterCampaigns,
  newsletterSubscribers,
  unsubscribeTokens,
} from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { generateNewsletterContent } from "./contentGeneratorService";
import { sendNewsletterCampaign } from "./newsletterService";

interface ActiveScheduleTask {
  id: number;
  cronExpression: string;
  task: ScheduledTask;
}

const activeTasks: Map<number, ActiveScheduleTask> = new Map();

/**
 * Calcula la expresión cron basada en la frecuencia y hora
 * Formato: segundo minuto hora día mes díaSemana
 */
function calculateCronExpression(
  frequency: string,
  dayOfWeek?: number,
  hour: number = 10,
  minute: number = 0
): string {
  const second = 0;

  switch (frequency) {
    case "daily":
      return `${second} ${minute} ${hour} * * *`;

    case "weekly":
      // dayOfWeek: 0-6 (0=Sunday, 5=Friday)
      const weekDay = dayOfWeek ?? 5; // Default to Friday
      return `${second} ${minute} ${hour} * * ${weekDay}`;

    case "biweekly":
      // Cada 15 días los viernes a la hora especificada
      // Nota: node-cron no soporta "cada 15 días" directamente
      // Usamos una expresión que se ejecuta cada viernes y luego verificamos en la función
      const biWeekDay = dayOfWeek ?? 5;
      return `${second} ${minute} ${hour} * * ${biWeekDay}`;

    case "monthly":
      return `${second} ${minute} ${hour} 1 * *`;

    default:
      return `${second} ${minute} ${hour} * * 5`; // Default: every Friday at specified time
  }
}

/**
 * Verifica si debe enviar newsletter (para frecuencias que no se pueden expresar en cron)
 */
async function shouldSendNewsletter(scheduleId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const schedule = await db
    .select()
    .from(newsletterSchedules)
    .where(eq(newsletterSchedules.id, scheduleId))
    .limit(1);

  if (schedule.length === 0) return false;

  const sched = schedule[0];

  // Si es biweekly, verificar que han pasado 15 días desde el último envío
  if (sched.frequency === "biweekly" && sched.lastSentAt) {
    const daysSinceLastSend = Math.floor(
      (Date.now() - sched.lastSentAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceLastSend >= 15;
  }

  return true;
}

/**
 * Ejecuta el envío de newsletter automático
 */
async function executeNewsletterSend(scheduleId: number): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      console.error("[Newsletter Scheduler] Database not available");
      return;
    }

    // Verificar si debe enviar
    const shouldSend = await shouldSendNewsletter(scheduleId);
    if (!shouldSend) {
      console.log(
        `[Newsletter Scheduler] Skipping schedule ${scheduleId}: not enough time since last send`
      );
      return;
    }

    // Obtener configuración del schedule
    const schedules = await db
      .select()
      .from(newsletterSchedules)
      .where(eq(newsletterSchedules.id, scheduleId))
      .limit(1);

    if (schedules.length === 0) {
      console.error(
        `[Newsletter Scheduler] Schedule ${scheduleId} not found`
      );
      return;
    }

    const schedule = schedules[0];

    // Obtener template
    const templates = await db
      .select()
      .from(newsletterTemplates)
      .where(eq(newsletterTemplates.scheduleId, scheduleId))
      .limit(1);

    if (templates.length === 0) {
      console.error(
        `[Newsletter Scheduler] Template for schedule ${scheduleId} not found`
      );
      return;
    }

    const template = templates[0];

    // Generar contenido
    const daysBack = schedule.frequency === "biweekly" ? 15 : 7;
    const content = await generateNewsletterContent(daysBack);

    // Obtener suscriptores activos
    const subscribers = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.status, "subscribed"));

    if (subscribers.length === 0) {
      console.log("[Newsletter Scheduler] No active subscribers");
      return;
    }

    // Crear campaña en BD
    const campaignResult = await db.insert(newsletterCampaigns).values({
      subject: content.subject,
      content: content.htmlContent,
      status: "scheduled",
      recipientCount: subscribers.length,
    });

    const campaignId = (campaignResult as any).insertId;

    // Preparar recipients con links de desuscripción
    const recipients = await Promise.all(
      subscribers.map(async (subscriber) => {
        // Generar o obtener token de desuscripción
        const tokens = await db
          .select()
          .from(unsubscribeTokens)
          .where(eq(unsubscribeTokens.subscriberId, subscriber.id))
          .limit(1);

        let token = tokens.length > 0 ? tokens[0].token : null;

        if (!token) {
          // Generar nuevo token
          const { generateUnsubscribeToken } = await import(
            "./newsletterService"
          );
          token = generateUnsubscribeToken();

          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 30);

          await db.insert(unsubscribeTokens).values({
            subscriberId: subscriber.id,
            token,
            expiresAt,
          });
        }

        const unsubscribeLink = `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/unsubscribe?token=${token}`;

        return {
          email: subscriber.email,
          unsubscribeLink,
        };
      })
    );

    // Enviar newsletter
    const result = await sendNewsletterCampaign(
      content.subject,
      content.htmlContent,
      recipients
    );

    // Actualizar campaña con resultados
    await db
      .update(newsletterCampaigns)
      .set({
        status: result.failed === 0 ? "sent" : "failed",
        sentAt: new Date(),
      })
      .where(eq(newsletterCampaigns.id, campaignId));

    // Actualizar schedule con fecha de último envío
    await db
      .update(newsletterSchedules)
      .set({
        lastSentAt: new Date(),
        nextSendAt: calculateNextSendDate(schedule),
      })
      .where(eq(newsletterSchedules.id, scheduleId));

    console.log(
      `[Newsletter Scheduler] Newsletter sent successfully: ${result.success} sent, ${result.failed} failed`
    );
  } catch (error) {
    console.error(
      `[Newsletter Scheduler] Error executing newsletter send for schedule ${scheduleId}:`,
      error
    );
  }
}

/**
 * Calcula la próxima fecha de envío
 */
function calculateNextSendDate(schedule: any): Date {
  const next = new Date();

  switch (schedule.frequency) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;

    case "weekly":
      next.setDate(next.getDate() + 7);
      break;

    case "biweekly":
      next.setDate(next.getDate() + 15);
      break;

    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
  }

  next.setHours(schedule.hour || 10);
  next.setMinutes(schedule.minute || 0);
  next.setSeconds(0);

  return next;
}

/**
 * Inicia un schedule de newsletter
 */
export async function startNewsletterSchedule(scheduleId: number): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      console.error("[Newsletter Scheduler] Database not available");
      return;
    }

    // Obtener configuración del schedule
    const schedules = await db
      .select()
      .from(newsletterSchedules)
      .where(eq(newsletterSchedules.id, scheduleId))
      .limit(1);

    if (schedules.length === 0) {
      console.error(
        `[Newsletter Scheduler] Schedule ${scheduleId} not found`
      );
      return;
    }

    const schedule = schedules[0];

    if (!schedule.isActive) {
      console.log(
        `[Newsletter Scheduler] Schedule ${scheduleId} is not active`
      );
      return;
    }

    // Detener tarea anterior si existe
    if (activeTasks.has(scheduleId)) {
      const existing = activeTasks.get(scheduleId);
      if (existing) {
        existing.task.stop();
        activeTasks.delete(scheduleId);
      }
    }

    // Crear expresión cron
    const cronExpression = calculateCronExpression(
      schedule.frequency,
      schedule.dayOfWeek ?? undefined,
      schedule.hour,
      schedule.minute ?? 0
    );

    // Crear y registrar tarea
    const task = cron.schedule(cronExpression, () => {
      console.log(
        `[Newsletter Scheduler] Running scheduled task for schedule ${scheduleId}`
      );
      executeNewsletterSend(scheduleId);
    });

    activeTasks.set(scheduleId, {
      id: scheduleId,
      cronExpression,
      task,
    });

    console.log(
      `[Newsletter Scheduler] Started schedule ${scheduleId} with cron: ${cronExpression}`
    );
  } catch (error) {
    console.error(
      `[Newsletter Scheduler] Error starting schedule ${scheduleId}:`,
      error
    );
  }
}

/**
 * Detiene un schedule de newsletter
 */
export async function stopNewsletterSchedule(scheduleId: number): Promise<void> {
  const existing = activeTasks.get(scheduleId);
  if (existing) {
    existing.task.stop();
    activeTasks.delete(scheduleId);
    console.log(`[Newsletter Scheduler] Stopped schedule ${scheduleId}`);
  }
}

/**
 * Inicia todos los schedules activos
 */
export async function initializeNewsletterSchedules(): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      console.error("[Newsletter Scheduler] Database not available");
      return;
    }

    // Obtener todos los schedules activos
    const schedules = await db
      .select()
      .from(newsletterSchedules)
      .where(eq(newsletterSchedules.isActive, 1));

    console.log(
      `[Newsletter Scheduler] Initializing ${schedules.length} active schedules`
    );

    for (const schedule of schedules) {
      await startNewsletterSchedule(schedule.id);
    }
  } catch (error) {
    console.error(
      "[Newsletter Scheduler] Error initializing schedules:",
      error
    );
  }
}

/**
 * Obtiene lista de tareas activas
 */
export function getActiveSchedules(): ActiveScheduleTask[] {
  return Array.from(activeTasks.values());
}
