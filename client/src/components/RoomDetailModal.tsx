import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { openAuthModal } from "@/lib/openAuthModal";
import { solvedKey } from "@shared/challengeCatalog";
import type { RoomContent } from "@shared/content";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";
import red_logo from "./GDGCybersec-Assets/GDG-ascii-red-transparent.png";
import blue_logo from "./GDGCybersec-Assets/GDG-ascii-blue-transparent.png";
import { getRoomBody } from "./rooms";

interface RoomDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "overview" | "challenges";
  initialChallengeId?: string | null;
  onNavigateChallenge?: (challengeId: string) => void;
  /** Pre-computed solved challenge ids (e.g. ["ch-1", "ch-3"]). */
  solvedChallengeIds: string[];
  room: RoomContent;
}

const difficultyColors = {
  Beginner: "bg-primary/10 text-primary border-primary/20",
  Intermediate: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Advanced: "bg-cyber-red/10 text-cyber-red border-cyber-red/20",
} as const;

interface SubmissionResponse {
  status: "Success" | "Fail";
  xpAwarded: boolean;
  pointsAwarded: number;
}

export default function RoomDetailModal({
  open,
  onOpenChange,
  initialTab,
  initialChallengeId,
  onNavigateChallenge,
  solvedChallengeIds,
  room,
}: RoomDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "challenges">(
    initialTab ?? "overview"
  );
  const [flagInputs, setFlagInputs] = useState<Record<string, string>>({});
  const [pendingChallengeId, setPendingChallengeId] = useState<string | null>(
    null
  );

  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => {
    if (!open) return;
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab, open]);

  // When the modal closes, drop any half-typed flags from local state.
  useEffect(() => {
    if (!open) {
      setFlagInputs({});
      setPendingChallengeId(null);
    }
  }, [open]);

  const solvedSet = useMemo(
    () => new Set(solvedChallengeIds),
    [solvedChallengeIds]
  );

  const completedChallenges = solvedSet.size;
  const totalChallenges = room.challenges.length;
  const totalPoints = room.challenges.reduce((s, c) => s + c.points, 0);
  const earnedPoints = room.challenges
    .filter((c) => solvedSet.has(c.id))
    .reduce((s, c) => s + c.points, 0);
  const progressPercent =
    totalChallenges > 0
      ? Math.round((completedChallenges / totalChallenges) * 100)
      : 0;

  const submitMut = useMutation({
    mutationFn: async (data: {
      flag: string;
      challengeId: string;
      roomId: string;
    }) => {
      const res = await apiRequest("POST", "/api/submissions", data);
      return res.json() as Promise<SubmissionResponse>;
    },
    onMutate: (variables) => {
      setPendingChallengeId(variables.challengeId);
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ["/api/dashboard"] });
      qc.invalidateQueries({ queryKey: ["/api/me"] });
      qc.setQueryData<{ solvedKeys: string[] }>(
        ["/api/rooms/progress"],
        (current) => {
          if (data.status !== "Success") return current ?? { solvedKeys: [] };
          const key = solvedKey(variables.roomId, variables.challengeId);
          const existing = new Set(current?.solvedKeys ?? []);
          existing.add(key);
          return { solvedKeys: Array.from(existing) };
        }
      );
      qc.invalidateQueries({ queryKey: ["/api/rooms/progress"] });
      qc.invalidateQueries({ queryKey: ["/api/progress/leaderboard", 10] });
      setFlagInputs((prev) => ({ ...prev, [variables.challengeId]: "" }));

      if (data.status === "Success") {
        toast({
          title: "Flag accepted",
          description: data.xpAwarded
            ? `+${data.pointsAwarded} XP awarded.`
            : "Already solved before — no extra XP this time.",
        });
      } else {
        toast({
          title: "Incorrect flag",
          description:
            "Make sure the flag matches the format NEXUS{...} for your TEAM_ID.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Submission failed",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setPendingChallengeId(null);
    },
  });

  const handleSubmitFlag = (challengeId: string) => {
    if (!isLoggedIn || !user) {
      toast({
        title: "Please log in",
        description: "You must be logged in to submit flags.",
        variant: "destructive",
      });
      openAuthModal("login", `/rooms/${room.id}/challenges/${challengeId}`);
      return;
    }
    if (user.team !== room.team) {
      toast({
        title: `This challenge is ${room.team === "red" ? "Red Team" : "Blue Team"} only`,
        description:
          "Switch teams from your profile to access challenges from the other track.",
        variant: "destructive",
      });
      return;
    }
    const flag = (flagInputs[challengeId] ?? "").trim();
    if (!flag) return;

    submitMut.mutate({ flag, challengeId, roomId: room.id });
  };

  const handleFlagInput = (challengeId: string, value: string) => {
    setFlagInputs((prev) => ({ ...prev, [challengeId]: value }));
  };

  const handlePrimaryAction = () => {
    setActiveTab("challenges");
    const nextChallenge = room.challenges.find(
      (challenge) => !solvedSet.has(challenge.id)
    )?.id;
    if (nextChallenge && onNavigateChallenge) {
      onNavigateChallenge(nextChallenge);
    }
    if (!isLoggedIn) {
      toast({
        title: "Create your account",
        description: "Sign up or log in to start submitting flags.",
      });
      openAuthModal("signup", `/rooms/${room.id}`);
    }
  };

  const RoomBody = getRoomBody(room.roomCode);
  const teamId = user?.teamId ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 overflow-y-auto max-h-[92vh]",
          activeTab === "challenges" ? "max-w-4xl" : "max-w-2xl"
        )}
      >
        <div
          className={cn(
            "relative h-32 flex items-end p-6",
            room.team === "blue"
              ? "bg-gradient-to-br from-primary/20 to-primary/5"
              : "bg-gradient-to-br from-cyber-red/20 to-cyber-red/5"
          )}
        >
          <img
            src={room.team === "blue" ? blue_logo : red_logo}
            alt={room.team === "blue" ? "Blue Team" : "Red Team"}
            className={cn(
              "absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none",
              room.team === "blue" ? "glow-blue" : "glow-red"
            )}
          />

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
                "px-3 py-1 rounded-md text-xs font-mono font-semibold border",
                room.team === "blue"
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "bg-cyber-red/20 text-cyber-red border-cyber-red/30"
              )}
            >
              {room.roomCode}
            </div>
            <div>
              <DialogTitle className="text-xl font-display font-bold text-foreground">
                {room.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Session {room.session} ·{" "}
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
              <BarChart3 className="w-4 h-4" />
              {earnedPoints}/{totalPoints} XP
            </span>
            {teamId && (
              <Badge
                variant="outline"
                className="font-mono text-xs"
                title="Your TEAM_ID is substituted into NEXUS flags"
              >
                {teamId}
              </Badge>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Your progress</span>
              <span className="font-medium text-foreground">
                {completedChallenges}/{totalChallenges} challenges
              </span>
            </div>
            <Progress
              value={progressPercent}
              className={cn(
                "h-2",
                room.team === "blue" ? "[&>div]:bg-primary" : "[&>div]:bg-cyber-red"
              )}
            />
          </div>

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
              onClick={() => {
                setActiveTab("challenges");
                if (room.challenges.length > 0 && onNavigateChallenge) {
                  const target = initialChallengeId ?? room.challenges[0].id;
                  onNavigateChallenge(target);
                }
              }}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === "challenges"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              data-testid="tab-challenges"
            >
              Challenges ({totalChallenges})
            </button>
          </div>

          {activeTab === "overview" ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground">{room.description}</p>
              </div>

              {room.learningObjectives.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Learning Objectives
                  </h3>
                  <ul className="space-y-2">
                    {room.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {room.prerequisites.length > 0 && (
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
            <RoomBody
              room={room}
              teamId={teamId}
              solvedChallengeIds={solvedSet}
              pendingChallengeId={pendingChallengeId}
              flagInputs={flagInputs}
              onFlagInput={handleFlagInput}
              onSubmitFlag={handleSubmitFlag}
            />
          )}

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border/50">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              variant={room.team === "blue" ? "default" : "destructive"}
              className="gap-2"
              data-testid="button-continue-room"
              onClick={handlePrimaryAction}
            >
              {completedChallenges > 0 ? "Continue Room" : "Start Room"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
