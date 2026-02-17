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


## Facebook Webhooks & Real-time Sync (Completado)

- [x] Crear tabla de métricas de engagement en base de datos
- [x] Configurar endpoint webhook en Express
- [x] Implementar procesamiento de eventos de Facebook
- [x] Crear procedimientos tRPC para obtener métricas
- [x] Actualizar panel de admin con estadísticas en vivo
- [x] Crear tests para webhooks (8 tests pasados)


## Upcoming Events Carousel (Completado)

- [x] Crear componente de carrusel de eventos
- [x] Agregar sección de próximos eventos en Home.tsx
- [x] Crear tests para carrusel (8 tests pasados)


## Social Media Reorganization (Completado)

- [x] Mover sección de Facebook después de Instagram
- [x] Agregar botón "Síguenos en Redes" en el hero

## Facebook Integration Removal (Completado)

- [x] Eliminada toda la funcionalidad de integración de Facebook
- [x] Removidos componentes (FacebookFeed, FacebookEngagementStats)
- [x] Removidos servicios (facebookScheduler, facebookWebhookService)
- [x] Removidos procedimientos tRPC de Facebook
- [x] Removidos endpoints webhook de Facebook
- [x] Removidas tablas y funciones de base de datos de Facebook
- [x] Removidas referencias en BlogAdmin.tsx
- [x] Mantenidos solo los enlaces directos a redes sociales


## Social Media Cleanup (Completado)

- [x] Eliminar sección "Síguenos en Redes" del final
- [x] Eliminar sección de Instagram Feed
- [x] Mantener solo iconos en la parte superior
