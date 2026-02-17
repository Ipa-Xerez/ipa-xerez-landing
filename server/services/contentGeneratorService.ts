import { getDb } from "../db";
import { events, blogPosts } from "../../drizzle/schema";
import { eq, gte, desc, and } from "drizzle-orm";

/**
 * Interfaz para contenido generado
 */
export interface GeneratedContent {
  subject: string;
  htmlContent: string;
  plainText: string;
}

/**
 * Genera contenido automático para newsletters
 * Incluye eventos recientes y posts de blog
 */
export async function generateNewsletterContent(
  daysBack: number = 15
): Promise<GeneratedContent> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const now = new Date();
  const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

  // Obtener eventos recientes
  const recentEvents = await db
    .select()
    .from(events)
    .where(
      gte(events.date, startDate)
    )
    .orderBy(desc(events.date))
    .limit(5);

  // Obtener posts de blog recientes
  const recentBlogPosts = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.isPublished, 1),
        gte(blogPosts.publishedAt, startDate)
      )
    )
    .orderBy(desc(blogPosts.publishedAt))
    .limit(3);

  // Generar asunto dinámico
  const subject = `IPA Xerez Newsletter - ${now.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  })}`;

  // Generar contenido HTML
  const htmlContent = generateHtmlContent(recentEvents, recentBlogPosts);

  // Generar texto plano
  const plainText = generatePlainText(recentEvents, recentBlogPosts);

  return {
    subject,
    htmlContent,
    plainText,
  };
}

/**
 * Genera contenido HTML para el newsletter
 */
