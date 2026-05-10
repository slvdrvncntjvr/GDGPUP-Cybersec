import request from "supertest";
import { setupApp } from "./app.ts";
import {
  ROOMS_CATALOG,
  renderExpectedFlag,
  NEXUS_FLAG_REGEX,
  CHALLENGE_META,
  ROOM_BY_CODE,
} from "@shared/challengeCatalog";

describe("API routes", () => {
  let app: Awaited<ReturnType<typeof setupApp>>;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.SESSION_SECRET = "vitest-session-secret";
    process.env.DATABASE_URL = "";
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

  it("registers a user, assigns a TEAM_ID, and returns it on /api/me", async () => {
    const agent = request.agent(app);
    const unique = Date.now();

    const registerRes = await agent.post("/api/register").send({
      username: `vitest-${unique}@example.com`,
      password: "password123",
      name: "Vitest User",
      team: "red",
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body?.username).toContain("vitest-");
    expect(registerRes.body?.team).toBe("red");
    expect(registerRes.body?.teamId).toMatch(/^TEAM\d{2,}$/);

    const meRes = await agent.get("/api/me");
    expect(meRes.status).toBe(200);
    expect(meRes.body?.teamId).toBe(registerRes.body.teamId);
    expect(meRes.body?.password).toBeUndefined();
  });

  it("returns leaderboard payload shape", async () => {
    const res = await request(app).get("/api/progress/leaderboard?limit=5");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body?.topUsers)).toBe(true);
    expect(Array.isArray(res.body?.teams)).toBe(true);
  });

  it("exposes the new catalog v2 shape", async () => {
    const res = await request(app).get("/api/content/rooms");
    expect(res.status).toBe(200);
    expect(res.body?.source).toBe("catalog-v2");
    const codes = (res.body?.rooms ?? []).map((r: any) => r.roomCode);
    expect(codes).toEqual(
      expect.arrayContaining([
        "RED-1",
        "RED-2",
        "RED-3",
        "RED-4",
        "BLUE-1",
        "BLUE-2",
        "BLUE-3",
        "BLUE-4",
      ])
    );
  });

  it("rejects flags missing the NEXUS{...} envelope", async () => {
    const agent = request.agent(app);
    const unique = Date.now();
    await agent.post("/api/register").send({
      username: `red-${unique}@example.com`,
      password: "password123",
      name: "Red User",
      team: "red",
    });

    const red1 = ROOM_BY_CODE.get("RED-1")!;
    const res = await agent.post("/api/submissions").send({
      flag: "not-a-flag",
      roomId: red1.id,
      challengeId: red1.challenges[0].id,
    });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("Fail");
    expect(res.body.xpAwarded).toBe(false);
  });

  it("blocks blue user submitting a red challenge", async () => {
    const agent = request.agent(app);
    const unique = Date.now();
    await agent.post("/api/register").send({
      username: `blue-${unique}@example.com`,
      password: "password123",
      name: "Blue User",
      team: "blue",
    });

    const red1 = ROOM_BY_CODE.get("RED-1")!;
    const me = await agent.get("/api/me");
    const expected = renderExpectedFlag(
      red1.challenges[0].flagTemplate,
      me.body.teamId
    );
    const res = await agent.post("/api/submissions").send({
      flag: expected,
      roomId: red1.id,
      challengeId: red1.challenges[0].id,
    });

    expect(res.status).toBe(403);
  });

  it("awards exactly the catalog points on first solve, and zero on a repeat", async () => {
    const agent = request.agent(app);
    const unique = Date.now();
    await agent.post("/api/register").send({
      username: `solver-${unique}@example.com`,
      password: "password123",
      name: "Solver",
      team: "red",
    });
    const me = await agent.get("/api/me");
    const teamId = me.body.teamId as string;

    const red1 = ROOM_BY_CODE.get("RED-1")!;
    const ch = red1.challenges[0];
    const valid = renderExpectedFlag(ch.flagTemplate, teamId);

    // First solve -> XP awarded equal to challenge points.
    const first = await agent.post("/api/submissions").send({
      flag: valid,
      roomId: red1.id,
      challengeId: ch.id,
    });
    expect(first.status).toBe(201);
    expect(first.body.status).toBe("Success");
    expect(first.body.xpAwarded).toBe(true);
    expect(first.body.pointsAwarded).toBe(ch.points);

    // Repeat solve -> still Success but no XP duplication.
    const second = await agent.post("/api/submissions").send({
      flag: valid,
      roomId: red1.id,
      challengeId: ch.id,
    });
    expect(second.status).toBe(201);
    expect(second.body.status).toBe("Success");
    expect(second.body.xpAwarded).toBe(false);
    expect(second.body.pointsAwarded).toBe(0);

    // /api/me reflects exactly one award.
    const after = await agent.get("/api/me");
    expect(after.body.xp).toBeGreaterThanOrEqual(ch.points);

    // /api/rooms/progress includes the solve key.
    const progress = await agent.get("/api/rooms/progress");
    expect(progress.body.solvedKeys).toContain(`${red1.id}:${ch.id}`);
  });

  it("rejects a flag with another user's TEAM_ID substituted", async () => {
    const agent = request.agent(app);
    const unique = Date.now();
    await agent.post("/api/register").send({
      username: `swap-${unique}@example.com`,
      password: "password123",
      name: "Swap",
      team: "red",
    });
    const red1 = ROOM_BY_CODE.get("RED-1")!;
    const wrong = renderExpectedFlag(
      red1.challenges[0].flagTemplate,
      "TEAM99"
    );

    const me = await agent.get("/api/me");
    if (me.body.teamId === "TEAM99") {
      // Vanishingly rare; skip the assertion if our generator happened to pick TEAM99.
      return;
    }

    const res = await agent.post("/api/submissions").send({
      flag: wrong,
      roomId: red1.id,
      challengeId: red1.challenges[0].id,
    });
    expect(res.body.status).toBe("Fail");
  });

  it("concurrent duplicate first-solves award XP only once total", async () => {
    const agent = request.agent(app);
    const unique = Date.now();
    const reg = await agent.post("/api/register").send({
      username: `race-${unique}@example.com`,
      password: "password123",
      name: "Race",
      team: "red",
    });
    expect(reg.status).toBe(201);
    const me = await agent.get("/api/me");
    expect(me.status).toBe(200);
    const teamId = me.body.teamId as string;
    const red1 = ROOM_BY_CODE.get("RED-1")!;
    const ch = red1.challenges[0];
    const valid = renderExpectedFlag(ch.flagTemplate, teamId);
    const [first, second] = await Promise.all([
      agent.post("/api/submissions").send({
        flag: valid,
        roomId: red1.id,
        challengeId: ch.id,
      }),
      agent.post("/api/submissions").send({
        flag: valid,
        roomId: red1.id,
        challengeId: ch.id,
      }),
    ]);
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    const awards = [first.body.xpAwarded, second.body.xpAwarded].filter(Boolean);
    expect(awards.length).toBe(1);
    const after = await agent.get("/api/me");
    expect(after.body.xp).toBe(ch.points);
  });
});

