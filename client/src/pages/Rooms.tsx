import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
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
import { ROOMS_CATALOG } from "@shared/challengeCatalog";

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

interface RoomsProgressResponse {
  solvedKeys: string[];
}

const iconByRoomId: Record<string, LucideIcon> = {
  "siem-triage": Shield,
  "windows-hunt": FileSearch,
  "firewall-hardening": Lock,
  "incident-response": AlertTriangle,
  "memory-forensics": Cpu,
  "web-sqli": Crosshair,
  "linux-privesc": Terminal,
  "osint-recon": Eye,
  "ad-attack": Network,
  "xss-exploitation": Crosshair,
  "api-exploitation": Database,
  "log-analysis": FileSearch,
};

const allRooms: Room[] = ROOMS_CATALOG.map((room) => ({
  ...room,
  icon: iconByRoomId[room.id] ?? Shield,
  challenges: room.challenges.map((challenge) => ({
    ...challenge,
    completed: false,
  })),
}));

export default function Rooms() {
  const [teamFilter, setTeamFilter] = useState<TeamFilter>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [, setLocation] = useLocation();
  const [roomOnlyMatch, roomOnlyParams] = useRoute<{ roomId: string }>("/rooms/:roomId");
  const [challengeMatch, challengeParams] = useRoute<{ roomId: string; challengeId: string }>(
    "/rooms/:roomId/challenges/:challengeId"
  );

  const { data: progressData } = useQuery<RoomsProgressResponse>({
    queryKey: ["/api/rooms/progress"],
    queryFn: async () => {
      const res = await fetch("/api/rooms/progress", { credentials: "include" });
      if (!res.ok) return { solvedKeys: [] };
      return res.json() as Promise<RoomsProgressResponse>;
    },
    retry: false,
  });

  const roomsWithProgress = useMemo(() => {
    const solved = new Set(progressData?.solvedKeys ?? []);
    return allRooms.map((room) => {
      const challenges = room.challenges.map((challenge) => ({
        ...challenge,
        completed: solved.has(`${room.id}:${challenge.id}`),
      }));

      const total = challenges.length;
      const completed = challenges.filter((challenge) => challenge.completed).length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        ...room,
        challenges,
        progress,
      };
    });
  }, [progressData?.solvedKeys]);

  const routeRoomId = challengeMatch
    ? challengeParams.roomId
    : roomOnlyMatch
      ? roomOnlyParams.roomId
      : null;
  const routeChallengeId = challengeMatch ? challengeParams.challengeId : null;

  const selectedRoom = useMemo(
    () => (routeRoomId ? roomsWithProgress.find((room) => room.id === routeRoomId) ?? null : null),
    [roomsWithProgress, routeRoomId]
  );

  useEffect(() => {
    if (routeRoomId && !selectedRoom) {
      setLocation("/rooms");
    }
  }, [routeRoomId, selectedRoom, setLocation]);

  const openRoom = (roomId: string) => {
    setLocation(`/rooms/${roomId}`);
  };

  const openRoomChallenge = (roomId: string, challengeId: string) => {
    setLocation(`/rooms/${roomId}/challenges/${challengeId}`);
  };

  const filteredRooms = useMemo(() => {
    return roomsWithProgress.filter((room) => {
      const matchesTeam = teamFilter === "all" || room.team === teamFilter;
      const matchesDifficulty = difficultyFilter === "all" || room.difficulty === difficultyFilter;
      const matchesSearch =
        searchQuery === "" ||
        room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTeam && matchesDifficulty && matchesSearch;
    });
  }, [roomsWithProgress, teamFilter, difficultyFilter, searchQuery]);

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
                  <div key={room.id} onClick={() => openRoom(room.id)} className="cursor-pointer">
                    <RoomCard
                      {...room}
                      delay={0.03 * index}
                      onJoin={() => openRoom(room.id)}
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
          onOpenChange={(open) => !open && setLocation("/rooms")}
          initialTab={routeChallengeId ? "challenges" : "overview"}
          initialChallengeId={routeChallengeId}
          onNavigateChallenge={(challengeId) => openRoomChallenge(selectedRoom.id, challengeId)}
          room={selectedRoom}
        />
      )}

      <Footer />
      <MobileNav />
    </div>
  );
}
