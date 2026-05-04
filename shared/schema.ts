import { z } from "zod";
import {
  pgTable,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────────────────────────

export type Team = "blue" | "red";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  team: text("team").$type<Team>().notNull().default("blue"),
  xp: integer("xp").notNull().default(0),
  xpGoal: integer("xp_goal").notNull().default(500),
  description: text("description").notNull().default(""),
  avatarUrl: text("avatar_url").notNull().default(""),
});

export const submissions = pgTable(
  "submissions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    flag: text("flag").notNull(),
    status: text("status").$type<"Success" | "Fail">().notNull(),
    challengeId: text("challenge_id").notNull(),
    roomId: text("room_id").notNull(),
    roomName: text("room_name").notNull(),
    team: text("team").$type<Team>().notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    byUserSubmittedAt: index("submissions_user_submitted_at_idx").on(
      table.userId,
      table.submittedAt
    ),
  })
);

export const userChallengeSolves = pgTable(
  "user_challenge_solves",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roomId: text("room_id").notNull(),
    challengeId: text("challenge_id").notNull(),
    team: text("team").$type<Team>().notNull(),
    solvedAt: timestamp("solved_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    byUserRoomChallenge: index("user_challenge_solves_unique_idx").on(
      table.userId,
      table.roomId,
      table.challengeId
    ),
    byTeamSolvedAt: index("user_challenge_solves_team_solved_at_idx").on(
      table.team,
      table.solvedAt
    ),
  })
);

export type DbUser = typeof users.$inferSelect;
export type DbSubmission = typeof submissions.$inferSelect;

export interface User {
  id: string;
  username: string;   // used as email as well
  password: string;   // hashed using scrypt
  name: string;
  team: Team;
  xp: number;
  xpGoal: number;
  description: string;
  avatarUrl: string;
}

export type PublicUser = Omit<User, "password">;

export const registerSchema = z.object({
  username: z.string().email("Must be a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  team: z.enum(["blue", "red"]).default("blue"),
});

export const loginSchema = z.object({
  username: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional().default(false),
});

export type InsertUser = z.infer<typeof registerSchema>;

// ─── Submissions ─────────────────────────────────────────────────────────────

export interface Submission {
  id: string;
  userId: string;
  flag: string;
  status: "Success" | "Fail";
  challengeId: string;
  roomId: string;
  roomName: string;
  team: Team;
  submittedAt: string; // ISO string
  xpAwarded?: boolean;
}

export const submitFlagSchema = z.object({
  flag: z.string().trim().min(1, "Flag cannot be empty").max(256, "Flag is too long"),
  challengeId: z.string().trim().min(1, "Challenge ID is required").max(64, "Challenge ID is too long"),
  roomId: z.string().trim().min(1, "Room ID is required").max(64, "Room ID is too long"),
});

export type InsertSubmission = z.infer<typeof submitFlagSchema>;
