import request from "supertest";
import { setupApp } from "./app.ts";

describe("API routes", () => {
  let app: Awaited<ReturnType<typeof setupApp>>;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.SESSION_SECRET = "vitest-session-secret";
    app = await setupApp();
  });

  it("returns health status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("requires auth for dashboard", async () => {
    const res = await request(app).get("/api/dashboard");
    expect(res.status).toBe(401);
    expect(res.body?.message).toBe("Not authenticated");
  });

  it("registers a user and returns authenticated profile", async () => {
    const agent = request.agent(app);
    const unique = Date.now();

    const registerRes = await agent.post("/api/register").send({
      username: `vitest-${unique}@example.com`,
      password: "password123",
      name: "Vitest User",
      team: "blue",
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body?.username).toContain("vitest-");
    expect(registerRes.body?.team).toBe("blue");

    const meRes = await agent.get("/api/me");
    expect(meRes.status).toBe(200);
    expect(meRes.body?.name).toBe("Vitest User");
  });

  it("returns leaderboard payload shape", async () => {
    const res = await request(app).get("/api/progress/leaderboard?limit=5");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body?.topUsers)).toBe(true);
    expect(Array.isArray(res.body?.teams)).toBe(true);
  });
});
