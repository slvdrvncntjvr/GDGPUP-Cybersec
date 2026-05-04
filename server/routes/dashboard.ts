import type { Express } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { withAsync, requireAuth } from "./middleware";

const dashboardQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(100),
});

export function registerDashboardRoutes(app: Express): void {
  // ── GET /api/dashboard ───────────────────────────────────────────────────

  app.get("/api/dashboard", requireAuth, withAsync(async (req, res) => {
    const query = dashboardQuerySchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ message: "Invalid dashboard query" });
    }

    const user = req.user as any;
    const freshUser = await storage.getUser(user.id);
    if (!freshUser) return res.status(404).json({ message: "User not found" });

    const submissions = await storage.getSubmissionsByUser(freshUser.id, query.data.limit);
    return res.json({
      user: storage.toPublic(freshUser),
      submissions,
    });
  }));
}
