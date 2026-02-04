import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowRight, Users, Clock } from "lucide-react";

export interface RoomCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  participants: number;
  tags: string[];
  team: "blue" | "red";
  progress?: number;
  delay?: number;
  onJoin?: (id: string) => void;
}

const difficultyColors = {
  Beginner: "bg-primary/10 text-primary border-primary/20",
  Intermediate: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Advanced: "bg-cyber-red/10 text-cyber-red border-cyber-red/20",
};

const teamColors = {
  blue: {
    accent: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    glow: "group-hover:shadow-primary/10",
  },
  red: {
    accent: "bg-cyber-red/10",
    text: "text-cyber-red",
    border: "border-cyber-red/20",
    glow: "group-hover:shadow-cyber-red/10",
  },
};

export default function RoomCard({
  id,
  title,
  description,
  icon: Icon,
  difficulty,
  duration,
  participants,
  tags,
  team,
  progress,
  delay = 0,
  onJoin,
}: RoomCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = teamColors[team];

  const handleJoin = () => {
    if (onJoin) {
      onJoin(id);
    } else {
      console.log(`Joining room: ${title}`);
    }
  };

  return (
    <div
      className={cn(
        "group relative p-6 rounded-2xl bg-card border border-border/50 transition-all duration-300",
        "hover:-translate-y-1 hover:border-border hover:shadow-xl",
        colors.glow,
        "opacity-0 animate-slide-up"
      )}
      style={{ animationDelay: `${delay}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`room-card-${id}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-md flex items-center justify-center transition-transform duration-300",
              colors.accent,
              isHovered && "scale-110"
            )}
          >
            <Icon className={cn("w-6 h-6", colors.text)} />
          </div>

          <Badge
            variant="outline"
            className={cn("text-xs", difficultyColors[difficulty])}
          >
            {difficulty}
          </Badge>
        </div>

        <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs bg-muted/50"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {progress !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  team === "blue" ? "bg-primary" : "bg-cyber-red"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {participants.toLocaleString()}
            </span>
          </div>

          <Button
            size="sm"
            variant={team === "blue" ? "default" : "destructive"}
            className="gap-1 group/btn"
            onClick={handleJoin}
            data-testid={`button-join-${id}`}
          >
            Join
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
