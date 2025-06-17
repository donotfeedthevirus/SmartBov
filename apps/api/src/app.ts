import express from "express";
import { env } from "./config";
import { errorHandler } from "./middlewares/error";
import { logger } from "./utils/logger";
import { authRouter } from "./routes/auth.route";
import { userRouter } from "./routes/user.route";

export const app = express();
app.use(express.json());

app.use("/auth", authRouter);

app.use("/user", userRouter);

app.get("/health", (_, res) => {
  res.json({ status: "ok", env: env.nodeEnv });
});

app.use(errorHandler);

if (env.nodeEnv === "development") {
  app.use((req, _res, next) => {
    logger.info({ method: req.method, url: req.url });
    next();
  });
}
