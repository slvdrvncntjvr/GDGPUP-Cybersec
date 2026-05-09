import RoomLab from "./RoomLab";
import Red1Body from "./Red1";
import Red2Body from "./Red2";
import Red3Body from "./Red3";
import Red4Body from "./Red4";
import Blue1Body from "./Blue1";
import Blue2Body from "./Blue2";
import Blue3Body from "./Blue3";
import Blue4Body from "./Blue4";
import type {
  RoomBodyComponent,
  RoomBodyProps,
  RoomBodyRegistry,
} from "./types";

export const ROOM_BODIES: RoomBodyRegistry = {
  "RED-1": Red1Body,
  "RED-2": Red2Body,
  "RED-3": Red3Body,
  "RED-4": Red4Body,
  "BLUE-1": Blue1Body,
  "BLUE-2": Blue2Body,
  "BLUE-3": Blue3Body,
  "BLUE-4": Blue4Body,
};

const FallbackBody: RoomBodyComponent = (props: RoomBodyProps) => (
  <RoomLab {...props} lessons={{}} />
);

export function getRoomBody(roomCode: string | undefined): RoomBodyComponent {
  if (!roomCode) return FallbackBody;
  return ROOM_BODIES[roomCode as keyof RoomBodyRegistry] ?? FallbackBody;
}

export type { RoomBodyProps } from "./types";
