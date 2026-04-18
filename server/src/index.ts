import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { accountRouter } from "./routes/account";
import { authRouter } from "./routes/auth";
import { customerPortalRouter } from "./routes/customerPortal";
import { customerRouter } from "./routes/customers";
import { healthRouter } from "./routes/health";
import { searchRouter } from "./routes/search";
import { stripeWebhookRouter } from "./routes/stripe";
import { syncRouter } from "./routes/sync";

dotenv.config({ override: true });

const app = express();
const port = Number(process.env.PORT ?? 4000);
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(helmet());
app.use(cors({ origin: clientOrigin }));
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

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Swayog API running on http://localhost:${port}`);
});
