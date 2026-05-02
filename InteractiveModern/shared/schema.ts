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
  username: string;   // used as email as well
  password: string;   // plain-text for now (hashed in production)
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
  roomId: string;
  roomName: string;
  team: Team;
  submittedAt: string; // ISO string
}

export const submitFlagSchema = z.object({
  flag: z.string().min(1, "Flag cannot be empty"),
  challengeId: z.string().min(1, "Challenge ID is required"),
  roomId: z.string().min(1),
  roomName: z.string().min(1),
  team: z.enum(["blue", "red"]),
});

export type InsertSubmission = z.infer<typeof submitFlagSchema>;
