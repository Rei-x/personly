import { z } from "zod";

import { generateTitle, polishNote } from "@/server/services/ai";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const aiRouter = createTRPCRouter({
  generateTitle: protectedProcedure
    .input(
      z.object({
        note: z.string().nonempty(),
      }),
    )
    .mutation(async ({ input }) => {
      return generateTitle(input.note);
    }),
  polishNote: protectedProcedure
    .input(
      z.object({
        text: z.string().nonempty(),
      }),
    )
    .mutation(async ({ input }) => {
      return polishNote(input.text);
    }),
});
