import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

export const prisma = new PrismaClient();

prisma.$on("query", (e) => {
  if (process.env.NODE_ENV === "development") {
    logger.debug({ duration: e.duration, query: e.query }, "Prisma query");
  }
});

export async function disconnectPrisma() {
  await prisma.$disconnect();
}
