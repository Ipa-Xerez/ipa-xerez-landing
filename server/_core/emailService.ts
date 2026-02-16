import { ENV } from "./env";

export type EmailPayload = {
  to: string;
  subject: string;
  htmlContent: string;
};

/**
 * Sends an email using the Manus Email Service
 * Returns true if successful, false otherwise
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    console.warn("[Email] Email service not configured");
    return false;
  }

  try {
    const endpoint = new URL(
      "webdevtoken.v1.WebDevService/SendEmail",
      ENV.forgeApiUrl.endsWith("/") ? ENV.forgeApiUrl : `${ENV.forgeApiUrl}/`
    ).toString();

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1",
      },
      body: JSON.stringify({
        to: payload.to,
        subject: payload.subject,
        htmlContent: payload.htmlContent,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Email] Failed to send email (${response.status} ${response.statusText})${
          detail ? `: ${detail}` : ""
        }`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return false;
  }
}

/**
 * Generates HTML for contact confirmation email
 */
export function generateContactConfirmationEmail(
  name: string,
  email: string,
  subject: string,
  message: string,
  referenceId: string
): string {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #003366 0%, #1A3A52 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .reference-box {
      background-color: #f9f9f9;
      border-left: 4px solid #D4AF37;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .reference-box p {
      margin: 5px 0;
      font-size: 14px;
    }
    .reference-box strong {
      color: #003366;
    }
    .reference-number {
      font-size: 18px;
      font-weight: bold;
      color: #D4AF37;
      font-family: monospace;
    }
    .message-box {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .message-box h3 {
      margin: 0 0 10px 0;
      color: #003366;
      font-size: 14px;
    }
    .message-content {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 14px;
      line-height: 1.5;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #666;
    }
    .footer a {
      color: #003366;
      text-decoration: none;
    }
    .button {
      display: inline-block;
      background-color: #D4AF37;
      color: #003366;
      padding: 12px 30px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .divider {
      height: 1px;
      background-color: #e0e0e0;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>IPA Xerez</h1>
      <p>Amistad y Profesionalidad sin Fronteras</p>
    </div>

    <div class="content">
      <div class="greeting">
        <p>Hola <strong>${name}</strong>,</p>
        <p>¡Gracias por ponerte en contacto con nosotros! Hemos recibido tu mensaje correctamente.</p>
      </div>

      <div class="reference-box">
        <p><strong>Número de Referencia:</strong></p>
        <p class="reference-number">#${referenceId}</p>
        <p><strong>Fecha de Recepción:</strong> ${currentDate}</p>
      </div>

      <p>A continuación, te mostramos un resumen de tu mensaje:</p>

      <div class="message-box">
        <h3>Asunto: ${subject}</h3>
        <div class="message-content">${message}</div>
      </div>

      <p>Nuestro equipo revisará tu mensaje y te responderemos lo antes posible. Si tienes alguna pregunta urgente, puedes contactarnos por:</p>

      <ul style="font-size: 14px; line-height: 1.8;">
        <li><strong>WhatsApp:</strong> +34 675 508 110</li>
        <li><strong>Email:</strong> ipaagrupacionxerez@gmail.com</li>
        <li><strong>Facebook:</strong> <a href="https://www.facebook.com/profile.php?id=61572445883496" style="color: #003366;">IPA Xerez</a></li>
        <li><strong>Instagram:</strong> <a href="https://instagram.com/ipa_xerez" style="color: #003366;">@ipa_xerez</a></li>
      </ul>

      <div class="divider"></div>

      <p style="font-size: 14px; color: #666;">
        Este es un correo automático de confirmación. Por favor, no respondas a este correo. Si necesitas ayuda adicional, utiliza los canales de contacto indicados arriba.
      </p>
    </div>

    <div class="footer">
      <p>© 2026 IPA Agrupación Xerez. Todos los derechos reservados.</p>
      <p>Servo per Amikeco</p>
    </div>
  </div>
</body>
</html>
  `;
}
