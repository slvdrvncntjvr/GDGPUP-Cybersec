import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoomCard from "./RoomCard";
import { Shield, Crosshair, AlertTriangle, Terminal, Eye, Network, Lock, FileSearch } from "lucide-react";
import { Link } from "wouter";

type TeamFilter = "all" | "blue" | "red";

const rooms = [
  {
    id: "siem-triage",
    title: "SIEM Alert Triage",
    description: "Investigate suspicious logins and lateral movement using a SIEM dashboard.",
    icon: Shield,
    difficulty: "Beginner" as const,
    duration: "45 min",
    participants: 1234,
    tags: ["Blue Team", "SIEM", "Log Analysis"],
    team: "blue" as const,
    progress: 65,
  },
  {
    id: "windows-hunt",
    title: "Windows Event Hunt",
    description: "Pivot through Security, Sysmon, and PowerShell logs to detect malicious behavior.",
    icon: FileSearch,
    difficulty: "Intermediate" as const,
    duration: "60 min",
    participants: 892,
    tags: ["Blue Team", "Windows", "Threat Hunting"],
    team: "blue" as const,
  },
  {
    id: "firewall-hardening",
    title: "Firewall Hardening",
    description: "Analyze traffic and apply rules to block brute-force and command & control.",
    icon: Lock,
    difficulty: "Beginner" as const,
    duration: "30 min",
    participants: 756,
    tags: ["Blue Team", "Network", "Hardening"],
    team: "blue" as const,
    progress: 100,
  },
  {
    id: "web-sqli",
    title: "Web Exploitation: SQLi",
    description: "Identify injection points, exfiltrate data, and craft safe payloads.",
    icon: Crosshair,
    difficulty: "Intermediate" as const,
    duration: "60 min",
    participants: 1567,
    tags: ["Red Team", "Web", "SQLi"],
    team: "red" as const,
  },
  {
    id: "linux-privesc",
    title: "Linux Privilege Escalation",
    description: "Enumerate misconfigs, exploit SUID binaries, and escalate to root.",
    icon: Terminal,
    difficulty: "Intermediate" as const,
    duration: "90 min",
    participants: 1123,
    tags: ["Red Team", "Linux", "Privesc"],
    team: "red" as const,
    progress: 40,
  },
  {
    id: "osint-recon",
    title: "OSINT Recon Challenge",
    description: "Gather intel from public sources to map targets and discover exposures.",
    icon: Eye,
    difficulty: "Beginner" as const,
    duration: "45 min",
    participants: 678,
    tags: ["Red Team", "OSINT", "Recon"],
    team: "red" as const,
  },
  {
    id: "incident-response",
    title: "Incident Response Drill",
    description: "Contain, eradicate, and recover in a simulated enterprise compromise.",
    icon: AlertTriangle,
    difficulty: "Advanced" as const,
    duration: "120 min",
    participants: 445,
    tags: ["Blue Team", "IR", "Playbooks"],
    team: "blue" as const,
  },
  {
    id: "ad-attack",
    title: "AD Attack Path",
    description: "Abuse weak ACLs to move laterally and dump credentials in a lab AD.",
    icon: Network,
    difficulty: "Advanced" as const,
    duration: "120 min",
    participants: 334,
    tags: ["Red Team", "Windows", "Active Directory"],
    team: "red" as const,
  },
];

export default function RoomsSection() {
  const [filter, setFilter] = useState<TeamFilter>("all");

  const filteredRooms = rooms.filter((room) => {
    if (filter === "all") return true;
    return room.team === filter;
  });

  const handleJoinRoom = (id: string) => {
    console.log(`Joining room: ${id}`);
  };

  return (
    <section className="py-20 md:py-32 bg-background" data-testid="rooms-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Defense vs Offense Rooms
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Choose your discipline and jump into interactive missions. Learn
              blue team defense or red team attack with hands-on labs.
            </p>
          </div>

          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as TeamFilter)}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="all" data-testid="filter-all">
                All Rooms
              </TabsTrigger>
              <TabsTrigger value="blue" data-testid="filter-blue">
                <Shield className="w-4 h-4 mr-1.5" />
                Defense
              </TabsTrigger>
              <TabsTrigger value="red" data-testid="filter-red">
                <Crosshair className="w-4 h-4 mr-1.5" />
                Offense
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room, index) => (
            <RoomCard
              key={room.id}
              {...room}
              delay={0.05 * index}
              onJoin={handleJoinRoom}
            />
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/rooms">
            <Button variant="outline" size="lg" data-testid="button-view-all-rooms">
              View All Rooms
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
