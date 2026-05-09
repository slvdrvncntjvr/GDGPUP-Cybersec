import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileCard from "@/components/dashboard/ProfileCard";
import RoomsCompleted from "@/components/dashboard/RoomsCompleted";
import SubmissionsTable from "@/components/dashboard/SubmissionsTable";
import type { RoomCard, UserSummary } from "@/components/dashboard/types";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROOM_BY_ID, type RoomCode } from "@shared/challengeCatalog";
import { openAuthModal } from "@/lib/openAuthModal";

interface DashboardApiUser {
  id: string;
  name: string;
  team: "blue" | "red";
  teamId: string;
  description: string;
  xp: number;
  xpGoal: number;
  avatarUrl: string;
}

interface DashboardApiSubmission {
  id: string;
  status: "Success" | "Fail";
  roomId: string;
  roomName: string;
  team: "blue" | "red";
  challengeId: string;
  submittedAt: string;
}

interface DashboardApiResponse {
  user: DashboardApiUser;
  submissions: DashboardApiSubmission[];
}

interface LeaderboardResponse {
  topUsers: Array<{
    id: string;
    name: string;
    team: "blue" | "red";
    xp: number;
  }>;
  teams: Array<{
    team: "blue" | "red";
    users: number;
    totalXp: number;
    solvedChallenges: number;
  }>;
}

interface RoomsProgressResponse {
  solvedKeys: string[];
}

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

