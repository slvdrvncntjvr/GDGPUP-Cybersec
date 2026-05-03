import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileCard from "@/components/dashboard/ProfileCard";
import RoomsCompleted from "@/components/dashboard/RoomsCompleted";
import SubmissionsTable from "@/components/dashboard/SubmissionsTable";
import type { UserSummary } from "@/components/dashboard/types";
import { Button } from "@/components/ui/button";
import { Shield, FileSearch, Network, Database, AlertTriangle, Crosshair, Terminal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROOM_BY_ID } from "@shared/challengeCatalog";
import { openAuthModal } from "@/lib/openAuthModal";

interface DashboardApiResponse {
  user: {
    id: string;
    name: string;
    team: "blue" | "red";
    description: string;
    xp: number;
    xpGoal: number;
    avatarUrl: string;
  };
  submissions: Array<{
    id: string;
    status: "Success" | "Fail";
    roomId: string;
    roomName: string;
    team: "blue" | "red";
  }>;
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

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const qc = useQueryClient();
  const [location] = useLocation();
  const [hasPromptedAuth, setHasPromptedAuth] = useState(false);
  const { user: authUser, isLoading: isAuthLoading } = useAuth();

  const { data: leaderboardData } = useQuery<LeaderboardResponse>({
    queryKey: ["/api/progress/leaderboard", 10],
    queryFn: async () => {
      const res = await fetch("/api/progress/leaderboard?limit=10", { credentials: "include" });
      if (!res.ok) {
        return { topUsers: [], teams: [] };
      }
      return res.json() as Promise<LeaderboardResponse>;
    },
    retry: false,
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

  const { data, isLoading, error, refetch, isFetching } = useQuery<DashboardApiResponse | null>({
    queryKey: ["/api/dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard?limit=100", { credentials: "include" });
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
            We could not load your dashboard right now. Please try again in a few seconds.
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
          <p className="text-muted-foreground">You must be logged in to view your dashboard. We will return you here after sign in.</p>
          <div className="flex gap-3 mt-2">
            <Button onClick={() => openAuthModal("login", location)}>Log In to Continue</Button>
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

  // Format API user into UI format
  const apiUser = data.user;
  const apiSubmissions = data.submissions || [];

  const user: UserSummary = {
    name: apiUser.name,
    gdgId: `GDG-${apiUser.id.substring(0, 8).toUpperCase()}`,
    team: apiUser.team,
    teamLabel: apiUser.team === "red" ? "Red Team" : "Blue Team",
    description: apiUser.description,
    xp: apiUser.xp,
    xpGoal: apiUser.xpGoal,
    avatarUrl: apiUser.avatarUrl,
  };

  // Convert raw submissions to UI RoomCards (mocking the icon mapping based on name for now)
  const iconMap: Record<string, any> = {
    "SIEM Alert Triage": Shield,
    "Windows Event Hunt": FileSearch,
    "AD Attack Path": Network,
    "API Security Testing": Database,
    "Web Exploitation: SQLi": Crosshair,
    "Linux Privilege Escalation": Terminal,
  };

  // Filter only successful submissions for the RoomsCompleted component
  const successfulRooms = apiSubmissions
    .filter((s: any) => s.status === "Success")
    .reduce((acc: any[], sub: any) => {
      // Deduplicate by roomName
      if (!acc.find((r) => r.name === sub.roomName)) {
        acc.push({
          id: sub.roomId,
          name: sub.roomName,
          icon: iconMap[sub.roomName] || Shield,
          team: sub.team,
          difficulty: ROOM_BY_ID.get(sub.roomId)?.difficulty ?? "Intermediate",
        });
      }
      return acc;
    }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-24 pt-20 md:pt-24">
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <DashboardHeader />
          <ProfileCard user={user} />
          <RoomsCompleted rooms={successfulRooms} />
          <SubmissionsTable 
            submissions={apiSubmissions.map((s: any) => ({
              id: s.id,
              flag: "••••••••", // hide actual flag in table
              status: s.status,
              roomName: s.roomName,
              team: s.team
            }))} 
            searchValue={search} 
            onSearchChange={setSearch} 
          />

          <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-semibold mb-3">Top Learners</h3>
              <div className="space-y-2">
                {(leaderboardData?.topUsers ?? []).map((entry, idx) => (
                  <div key={entry.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-5">#{idx + 1}</span>
                      <span className="font-medium">{entry.name}</span>
                      <span className={entry.team === "red" ? "text-[hsl(var(--cyber-red))]" : "text-[hsl(var(--cyber-blue))]"}>
                        {entry.team === "red" ? "Red" : "Blue"}
                      </span>
                    </div>
                    <span className="font-mono">{entry.xp} XP</span>
                  </div>
                ))}
                {(leaderboardData?.topUsers?.length ?? 0) === 0 && (
                  <p className="text-sm text-muted-foreground">No leaderboard data yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-semibold mb-3">Team Aggregates</h3>
              <div className="space-y-3">
                {(leaderboardData?.teams ?? []).map((team) => (
                  <div key={team.team} className="rounded-lg border border-border/60 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className={team.team === "red" ? "font-medium text-[hsl(var(--cyber-red))]" : "font-medium text-[hsl(var(--cyber-blue))]"}>
                        {team.team === "red" ? "Red Team" : "Blue Team"}
                      </span>
                      <span className="text-xs text-muted-foreground">{team.users} members</span>
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
                  <p className="text-sm text-muted-foreground">No team progress data yet.</p>
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