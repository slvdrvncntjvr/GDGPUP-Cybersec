import { randomUUID } from "crypto";
import type {
  User,
  PublicUser,
  InsertUser,
  Submission,
  InsertSubmission,
  Team,
  DbUser,
  DbSubmission,
} from "@shared/schema";
import { submissions, users } from "@shared/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { db, hasDatabaseUrl } from "./db";
import { getChallengeMeta, verifyFlag } from "./challenges";

function requireDb() {
  if (!db) {
    throw new Error("DATABASE_URL is not configured");
  }
  return db;
}

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface IStorage {
  init(): Promise<void>;

  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(data: InsertUser): Promise<User>;
  toPublic(user: User): PublicUser;

  // Submissions
  getSubmissionsByUser(userId: string, limit?: number): Promise<Submission[]>;
  getSolvedChallengesByUser(userId: string): Promise<Array<{ roomId: string; challengeId: string }>>;
  getLeaderboard(limit?: number): Promise<Array<{ id: string; name: string; team: Team; xp: number }>>;
  getTeamProgress(): Promise<Array<{ team: Team; users: number; totalXp: number; solvedChallenges: number }>>;
  createSubmission(userId: string, data: InsertSubmission): Promise<Submission>;
}

// ─── In-Memory Implementation ────────────────────────────────────────────────

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private submissions: Map<string, Submission[]> = new Map();

  async init(): Promise<void> {
    return;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(data: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: data.username,
      password: data.password,
      name: data.name,
      team: (data.team as Team) ?? "blue",
      xp: 0,
      xpGoal: 500,
      description: `${data.team === "red" ? "Offense" : "Defense"} team member`,
      avatarUrl: "",
    };
    this.users.set(id, user);
    this.submissions.set(id, []);
    return user;
  }

  toPublic(user: User): PublicUser {
    const { password: _pw, ...pub } = user;
    return pub;
  }

  async getSubmissionsByUser(userId: string, limit = 100): Promise<Submission[]> {
    const rows = this.submissions.get(userId) ?? [];
    return rows.slice(-limit).reverse();
  }

  async getSolvedChallengesByUser(
    userId: string
  ): Promise<Array<{ roomId: string; challengeId: string }>> {
    const rows = this.submissions.get(userId) ?? [];
    const solved = rows.filter((row) => row.status === "Success");
    const seen = new Set<string>();
    const result: Array<{ roomId: string; challengeId: string }> = [];

    for (const row of solved) {
      const key = `${row.roomId}:${row.challengeId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({ roomId: row.roomId, challengeId: row.challengeId });
    }

    return result;
  }

  async getLeaderboard(limit = 10): Promise<Array<{ id: string; name: string; team: Team; xp: number }>> {
    return Array.from(this.users.values())
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit)
      .map((user) => ({ id: user.id, name: user.name, team: user.team, xp: user.xp }));
  }

  async getTeamProgress(): Promise<Array<{ team: Team; users: number; totalXp: number; solvedChallenges: number }>> {
    const teams: Team[] = ["blue", "red"];
    const entries = Array.from(this.users.values());
    const solvedByTeam = new Map<Team, Set<string>>([
      ["blue", new Set<string>()],
      ["red", new Set<string>()],
    ]);

    for (const [userId, userSubmissions] of Array.from(this.submissions.entries())) {
      const user = this.users.get(userId);
      if (!user) continue;
      const solvedSet = solvedByTeam.get(user.team)!;
      for (const submission of userSubmissions) {
        if (submission.status !== "Success") continue;
        solvedSet.add(`${submission.userId}:${submission.roomId}:${submission.challengeId}`);
      }
    }

    return teams.map((team) => {
      const users = entries.filter((entry) => entry.team === team);
      return {
        team,
        users: users.length,
        totalXp: users.reduce((sum, user) => sum + user.xp, 0),
        solvedChallenges: solvedByTeam.get(team)?.size ?? 0,
      };
    });
  }

  async createSubmission(
    userId: string,
    data: InsertSubmission
  ): Promise<Submission> {
    const meta = getChallengeMeta(data.roomId, data.challengeId);
    if (!meta) {
      throw new Error("Unknown challenge");
    }

    const existing = this.submissions.get(userId) ?? [];
    const alreadySolved = existing.some(
      (s) =>
        s.status === "Success" &&
        s.roomId === data.roomId &&
        s.challengeId === data.challengeId
    );

    const status: "Success" | "Fail" = verifyFlag(
      data.roomId,
      data.challengeId,
      data.flag
    )
      ? "Success"
      : "Fail";

    const submission: Submission = {
      id: randomUUID(),
      userId,
      flag: data.flag.trim(),
      status,
      challengeId: data.challengeId,
      roomId: data.roomId,
      roomName: meta.roomName,
      team: meta.team,
      submittedAt: new Date().toISOString(),
    };

    this.submissions.set(userId, [...existing, submission]);

    // Award XP only for first successful solve of a challenge.
    if (status === "Success" && !alreadySolved) {
      const user = this.users.get(userId);
      if (user) {
        this.users.set(userId, { ...user, xp: user.xp + 50 });
      }
    }

    return submission;
  }
}

export class DatabaseStorage implements IStorage {
  async init(): Promise<void> {
    const database = requireDb();

    await database.execute(sql`
      create table if not exists users (
        id text primary key,
        username text not null unique,
        password text not null,
        name text not null,
        team text not null default 'blue',
        xp integer not null default 0,
        xp_goal integer not null default 500,
        description text not null default '',
        avatar_url text not null default ''
      );
    `);

    await database.execute(sql`
      create table if not exists submissions (
        id text primary key,
        user_id text not null references users(id) on delete cascade,
        flag text not null,
        status text not null,
        challenge_id text not null,
        room_id text not null,
        room_name text not null,
        team text not null,
        submitted_at timestamptz not null default now()
      );
    `);

    await database.execute(sql`
      alter table submissions
      add column if not exists challenge_id text not null default '';
    `);

    await database.execute(sql`
      create index if not exists submissions_user_submitted_at_idx
      on submissions (user_id, submitted_at);
    `);

    await database.execute(sql`
      create index if not exists submissions_user_room_challenge_idx
      on submissions (user_id, room_id, challenge_id);
    `);

    await database.execute(sql`
      create table if not exists user_sessions (
        sid varchar not null collate "default" primary key,
        sess json not null,
        expire timestamp(6) not null
      );
    `);

    await database.execute(sql`
      create index if not exists "IDX_user_sessions_expire"
      on user_sessions (expire);
    `);
  }

  private toApiUser(user: DbUser): User {
    return {
      id: user.id,
      username: user.username,
      password: user.password,
      name: user.name,
      team: user.team,
      xp: user.xp,
      xpGoal: user.xpGoal,
      description: user.description,
      avatarUrl: user.avatarUrl,
    };
  }

  private toApiSubmission(submission: DbSubmission): Submission {
    return {
      id: submission.id,
      userId: submission.userId,
      flag: submission.flag,
      status: submission.status,
      challengeId: submission.challengeId,
      roomId: submission.roomId,
      roomName: submission.roomName,
      team: submission.team,
      submittedAt: submission.submittedAt.toISOString(),
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    const database = requireDb();
    const rows = await database.select().from(users).where(eq(users.id, id)).limit(1);
    return rows[0] ? this.toApiUser(rows[0]) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const database = requireDb();
    const rows = await database
      .select()
      .from(users)
      .where(sql`lower(${users.username}) = lower(${username})`)
      .limit(1);
    return rows[0] ? this.toApiUser(rows[0]) : undefined;
  }

  async createUser(data: InsertUser): Promise<User> {
    const database = requireDb();
    const id = randomUUID();
    const created = await database
      .insert(users)
      .values({
        id,
        username: data.username,
        password: data.password,
        name: data.name,
        team: data.team,
        xp: 0,
        xpGoal: 500,
        description: `${data.team === "red" ? "Offense" : "Defense"} team member`,
        avatarUrl: "",
      })
      .returning();

    return this.toApiUser(created[0]);
  }

  toPublic(user: User): PublicUser {
    const { password: _pw, ...pub } = user;
    return pub;
  }

  async getSubmissionsByUser(userId: string, limit = 100): Promise<Submission[]> {
    const database = requireDb();
    const rows = await database
      .select()
      .from(submissions)
      .where(eq(submissions.userId, userId))
      .orderBy(desc(submissions.submittedAt))
      .limit(limit);
    return rows.map((row) => this.toApiSubmission(row));
  }

  async getSolvedChallengesByUser(
    userId: string
  ): Promise<Array<{ roomId: string; challengeId: string }>> {
    const database = requireDb();
    const rows = await database
      .select({ roomId: submissions.roomId, challengeId: submissions.challengeId })
      .from(submissions)
      .where(and(eq(submissions.userId, userId), eq(submissions.status, "Success")))
      .orderBy(desc(submissions.submittedAt));

    const seen = new Set<string>();
    const result: Array<{ roomId: string; challengeId: string }> = [];
    for (const row of rows) {
      const key = `${row.roomId}:${row.challengeId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({ roomId: row.roomId, challengeId: row.challengeId });
    }

    return result;
  }

  async getLeaderboard(limit = 10): Promise<Array<{ id: string; name: string; team: Team; xp: number }>> {
    const database = requireDb();
    const rows = await database
      .select({ id: users.id, name: users.name, team: users.team, xp: users.xp })
      .from(users)
      .orderBy(desc(users.xp))
      .limit(limit);

    return rows;
  }

  async getTeamProgress(): Promise<Array<{ team: Team; users: number; totalXp: number; solvedChallenges: number }>> {
    const database = requireDb();

    const teamRows = await database
      .select({
        team: users.team,
        users: sql<number>`count(*)`,
        totalXp: sql<number>`coalesce(sum(${users.xp}), 0)`,
      })
      .from(users)
      .groupBy(users.team);

    const solvedRows = await database
      .select({
        team: submissions.team,
        solvedChallenges: sql<number>`count(distinct (${submissions.userId} || ':' || ${submissions.roomId} || ':' || ${submissions.challengeId}))`,
      })
      .from(submissions)
      .where(eq(submissions.status, "Success"))
      .groupBy(submissions.team);

    const solvedByTeam = new Map<Team, number>();
    for (const row of solvedRows) {
      solvedByTeam.set(row.team, Number(row.solvedChallenges) || 0);
    }

    const teams: Team[] = ["blue", "red"];
    return teams.map((team) => {
      const teamRow = teamRows.find((row) => row.team === team);
      return {
        team,
        users: Number(teamRow?.users ?? 0),
        totalXp: Number(teamRow?.totalXp ?? 0),
        solvedChallenges: solvedByTeam.get(team) ?? 0,
      };
    });
  }

  async createSubmission(
    userId: string,
    data: InsertSubmission
  ): Promise<Submission> {
    const database = requireDb();
    const meta = getChallengeMeta(data.roomId, data.challengeId);
    if (!meta) {
      throw new Error("Unknown challenge");
    }

    const status: "Success" | "Fail" = verifyFlag(
      data.roomId,
      data.challengeId,
      data.flag
    )
      ? "Success"
      : "Fail";

    const alreadySolvedRows = await database
      .select({ id: submissions.id })
      .from(submissions)
      .where(
        and(
          eq(submissions.userId, userId),
          eq(submissions.roomId, data.roomId),
          eq(submissions.challengeId, data.challengeId),
          eq(submissions.status, "Success")
        )
      )
      .limit(1);
    const alreadySolved = alreadySolvedRows.length > 0;

    const created = await database
      .insert(submissions)
      .values({
        id: randomUUID(),
        userId,
        flag: data.flag.trim(),
        status,
        challengeId: data.challengeId,
        roomId: data.roomId,
        roomName: meta.roomName,
        team: meta.team,
      })
      .returning();

    if (status === "Success" && !alreadySolved) {
      await database
        .update(users)
        .set({ xp: sql`${users.xp} + 50` })
        .where(and(eq(users.id, userId), eq(users.team, meta.team as Team)));
    }

    return this.toApiSubmission(created[0]);
  }
}

