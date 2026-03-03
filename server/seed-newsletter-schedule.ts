import { getDb } from "./db";
import { newsletterSchedules, newsletterTemplates } from "../drizzle/schema";
import { eq } from "drizzle-orm";

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

    // Verificar si ya existe un schedule activo
    const existingSchedules = await db
      .select()
      .from(newsletterSchedules)
      .where(eq(newsletterSchedules.isActive, 1));

    if (existingSchedules.length > 0) {
      console.log("ℹ️  Ya existe un schedule activo. Usando el existente...");
      const scheduleId = existingSchedules[0].id;

      // Verificar si ya tiene template
      const existingTemplates = await db
        .select()
        .from(newsletterTemplates)
        .where(eq(newsletterTemplates.scheduleId, scheduleId));

      if (existingTemplates.length > 0) {
        console.log("✅ Newsletter ya está configurado y activo");
        console.log(
          `📧 El newsletter se enviará automáticamente cada 15 días los viernes a las 10:00 AM (Madrid)`
        );
        process.exit(0);
      }
    }

    // Insertar schedule
    await db.insert(newsletterSchedules).values({
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

    // Obtener el schedule recién creado
    const schedules = await db
      .select()
      .from(newsletterSchedules)
      .where(eq(newsletterSchedules.name, "Newsletter Automático IPA Xerez"));

    if (schedules.length === 0) {
      throw new Error("No se pudo crear el schedule");
    }

    const scheduleId = schedules[0].id;
    console.log(`✅ Schedule creado con ID: ${scheduleId}`);

    // Insertar template
    await db.insert(newsletterTemplates).values({
      scheduleId: scheduleId,
      subject: "IPA Xerez Newsletter - Últimas Noticias",
      includeEvents: 1, // true
      includePhotos: 1, // true
      includeBlog: 1, // true
      maxEvents: 5,
      maxPhotos: 10,
      maxBlogPosts: 3,
    });

    const templateId = (await db
      .select()
      .from(newsletterTemplates)
      .where(eq(newsletterTemplates.scheduleId, scheduleId)))[0]?.id;

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
