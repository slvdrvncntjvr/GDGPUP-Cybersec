import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

if (!hasDatabaseUrl) {
  console.warn(
    "[db] DATABASE_URL is not set; using in-memory storage (non-persistent)."
  );
}

export const db = hasDatabaseUrl
  ? drizzle(neon(process.env.DATABASE_URL as string))
  : null;
