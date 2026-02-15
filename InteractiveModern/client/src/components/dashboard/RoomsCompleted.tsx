import { useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { RoomCard } from "./types";

type Props = {
  rooms: RoomCard[];
};

// Difficulty badge palette matching Rooms page
const difficultyColors: Record<RoomCard["difficulty"], string> = {
  Beginner: "bg-primary/10 text-primary border-primary/20",
  Intermediate: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Advanced: "bg-cyber-red/10 text-cyber-red border-cyber-red/20",
};

// Team badge: BLUE uses cyber-blue (requested)
const teamBadgeColors: Record<RoomCard["team"], string> = {
  blue: "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20",
  red: "bg-cyber-red/10 text-cyber-red border border-cyber-red/20",
};

const teamGlow: Record<RoomCard["team"], string> = {
  blue: "group-hover:shadow-cyber-blue/10",
  red: "group-hover:shadow-cyber-red/10",
};

const teamIconBox: Record<RoomCard["team"], { bg: string; text: string }> = {
  blue: { bg: "bg-cyber-blue/10", text: "text-cyber-blue" },
  red: { bg: "bg-cyber-red/10", text: "text-cyber-red" },
};

export default function RoomsCompleted({ rooms }: Props) {
  return (
    <section className="mb-8">
      <div className="mb-3 inline-flex rounded-md bg-muted px-3 py-1 text-sm font-medium">
        Rooms Completed
      </div>

      {rooms.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border/50 p-6 text-sm text-muted-foreground">
          No rooms completed yet.{" "}
          <Link href="/rooms">
            <a className="text-primary underline-offset-4 hover:underline">Browse rooms</a>
          </Link>{" "}
          to get started.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCompletedCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </section>
  );
}

function RoomCompletedCard({ room }: { room: RoomCard }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = room.icon;

  return (
    <div
      className={cn(
        "group relative p-6 rounded-2xl bg-card border border-border/50 transition-all duration-300",
        "hover:-translate-y-1 hover:border-border hover:shadow-xl",
        teamGlow[room.team]
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-md flex items-center justify-center transition-transform duration-300",
              teamIconBox[room.team].bg,
              isHovered && "scale-110"
            )}
          >
            <Icon className={cn("w-6 h-6", teamIconBox[room.team].text)} />
          </div>

          <Badge variant="outline" className={cn("text-xs", teamBadgeColors[room.team])}>
            {room.team.toUpperCase()}
          </Badge>
        </div>

        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="font-display text-lg font-semibold text-foreground leading-tight min-w-0 truncate">
            {room.name}
          </h3>

          <Badge variant="outline" className={cn("text-xs", difficultyColors[room.difficulty])}>
            {room.difficulty}
          </Badge>
        </div>

        <div className="pt-4 border-t border-border/50 flex items-center justify-end">
          <Button asChild size="sm" variant="outline" className="gap-1 group/btn">
            <Link href="/rooms">
              Open
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}