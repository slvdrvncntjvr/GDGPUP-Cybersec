import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileCard from "@/components/dashboard/ProfileCard";
import RoomsCompleted from "@/components/dashboard/RoomsCompleted";
import SubmissionsTable from "@/components/dashboard/SubmissionsTable";
import type { RoomCard, Submission, UserSummary } from "@/components/dashboard/types";
import { Shield, FileSearch, Lock, AlertTriangle, Cpu, Crosshair, Terminal, Eye, Network, Database } from "lucide-react";

export default function Dashboard() {
  const [search, setSearch] = useState("");

  // TODO: Replace with API data later
  const user: UserSummary = {
    name: "NAME",
    gdgId: "GDG_ID",
    team: "red",
    teamLabel: "Red Team",
    description: "Description",
    xp: 0,
    xpGoal: 100,
    avatarUrl: "",
  };

  const roomsCompleted: RoomCard[] = [
    { id: "siem-triage", name: "SIEM Alert Triage", icon: Shield, team: "blue", difficulty: "Beginner" },
    { id: "windows-hunt", name: "Windows Event Hunt", icon: FileSearch, team: "blue", difficulty: "Intermediate" },
    { id: "ad-attack", name: "AD Attack Path", icon: Network, team: "red", difficulty: "Advanced" },
  ];

  const submissions: Submission[] = [
    { id: "sub-1", flag: "Flag", status: "Success", roomName: "SIEM Alert Triage", team: "blue" },
    { id: "sub-2", flag: "Flag", status: "Fail", roomName: "AD Attack Path", team: "red" },
    { id: "sub-3", flag: "Flag", status: "Success", roomName: "Windows Event Hunt", team: "blue" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-24 pt-20 md:pt-24">
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <DashboardHeader />
          <ProfileCard user={user} />
          <RoomsCompleted rooms={roomsCompleted} />
          <SubmissionsTable submissions={submissions} searchValue={search} onSearchChange={setSearch} />
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}