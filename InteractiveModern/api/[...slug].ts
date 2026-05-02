// Cache the configured Express app across warm invocations of the same
// serverless function instance (avoids re-running passport/session setup).
let appPromise: Promise<((req: any, res: any) => void) | null> | null = null;
let startupError: Error | null = null;

async function getApp() {
  if (appPromise) return appPromise;

  appPromise = (async () => {
    try {
      // Lazy import so import-time failures are captured and returned as JSON.
      const mod = await import("../server/app");
      return await mod.setupApp();
    } catch (err: unknown) {
      startupError = err instanceof Error ? err : new Error(String(err));
      return null;
    }
  })();

  return appPromise;
}

export default async function handler(req: any, res: any) {
  const app = await getApp();
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