function generateHtmlContent(recentEvents: any[], recentBlogPosts: any[]): string {
  const eventsHtml = recentEvents
    .map(
      (event) => `
    <div style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #D4AF37; border-radius: 3px;">
      <h3 style="margin-top: 0; color: #003366;">${event.title}</h3>
      ${event.description ? `<p style="color: #666; margin: 10px 0;">${event.description}</p>` : ""}
      <p style="margin: 10px 0; color: #999; font-size: 14px;">
        📅 ${new Date(event.date).toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        ${event.location ? ` | 📍 ${event.location}` : ""}
      </p>
      ${event.registrationUrl ? `<a href="${event.registrationUrl}" style="color: #D4AF37; text-decoration: none; font-weight: bold;">Ver más →</a>` : ""}
    </div>
  `
    )
    .join("");

  const blogHtml = recentBlogPosts
    .map(
      (post) => `
    <div style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #D4AF37; border-radius: 3px;">
      ${post.image ? `<img src="${post.image}" alt="${post.title}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 3px; margin-bottom: 10px;">` : ""}
      <h3 style="margin-top: 0; color: #003366;">${post.title}</h3>
      ${post.excerpt ? `<p style="color: #666; margin: 10px 0;">${post.excerpt}</p>` : ""}
      <p style="margin: 10px 0; color: #999; font-size: 14px;">
        📝 ${post.author || "IPA Xerez"} | 📅 ${new Date(post.publishedAt || post.createdAt).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        ${post.category ? ` | 🏷️ ${post.category}` : ""}
      </p>
      <a href="#" style="color: #D4AF37; text-decoration: none; font-weight: bold;">Leer más →</a>
    </div>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
          .header { background: linear-gradient(135deg, #003366 0%, #004d99 100%); color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .highlight { color: #D4AF37; }
          h1 { margin: 0; font-size: 28px; }
          h2 { color: #003366; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; }
          .section { margin-bottom: 30px; }
          .unsubscribe { margin-top: 20px; font-size: 12px; color: #999; }
          .unsubscribe a { color: #D4AF37; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌍 IPA Xerez Newsletter</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Hermandad Policial Internacional</p>
          </div>
          <div class="content">
            <p>¡Hola amigo!</p>
            <p>Te traemos las últimas noticias y eventos de <span class="highlight">IPA Xerez</span>. Sigue leyendo para conocer las actividades próximas.</p>

            ${recentEvents.length > 0 ? `
            <div class="section">
              <h2>📅 Próximos Eventos</h2>
              ${eventsHtml}
            </div>
            ` : `
            <div class="section">
              <p style="color: #999;">No hay eventos programados en este período. ¡Mantente atento a nuestras próximas actividades!</p>
            </div>
            `}

            ${recentBlogPosts.length > 0 ? `
            <div class="section">
              <h2>📰 Últimas Publicaciones del Blog</h2>
              ${blogHtml}
            </div>
            ` : ""}

            <div class="section">
              <h2>🤝 Nuestro Lema</h2>
              <p style="text-align: center; font-size: 18px; color: #D4AF37; font-weight: bold;">
                Servo per Amikeco
              </p>
              <p style="text-align: center; color: #666; font-size: 14px;">
                Servir por la Amistad
              </p>
            </div>

            <div class="section">
              <h2>📞 Mantente en Contacto</h2>
              <p>¿Tienes preguntas o sugerencias? Nos encantaría escucharte:</p>
              <ul style="color: #666;">
                <li>📧 Email: ipaagrupacionxerez@gmail.com</li>
                <li>📱 WhatsApp: +34 675 50 81 10</li>
                <li>📘 Facebook: <a href="https://www.facebook.com/profile.php?id=61572445883496" style="color: #D4AF37; text-decoration: none;">IPA Xerez</a></li>
                <li>📸 Instagram: <a href="https://instagram.com/ipa_xerez" style="color: #D4AF37; text-decoration: none;">@ipa_xerez</a></li>
              </ul>
            </div>

            <p style="margin-top: 30px; color: #999; font-size: 12px;">
              Este es un newsletter automático de IPA Xerez. Recibirás estos correos cada 15 días los viernes a las 10:00 AM (hora de Madrid).
            </p>
          </div>
          <div class="footer">
            <p>International Police Association - Agrupación Xerez</p>
            <p>Hermandad Policial Internacional | Amistad sin Fronteras</p>
            <p style="margin-top: 10px; font-size: 11px;">
              Servo per Amikeco - Desde 1950 | 370.000+ Miembros | 60+ Países
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Genera contenido en texto plano para el newsletter
 */
function generatePlainText(recentEvents: any[], recentBlogPosts: any[]): string {
  const eventsText = recentEvents
    .map(
      (event) => `
📅 ${event.title}
Fecha: ${new Date(event.date).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
${event.location ? `Ubicación: ${event.location}` : ""}
${event.description ? `Descripción: ${event.description}` : ""}
---
`
    )
    .join("\n");

  const blogText = recentBlogPosts
    .map(
      (post) => `
📰 ${post.title}
Autor: ${post.author || "IPA Xerez"}
Fecha: ${new Date(post.publishedAt || post.createdAt).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
${post.category ? `Categoría: ${post.category}` : ""}
${post.excerpt ? `\n${post.excerpt}` : ""}
---
`
    )
    .join("\n");

  return `
IPA XEREZ NEWSLETTER

¡Hola amigo!

Te traemos las últimas noticias y eventos de IPA Xerez.

PRÓXIMOS EVENTOS:
${recentEvents.length > 0 ? eventsText : "No hay eventos programados en este período."}

ÚLTIMAS PUBLICACIONES DEL BLOG:
${recentBlogPosts.length > 0 ? blogText : "No hay publicaciones recientes."}

NUESTRO LEMA:
Servo per Amikeco
(Servir por la Amistad)

MANTENTE EN CONTACTO:
📧 Email: ipaagrupacionxerez@gmail.com
📱 WhatsApp: +34 675 50 81 10
📘 Facebook: https://www.facebook.com/profile.php?id=61572445883496
📸 Instagram: https://instagram.com/ipa_xerez

---
International Police Association - Agrupación Xerez
Hermandad Policial Internacional | Amistad sin Fronteras
Servo per Amikeco - Desde 1950 | 370.000+ Miembros | 60+ Países
  `;
}
