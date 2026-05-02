import { setupApp } from "../server/app";

// Cache the configured Express app across warm invocations of the same
// serverless function instance (avoids re-running passport/session setup).
let startupError: Error | null = null;
const appReady = setupApp().catch((err: unknown) => {
  startupError = err instanceof Error ? err : new Error(String(err));
  return null;
});

export default async function handler(req: any, res: any) {
  const app = await appReady;
  if (!app) {
    const message = startupError?.message ?? "Server initialization failed";
    const stack = startupError?.stack;

    res.status(500).json({
      message: "Server startup failed",
      detail: message,
      stack,
      checks: [
        "Ensure SESSION_SECRET is set in Vercel environment variables",
        "Ensure DATABASE_URL is set and valid",
        "Verify Vercel project Root Directory points to InteractiveModern",
        "Redeploy after updating environment variables",
      ],
    });
    return;
  }

  app(req, res);
}
