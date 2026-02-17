import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

/**
 * Script para crear la configuración de newsletter automático
 * Ejecutar con: node server/seed-newsletter-schedule.mjs
 */

async function seedNewsletterSchedule() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_URL?.split("@")[1]?.split("/")[0] || "localhost",
    user: process.env.DATABASE_URL?.split("://")[1]?.split(":")[0] || "root",
    password: process.env.DATABASE_URL?.split(":")[2]?.split("@")[0] || "",
    database: process.env.DATABASE_URL?.split("/").pop() || "test",
  });

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

    console.log(`📅 Próximo envío programado para: ${nextFriday.toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}`);

    // Insertar schedule
    const [scheduleResult] = await connection.execute(
      `INSERT INTO newsletter_schedules 
       (name, description, frequency, dayOfWeek, hour, minute, timezone, isActive, nextSendAt, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        "Newsletter Automático IPA Xerez",
        "Newsletter automático cada 15 días los viernes a las 10:00 AM (Madrid)",
        "biweekly",
        5, // Friday
        10, // 10 AM
        0, // 0 minutes
        "Europe/Madrid",
        1, // isActive = true
        nextFriday,
      ]
    );

    const scheduleId = scheduleResult.insertId;
    console.log(`✅ Schedule creado con ID: ${scheduleId}`);

    // Insertar template
    const [templateResult] = await connection.execute(
      `INSERT INTO newsletter_templates
       (scheduleId, subject, includeEvents, includePhotos, includeBlog, maxEvents, maxPhotos, maxBlogPosts, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        scheduleId,
        "IPA Xerez Newsletter - Últimas Noticias",
        1, // includeEvents = true
        1, // includePhotos = true
        1, // includeBlog = true
        5, // maxEvents
        10, // maxPhotos
        3, // maxBlogPosts
      ]
    );

    const templateId = templateResult.insertId;
    console.log(`✅ Template creado con ID: ${templateId}`);

    console.log("\n✨ Configuración completada!");
    console.log(`📧 El newsletter se enviará automáticamente cada 15 días los viernes a las 10:00 AM (Madrid)`);
    console.log(`🔄 Próximo envío: ${nextFriday.toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}`);

    await connection.end();
  } catch (error) {
    console.error("❌ Error al configurar newsletter:", error);
    await connection.end();
    process.exit(1);
  }
}

seedNewsletterSchedule();
