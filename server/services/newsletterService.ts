import nodemailer from "nodemailer";
import { ENV } from "../\_core/env";
import { randomBytes } from "crypto";

// Generar token único para desuscripción
export function generateUnsubscribeToken(): string {
  return randomBytes(32).toString("hex");
}

// Crear transporte de correo usando Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

/**
 * Envía un email de confirmación de suscripción
 */
export async function sendSubscriptionConfirmationEmail(
  email: string,
  name?: string,
  unsubscribeLink?: string
): Promise<boolean> {
  try {
    const htmlContent = `
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
            .button { display: inline-block; background-color: #D4AF37; color: #003366; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            h1 { margin: 0; font-size: 28px; }
            .highlight { color: #D4AF37; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Bienvenido a IPA Xerez!</h1>
            </div>
            <div class="content">
              <p>Hola ${name || "amigo"},</p>
              <p>¡Gracias por suscribirte a nuestro newsletter! Nos alegra mucho que te unas a nuestra comunidad.</p>
              <p>A partir de ahora recibirás:</p>
              <ul>
                <li>📅 Información sobre próximos eventos y actividades</li>
                <li>📰 Noticias de IPA Xerez y la hermandad policial internacional</li>
                <li>🌍 Actualizaciones sobre viajes e intercambios internacionales</li>
                <li>🎉 Invitaciones exclusivas a eventos especiales</li>
              </ul>
              <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
              <p><strong>Nuestro lema:</strong> <span class="highlight">Servo per Amikeco</span> (Servir por la Amistad)</p>              <p>Saludos cordiales,<br><strong>El equipo de IPA Xerez</strong></p>
              ${unsubscribeLink ? `<p style="margin-top: 20px; font-size: 12px; color: #999;"><a href="${unsubscribeLink}" style="color: #D4AF37; text-decoration: none;">Desuscribirse de este newsletter</a></p>` : ""}
            </div>
            <div className="footer">            <p>International Police Association - Agrupación Xerez</p>
              <p>Hermandad Policial Internacional | Amistad sin Fronteras</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "¡Bienvenido a IPA Xerez Newsletter!",
      html: htmlContent,
    });

    console.log(`[Newsletter] Confirmation email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`[Newsletter] Failed to send confirmation email to ${email}:`, error);
    return false;
  }
}

/**
 * Envía un newsletter a múltiples suscriptores
 */
export async function sendNewsletterCampaign(
  subject: string,
  content: string,
  recipients: Array<{ email: string; unsubscribeLink: string }>
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  if (recipients.length === 0) {
    console.warn("[Newsletter] No recipients provided");
    return { success: 0, failed: 0 };
  }

  try {
    // Enviar a todos los suscriptores
    for (const recipient of recipients) {
      try {
        const htmlContent = `
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
                .unsubscribe { margin-top: 20px; font-size: 12px; color: #999; }
                .unsubscribe a { color: #D4AF37; text-decoration: none; }
                h1 { margin: 0; font-size: 28px; color: #D4AF37; }
                .highlight { color: #D4AF37; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>${subject}</h1>
                </div>
                <div class="content">
                  ${content}
                  <div class="unsubscribe">
                    <p><a href="${recipient.unsubscribeLink}">Desuscribirse de este newsletter</a></p>
                  </div>
                </div>
                <div class="footer">
                  <p>International Police Association - Agrupación Xerez</p>
                  <p>Hermandad Policial Internacional | Amistad sin Fronteras</p>
                </div>
              </div>
            </body>
          </html>
        `;

        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: recipient.email,
          subject: subject,
          html: htmlContent,
        });

        success++;
      } catch (error) {
        console.error(`[Newsletter] Failed to send to ${recipient.email}:`, error);
        failed++;
      }
    }

    console.log(
      `[Newsletter] Campaign sent: ${success} successful, ${failed} failed`
    );
    return { success, failed };
  } catch (error) {
    console.error("[Newsletter] Failed to send campaign:", error);
    return { success, failed };
  }
}
