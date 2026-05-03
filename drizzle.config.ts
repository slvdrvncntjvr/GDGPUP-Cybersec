import fs from "fs";
import path from "path";
import { config as loadDotenv } from "dotenv";
import { defineConfig } from "drizzle-kit";

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", ".env"),
];

for (const envPath of envCandidates) {
  if (!fs.existsSync(envPath)) continue;
  loadDotenv({ path: envPath, override: false });
  if (process.env.DATABASE_URL) break;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
