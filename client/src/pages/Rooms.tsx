import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import RoomCard from "@/components/RoomCard";
import RoomDetailModal from "@/components/RoomDetailModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Shield,
  Crosshair,
  SlidersHorizontal,
  X,
  AlertTriangle,
  Terminal,
  Eye,
  Network,
  Lock,
  FileSearch,
  Cpu,
  Database,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

type TeamFilter = "all" | "blue" | "red";
type DifficultyFilter = "all" | "Beginner" | "Intermediate" | "Advanced";

interface Room {
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
  objectives?: string[];
  prerequisites?: string[];
  challenges: { id: string; title: string; description: string; completed: boolean; points: number }[];
}

const allRooms: Room[] = [
  {
    id: "siem-triage",
    title: "SIEM Alert Triage",
    description: "Investigate suspicious logins and lateral movement using a SIEM dashboard.",
    icon: Shield,
    difficulty: "Beginner",
    duration: "45 min",
    participants: 1234,
    tags: ["Blue Team", "SIEM", "Log Analysis"],
    team: "blue",
    progress: 65,
    objectives: ["Understand SIEM alert structure", "Correlate events across logs", "Prioritize incidents"],
    challenges: [
      { id: "ch-1", title: "Alert Classification", description: "Learn to classify alerts", completed: true, points: 50 },
      { id: "ch-2", title: "Log Correlation", description: "Connect multiple log sources", completed: true, points: 100 },
      { id: "ch-3", title: "Lateral Movement", description: "Detect attacker movement", completed: false, points: 150 },
    ],
  },
  {
    id: "windows-hunt",
    title: "Windows Event Hunt",
    description: "Pivot through Security, Sysmon, and PowerShell logs to detect malicious behavior.",
    icon: FileSearch,
    difficulty: "Intermediate",
    duration: "60 min",
    participants: 892,
    tags: ["Blue Team", "Windows", "Threat Hunting"],
    team: "blue",
    objectives: ["Navigate Windows Event logs", "Use Sysmon for detection", "Identify PowerShell attacks"],
    challenges: [
      { id: "ch-1", title: "Event ID Basics", description: "Learn critical event IDs", completed: false, points: 75 },
      { id: "ch-2", title: "Sysmon Analysis", description: "Process creation tracking", completed: false, points: 125 },
    ],
  },
  {
    id: "firewall-hardening",
    title: "Firewall Hardening",
    description: "Analyze traffic and apply rules to block brute-force and command & control.",
    icon: Lock,
    difficulty: "Beginner",
    duration: "30 min",
    participants: 756,
    tags: ["Blue Team", "Network", "Hardening"],
    team: "blue",
    progress: 100,
    challenges: [
      { id: "ch-1", title: "Rule Basics", description: "Create firewall rules", completed: true, points: 50 },
      { id: "ch-2", title: "Block C2", description: "Identify and block C2 traffic", completed: true, points: 100 },
    ],
  },
  {
    id: "incident-response",
    title: "Incident Response Drill",
    description: "Contain, eradicate, and recover in a simulated enterprise compromise.",
    icon: AlertTriangle,
    difficulty: "Advanced",
    duration: "120 min",
    participants: 445,
    tags: ["Blue Team", "IR", "Playbooks"],
    team: "blue",
    challenges: [
      { id: "ch-1", title: "Detection", description: "Identify the compromise", completed: false, points: 100 },
      { id: "ch-2", title: "Containment", description: "Isolate affected systems", completed: false, points: 150 },
      { id: "ch-3", title: "Eradication", description: "Remove the threat", completed: false, points: 150 },
      { id: "ch-4", title: "Recovery", description: "Restore operations", completed: false, points: 100 },
    ],
  },
  {
    id: "memory-forensics",
    title: "Memory Forensics",
    description: "Analyze memory dumps to uncover hidden malware and attacker artifacts.",
    icon: Cpu,
    difficulty: "Advanced",
    duration: "90 min",
    participants: 312,
    tags: ["Blue Team", "Forensics", "Malware"],
    team: "blue",
    challenges: [
      { id: "ch-1", title: "Process Analysis", description: "Find suspicious processes", completed: false, points: 125 },
      { id: "ch-2", title: "Injection Detection", description: "Identify code injection", completed: false, points: 175 },
    ],
  },
  {
    id: "web-sqli",
    title: "Web Exploitation: SQLi",
    description: "Identify injection points, exfiltrate data, and craft safe payloads.",
    icon: Crosshair,
    difficulty: "Intermediate",
    duration: "60 min",
    participants: 1567,
    tags: ["Red Team", "Web", "SQLi"],
    team: "red",
    objectives: ["Find injection vulnerabilities", "Bypass filters", "Extract database contents"],
    challenges: [
      { id: "ch-1", title: "Basic SQLi", description: "Simple injection techniques", completed: false, points: 75 },
      { id: "ch-2", title: "Blind SQLi", description: "Boolean and time-based attacks", completed: false, points: 150 },
    ],
  },
  {
    id: "linux-privesc",
    title: "Linux Privilege Escalation",
    description: "Enumerate misconfigs, exploit SUID binaries, and escalate to root.",
    icon: Terminal,
    difficulty: "Intermediate",
    duration: "90 min",
    participants: 1123,
    tags: ["Red Team", "Linux", "Privesc"],
    team: "red",
    progress: 40,
    challenges: [
      { id: "ch-1", title: "Enumeration", description: "Find privilege escalation vectors", completed: true, points: 75 },
      { id: "ch-2", title: "SUID Exploitation", description: "Abuse SUID binaries", completed: false, points: 125 },
      { id: "ch-3", title: "Root Access", description: "Gain root privileges", completed: false, points: 150 },
    ],
  },
  {
    id: "osint-recon",
    title: "OSINT Recon Challenge",
    description: "Gather intel from public sources to map targets and discover exposures.",
    icon: Eye,
    difficulty: "Beginner",
    duration: "45 min",
    participants: 678,
    tags: ["Red Team", "OSINT", "Recon"],
    team: "red",
    challenges: [
      { id: "ch-1", title: "Domain Intel", description: "Enumerate subdomains and IPs", completed: false, points: 50 },
      { id: "ch-2", title: "Employee OSINT", description: "Find employee information", completed: false, points: 75 },
    ],
  },
  {
    id: "ad-attack",
    title: "AD Attack Path",
    description: "Abuse weak ACLs to move laterally and dump credentials in a lab AD.",
    icon: Network,
    difficulty: "Advanced",
    duration: "120 min",
    participants: 334,
    tags: ["Red Team", "Windows", "Active Directory"],
    team: "red",
    challenges: [
      { id: "ch-1", title: "Bloodhound Mapping", description: "Map AD attack paths", completed: false, points: 100 },
      { id: "ch-2", title: "Kerberoasting", description: "Extract service tickets", completed: false, points: 150 },
      { id: "ch-3", title: "DCSync", description: "Dump domain credentials", completed: false, points: 200 },
    ],
  },
  {
    id: "xss-exploitation",
    title: "XSS Exploitation",
    description: "Find and exploit cross-site scripting vulnerabilities in web applications.",
    icon: Crosshair,
    difficulty: "Beginner",
    duration: "45 min",
    participants: 945,
    tags: ["Red Team", "Web", "XSS"],
    team: "red",
    challenges: [
      { id: "ch-1", title: "Reflected XSS", description: "Simple reflection attacks", completed: false, points: 50 },
      { id: "ch-2", title: "Stored XSS", description: "Persistent script injection", completed: false, points: 100 },
    ],
  },
  {
    id: "api-exploitation",
    title: "API Security Testing",
    description: "Test REST APIs for authentication flaws, IDOR, and mass assignment.",
    icon: Database,
    difficulty: "Intermediate",
    duration: "75 min",
    participants: 567,
    tags: ["Red Team", "API", "Web"],
    team: "red",
    challenges: [
      { id: "ch-1", title: "Auth Bypass", description: "Find authentication weaknesses", completed: false, points: 100 },
      { id: "ch-2", title: "IDOR Discovery", description: "Access unauthorized resources", completed: false, points: 125 },
    ],
  },
  {
    id: "log-analysis",
    title: "Log Analysis Fundamentals",
    description: "Learn to parse, analyze, and correlate logs from various sources.",
    icon: FileSearch,
    difficulty: "Beginner",
    duration: "40 min",
    participants: 1456,
    tags: ["Blue Team", "Logs", "Analysis"],
    team: "blue",
    challenges: [
      { id: "ch-1", title: "Log Parsing", description: "Extract key fields from logs", completed: false, points: 40 },
      { id: "ch-2", title: "Pattern Recognition", description: "Identify anomalies", completed: false, points: 60 },
    ],
  },
];

