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
import {
  getChallengeMeta,
  hashFlagForStorage,
  verifyFlag,
} from "./challenges";

function requireDb() {
  if (!db) {
    throw new Error("DATABASE_URL is not configured");
  }
  return db;
}

/** Postgres-safe TEAM ids: TEAM01–TEAM09, TEAM10+, no lpad truncation at 100 (shared with DB logic). */
export function formatTeamId(seq: number): string {
  const s = String(seq);
  const width = Math.max(2, s.length);
  return `TEAM${s.padStart(width, "0")}`;
}

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface SubmissionResult extends Submission {
  xpAwarded: boolean;
  pointsAwarded: number;
}

export interface IStorage {
  init(): Promise<void>;

  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(data: InsertUser): Promise<User>;
  toPublic(user: User): PublicUser;

  // Submissions
  getSubmissionsByUser(userId: string, limit?: number): Promise<Submission[]>;
  getSolvedChallengesByUser(
    userId: string
  ): Promise<Array<{ roomId: string; challengeId: string }>>;
  getLeaderboard(
    limit?: number
  ): Promise<Array<{ id: string; name: string; team: Team; xp: number }>>;
  getTeamProgress(): Promise<
    Array<{ team: Team; users: number; totalXp: number; solvedChallenges: number }>
  >;
  createSubmission(user: User, data: InsertSubmission): Promise<SubmissionResult>;
}

// ─── In-Memory Implementation ────────────────────────────────────────────────

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private submissions: Map<string, Submission[]> = new Map();
  private solves: Set<string> = new Set();
  private teamSeq = 0;

  async init(): Promise<void> {
    return;
  }

  private nextTeamId(): string {
    this.teamSeq += 1;
    return formatTeamId(this.teamSeq);
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
    const team = (data.team as Team) ?? "blue";
    const user: User = {
      id,
      username: data.username,
      password: data.password,
      name: data.name,
      team,
      teamId: this.nextTeamId(),
      xp: 0,
      xpGoal: 500,
      description: `${team === "red" ? "Offense" : "Defense"} team member`,
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
    return Array.from(this.solves)
      .filter((key) => key.startsWith(`${userId}:`))
      .map((key) => {
        const [, roomId, challengeId] = key.split(":");
        return { roomId, challengeId };
      });
  }

  async getLeaderboard(limit = 10) {
    return Array.from(this.users.values())
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit)
      .map((user) => ({ id: user.id, name: user.name, team: user.team, xp: user.xp }));
  }

  async getTeamProgress() {
    const teams: Team[] = ["blue", "red"];
    const entries = Array.from(this.users.values());
    const solvedByTeam = new Map<Team, number>([
      ["blue", 0],
      ["red", 0],
    ]);

    for (const key of Array.from(this.solves)) {
      const [userId] = key.split(":");
      const u = this.users.get(userId);
      if (!u) continue;
      solvedByTeam.set(u.team, (solvedByTeam.get(u.team) ?? 0) + 1);
    }

    return teams.map((team) => {
      const teamUsers = entries.filter((entry) => entry.team === team);
      return {
        team,
        users: teamUsers.length,
        totalXp: teamUsers.reduce((sum, user) => sum + user.xp, 0),
        solvedChallenges: solvedByTeam.get(team) ?? 0,
      };
    });
  }

  async createSubmission(
    user: User,
    data: InsertSubmission
  ): Promise<SubmissionResult> {
    const meta = getChallengeMeta(data.roomId, data.challengeId);
    if (!meta) {
      throw new Error("Unknown challenge");
    }

    const status: "Success" | "Fail" = verifyFlag(
      data.roomId,
      data.challengeId,
      data.flag,
      user.teamId
    )
      ? "Success"
      : "Fail";

    const submission: Submission = {
      id: randomUUID(),
      userId: user.id,
      status,
      challengeId: data.challengeId,
      roomId: data.roomId,
      roomName: meta.roomName,
      team: meta.team,
      submittedAt: new Date().toISOString(),
    };

    const existing = this.submissions.get(user.id) ?? [];
    this.submissions.set(user.id, [...existing, submission]);

    let xpAwarded = false;
    let pointsAwarded = 0;

    if (status === "Success") {
      const solveKey = `${user.id}:${data.roomId}:${data.challengeId}`;
      if (!this.solves.has(solveKey)) {
        this.solves.add(solveKey);
        const stored = this.users.get(user.id);
        if (stored) {
          this.users.set(user.id, {
            ...stored,
            xp: stored.xp + meta.points,
          });
        }
        xpAwarded = true;
        pointsAwarded = meta.points;
      }
    }

    return { ...submission, xpAwarded, pointsAwarded };
  }
}

