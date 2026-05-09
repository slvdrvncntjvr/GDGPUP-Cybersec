import type { Express } from "express";
import { storage } from "./storage";
import {
  registerSchema,
  loginSchema,
  submitFlagSchema,
} from "@shared/schema";
import { z } from "zod";
import passport from "passport";
import { hashPassword } from "./auth";
import { getChallengeMeta } from "./challenges";
import { ROOMS_CATALOG } from "@shared/challengeCatalog";
import { buildRoomsContentResponse } from "@shared/content";

const SESSION_7_DAYS_MS = 1000 * 60 * 60 * 24 * 7;
const SESSION_30_DAYS_MS = 1000 * 60 * 60 * 24 * 30;
const dashboardQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(100),
});
const leaderboardQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

type AsyncHandler = (req: any, res: any, next: any) => Promise<unknown>;

function withAsync(handler: AsyncHandler) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function saveSession(req: any): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.save((err: any) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function regenerateSession(req: any): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err: any) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Not authenticated" });
}

export async function registerRoutes(app: Express): Promise<void> {
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/rooms/catalog", (_req, res) => {
    res.json({ rooms: ROOMS_CATALOG });
  });

  app.get("/api/content/rooms", (_req, res) => {
    res.json(buildRoomsContentResponse(ROOMS_CATALOG));
  });

  // ── POST /api/register ───────────────────────────────────────────────────

  app.post(
    "/api/register",
    withAsync(async (req, res) => {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: parsed.error.errors[0]?.message ?? "Invalid input",
        });
      }

      const { username, password, name, team } = parsed.data;

      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const user = await storage.createUser({
        username,
        password: hashPassword(password),
        name,
        team,
      });
      const pub = storage.toPublic(user);

      await regenerateSession(req);

      await new Promise<void>((resolve, reject) => {
        req.login(user, (err: any) => {
          if (err) return reject(err);
          resolve();
        });
      });

      await saveSession(req);

      return res.status(201).json(pub);
    })
  );

  // ── POST /api/login ──────────────────────────────────────────────────────

  app.post(
    "/api/login",
    withAsync(async (req, res, next) => {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: parsed.error.errors[0]?.message ?? "Invalid input",
        });
      }

      const { rememberMe } = parsed.data;

      const authResult = await new Promise<{ user: any; info: any }>(
        (resolve, reject) => {
          passport.authenticate("local", (err: any, user: any, info: any) => {
            if (err) return reject(err);
            resolve({ user, info });
          })(req, res, next);
        }
      );

      if (!authResult.user) {
        return res.status(401).json({
          message: authResult.info?.message ?? "Invalid credentials",
        });
      }

      await regenerateSession(req);

      await new Promise<void>((resolve, reject) => {
        req.login(authResult.user, (loginErr: any) => {
          if (loginErr) return reject(loginErr);
          resolve();
        });
      });

      req.session.cookie.maxAge = rememberMe ? SESSION_30_DAYS_MS : SESSION_7_DAYS_MS;
      await saveSession(req);

      return res.json(storage.toPublic(authResult.user));
    })
  );

  // ── POST /api/logout ─────────────────────────────────────────────────────

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      req.session.destroy((destroyErr: any) => {
        if (destroyErr) {
          return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out" });
      });
    });
  });

  // ── GET /api/me ──────────────────────────────────────────────────────────

  app.get("/api/me", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const pub = storage.toPublic(req.user as any);
    res.json(pub);
  });

  // ── GET /api/rooms/progress ─────────────────────────────────────────────

  app.get(
    "/api/rooms/progress",
    withAsync(async (req, res) => {
      if (!req.isAuthenticated() || !req.user) {
        return res.json({ solvedKeys: [] as string[] });
      }

      const user = req.user as any;
      const solved = await storage.getSolvedChallengesByUser(user.id);
      const solvedKeys = solved.map(
        (entry) => `${entry.roomId}:${entry.challengeId}`
      );
      return res.json({ solvedKeys });
    })
  );

  // ── GET /api/progress/leaderboard ───────────────────────────────────────

  app.get(
    "/api/progress/leaderboard",
    withAsync(async (req, res) => {
      const query = leaderboardQuerySchema.safeParse(req.query);
      if (!query.success) {
        return res.status(400).json({ message: "Invalid leaderboard query" });
      }

      const topUsers = await storage.getLeaderboard(query.data.limit);
      const teams = await storage.getTeamProgress();
      return res.json({ topUsers, teams });
    })
  );

  // ── GET /api/dashboard ───────────────────────────────────────────────────

  app.get(
    "/api/dashboard",
    requireAuth,
    withAsync(async (req, res) => {
      const query = dashboardQuerySchema.safeParse(req.query);
      if (!query.success) {
        return res.status(400).json({ message: "Invalid dashboard query" });
      }

      const user = req.user as any;
      const freshUser = await storage.getUser(user.id);
      if (!freshUser) return res.status(404).json({ message: "User not found" });

      const submissions = await storage.getSubmissionsByUser(
        freshUser.id,
        query.data.limit
      );
      return res.json({
        user: storage.toPublic(freshUser),
        submissions,
      });
    })
  );

  // ── POST /api/submissions ─────────────────────────────────────────────────

  app.post(
    "/api/submissions",
    requireAuth,
    withAsync(async (req, res) => {
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
        return res
          .status(403)
          .json({ message: "Challenge is not available for your team" });
      }

      const result = await storage.createSubmission(user, parsed.data);
      return res.status(201).json(result);
    })
  );
}
