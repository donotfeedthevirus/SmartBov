import { app } from "./app";
import { env } from "./config";
import { logger } from "./utils/logger";
import { disconnectPrisma } from "./utils/prisma";

const server = app.listen(env.port, () => {
  logger.info(`API ready on http://localhost:${env.port}`);
});

const shutdown = async () => {
  logger.info("Shutting down…");
  await disconnectPrisma();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
