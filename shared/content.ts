import type {
  CatalogRoom,
  CatalogChallenge,
  CatalogResource,
  RoomCode,
  Session,
} from "./challengeCatalog";
import type { Team } from "./schema";

export type RoomDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface RoomChallengeContent {
  id: string;
  title: string;
  description: string;
  points: number;
  /**
   * The challenge's flag template, e.g. "NEXUS{SQLI_ADMIN_${TEAM_ID}}".
   * The frontend uses this purely as a placeholder hint in the UI; the server
   * remains the only authority that resolves the template.
   */
  flagTemplate: string;
}

export interface RoomContent {
  id: string;
  roomCode: RoomCode;
  session: Session;
  title: string;
  description: string;
  team: Team;
  difficulty: RoomDifficulty;
  duration: string;
  durationMinutes: number | null;
  participants: number;
  tags: string[];
  learningObjectives: string[];
  prerequisites: string[];
  externalResources: CatalogResource[];
  challenges: RoomChallengeContent[];
}

export interface RoomsContentResponse {
  source: "catalog-v2";
  generatedAt: string;
  rooms: RoomContent[];
}

function parseDurationMinutes(duration: string): number | null {
  const match = duration.match(/(\d+)/);
  if (!match) return null;

  const value = Number(match[1]);
  if (!Number.isFinite(value)) return null;
  return value;
}

function mapChallenge(challenge: CatalogChallenge): RoomChallengeContent {
  return {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    points: challenge.points,
    flagTemplate: challenge.flagTemplate,
  };
}

export function mapCatalogRoomToContent(room: CatalogRoom): RoomContent {
  return {
    id: room.id,
    roomCode: room.roomCode,
    session: room.session,
    title: room.title,
    description: room.description,
    team: room.team,
    difficulty: room.difficulty,
    duration: room.duration,
    durationMinutes: parseDurationMinutes(room.duration),
    participants: room.participants,
    tags: room.tags,
    learningObjectives: room.objectives ?? [],
    prerequisites: room.prerequisites ?? [],
    externalResources: room.externalResources ?? [],
    challenges: room.challenges.map(mapChallenge),
  };
}

export function buildRoomsContentResponse(
  catalog: CatalogRoom[]
): RoomsContentResponse {
  return {
    source: "catalog-v2",
    generatedAt: new Date().toISOString(),
    rooms: catalog.map(mapCatalogRoomToContent),
  };
}