export default function Rooms() {
  const [teamFilter, setTeamFilter] = useState<TeamFilter>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredRooms = useMemo(() => {
    return allRooms.filter((room) => {
      const matchesTeam = teamFilter === "all" || room.team === teamFilter;
      const matchesDifficulty = difficultyFilter === "all" || room.difficulty === difficultyFilter;
      const matchesSearch =
        searchQuery === "" ||
        room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTeam && matchesDifficulty && matchesSearch;
    });
  }, [teamFilter, difficultyFilter, searchQuery]);

  const activeFilters = [
    teamFilter !== "all" && { key: "team", label: teamFilter === "blue" ? "Defense" : "Offense" },
    difficultyFilter !== "all" && { key: "difficulty", label: difficultyFilter },
    searchQuery && { key: "search", label: `"${searchQuery}"` },
  ].filter(Boolean) as { key: string; label: string }[];

  const clearFilter = (key: string) => {
    if (key === "team") setTeamFilter("all");
    if (key === "difficulty") setDifficultyFilter("all");
    if (key === "search") setSearchQuery("");
  };

  const clearAllFilters = () => {
    setTeamFilter("all");
    setDifficultyFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 md:pt-28 pb-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Interactive Rooms
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Choose your discipline and jump into hands-on cybersecurity labs.
              Filter by team, difficulty, or search for specific topics.
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms, topics, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-rooms"
                />
              </div>

              <div className="flex gap-2">
                <Tabs
                  value={teamFilter}
                  onValueChange={(v) => setTeamFilter(v as TeamFilter)}
                  className="hidden sm:block"
                >
                  <TabsList>
                    <TabsTrigger value="all" data-testid="filter-all">All</TabsTrigger>
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

                <Select
                  value={difficultyFilter}
                  onValueChange={(v) => setDifficultyFilter(v as DifficultyFilter)}
                >
                  <SelectTrigger className="w-[140px]" data-testid="select-difficulty">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  className="sm:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                  data-testid="button-toggle-filters"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="sm:hidden">
                <Tabs
                  value={teamFilter}
                  onValueChange={(v) => setTeamFilter(v as TeamFilter)}
                >
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="blue">Defense</TabsTrigger>
                    <TabsTrigger value="red">Offense</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter.key}
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-muted"
                    onClick={() => clearFilter(filter.key)}
                  >
                    {filter.label}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                  data-testid="button-clear-filters"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {filteredRooms.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No rooms found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRooms.map((room, index) => (
                  <div key={room.id} onClick={() => setSelectedRoom(room)} className="cursor-pointer">
                    <RoomCard
                      {...room}
                      delay={0.03 * index}
                      onJoin={() => setSelectedRoom(room)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {selectedRoom && (
        <RoomDetailModal
          open={!!selectedRoom}
          onOpenChange={(open) => !open && setSelectedRoom(null)}
          room={selectedRoom}
        />
      )}

      <Footer />
      <MobileNav />
    </div>
  );
}
