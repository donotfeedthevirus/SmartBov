import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = (err as any)?.statusCode ?? 500;

  logger.error({ err }, "Unhandled error");

  res.status(status).json({
    error: {
      message:
        status === 500 ? "Internal server error" : (err as any)?.message,
    },
  });
}
