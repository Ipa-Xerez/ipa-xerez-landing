import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";
import { sendEmail, generateContactConfirmationEmail } from "./_core/emailService";
import { sendSubscriptionConfirmationEmail, sendNewsletterCampaign, generateUnsubscribeToken } from "./services/newsletterService";
import { storagePut } from "./storage";

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
    getUpcoming: publicProcedure.query(() => db.getUpcomingEvents()),
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

  blog: router({
    getAll: publicProcedure.query(() => db.getBlogPosts()),
    getRecent: publicProcedure
      .input(z.object({ limit: z.number().default(5) }))
      .query(({ input }) => db.getRecentBlogPosts(input.limit)),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => db.getBlogPostBySlug(input.slug)),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getBlogPostById(input.id)),
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(({ input }) => db.searchBlogPosts(input.query)),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string(),
        author: z.string().optional(),
        image: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        isPublished: z.number().optional(),
        publishedAt: z.date().optional(),
      }))
      .mutation(({ input }) => db.createBlogPost(input)),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        author: z.string().optional(),
        image: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        isPublished: z.number().optional(),
        publishedAt: z.date().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateBlogPost(id, data);
      }),
     delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteBlogPost(input.id)),
    uploadImage: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        mimeType: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          // Convert base64 to buffer
          const buffer = Buffer.from(input.fileData, 'base64');
          
          // Generate unique file key
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(7);
          const fileKey = `blog-images/${timestamp}-${random}-${input.fileName}`;
          
          // Upload to S3
          const result = await storagePut(fileKey, buffer, input.mimeType);
          
          return {
            success: true,
            url: result.url,
            key: result.key,
          };
        } catch (error) {
          console.error("[Blog] Error uploading image:", error);
          throw error;
        }
      }),
  }),


  admin: router({
    isAdmin: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(({ input }) => db.isUserAdmin(input.email)),
    getAll: protectedProcedure.query(() => db.getAllAdministrators()),
    add: protectedProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
        permissions: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.email || !ctx.user?.id) throw new Error("Not authenticated");
        const isAdmin = await db.isUserAdmin(ctx.user.email);
        if (!isAdmin) throw new Error("Not authorized");
        return db.addAdministrator({
          email: input.email,
          userId: ctx.user.id,
          name: input.name,
          permissions: input.permissions || "blog,newsletter,events",
          addedBy: ctx.user.id,
        });
      }),
    remove: protectedProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.email) throw new Error("Not authenticated");
        const isAdmin = await db.isUserAdmin(ctx.user.email);
        if (!isAdmin) throw new Error("Not authorized");
        return db.removeAdministrator(input.email);
      }),
  }),

  eventRegistrations: router({
    register: publicProcedure
      .input(z.object({
        eventId: z.number(),
        name: z.string().min(1, "El nombre es requerido"),
        email: z.string().email("Email inválido"),
        phone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const registration = await db.createEventRegistration(input);
          
          if (registration) {
            const confirmationEmail = `
              <h2>¡Inscripción confirmada!</h2>
              <p>Hola ${input.name},</p>
              <p>Tu inscripción al evento ha sido registrada exitosamente.</p>
              <p>Recibirás más detalles sobre el evento próximamente.</p>
            `;
            
            await sendEmail({
              to: input.email,
              subject: "Confirmación de inscripción - IPA Xerez",
              htmlContent: confirmationEmail,
            });
          }
          
          return registration;
        } catch (error) {
          console.error("[EventRegistrations] Error registering:", error);
          throw error;
        }
      }),
    
    getByEvent: publicProcedure
      .input(z.object({ eventId: z.number() }))
      .query(({ input }) => db.getEventRegistrations(input.eventId)),
    
    getByEmail: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(({ input }) => db.getEventRegistrationsByEmail(input.email)),
    
    cancel: publicProcedure
      .input(z.object({ registrationId: z.number() }))
      .mutation(({ input }) => db.cancelEventRegistration(input.registrationId)),
  }),

  documents: router({
    uploadAndCreate: protectedProcedure
      .input(z.object({
        title: z.string().min(1, "El titulo es requerido"),
        description: z.string().optional(),
        documentType: z.string().min(1, "El tipo de documento es requerido"),
        fileName: z.string().min(1, "El nombre del archivo es requerido"),
        fileData: z.string(), // base64 encoded file
        isPublic: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          // Convertir base64 a buffer
          const buffer = Buffer.from(input.fileData, 'base64');
          
          // Determinar el tipo MIME
          let mimeType = 'application/octet-stream';
          if (input.fileName.endsWith('.pdf')) mimeType = 'application/pdf';
          else if (input.fileName.endsWith('.docx')) mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          else if (input.fileName.endsWith('.xlsx')) mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          
          // Subir a S3
          const fileKey = `documents/${Date.now()}-${input.fileName}`;
          const { url } = await storagePut(fileKey, buffer, mimeType);
          
          // Crear documento con URL de S3
          const doc = await db.createPrivateDocument({
            title: input.title,
            description: input.description,
            documentType: input.documentType,
            fileUrl: url,
            fileName: input.fileName,
            uploadedBy: ctx.user?.id,
            isPublic: input.isPublic || 0,
          });
          return doc;
        } catch (error) {
          console.error("[Documents] Error uploading document:", error);
          throw error;
        }
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1, "El titulo es requerido"),
        description: z.string().optional(),
        documentType: z.string().min(1, "El tipo de documento es requerido"),
        fileUrl: z.string().url("URL invalida"),
        fileName: z.string().min(1, "El nombre del archivo es requerido"),
        isPublic: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const doc = await db.createPrivateDocument({
            title: input.title,
            description: input.description,
            documentType: input.documentType,
            fileUrl: input.fileUrl,
            fileName: input.fileName,
            uploadedBy: ctx.user?.id,
            isPublic: input.isPublic || 0,
          });
          return doc;
        } catch (error) {
          console.error("[Documents] Error creating document:", error);
          throw error;
        }
      }),

    getAll: protectedProcedure.query(async () => {
      try {
        return await db.getPrivateDocuments(false);
      } catch (error) {
        console.error("[Documents] Error fetching documents:", error);
        throw error;
      }
    }),

    getByType: publicProcedure
      .input(z.object({ documentType: z.string() }))
      .query(async ({ input }) => {
        try {
          return await db.getPrivateDocumentsByType(input.documentType);
        } catch (error) {
          console.error("[Documents] Error fetching documents by type:", error);
          throw error;
        }
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        try {
          const doc = await db.getPrivateDocumentById(input.id);
          if (doc) {
            await db.incrementDocumentViewCount(input.id);
          }
          return doc;
        } catch (error) {
          console.error("[Documents] Error fetching document:", error);
          throw error;
        }
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        documentType: z.string().optional(),
        isPublic: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const { id, ...updates } = input;
          return await db.updatePrivateDocument(id, updates);
        } catch (error) {
          console.error("[Documents] Error updating document:", error);
          throw error;
        }
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        try {
          const success = await db.deletePrivateDocument(input.id);
          return { success };
        } catch (error) {
          console.error("[Documents] Error deleting document:", error);
          throw error;
        }
      }),
  }),

  members: router({
    validateMemberNumber: publicProcedure
      .input(z.object({ memberNumber: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const member = await db.getIpaMemberByNumber(input.memberNumber);
          if (member) {
            return {
              success: true,
              message: "Acceso concedido",
              member,
            };
          } else {
            return {
              success: false,
              message: "Numero de socio no encontrado. Por favor verifica tu numero.",
            };
          }
        } catch (error) {
          console.error("[Members] Error validating member:", error);
          return {
            success: false,
            message: "Error al validar el numero de socio",
          };
        }
      }),

    getMemberDocuments: publicProcedure
      .input(z.object({ memberNumber: z.string() }))
      .query(async ({ input }) => {
        try {
          return await db.getPrivateDocuments(true);
        } catch (error) {
          console.error("[Members] Error fetching documents:", error);
          throw error;
        }
      }),

    seedMembers: protectedProcedure
      .mutation(async ({ ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can seed members");
        }
        try {
          const fs = await import("fs");
          const path = await import("path");
          const { fileURLToPath } = await import("url");
          const __dirname = path.dirname(fileURLToPath(import.meta.url));
          const jsonPath = path.join(__dirname, "../socios_ipa_xerez.json");
          const jsonData = fs.readFileSync(jsonPath, "utf-8");
          const members = JSON.parse(jsonData);
          const inserted = await db.importIpaMembers(members);
          return { success: true, inserted, total: members.length };
        } catch (error) {
          console.error("[Members] Error seeding members:", error);
          throw error;
        }
      }),
  }),

  downloads: router({
    recordDownload: protectedProcedure
      .input(z.object({
        documentId: z.number(),
        memberId: z.number(),
        memberName: z.string(),
        memberEmail: z.string(),
      }))
      .mutation(({ input }) => db.recordDocumentDownload(input.documentId, input.memberId, input.memberName, input.memberEmail)),
    
    getDocumentDownloads: protectedProcedure
      .input(z.object({ documentId: z.number() }))
      .query(({ input }) => db.getDocumentDownloads(input.documentId)),
    
    getDownloadStats: protectedProcedure
      .input(z.object({ documentId: z.number() }))
      .query(({ input }) => db.getDownloadStats(input.documentId)),
    
    getAllDownloadsHistory: protectedProcedure
      .query(() => db.getAllDownloadsHistory()),
    
    getMemberDownloadHistory: protectedProcedure
      .input(z.object({ memberId: z.number() }))
      .query(({ input }) => db.getMemberDownloadHistory(input.memberId)),
  }),
})
export type AppRouter = typeof appRouter;
