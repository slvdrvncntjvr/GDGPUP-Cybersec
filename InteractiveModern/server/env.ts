import fs from "fs";
import path from "path";
import { config as loadDotenv } from "dotenv";

let loaded = false;

export function ensureEnvironmentLoaded() {
  if (loaded) return;

  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "..", ".env"),
    path.resolve(process.cwd(), "InteractiveModern", ".env"),
  ];

  for (const envPath of candidates) {
    if (!fs.existsSync(envPath)) continue;
    loadDotenv({ path: envPath, override: false });
    loaded = true;
    break;
  }
}

// Load as soon as this module is imported.
ensureEnvironmentLoaded();
