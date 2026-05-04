import "./env";

import express, { type Request, type Response, type NextFunction } from "express";
import session from "express-session";
import { createHash } from "crypto";
import MemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { verifyPassword } from "./auth";
import { log } from "./logger";
import { registerRoutes } from "./routes";
import { hasDatabaseUrl } from "./db";

export async function setupApp() {
  const app = express();
  const isProduction = process.env.NODE_ENV === "production";

  const usingDefaultSessionSecret =
    !process.env.SESSION_SECRET ||
    process.env.SESSION_SECRET === "gdg-cybersec-dev-secret";

  // Keep production online even when SESSION_SECRET is missing by deriving a
  // stable fallback per deployment. This prevents blanket 500s on /api/*.
  let sessionSecret = process.env.SESSION_SECRET ?? "gdg-cybersec-dev-secret";
  if (isProduction && usingDefaultSessionSecret) {
    const seed = [
      process.env.DATABASE_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
      process.env.VERCEL_URL,
      process.env.RAILWAY_PUBLIC_DOMAIN,
      "gdg-cybersec-fallback",
    ]
      .filter(Boolean)
      .join("|");

    sessionSecret = createHash("sha256").update(seed).digest("hex");
    log(
      "SESSION_SECRET is missing in production. Using a derived fallback secret; set SESSION_SECRET for stronger session security.",
      "warn"
    );
  }

  if (isProduction) {
    app.set("trust proxy", 1);
  }

  // ─── Body Parsing ─────────────────────────────────────────────────────────

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // ─── Rate Limiting (auth routes only) ─────────────────────────────────────

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts, please try again later." },
  });
  app.use("/api/login", authLimiter);
  app.use("/api/register", authLimiter);

  const submissionsLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 40,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many submissions, please slow down." },
  });
  app.use("/api/submissions", submissionsLimiter);

  // ─── Session Store ─────────────────────────────────────────────────────────
  // Use Neon-backed Postgres sessions in production; in-memory in dev.

  let store: session.Store;
  if (hasDatabaseUrl) {
    const PgSession = connectPgSimple(session);
    store = new PgSession({
      conString: process.env.DATABASE_URL!,
      tableName: "user_sessions",
      createTableIfMissing: false,
    });
  } else {
    const MStore = MemoryStore(session);
    store = new MStore({ checkPeriod: 86_400_000 });
  }

  app.use(
    session({
      secret: sessionSecret,
      proxy: true,
      resave: false,
      saveUninitialized: false,
      cookie: {
        // "auto" uses HTTPS cookies on secure requests (e.g., Vercel) and
        // still allows local non-HTTPS smoke tests.
        secure: "auto",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
      store,
    })
  );

  // ─── Passport ─────────────────────────────────────────────────────────────

  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      async (username, password, done) => {
        try {
          const user = await storage.getUserByUsername(username);
          if (!user) return done(null, false, { message: "Invalid credentials" });
          if (!verifyPassword(user.password, password))
            return done(null, false, { message: "Invalid credentials" });
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user ?? false);
    } catch (err) {
      done(err);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());

  // ─── Request Logger (no response body — avoids leaking flag/credential data)

  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const path = req.path;
    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
      }
    });
    next();
  });

  // ─── Routes ───────────────────────────────────────────────────────────────

  await storage.init();
  await registerRoutes(app);

  // ─── Error Handler ────────────────────────────────────────────────────────

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const isProductionRuntime = process.env.NODE_ENV === "production";
    const status = err.status || err.statusCode || 500;
    const rawMessage = err?.message || "Internal Server Error";
    const safeMessage = status >= 500 && isProductionRuntime
      ? "Internal Server Error"
      : rawMessage;
    res.status(status).json({ message: safeMessage });
    log(`request failed with ${status}: ${rawMessage}`, "error");
  });

  return app;
}
