import type { ReactNode } from "react";
import type { RoomCode } from "@shared/challengeCatalog";
import type { RoomChallengeContent, RoomContent } from "@shared/content";

export interface ChallengeStep {
  title: string;
  body: ReactNode;
}

export interface ChallengeLesson {
  /** Short objective sentence shown at the top of the lesson card. */
  objective?: ReactNode;
  /** Optional background context for the technique. */
  background?: ReactNode;
  /** Ordered, step-by-step walkthrough. */
  steps?: ChallengeStep[];
  /** Bullet list of "what good looks like" for the participant. */
  verification?: string[];
  /** Optional "Open Target" / external lab links specific to this challenge. */
  resources?: { label: string; url: string }[];
}

export type RoomLessonMap = Record<string, ChallengeLesson>;

export interface RoomBodyProps {
  room: RoomContent;
  teamId: string | null;
  solvedChallengeIds: Set<string>;
  pendingChallengeId: string | null;
  flagInputs: Record<string, string>;
  onFlagInput: (challengeId: string, value: string) => void;
  onSubmitFlag: (challengeId: string) => void;
}

export interface RoomLabRendererProps extends RoomBodyProps {
  /** Per-challenge lesson content. */
  lessons: RoomLessonMap;
}

export type RoomBodyComponent = (props: RoomBodyProps) => JSX.Element;

export type RoomBodyRegistry = Partial<Record<RoomCode, RoomBodyComponent>>;

// Re-export so room files don't need both this module and `@shared/content`.
export type { RoomChallengeContent, RoomContent };
