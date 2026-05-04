import type { Express } from "express";
import passport from "passport";
import { storage } from "../storage";
import { hashPassword } from "../auth";
import { registerSchema, loginSchema } from "@shared/schema";

const SESSION_7_DAYS_MS = 1000 * 60 * 60 * 24 * 7;
const SESSION_30_DAYS_MS = 1000 * 60 * 60 * 24 * 30;

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

export function registerAuthRoutes(app: Express): void {
  // ── POST /api/register ───────────────────────────────────────────────────

  app.post("/api/register", withAsync(async (req, res) => {
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
  }));

  // ── POST /api/login ──────────────────────────────────────────────────────

  app.post("/api/login", withAsync(async (req, res, next) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0]?.message ?? "Invalid input",
      });
    }

    const { rememberMe } = parsed.data;

    const authResult = await new Promise<{ user: any; info: any }>((resolve, reject) => {
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) return reject(err);
        resolve({ user, info });
      })(req, res, next);
    });

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
  }));

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
}
