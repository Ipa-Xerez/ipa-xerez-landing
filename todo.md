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


## Newsletter Accessibility (Completado)

- [x] Agregar sección "Mantente Informado" en la parte superior
- [x] Ubicada después del hero para fácil acceso
- [x] Diseño responsive con colores corporativos


## Facebook Integration (Completado)

- [x] Guardar credenciales de Facebook (FACEBOOK_PAGE_ACCESS_TOKEN, FACEBOOK_PAGE_ID)
- [x] Crear router de Facebook con dos endpoints:
  - [x] facebook.sharePost - Compartir artículos de blog en Facebook
  - [x] facebook.getFeed - Obtener feed de la página de Facebook
- [x] Agregar botón "Compartir en Facebook" en panel de admin del blog
- [x] Crear componente FacebookFeed para mostrar posts en la página de inicio
- [x] Agregar sección de "Últimas Noticias en Facebook" en Home.tsx
- [x] Escribir y ejecutar tests de Facebook (4 tests pasados)
- [x] Integración completa con Facebook API Graph v18.0


## Facebook Auto-Share Scheduling (Completado)

- [x] Crear tabla de rastreo de comparticiones en Facebook
- [x] Implementar scheduler para compartir artículos automáticamente
- [x] Agregar campos de configuración en formulario de blog
- [x] Actualizar panel de admin con estado de compartición
- [x] Crear tests para validar programación automática (8 tests pasados)
