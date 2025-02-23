import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const personRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ name: z.string().nonempty() }))
    .mutation(async ({ input, ctx }) => {
      return db.person.create({
        data: {
          name: input.name,
          createdBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  saveEvent: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid2(),
        title: z.string(),
        description: z.string(),
        personId: z.string().cuid2(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return db.event.upsert({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        update: {
          name: input.title,
          description: input.description,
          personId: input.personId,
        },
        create: {
          id: input.id,
          name: input.title,
          description: input.description,
          personId: input.personId,
          userId: ctx.session.user.id,
        },
      });
    }),
  deleteEvent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return db.event.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),
});
