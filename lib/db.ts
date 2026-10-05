import { PrismaClient } from "@prisma/client";

/**
 * Standard Next.js Prisma singleton pattern: in dev, Next's hot-reload would
 * otherwise create a new `PrismaClient` (and a new connection pool) on every
 * file save, eventually exhausting the database's connection limit. Storing
 * the instance on `globalThis` survives module reloads in dev while staying
 * a plain fresh instance in production.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
