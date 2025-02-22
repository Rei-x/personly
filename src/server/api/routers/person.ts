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
});
