# IPA Xerez - Project TODO

## Newsletter System Implementation

- [x] Configurar credenciales de Gmail (GMAIL_USER, GMAIL_PASSWORD)
- [x] Crear tablas de base de datos (newsletter_subscribers, newsletter_campaigns)
- [x] Implementar helpers de base de datos para newsletter
- [x] Crear servicio de email con nodemailer
- [x] Implementar procedimientos tRPC para newsletter:
  - [x] subscribe - Suscribir a newsletter
  - [x] getSubscribers - Obtener suscriptores
  - [x] unsubscribe - Desuscribirse
  - [x] getCampaigns - Obtener campañas
  - [x] createCampaign - Crear nueva campaña
  - [x] sendCampaign - Enviar newsletter a suscriptores
- [x] Crear formulario de suscripción en página principal
- [x] Crear dashboard de administración (/admin/newsletter)
- [x] Implementar envío automático de emails con Gmail
- [x] Escribir y ejecutar tests (10 tests pasados)

## Features Completados

- [x] Sistema de suscripción a newsletter
- [x] Base de datos de suscriptores
- [x] Gestión de campañas de newsletter
- [x] Envío automático de emails
- [x] Dashboard de administración
- [x] Descarga de lista de suscriptores en CSV
- [x] Emails de confirmación de suscripción
- [x] Previsualización de newsletters

## Próximos Pasos (Opcionales)

- [ ] Agregar estadísticas de aperturas de emails
- [ ] Implementar desuscripción por link en email
- [ ] Agregar plantillas de email personalizables
- [ ] Implementar programación de envíos
- [ ] Agregar segmentación de suscriptores


## Unsubscribe Feature (Completado)

- [x] Agregar tabla de tokens de desuscripción
- [x] Crear procedimiento tRPC para desuscripción
- [x] Actualizar servicio de email con links de baja
- [x] Crear página pública de desuscripción
- [x] Generar tokens únicos para cada suscriptor
- [x] Tokens válidos por 30 días
