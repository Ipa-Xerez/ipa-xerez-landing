import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";

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
          
          // Send notification email
          if (contact) {
            await notifyOwner({
              title: `Nuevo mensaje de contacto: ${input.subject}`,
              content: `De: ${input.name} (${input.email})\nTeléfono: ${input.phone || "No proporcionado"}\n\nMensaje:\n${input.message}`,
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
});

export type AppRouter = typeof appRouter;
