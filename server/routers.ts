import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  createRegistration,
  deleteRegistration,
  getEventById,
  listEvents,
  listRegistrations,
  updateRegistration,
} from "./mongodb";

const registrationInput = z.object({
  eventId: z.string().min(1),
  eventTitle: z.string().min(1),
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().min(7, "Please enter a valid phone number."),
  tickets: z.number().int().min(1).max(8),
  notes: z.string().trim().max(500).optional().default(""),
  status: z.enum(["confirmed", "waitlist"]).default("confirmed"),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  events: router({
    list: publicProcedure.query(() => listEvents()),
    getById: publicProcedure.input(z.object({ id: z.string().min(1) })).query(({ input }) => getEventById(input.id)),
  }),
  registrations: router({
    list: publicProcedure.query(() => listRegistrations()),
    create: publicProcedure.input(registrationInput).mutation(({ input }) => createRegistration(input)),
    update: publicProcedure
      .input(z.object({ id: z.string().min(1), data: registrationInput }))
      .mutation(({ input }) => updateRegistration(input.id, input.data)),
    delete: publicProcedure.input(z.object({ id: z.string().min(1) })).mutation(({ input }) => deleteRegistration(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