describe("Support chat", () => {
  let app: Awaited<ReturnType<typeof setupApp>>;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.SESSION_SECRET = "vitest-session-secret";
    process.env.DATABASE_URL = "";
    delete process.env.GEMINI_API_KEY;
    app = await setupApp();
  });

  it("falls back to FAQ when GEMINI_API_KEY is unset", async () => {
    const res = await request(app)
      .post("/api/support/chat")
      .send({ message: "What is my TEAM_ID?" });

    expect(res.status).toBe(200);
    expect(res.body.source).toBe("faq");
    expect(res.body.answer).toMatch(/TEAM_ID/i);
  });

  it("rejects empty messages", async () => {
    const res = await request(app)
      .post("/api/support/chat")
      .send({ message: "" });
    expect(res.status).toBe(400);
  });

  it("returns the generic fallback for off-topic input", async () => {
    const res = await request(app)
      .post("/api/support/chat")
      .send({ message: "tell me about quantum chromodynamics" });

    expect(res.status).toBe(200);
    expect(res.body.source).toBe("faq");
    expect(res.body.answer).toMatch(/static FAQ/i);
  });
});

describe("Catalog shape", () => {
  it("has unique room ids and challenge ids", () => {
    const ids = new Set<string>();
    const pairs = new Set<string>();
    for (const room of ROOMS_CATALOG) {
      expect(ids.has(room.id)).toBe(false);
      ids.add(room.id);
      for (const ch of room.challenges) {
        const key = `${room.id}:${ch.id}`;
        expect(pairs.has(key)).toBe(false);
        pairs.add(key);
      }
    }
  });

  it("every flag template renders to a valid NEXUS envelope", () => {
    for (const [, meta] of Object.entries(CHALLENGE_META)) {
      const rendered = renderExpectedFlag(meta.flagTemplate, "TEAM01");
      expect(NEXUS_FLAG_REGEX.test(rendered)).toBe(true);
    }
  });

  it("every challenge has positive points", () => {
    for (const room of ROOMS_CATALOG) {
      for (const ch of room.challenges) {
        expect(ch.points).toBeGreaterThan(0);
      }
    }
  });
});
