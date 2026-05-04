import type { Express } from "express";
import { storage } from "../storage";
import { getChallengeMeta } from "../challenges";
import { submitFlagSchema } from "@shared/schema";

type AsyncHandler = (req: any, res: any, next: any) => Promise<unknown>;

function withAsync(handler: AsyncHandler) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Not authenticated" });
}

export function registerSubmissionRoutes(app: Express): void {
  // ── POST /api/submissions ─────────────────────────────────────────────────

  app.post("/api/submissions", requireAuth, withAsync(async (req, res) => {
    const parsed = submitFlagSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0]?.message ?? "Invalid input",
      });
    }

    const user = req.user as any;
    const meta = getChallengeMeta(parsed.data.roomId, parsed.data.challengeId);
    if (!meta) {
      return res.status(400).json({ message: "Unknown challenge" });
    }

    if (user.team !== meta.team) {
      return res.status(403).json({ message: "Challenge is not available for your team" });
    }

    const solvedBefore = await storage.getSolvedChallengesByUser(user.id);
    const alreadySolved = solvedBefore.some(
      (entry) => entry.roomId === parsed.data.roomId && entry.challengeId === parsed.data.challengeId
    );

    const submission = await storage.createSubmission(user.id, parsed.data);
    const xpAwarded = submission.status === "Success" && !alreadySolved;
    return res.status(201).json({ ...submission, xpAwarded });
  }));

  // ── GET /api/submissions ──────────────────────────────────────────────────

  app.get("/api/submissions", requireAuth, withAsync(async (req, res) => {
    const user = req.user as any;
    const submissions = await storage.getSubmissionsByUser(user.id);
    return res.json({ submissions });
  }));
}
