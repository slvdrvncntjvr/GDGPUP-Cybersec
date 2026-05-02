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
import { verifyFlag } from "./challenges";

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
  getSubmissionsByUser(userId: string): Promise<Submission[]>;
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

  async getSubmissionsByUser(userId: string): Promise<Submission[]> {
    return this.submissions.get(userId) ?? [];
  }

  async createSubmission(
    userId: string,
    data: InsertSubmission
  ): Promise<Submission> {
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
      roomId: data.roomId,
      roomName: data.roomName,
      team: data.team,
      submittedAt: new Date().toISOString(),
    };

    const existing = this.submissions.get(userId) ?? [];
    this.submissions.set(userId, [...existing, submission]);

    // Award XP on success
    if (status === "Success") {
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
        room_id text not null,
        room_name text not null,
        team text not null,
        submitted_at timestamptz not null default now()
      );
    `);

    await database.execute(sql`
      create index if not exists submissions_user_submitted_at_idx
      on submissions (user_id, submitted_at);
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

  async getSubmissionsByUser(userId: string): Promise<Submission[]> {
    const database = requireDb();
    const rows = await database
      .select()
      .from(submissions)
      .where(eq(submissions.userId, userId))
      .orderBy(desc(submissions.submittedAt));
    return rows.map((row) => this.toApiSubmission(row));
  }

  async createSubmission(
    userId: string,
    data: InsertSubmission
  ): Promise<Submission> {
    const database = requireDb();
    const status: "Success" | "Fail" = verifyFlag(
      data.roomId,
      data.challengeId,
      data.flag
    )
      ? "Success"
      : "Fail";

    const created = await database
      .insert(submissions)
      .values({
        id: randomUUID(),
        userId,
        flag: data.flag.trim(),
        status,
        roomId: data.roomId,
        roomName: data.roomName,
        team: data.team,
      })
      .returning();

    if (status === "Success") {
      await database
        .update(users)
        .set({ xp: sql`${users.xp} + 50` })
        .where(and(eq(users.id, userId), eq(users.team, data.team as Team)));
    }

    return this.toApiSubmission(created[0]);
  }
}

export const storage: IStorage = hasDatabaseUrl ? new DatabaseStorage() : new MemStorage();
