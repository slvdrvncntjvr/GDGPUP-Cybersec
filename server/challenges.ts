import { createHash, timingSafeEqual } from "crypto";
import type { Team } from "@shared/schema";
import {
  CHALLENGE_META,
  NEXUS_FLAG_REGEX,
  renderExpectedFlag,
  type ChallengeMetaEntry,
  type RoomCode,
} from "@shared/challengeCatalog";

export interface ChallengeMeta {
  team: Team;
  roomName: string;
  roomCode: RoomCode;
  points: number;
}

export function getChallengeMeta(
  roomId: string,
  challengeId: string
): ChallengeMeta | null {
  const entry: ChallengeMetaEntry | undefined =
    CHALLENGE_META[`${roomId}:${challengeId}`];
  if (!entry) return null;
  return {
    team: entry.team,
    roomName: entry.roomName,
    roomCode: entry.roomCode,
    points: entry.points,
  };
}

/**
 * Validates a submitted flag against the user-specific expected value.
 *
 * The submission must:
 *   1. Be a non-empty string that fits the `NEXUS{...}` envelope.
 *   2. Match a known (roomId, challengeId) catalog entry.
 *   3. Equal the room's `flagTemplate` with the user's `teamId` substituted in.
 *
 * Comparison is constant-time (timingSafeEqual) to avoid leaking partial flag
 * bytes through timing channels. Always returns false for unknown pairs or
 * malformed input.
 */
export function verifyFlag(
  roomId: string,
  challengeId: string,
  submittedFlag: string,
  teamId: string
): boolean {
  const trimmed = submittedFlag.trim();
  if (!NEXUS_FLAG_REGEX.test(trimmed)) return false;

  const entry = CHALLENGE_META[`${roomId}:${challengeId}`];
  if (!entry) return false;

  if (!teamId) return false;

  const expected = renderExpectedFlag(entry.flagTemplate, teamId);

  const a = Buffer.from(trimmed, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function hashFlagForStorage(submittedFlag: string): string {
  return createHash("sha256").update(submittedFlag.trim()).digest("hex");
}
