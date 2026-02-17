import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";
import { sendEmail, generateContactConfirmationEmail } from "./_core/emailService";
import { sendSubscriptionConfirmationEmail, sendNewsletterCampaign, generateUnsubscribeToken } from "./services/newsletterService";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  events: router({
    getAll: publicProcedure.query(() => db.getEvents()),
    getByMonth: publicProcedure
      .input(z.object({ year: z.number(), month: z.number() }))
      .query(({ input }) => db.getEventsByMonth(input.year, input.month)),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.date(),
        location: z.string().optional(),
        eventType: z.string(),
        image: z.string().optional(),
        registrationUrl: z.string().optional(),
      }))
      .mutation(({ input }) => db.createEvent(input)),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        date: z.date().optional(),
        location: z.string().optional(),
        eventType: z.string().optional(),
        image: z.string().optional(),
        registrationUrl: z.string().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateEvent(id, data);
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(({ input }) => db.deleteEvent(input)),
  }),

  contact: router({
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1, "El nombre es requerido"),
        email: z.string().email("Email inválido"),
        phone: z.string().optional(),
        subject: z.string().min(1, "El asunto es requerido"),
        message: z.string().min(1, "El mensaje es requerido"),
      }))
      .mutation(async ({ input }) => {
        try {
          const contact = await db.createContact(input);
          
          if (contact) {
            const referenceId = `IPA-${contact.id.toString().padStart(6, "0")}-${new Date().getFullYear()}`;
            
            await notifyOwner({
              title: `Nuevo mensaje de contacto: ${input.subject}`,
              content: `De: ${input.name} (${input.email})\nTeléfono: ${input.phone || "No proporcionado"}\nReferencia: ${referenceId}\n\nMensaje:\n${input.message}`,
            });
            
            const confirmationEmail = generateContactConfirmationEmail(
              input.name,
              input.email,
              input.subject,
              input.message,
              referenceId
            );
            
            await sendEmail({
              to: input.email,
              subject: `Confirmación de recepción - IPA Xerez [${referenceId}]`,
              htmlContent: confirmationEmail,
            });
          }
          
          return contact;
        } catch (error) {
          console.error("[Contact] Error creating contact:", error);
          throw error;
        }
      }),
    getAll: protectedProcedure.query(() => db.getContacts()),
  }),

  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email("Email inválido"),
        name: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const subscriber = await db.subscribeToNewsletter({
            email: input.email,
            name: input.name,
            status: "subscribed",
          });

          if (subscriber) {
            // Enviar email de confirmación
            await sendSubscriptionConfirmationEmail(input.email, input.name);
            
            // Notificar al propietario
            await notifyOwner({
              title: "Nuevo suscriptor a newsletter",
              content: `Email: ${input.email}\nNombre: ${input.name || "No proporcionado"}`,
            });
          }

          return {
            success: true,
            message: "¡Suscripción exitosa! Revisa tu correo para confirmar.",
          };
        } catch (error: any) {
          // Si el email ya existe, devolver mensaje amigable
          if (error.message?.includes("Duplicate")) {
            return {
              success: false,
              message: "Este email ya está suscrito a nuestro newsletter.",
            };
          }
          console.error("[Newsletter] Error subscribing:", error);
          throw error;
        }
      }),

    getSubscribers: protectedProcedure.query(() => db.getNewsletterSubscribers("subscribed")),

    unsubscribeByEmail: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(({ input }) => db.unsubscribeFromNewsletter(input.email)),

    getCampaigns: protectedProcedure.query(() => db.getNewsletterCampaigns()),

    createCampaign: protectedProcedure
      .input(z.object({
        subject: z.string().min(1, "El asunto es requerido"),
        content: z.string().min(1, "El contenido es requerido"),
      }))
      .mutation(async ({ input }) => {
        try {
          const campaign = await db.createNewsletterCampaign({
            subject: input.subject,
            content: input.content,
            status: "draft",
          });
          return campaign;
        } catch (error) {
          console.error("[Newsletter] Error creating campaign:", error);
          throw error;
        }
      }),

    sendCampaign: protectedProcedure
      .input(z.object({ campaignId: z.number() }))
      .mutation(async ({ input }) => {
        try {
          const campaign = await db.getNewsletterCampaigns();
          const targetCampaign = campaign.find(c => c.id === input.campaignId);

          if (!targetCampaign) {
            throw new Error("Campaign not found");
          }

          const subscribers = await db.getNewsletterSubscribers("subscribed");

          if (subscribers.length === 0) {
            return {
              success: false,
              message: "No hay suscriptores para enviar el newsletter.",
            };
          }

          // Generar tokens de desuscripción para cada suscriptor
          const recipientsWithUnsubscribe = await Promise.all(
            subscribers.map(async (subscriber) => {
              const token = generateUnsubscribeToken();
              await db.createUnsubscribeToken(subscriber.id, token);
              const unsubscribeLink = `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/unsubscribe?token=${token}`;
              return {
                email: subscriber.email,
                unsubscribeLink,
              };
            })
          );

          const result = await sendNewsletterCampaign(
            targetCampaign.subject,
            targetCampaign.content,
            recipientsWithUnsubscribe
          );

          // Actualizar el estado de la campaña
          if (result.success > 0) {
            await db.updateNewsletterCampaign(input.campaignId, {
              status: "sent",
              sentAt: new Date(),
              recipientCount: result.success,
            });
          }

          return {
            success: true,
            message: `Newsletter enviado a ${result.success} suscriptores.`,
            sent: result.success,
            failed: result.failed,
          };
        } catch (error) {
          console.error("[Newsletter] Error sending campaign:", error);
          throw error;
        }
      }),
    unsubscribe: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const unsubscribeToken = await db.getUnsubscribeToken(input.token);

          if (!unsubscribeToken) {
            throw new Error("Token de desuscripción inválido o expirado");
          }

          // Verificar si el token ha expirado
          if (new Date() > unsubscribeToken.expiresAt) {
            throw new Error("El token de desuscripción ha expirado");
          }

          // Desuscribir al usuario
          await db.unsubscribeFromNewsletterById(unsubscribeToken.subscriberId);

          // Eliminar el token
          await db.deleteUnsubscribeToken(input.token);

          return {
            success: true,
            message: "Te has desuscrito exitosamente del newsletter.",
          };
        } catch (error) {
          console.error("[Newsletter] Error unsubscribing:", error);
          throw error;
        }
      }),

    getStats: protectedProcedure.query(() => db.getNewsletterStats()),

    getCampaignStats: protectedProcedure
      .input(z.object({ campaignId: z.number() }))
      .query(({ input }) => db.getCampaignStats(input.campaignId)),

    getAllCampaignsStats: protectedProcedure.query(() => db.getAllCampaignsStats()),
  }),
})

export type AppRouter = typeof appRouter;
