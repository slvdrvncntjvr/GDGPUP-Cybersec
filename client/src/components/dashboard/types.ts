import type { LucideIcon } from "lucide-react";

export type Team = "blue" | "red";

export type UserSummary = {
  name: string;
  /** Public profile id used as the visible badge (display only). */
  gdgId: string;
  /** Server-assigned, persistent TEAM_ID used inside flag templates. */
  teamId: string;
  team: Team; // badge color (blue/red)
  teamLabel: string; // "Blue Team" / "Red Team"
  description: string;
  xp: number;
  xpGoal: number;
  avatarUrl?: string;
};

export type RoomCard = {
  id: string;
  name: string;
  /** PDF code, e.g. "RED-1" / "BLUE-2". Optional for legacy submissions. */
  roomCode?: string;
  icon: LucideIcon;
  team: Team;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  /** Solved/total challenge count for an inline progress chip. */
  solvedChallenges?: number;
  totalChallenges?: number;
  earnedXp?: number;
  totalXp?: number;
};

export type Submission = {
  id: string;
  status: "Success" | "Fail";
  roomName: string;
  team: Team;
  /** ISO timestamp from the API. */
  submittedAt?: string;
  /** Optional room code for display, e.g. "RED-1". */
  roomCode?: string;
};