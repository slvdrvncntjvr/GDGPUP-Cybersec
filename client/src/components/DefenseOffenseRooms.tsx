import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  AlertTriangle,
  CloudCog,
  Crosshair,
  Eye,
  FileSearch,
  Lock,
  Network,
  Shield,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { RoomCode } from "@shared/challengeCatalog";
import type { RoomContent, RoomsContentResponse } from "@shared/content";

const iconByRoomCode: Record<RoomCode, LucideIcon> = {
  "RED-1": Crosshair,
  "RED-2": Network,
  "RED-3": CloudCog,
  "RED-4": Terminal,
  "BLUE-1": Lock,
  "BLUE-2": FileSearch,
  "BLUE-3": Eye,
  "BLUE-4": AlertTriangle,
};

interface MiniRoomCardProps {
  room: RoomContent;
  team: "blue" | "red";
  delay: number;
}

function MiniRoomCard({ room, team, delay }: MiniRoomCardProps) {
  const Icon = iconByRoomCode[room.roomCode] ?? Shield;
  const isBlue = team === "blue";

  return (
    <div
      className={cn(
        "group flex items-start justify-between gap-4 p-4 rounded-xl bg-card border border-border/50 transition-all duration-300 hover:border-border opacity-0 animate-slide-up"
      )}
      style={{ animationDelay: `${delay}s` }}
      data-testid={`room-card-${room.id}`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div
          className={cn(
            "w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0",
            isBlue ? "bg-primary/10" : "bg-cyber-red/10"
          )}
        >
          <Icon
            className={cn(
              "w-4.5 h-4.5",
              isBlue ? "text-primary" : "text-cyber-red"
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "px-1.5 py-0 rounded-md text-[10px] font-mono font-semibold border",
                isBlue
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-cyber-red/10 text-cyber-red border-cyber-red/30"
              )}
            >
              {room.roomCode}
            </span>
            <h4 className="font-display text-sm font-semibold text-foreground truncate">
              {room.title}
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {room.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {room.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-5 bg-muted/50"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Button
        asChild
        size="sm"
        variant={isBlue ? "default" : "destructive"}
        className="flex-shrink-0 text-xs h-8"
        data-testid={`button-join-${room.id}`}
      >
        <Link href={`/rooms/${room.id}`}>Open</Link>
      </Button>
    </div>
  );
}

export default function DefenseOffenseRooms() {
  const [activeTeam, setActiveTeam] = useState<"none" | "blue" | "red">("none");

  const { data, isLoading } = useQuery<RoomsContentResponse>({
    queryKey: ["/api/content/rooms"],
    queryFn: async () => {
      const res = await fetch("/api/content/rooms", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load room catalog");
      return res.json() as Promise<RoomsContentResponse>;
    },
  });

  const { defenseRooms, offenseRooms } = useMemo(() => {
    const rooms = data?.rooms ?? [];
    return {
      defenseRooms: rooms.filter((room) => room.team === "blue"),
      offenseRooms: rooms.filter((room) => room.team === "red"),
    };
  }, [data?.rooms]);

  return (
    <section
      className="py-16 md:py-24 bg-background relative overflow-hidden"
      data-testid="defense-offense-rooms"
    >
      <div
        className={cn(
          "absolute inset-0 transition-all duration-700 pointer-events-none",
          activeTeam === "blue" &&
            "bg-gradient-to-br from-cyber-blue/5 via-transparent to-cyber-blue/[0.03]",
          activeTeam === "red" &&
            "bg-gradient-to-br from-cyber-red/5 via-transparent to-cyber-red/[0.03]"
        )}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3 opacity-0 animate-slide-up">
            Defense vs Offense Rooms
          </h2>
          <p
            className="text-base text-muted-foreground opacity-0 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Eight session labs from the GDG PUP cybersec track — pick defense or
            offense and jump in.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div
            onMouseEnter={() => setActiveTeam("blue")}
            onMouseLeave={() => setActiveTeam("none")}
            className={cn(
              "relative rounded-2xl p-1 transition-all duration-500",
              activeTeam === "blue" &&
                "bg-gradient-to-br from-cyber-blue/15 to-cyber-blue/5 shadow-md shadow-cyber-blue/5"
            )}
          >
            <div className="bg-background rounded-xl p-4">
              <div
                className="flex items-center gap-2 mb-4 opacity-0 animate-fade-in"
                style={{ animationDelay: "0.15s" }}
              >
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Blue Team</h3>
                <Badge variant="outline" className="text-xs border-primary/30">
                  Defense
                </Badge>
              </div>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading rooms…</p>
              ) : (
                <div className="space-y-3">
                  {defenseRooms.map((room, i) => (
                    <MiniRoomCard
                      key={room.id}
                      room={room}
                      team="blue"
                      delay={0.02 * i}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            onMouseEnter={() => setActiveTeam("red")}
            onMouseLeave={() => setActiveTeam("none")}
            className={cn(
              "relative rounded-2xl p-1 transition-all duration-500",
              activeTeam === "red" &&
                "bg-gradient-to-br from-cyber-red/15 to-cyber-red/5 shadow-md shadow-cyber-red/5"
            )}
          >
            <div className="bg-background rounded-xl p-4">
              <div
                className="flex items-center gap-2 mb-4 opacity-0 animate-fade-in"
                style={{ animationDelay: "0.15s" }}
              >
                <Crosshair className="w-5 h-5 text-cyber-red" />
                <h3 className="font-display font-semibold text-lg">Red Team</h3>
                <Badge variant="outline" className="text-xs border-cyber-red/30 text-cyber-red">
                  Offense
                </Badge>
              </div>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading rooms…</p>
              ) : (
                <div className="space-y-3">
                  {offenseRooms.map((room, i) => (
                    <MiniRoomCard
                      key={room.id}
                      room={room}
                      team="red"
                      delay={0.02 * i}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button asChild variant="outline">
            <Link href="/rooms">Browse full catalog</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
