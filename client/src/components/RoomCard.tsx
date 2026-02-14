import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowRight, Users, Clock, Trophy } from "lucide-react";

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

// Keep difficulty colors standard (Green/Easy, Orange/Med, Red/Hard)
const difficultyColors = {
  Beginner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Advanced: "bg-red-500/10 text-red-500 border-red-500/20",
};

// Define explicit team styling
const teamConfig = {
  blue: {
    accent: "bg-blue-500/10",
    text: "text-blue-500",
    border: "group-hover:border-blue-500/50",
    glow: "group-hover:shadow-blue-500/10",
    gradient: "from-blue-500/5",
    progress: "bg-blue-500",
    button: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20",
    badge: "bg-blue-500/5 text-blue-500 border-blue-500/20"
  },
  red: {
    accent: "bg-red-500/10",
    text: "text-red-500",
    border: "group-hover:border-red-500/50",
    glow: "group-hover:shadow-red-500/10",
    gradient: "from-red-500/5",
    progress: "bg-red-500",
    button: "bg-red-600 hover:bg-red-700 text-white shadow-red-900/20",
    badge: "bg-red-500/5 text-red-500 border-red-500/20"
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
  
  // Select configuration based on team
  const config = teamConfig[team];

  const handleJoin = () => {
    if (onJoin) {
      onJoin(id);
    }
  };

  return (
    <div
      className={cn(
        "group relative p-6 rounded-2xl bg-card border border-border/50 transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        config.border, 
        config.glow,
        "opacity-0 animate-slide-up"
      )}
      style={{ animationDelay: `${delay}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Background Gradient */}
      <div className={cn(
        "absolute inset-0 rounded-2xl bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity",
        config.gradient
      )} />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-md flex items-center justify-center transition-transform duration-300",
              config.accent,
              isHovered && "scale-110"
            )}
          >
            <Icon className={cn("w-6 h-6", config.text)} />
          </div>

          <Badge
            variant="outline"
            className={cn("text-xs", difficultyColors[difficulty])}
          >
            {difficulty}
          </Badge>
        </div>

        <h3 className={cn(
          "font-display text-lg font-semibold text-foreground mb-2 transition-colors",
          `group-hover:${config.text}`
        )}>
          {title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={cn("text-[10px]", config.badge)}
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
                className={cn("h-full rounded-full transition-all duration-500", config.progress)}
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
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              {team === 'red' ? '20 XP' : '50 XP'}
            </span>
          </div>

          <Button
            size="sm"
            className={cn("gap-1 group/btn shadow-md border-0", config.button)}
            onClick={handleJoin}
          >
            Join
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}