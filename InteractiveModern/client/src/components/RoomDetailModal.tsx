import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  LucideIcon,
  Clock,
  Users,
  BarChart3,
  CheckCircle2,
  Circle,
  Play,
  ArrowRight,
  X,
} from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  points: number;
}

interface RoomDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: {
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
    challenges: Challenge[];
    prerequisites?: string[];
    objectives?: string[];
  };
}

const difficultyColors = {
  Beginner: "bg-primary/10 text-primary border-primary/20",
  Intermediate: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Advanced: "bg-cyber-red/10 text-cyber-red border-cyber-red/20",
};

export default function RoomDetailModal({
  open,
  onOpenChange,
  room,
}: RoomDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "challenges">("overview");
  const Icon = room.icon;
  const completedChallenges = room.challenges.filter((c) => c.completed).length;
  const totalPoints = room.challenges.reduce((sum, c) => sum + c.points, 0);
  const earnedPoints = room.challenges
    .filter((c) => c.completed)
    .reduce((sum, c) => sum + c.points, 0);

  const handleStartChallenge = (challengeId: string) => {
    console.log(`Starting challenge: ${challengeId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div
          className={cn(
            "relative h-32 flex items-end p-6",
            room.team === "blue"
              ? "bg-gradient-to-br from-primary/20 to-primary/5"
              : "bg-gradient-to-br from-cyber-red/20 to-cyber-red/5"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-14 h-14 rounded-md flex items-center justify-center",
                room.team === "blue" ? "bg-primary/20" : "bg-cyber-red/20"
              )}
            >
              <Icon
                className={cn(
                  "w-7 h-7",
                  room.team === "blue" ? "text-primary" : "text-cyber-red"
                )}
              />
            </div>
            <div>
              <DialogTitle className="text-xl font-display font-bold text-foreground">
                {room.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {room.team === "blue" ? "Defense Track" : "Offense Track"}
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="outline" className={difficultyColors[room.difficulty]}>
              {room.difficulty}
            </Badge>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {room.duration}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {room.participants.toLocaleString()} learners
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <BarChart3 className="w-4 h-4" />
              {earnedPoints}/{totalPoints} points
            </span>
          </div>

          {room.progress !== undefined && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Your Progress</span>
                <span className="font-medium text-foreground">
                  {completedChallenges}/{room.challenges.length} challenges
                </span>
              </div>
              <Progress
                value={room.progress}
                className={cn(
                  "h-2",
                  room.team === "blue" ? "[&>div]:bg-primary" : "[&>div]:bg-cyber-red"
                )}
              />
            </div>
          )}

          <div className="flex gap-2 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab("overview")}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === "overview"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              data-testid="tab-overview"
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("challenges")}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === "challenges"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              data-testid="tab-challenges"
            >
              Challenges ({room.challenges.length})
            </button>
          </div>

          {activeTab === "overview" ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground">{room.description}</p>
              </div>

              {room.objectives && room.objectives.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Learning Objectives
                  </h3>
                  <ul className="space-y-2">
                    {room.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {room.prerequisites && room.prerequisites.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Prerequisites</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.prerequisites.map((prereq, i) => (
                      <Badge key={i} variant="secondary">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-foreground mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {room.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {room.challenges.map((challenge, index) => (
                <div
                  key={challenge.id}
                  className={cn(
                    "p-4 rounded-md border transition-colors",
                    challenge.completed
                      ? "bg-muted/30 border-border/50"
                      : "bg-card border-border hover:border-primary/30"
                  )}
                  data-testid={`challenge-${challenge.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                          challenge.completed
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {challenge.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h4
                          className={cn(
                            "font-medium",
                            challenge.completed
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          )}
                        >
                          {challenge.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {challenge.description}
                        </p>
                        <span className="text-xs text-muted-foreground mt-2 inline-block">
                          {challenge.points} points
                        </span>
                      </div>
                    </div>

                    {!challenge.completed && (
                      <Button
                        size="sm"
                        variant={room.team === "blue" ? "default" : "destructive"}
                        className="gap-1 flex-shrink-0"
                        onClick={() => handleStartChallenge(challenge.id)}
                        data-testid={`button-start-challenge-${challenge.id}`}
                      >
                        <Play className="w-3 h-3" />
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border/50">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              variant={room.team === "blue" ? "default" : "destructive"}
              className="gap-2"
              data-testid="button-continue-room"
            >
              {room.progress ? "Continue Room" : "Start Room"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