// ─── Postgres-Backed Implementation ──────────────────────────────────────────

export class DatabaseStorage implements IStorage {
  async init(): Promise<void> {
    const database = requireDb();

    // ── Users ────────────────────────────────────────────────────────────────
    await database.execute(sql`
      create table if not exists users (
        id text primary key,
        username text not null unique,
        password text not null,
        name text not null,
        team text not null default 'blue',
        team_id text,
        xp integer not null default 0,
        xp_goal integer not null default 500,
        description text not null default '',
        avatar_url text not null default ''
      );
    `);
    await database.execute(sql`
      alter table users add column if not exists team_id text;
    `);
    await database.execute(sql`
      create sequence if not exists users_team_seq start with 1;
    `);
    // Backfill any user that pre-existed without a team_id.
    await database.execute(sql`
      update users
      set team_id = (
        select 'TEAM' || lpad(s.n::text, greatest(2, char_length(s.n::text)), '0')
        from (select nextval('users_team_seq') as n) s
      )
      where team_id is null;
    `);
    await database.execute(sql`
      do $$
      begin
        if exists (
          select 1 from information_schema.columns
          where table_name = 'users' and column_name = 'team_id' and is_nullable = 'YES'
        ) then
          alter table users alter column team_id set not null;
        end if;
      end $$;
    `);
    await database.execute(sql`
      create unique index if not exists users_team_id_unique on users (team_id);
    `);

    // ── Submissions ──────────────────────────────────────────────────────────
    await database.execute(sql`
      create table if not exists submissions (
        id text primary key,
        user_id text not null references users(id) on delete cascade,
        flag_hash text not null default '',
        status text not null,
        challenge_id text not null default '',
        room_id text not null,
        room_name text not null,
        team text not null,
        submitted_at timestamptz not null default now()
      );
    `);
    // Migration from older schema where the column was named `flag` (plaintext).
    await database.execute(sql`
      alter table submissions add column if not exists flag_hash text;
    `);
    await database.execute(sql`
      do $$
      begin
        if exists (
          select 1 from information_schema.columns
          where table_name = 'submissions' and column_name = 'flag'
        ) then
          update submissions
          set flag_hash = encode(sha256(coalesce(flag, '')::bytea), 'hex')
          where flag_hash is null or flag_hash = '';
          alter table submissions drop column flag;
        end if;
      end $$;
    `);
    await database.execute(sql`
      do $$
      begin
        if exists (
          select 1 from information_schema.columns
          where table_name = 'submissions' and column_name = 'flag_hash' and is_nullable = 'YES'
        ) then
          alter table submissions alter column flag_hash set not null;
        end if;
      end $$;
    `);
    await database.execute(sql`
      alter table submissions add column if not exists challenge_id text not null default '';
    `);
    await database.execute(sql`
      create index if not exists submissions_user_submitted_at_idx
      on submissions (user_id, submitted_at);
    `);
    await database.execute(sql`
      create index if not exists submissions_user_room_challenge_idx
      on submissions (user_id, room_id, challenge_id);
    `);

    // ── First-solve enforcement ──────────────────────────────────────────────
    // A separate table makes "this submission is the first successful solve"
    // an atomic INSERT … ON CONFLICT DO NOTHING — no transactions required.
    await database.execute(sql`
      create table if not exists user_solves (
        user_id text not null references users(id) on delete cascade,
        room_id text not null,
        challenge_id text not null,
        team text not null,
        points integer not null default 0,
        solved_at timestamptz not null default now(),
        primary key (user_id, room_id, challenge_id)
      );
    `);
    await database.execute(sql`
      create index if not exists user_solves_team_idx on user_solves (team);
    `);

    // ── Sessions ─────────────────────────────────────────────────────────────
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
      teamId: user.teamId,
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
    const rows = await database
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
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

    // Pull a unique TEAM-id from the dedicated sequence in a single roundtrip.
    const teamIdRow = await database.execute<{ team_id: string }>(sql`
      select 'TEAM' || lpad(s.n::text, greatest(2, char_length(s.n::text)), '0') as team_id
      from (select nextval('users_team_seq') as n) s
    `);
    const teamId = (teamIdRow as any).rows?.[0]?.team_id as string | undefined;
    if (!teamId) {
      throw new Error("Failed to generate team_id");
    }

    const created = await database
      .insert(users)
      .values({
        id,
        username: data.username,
        password: data.password,
        name: data.name,
        team: data.team,
        teamId,
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
    const result = await database.execute<{ room_id: string; challenge_id: string }>(sql`
      select room_id, challenge_id
      from user_solves
      where user_id = ${userId}
    `);
    const rows = (result as any).rows ?? [];
    return rows.map((row: any) => ({
      roomId: row.room_id,
      challengeId: row.challenge_id,
    }));
  }

  async getLeaderboard(limit = 10) {
    const database = requireDb();
    const rows = await database
      .select({ id: users.id, name: users.name, team: users.team, xp: users.xp })
      .from(users)
      .orderBy(desc(users.xp))
      .limit(limit);
    return rows;
  }

  async getTeamProgress() {
    const database = requireDb();

    const teamRows = await database
      .select({
        team: users.team,
        users: sql<number>`count(*)`,
        totalXp: sql<number>`coalesce(sum(${users.xp}), 0)`,
      })
      .from(users)
      .groupBy(users.team);

    const solvedRows = await database.execute<{ team: Team; solved_challenges: number }>(sql`
      select team, count(*)::int as solved_challenges
      from user_solves
      group by team
    `);
    const rows = ((solvedRows as any).rows ?? []) as Array<{
      team: Team;
      solved_challenges: number;
    }>;

    const solvedByTeam = new Map<Team, number>();
    for (const row of rows) {
      solvedByTeam.set(row.team, Number(row.solved_challenges) || 0);
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
    user: User,
    data: InsertSubmission
  ): Promise<SubmissionResult> {
    const database = requireDb();
    const meta = getChallengeMeta(data.roomId, data.challengeId);
    if (!meta) {
      throw new Error("Unknown challenge");
    }

    const status: "Success" | "Fail" = verifyFlag(
      data.roomId,
      data.challengeId,
      data.flag,
      user.teamId
    )
      ? "Success"
      : "Fail";

    const created = await database
      .insert(submissions)
      .values({
        id: randomUUID(),
        userId: user.id,
        flagHash: hashFlagForStorage(data.flag),
        status,
        challengeId: data.challengeId,
        roomId: data.roomId,
        roomName: meta.roomName,
        team: meta.team,
      })
      .returning();

    let xpAwarded = false;
    let pointsAwarded = 0;

    if (status === "Success") {
      // Atomic first-solve enforcement: the unique pkey prevents double XP.
      const solve = await database.execute(sql`
        insert into user_solves (user_id, room_id, challenge_id, team, points)
        values (${user.id}, ${data.roomId}, ${data.challengeId}, ${meta.team}, ${meta.points})
        on conflict (user_id, room_id, challenge_id) do nothing
        returning user_id
      `);
      const inserted = ((solve as any).rows ?? []).length > 0;

      if (inserted) {
        await database
          .update(users)
          .set({ xp: sql`${users.xp} + ${meta.points}` })
          .where(eq(users.id, user.id));
        xpAwarded = true;
        pointsAwarded = meta.points;
      }
    }

    return { ...this.toApiSubmission(created[0]), xpAwarded, pointsAwarded };
  }
}

class AutoFallbackStorage implements IStorage {
  private delegate: IStorage = hasDatabaseUrl ? new DatabaseStorage() : new MemStorage();

  async init(): Promise<void> {
    try {
      await this.delegate.init();
    } catch (err) {
      // If DATABASE_URL is set, sessions use Postgres; in-memory users would strand sessions.
      if (hasDatabaseUrl) {
        throw err;
      }
      console.warn("[storage] Database init failed, falling back to in-memory mode:", err);
      this.delegate = new MemStorage();
      await this.delegate.init();
    }
  }

  getUser(id: string) {
    return this.delegate.getUser(id);
  }
  getUserByUsername(username: string) {
    return this.delegate.getUserByUsername(username);
  }
  createUser(data: InsertUser) {
    return this.delegate.createUser(data);
  }
  toPublic(user: User) {
    return this.delegate.toPublic(user);
  }
  getSubmissionsByUser(userId: string, limit?: number) {
    return this.delegate.getSubmissionsByUser(userId, limit);
  }
  getSolvedChallengesByUser(userId: string) {
    return this.delegate.getSolvedChallengesByUser(userId);
  }
  getLeaderboard(limit?: number) {
    return this.delegate.getLeaderboard(limit);
  }
  getTeamProgress() {
    return this.delegate.getTeamProgress();
  }
  createSubmission(user: User, data: InsertSubmission) {
    return this.delegate.createSubmission(user, data);
  }
}

export const storage: IStorage = new AutoFallbackStorage();
