import { getDb } from "./db";
import { newsletterSchedules, newsletterTemplates } from "../drizzle/schema";

/**
 * Script para crear la configuración de newsletter automático
 * Ejecutar con: pnpm tsx server/seed-newsletter-schedule.ts
 */

async function seedNewsletterSchedule() {
  const db = await getDb();
  if (!db) {
    console.error("❌ Database not available");
    process.exit(1);
  }

  try {
    console.log("🚀 Configurando newsletter automático cada 15 días...");

    // Calcular próximo viernes a las 10:00 AM (Madrid)
    const now = new Date();
    const nextFriday = new Date(now);

    // Encontrar el próximo viernes
    const dayOfWeek = nextFriday.getDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
    nextFriday.setDate(nextFriday.getDate() + daysUntilFriday);
    nextFriday.setHours(10, 0, 0, 0);

    console.log(
      `📅 Próximo envío programado para: ${nextFriday.toLocaleString("es-ES", {
        timeZone: "Europe/Madrid",
      })}`
    );

    // Insertar schedule
    const scheduleResult = await db.insert(newsletterSchedules).values({
      name: "Newsletter Automático IPA Xerez",
      description:
        "Newsletter automático cada 15 días los viernes a las 10:00 AM (Madrid)",
      frequency: "biweekly",
      dayOfWeek: 5, // Friday
      hour: 10, // 10 AM
      minute: 0, // 0 minutes
      timezone: "Europe/Madrid",
      isActive: 1, // true
      nextSendAt: nextFriday,
    });

    const scheduleId = (scheduleResult as any).insertId;
    console.log(`✅ Schedule creado con ID: ${scheduleId}`);

    // Insertar template
    const templateResult = await db.insert(newsletterTemplates).values({
      scheduleId: scheduleId,
      subject: "IPA Xerez Newsletter - Últimas Noticias",
      includeEvents: 1, // true
      includePhotos: 1, // true
      includeBlog: 1, // true
      maxEvents: 5,
      maxPhotos: 10,
      maxBlogPosts: 3,
    });

    const templateId = (templateResult as any).insertId;
    console.log(`✅ Template creado con ID: ${templateId}`);

    console.log("\n✨ Configuración completada!");
    console.log(
      `📧 El newsletter se enviará automáticamente cada 15 días los viernes a las 10:00 AM (Madrid)`
    );
    console.log(
      `🔄 Próximo envío: ${nextFriday.toLocaleString("es-ES", {
        timeZone: "Europe/Madrid",
      })}`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error al configurar newsletter:", error);
    process.exit(1);
  }
}

seedNewsletterSchedule();
