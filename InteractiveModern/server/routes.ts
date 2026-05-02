import type { Express } from "express";
import { storage } from "./storage";
import {
  registerSchema,
  loginSchema,
  submitFlagSchema,
} from "@shared/schema";
import passport from "passport";
import { hashPassword } from "./auth";

// Middleware: require an active session
function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Not authenticated" });
}

export async function registerRoutes(
  app: Express
): Promise<void> {

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // ── POST /api/register ───────────────────────────────────────────────────

  app.post("/api/register", async (req, res) => {
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

    // Log in immediately after registration
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Login after register failed" });
      return res.status(201).json(pub);
    });
  });

  // ── POST /api/login ──────────────────────────────────────────────────────

  app.post("/api/login", (req, res, next) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0]?.message ?? "Invalid input",
      });
    }

    passport.authenticate(
      "local",
      (err: any, user: any, info: any) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({
            message: info?.message ?? "Invalid credentials",
          });
        }
        req.login(user, (loginErr) => {
          if (loginErr) return next(loginErr);
          return res.json(storage.toPublic(user));
        });
      }
    )(req, res, next);
  });

  // ── POST /api/logout ─────────────────────────────────────────────────────

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ message: "Logged out" });
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

  // ── GET /api/dashboard ───────────────────────────────────────────────────

  app.get("/api/dashboard", requireAuth, async (req, res) => {
    const user = req.user as any;
    const freshUser = await storage.getUser(user.id);
    if (!freshUser) return res.status(404).json({ message: "User not found" });

    const submissions = await storage.getSubmissionsByUser(freshUser.id);
    return res.json({
      user: storage.toPublic(freshUser),
      submissions,
    });
  });

  // ── POST /api/submissions ─────────────────────────────────────────────────

  app.post("/api/submissions", requireAuth, async (req, res) => {
    const parsed = submitFlagSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0]?.message ?? "Invalid input",
      });
    }

    const user = req.user as any;
    const submission = await storage.createSubmission(user.id, parsed.data);
    return res.status(201).json(submission);
  });
}
