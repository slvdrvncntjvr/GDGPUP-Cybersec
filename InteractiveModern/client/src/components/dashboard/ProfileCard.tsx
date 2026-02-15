import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Trophy, Camera, Crosshair } from "lucide-react";
import type { UserSummary } from "./types";
import { useToast } from "@/hooks/use-toast";

type Props = {
  user: UserSummary;
  onUploadPhoto?: () => void;
  onCopyGdgId?: (gdgId: string) => Promise<void> | void;
};

const teamBadgeClass = (team: UserSummary["team"]) =>
  team === "blue"
    ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20"
    : "bg-cyber-red/10 text-cyber-red border border-cyber-red/20";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";

  const first = parts[0]?.[0]?.toUpperCase() ?? "U";
  const last =
    parts.length > 1
      ? parts[parts.length - 1]?.[0]?.toUpperCase()
      : "";

  return (first + last).trim() || first;
}

export default function ProfileCard({
  user,
  onUploadPhoto,
  onCopyGdgId,
}: Props) {
  const { toast } = useToast();

  const xpPercent =
    user.xpGoal > 0
      ? Math.max(0, Math.min(100, Math.round((user.xp / user.xpGoal) * 100)))
      : 0;

  const initials = useMemo(() => getInitials(user.name ?? ""), [user.name]);

  const TeamIcon = user.team === "blue" ? Shield : Crosshair;

  const copyIdToClipboard = async () => {
    try {
      // TODO (backend): If ID copy needs logging/analytics, handle it here.
      if (onCopyGdgId) {
        await onCopyGdgId(user.gdgId);
      } else if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(user.gdgId);
      } else {
        const ta = document.createElement("textarea");
        ta.value = user.gdgId;
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }

      toast({
        title: "ID copied",
        description: "Your GDG ID has been copied to clipboard.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy ID. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-44 w-full items-center justify-center rounded-md border bg-muted/30">
              <Avatar className="h-20 w-20">
                {/* TODO (backend): Supply real avatarUrl from user profile API */}
                <AvatarImage src={user.avatarUrl ?? ""} alt={`${user.name} avatar`} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => {
                // TODO (backend): Implement upload flow (signed URL / storage service)
                onUploadPhoto?.();
              }}
            >
              <Camera className="h-4 w-4" />
              Upload photo
            </Button>
          </div>

          {/* Info Section */}
          <div className="flex flex-col justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                <div className="text-3xl font-bold tracking-tight">
                  {user.name}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* GDG ID (click to copy) */}
                  <button
                    type="button"
                    onClick={copyIdToClipboard}
                    className="inline-flex"
                    title="Click to copy ID"
                  >
                    <Badge
                      variant="secondary"
                      className="cursor-pointer select-none hover:bg-muted transition-colors"
                    >
                      {user.gdgId}
                    </Badge>
                  </button>

                  {/* Team badge with correct icon */}
                  <Badge
                    variant="outline"
                    className={`gap-1 ${teamBadgeClass(user.team)}`}
                  >
                    <TeamIcon className="h-3.5 w-3.5" />
                    {user.teamLabel}
                  </Badge>
                </div>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {user.description}
              </p>
            </div>

            {/* XP Section */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  XP Progress
                </span>
                <span className="text-xs text-muted-foreground">
                  {/* TODO (backend): Replace with real stats endpoint */}
                  {user.xp}/{user.xpGoal}XP
                </span>
              </div>

              <Progress value={xpPercent} />

              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5" />
                  Level-up by completing rooms
                </span>
                <span>{xpPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}