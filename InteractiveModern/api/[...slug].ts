import { setupApp } from "../server/app";

// Cache the configured Express app across warm invocations of the same
// serverless function instance (avoids re-running passport/session setup).
const appReady = setupApp();

export default async function handler(req: any, res: any) {
  const app = await appReady;
  app(req, res);
}
