// Force tests onto in-memory storage and a deterministic session secret so
// no test ever touches the production Neon database or generates flaky timing.
delete process.env.DATABASE_URL;
process.env.NODE_ENV = "test";
process.env.SESSION_SECRET ??= "vitest-session-secret";
