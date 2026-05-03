import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, KEYLEN).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(storedPassword: string, candidatePassword: string): boolean {
  const [salt, hash] = storedPassword.split(":");
  if (!salt || !hash) return false;

  const derived = scryptSync(candidatePassword, salt, KEYLEN);
  const stored = Buffer.from(hash, "hex");

  if (stored.length !== derived.length) return false;
  return timingSafeEqual(stored, derived);
}
