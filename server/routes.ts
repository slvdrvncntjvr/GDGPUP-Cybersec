import type { Express } from "express";
import { registerHealthRoutes } from "./routes/health";
import { registerAuthRoutes } from "./routes/auth";
import { registerRoomRoutes } from "./routes/rooms";
import { registerDashboardRoutes } from "./routes/dashboard";
import { registerSubmissionRoutes } from "./routes/submissions";

export async function registerRoutes(app: Express): Promise<void> {
  registerHealthRoutes(app);
  registerAuthRoutes(app);
  registerRoomRoutes(app);
  registerDashboardRoutes(app);
  registerSubmissionRoutes(app);
}
