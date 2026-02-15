export type Team = "blue" | "red";

export type UserSummary = {
  name: string;
  gdgId: string;
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
  team: Team;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
};

export type Submission = {
  id: string;
  flag: string;
  status: "Success" | "Fail";
  roomName: string;
  team: Team; // offense/defense badge color
};