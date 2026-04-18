import "./env";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { accountRouter } from "./routes/account";
import { authRouter } from "./routes/auth";
import { customerPortalRouter } from "./routes/customerPortal";
import { customerRouter } from "./routes/customers";
import { healthRouter } from "./routes/health";
import { searchRouter } from "./routes/search";
import { stripeWebhookRouter } from "./routes/stripe";
import { syncRouter } from "./routes/sync";

function createCorsOriginHandler() {
  const configuredOrigins = [process.env.CLIENT_ORIGIN, process.env.APP_BASE_URL]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  const allowedOrigins = new Set(configuredOrigins);
  const isDevelopment = process.env.NODE_ENV !== "production";

  function isLocalDevelopmentOrigin(origin: string) {
    return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
  }

  return (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (
      !origin ||
      allowedOrigins.size === 0 ||
      allowedOrigins.has(origin) ||
      (isDevelopment && isLocalDevelopmentOrigin(origin))
    ) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS.`));
  };
}

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(helmet());
app.use(
  cors({
    origin: createCorsOriginHandler(),
    credentials: true
  })
);
app.use("/api/stripe", express.raw({ type: "application/json" }), stripeWebhookRouter);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", healthRouter);
app.use("/api/sync", syncRouter);
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/customer", customerPortalRouter);
app.use("/api/customers", customerRouter);
app.use("/api/search", searchRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
