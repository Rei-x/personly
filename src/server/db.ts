// eslint-disable-next-line unicorn/prevent-abbreviations
import { PrismaClient } from "@prisma/client";

import { env } from "@/env";

function createPrismaClient() {
  return new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// eslint-disable-next-line unicorn/prevent-abbreviations
export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
