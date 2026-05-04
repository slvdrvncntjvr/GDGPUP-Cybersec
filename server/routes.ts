import type { Express } from "express";
import { registerHealthRoutes } from "./routes/health";
import { registerAuthRoutes } from "./routes/auth";
import { registerRoomRoutes } from "./routes/rooms";
import { registerDashboardRoutes } from "./routes/dashboard";
import { registerSubmissionRoutes } from "./routes/submissions";
import rateLimit from "express-rate-limit";

const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

export async function registerRoutes(app: Express): Promise<void> {
  registerHealthRoutes(app);
  registerAuthRoutes(app, generalApiLimiter);
  registerRoomRoutes(app, generalApiLimiter);
  registerDashboardRoutes(app, generalApiLimiter);
  registerSubmissionRoutes(app);
}
