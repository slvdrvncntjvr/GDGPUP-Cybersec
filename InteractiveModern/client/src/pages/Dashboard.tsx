import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileCard from "@/components/dashboard/ProfileCard";
import RoomsCompleted from "@/components/dashboard/RoomsCompleted";
import SubmissionsTable from "@/components/dashboard/SubmissionsTable";
import type { RoomCard, Submission, UserSummary } from "@/components/dashboard/types";
import { Button } from "@/components/ui/button";
import { Shield, FileSearch, Network, Database, Lock, AlertTriangle, Cpu, Crosshair, Terminal, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const qc = useQueryClient();
  const { user: authUser, isLoading: isAuthLoading } = useAuth();

  const { data, isLoading, error, refetch, isFetching } = useQuery<DashboardApiResponse | null>({
    queryKey: ["/api/dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard", { credentials: "include" });
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
          <p className="text-muted-foreground">You must be logged in to view your dashboard.</p>
          <Button asChild className="mt-4">
            <Link href="/">Return Home</Link>
          </Button>
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
          difficulty: "Intermediate", // Fallback, would normally come from room metadata
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
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}