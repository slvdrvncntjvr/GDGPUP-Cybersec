import { z } from "zod";
import {
  pgTable,
  text,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────────────────────────

export type Team = "blue" | "red";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    name: text("name").notNull(),
    team: text("team").$type<Team>().notNull().default("blue"),
    teamId: text("team_id").notNull(),
    xp: integer("xp").notNull().default(0),
    xpGoal: integer("xp_goal").notNull().default(500),
    description: text("description").notNull().default(""),
    avatarUrl: text("avatar_url").notNull().default(""),
  },
  (table) => ({
    teamIdUnique: uniqueIndex("users_team_id_unique").on(table.teamId),
  })
);

export const submissions = pgTable(
  "submissions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    flagHash: text("flag_hash").notNull(),
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

export type DbUser = typeof users.$inferSelect;
export type DbSubmission = typeof submissions.$inferSelect;

export interface User {
  id: string;
  username: string; // also used as the email
  password: string; // scrypt-hashed
  name: string;
  team: Team;
  teamId: string; // e.g. "TEAM01"
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
  status: "Success" | "Fail";
  challengeId: string;
  roomId: string;
  roomName: string;
  team: Team;
  submittedAt: string; // ISO string
}

export const submitFlagSchema = z.object({
  flag: z
    .string()
    .trim()
    .min(1, "Flag cannot be empty")
    .max(256, "Flag is too long"),
  challengeId: z
    .string()
    .trim()
    .min(1, "Challenge ID is required")
    .max(64, "Challenge ID is too long"),
  roomId: z
    .string()
    .trim()
    .min(1, "Room ID is required")
    .max(64, "Room ID is too long"),
});

export type InsertSubmission = z.infer<typeof submitFlagSchema>;