function iconForRoom(roomId: string): LucideIcon {
  const room = ROOM_BY_ID.get(roomId);
  if (!room) return Shield;
  return iconByRoomCode[room.roomCode] ?? Shield;
}

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const qc = useQueryClient();
  const [location] = useLocation();
  const [hasPromptedAuth, setHasPromptedAuth] = useState(false);
  const { user: authUser, isLoading: isAuthLoading } = useAuth();

  const { data: leaderboardData } = useQuery<LeaderboardResponse>({
    queryKey: ["/api/progress/leaderboard", 10],
    queryFn: async () => {
      const res = await fetch("/api/progress/leaderboard?limit=10", {
        credentials: "include",
      });
      if (!res.ok) {
        return { topUsers: [], teams: [] };
      }
      return res.json() as Promise<LeaderboardResponse>;
    },
    retry: false,
  });

  const { data: progressData } = useQuery<RoomsProgressResponse>({
    queryKey: ["/api/rooms/progress"],
    queryFn: async () => {
      const res = await fetch("/api/rooms/progress", { credentials: "include" });
      if (!res.ok) return { solvedKeys: [] };
      return res.json() as Promise<RoomsProgressResponse>;
    },
    retry: false,
    enabled: !isAuthLoading && !!authUser,
  });

  useEffect(() => {
    if (!isAuthLoading && !authUser && !hasPromptedAuth) {
      openAuthModal("login", location);
      setHasPromptedAuth(true);
    }
    if (authUser && hasPromptedAuth) {
      setHasPromptedAuth(false);
    }
  }, [authUser, hasPromptedAuth, isAuthLoading, location]);

  const { data, isLoading, error, refetch, isFetching } = useQuery<
    DashboardApiResponse | null
  >({
    queryKey: ["/api/dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard?limit=100", {
        credentials: "include",
      });
      if (res.status === 401) {
        await qc.invalidateQueries({ queryKey: ["/api/me"] });
        return null;
      }
      if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        throw new Error(`${res.status}: ${text}`);
      }
      return res.json() as Promise<DashboardApiResponse>;
    },
    retry: false,
    enabled: !isAuthLoading && !!authUser,
  });

  const completedRooms = useMemo<RoomCard[]>(() => {
    if (!data?.user || !progressData) return [];

    const byRoom = new Map<
      string,
      { solvedChallenges: number; earnedXp: number }
    >();
    for (const key of progressData.solvedKeys) {
      const [roomId, challengeId] = key.split(":");
      if (!roomId || !challengeId) continue;
      const room = ROOM_BY_ID.get(roomId);
      if (!room) continue;
      const challenge = room.challenges.find((c) => c.id === challengeId);
      if (!challenge) continue;
      const entry = byRoom.get(roomId) ?? { solvedChallenges: 0, earnedXp: 0 };
      entry.solvedChallenges += 1;
      entry.earnedXp += challenge.points;
      byRoom.set(roomId, entry);
    }

    return Array.from(byRoom.entries())
      .map(([roomId, agg]) => {
        const room = ROOM_BY_ID.get(roomId);
        if (!room) return null;
        const totalXp = room.challenges.reduce((s, c) => s + c.points, 0);
        return {
          id: roomId,
          name: room.title,
          roomCode: room.roomCode,
          icon: iconForRoom(roomId),
          team: room.team,
          difficulty: room.difficulty,
          solvedChallenges: agg.solvedChallenges,
          totalChallenges: room.challenges.length,
          earnedXp: agg.earnedXp,
          totalXp,
        } as RoomCard;
      })
      .filter((entry): entry is RoomCard => Boolean(entry))
      .sort((a, b) => (b.solvedChallenges ?? 0) - (a.solvedChallenges ?? 0));
  }, [data?.user, progressData]);

  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pb-24 pt-20 md:pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pb-24 pt-20 md:pt-24 flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 opacity-70" />
          <h2 className="text-2xl font-bold">Dashboard Temporarily Unavailable</h2>
          <p className="text-muted-foreground max-w-md">
            We could not load your dashboard right now. Please try again in a few
            seconds.
          </p>
          <Button className="mt-2" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? "Retrying..." : "Retry"}
          </Button>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (!authUser || !data?.user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pb-24 pt-20 md:pt-24 flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
          <Shield className="w-16 h-16 text-muted-foreground opacity-50" />
          <h2 className="text-2xl font-bold">Please Log In</h2>
          <p className="text-muted-foreground">
            You must be logged in to view your dashboard. We will return you here
            after sign in.
          </p>
          <div className="flex gap-3 mt-2">
            <Button onClick={() => openAuthModal("login", location)}>
              Log In to Continue
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  const apiUser = data.user;
  const apiSubmissions = data.submissions || [];

  const userSummary: UserSummary = {
    name: apiUser.name,
    gdgId: `GDG-${apiUser.id.substring(0, 8).toUpperCase()}`,
    teamId: apiUser.teamId,
    team: apiUser.team,
    teamLabel: apiUser.team === "red" ? "Red Team" : "Blue Team",
    description:
      apiUser.description ||
      `${apiUser.team === "red" ? "Offense" : "Defense"} team member`,
    xp: apiUser.xp,
    xpGoal: apiUser.xpGoal,
    avatarUrl: apiUser.avatarUrl,
  };

  const submissionsForTable = apiSubmissions.map((sub) => {
    const room = ROOM_BY_ID.get(sub.roomId);
    return {
      id: sub.id,
      status: sub.status,
      roomName: sub.roomName,
      team: sub.team,
      submittedAt: sub.submittedAt,
      roomCode: room?.roomCode,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-24 pt-20 md:pt-24">
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <DashboardHeader />
          <ProfileCard user={userSummary} />
          <RoomsCompleted rooms={completedRooms} />
          <SubmissionsTable
            submissions={submissionsForTable}
            searchValue={search}
            onSearchChange={setSearch}
          />

          <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-semibold mb-3">Top Learners</h3>
              <div className="space-y-2">
                {(leaderboardData?.topUsers ?? []).map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-5">#{idx + 1}</span>
                      <span className="font-medium">{entry.name}</span>
                      <span
                        className={
                          entry.team === "red"
                            ? "text-[hsl(var(--cyber-red))]"
                            : "text-[hsl(var(--cyber-blue))]"
                        }
                      >
                        {entry.team === "red" ? "Red" : "Blue"}
                      </span>
                    </div>
                    <span className="font-mono">{entry.xp} XP</span>
                  </div>
                ))}
                {(leaderboardData?.topUsers?.length ?? 0) === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No leaderboard data yet.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-semibold mb-3">Team Aggregates</h3>
              <div className="space-y-3">
                {(leaderboardData?.teams ?? []).map((team) => (
                  <div
                    key={team.team}
                    className="rounded-lg border border-border/60 p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={
                          team.team === "red"
                            ? "font-medium text-[hsl(var(--cyber-red))]"
                            : "font-medium text-[hsl(var(--cyber-blue))]"
                        }
                      >
                        {team.team === "red" ? "Red Team" : "Blue Team"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {team.users} members
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Total XP</span>
                      <span className="font-mono">{team.totalXp}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Solved Challenges</span>
                      <span className="font-mono">{team.solvedChallenges}</span>
                    </div>
                  </div>
                ))}
                {(leaderboardData?.teams?.length ?? 0) === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No team progress data yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