class AutoFallbackStorage implements IStorage {
  private delegate: IStorage = hasDatabaseUrl ? new DatabaseStorage() : new MemStorage();

  async init(): Promise<void> {
    try {
      await this.delegate.init();
    } catch (err) {
      // Keep API available in production even if the managed DB is temporarily unreachable.
      console.warn("[storage] Database init failed, falling back to in-memory mode:", err);
      this.delegate = new MemStorage();
      await this.delegate.init();
    }
  }

  getUser(id: string): Promise<User | undefined> {
    return this.delegate.getUser(id);
  }

  getUserByUsername(username: string): Promise<User | undefined> {
    return this.delegate.getUserByUsername(username);
  }

  createUser(data: InsertUser): Promise<User> {
    return this.delegate.createUser(data);
  }

  toPublic(user: User): PublicUser {
    return this.delegate.toPublic(user);
  }

  getSubmissionsByUser(userId: string, limit?: number): Promise<Submission[]> {
    return this.delegate.getSubmissionsByUser(userId, limit);
  }

  getSolvedChallengesByUser(
    userId: string
  ): Promise<Array<{ roomId: string; challengeId: string }>> {
    return this.delegate.getSolvedChallengesByUser(userId);
  }

  getLeaderboard(limit?: number): Promise<Array<{ id: string; name: string; team: Team; xp: number }>> {
    return this.delegate.getLeaderboard(limit);
  }

  getTeamProgress(): Promise<Array<{ team: Team; users: number; totalXp: number; solvedChallenges: number }>> {
    return this.delegate.getTeamProgress();
  }

  createSubmission(userId: string, data: InsertSubmission): Promise<Submission> {
    return this.delegate.createSubmission(userId, data);
  }
}

export const storage: IStorage = new AutoFallbackStorage();
