import type { Express } from "express";
import { registerHealthRoutes } from "./routes/health";
import { registerAuthRoutes } from "./routes/auth";
import { registerRoomRoutes } from "./routes/rooms";
import { registerDashboardRoutes } from "./routes/dashboard";
import { registerSubmissionRoutes } from "./routes/submissions";
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later." },
});

const submissionsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many submissions, please slow down." },
});

const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

export async function registerRoutes(app: Express): Promise<void> {
  registerHealthRoutes(app);
  registerAuthRoutes(app, authLimiter, generalApiLimiter);
  registerRoomRoutes(app, generalApiLimiter);
  registerDashboardRoutes(app, generalApiLimiter);
  registerSubmissionRoutes(app, submissionsLimiter, generalApiLimiter);
}
