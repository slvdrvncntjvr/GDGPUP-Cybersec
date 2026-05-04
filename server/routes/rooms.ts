import type { Express } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { ROOMS_CATALOG } from "@shared/challengeCatalog";
import { withAsync } from "./middleware";

const leaderboardQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export function registerRoomRoutes(app: Express): void {
  // ── GET /api/rooms/catalog ───────────────────────────────────────────────

  app.get("/api/rooms/catalog", (_req, res) => {
    res.json({ rooms: ROOMS_CATALOG });
  });

  // ── GET /api/rooms/progress ─────────────────────────────────────────────

  app.get("/api/rooms/progress", withAsync(async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.json({ solvedKeys: [] as string[] });
    }

    const user = req.user as any;
    const solved = await storage.getSolvedChallengesByUser(user.id);
    const solvedKeys = solved.map((entry) => `${entry.roomId}:${entry.challengeId}`);
    return res.json({ solvedKeys });
  }));

  // ── GET /api/progress/leaderboard ───────────────────────────────────────

  app.get("/api/progress/leaderboard", withAsync(async (req, res) => {
    const query = leaderboardQuerySchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ message: "Invalid leaderboard query" });
    }

    const topUsers = await storage.getLeaderboard(query.data.limit);
    const teams = await storage.getTeamProgress();
    return res.json({ topUsers, teams });
  }));
}
