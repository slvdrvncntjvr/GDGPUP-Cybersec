import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { setupApp } from "./app";
import { log } from "./logger";

(async () => {
  const app = await setupApp();
  const httpServer = createServer(app);

  if (process.env.NODE_ENV === "production") {
    const { serveStatic } = await import("./static");
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  const listenOptions: any = { port, host: "0.0.0.0" };
  if (process.platform !== "win32") {
    listenOptions.reusePort = true;
  }

  httpServer.listen(listenOptions, () => {
    log(`serving on port ${port}`);
  });
})();
