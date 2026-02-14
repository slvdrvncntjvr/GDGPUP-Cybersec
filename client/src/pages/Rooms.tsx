import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import RoomCard from "@/components/RoomCard";
import RoomDetailModal from "@/components/RoomDetailModal";
import { 
  Shield, 
  Globe, 
  Database, 
  Terminal, 
  Server, 
  Cpu,
  Network,
  Activity
} from "lucide-react";

interface Room {
  id: string;
  title: string;
  description: string;
  icon: any;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  participants: number;
  tags: string[];
  team: "blue" | "red";
  challenges: any[];
}

const allRooms: Room[] = [
  // --- RED TEAM CHALLENGES ---
  {
    id: "red-1",
    title: "RED-1: SQLi Admin Login",
    description: "Challenge 1: Bypass authentication to log in as administrator without a password using SQL Injection.",
    icon: Globe,
    difficulty: "Beginner",
    duration: "20 min",
    participants: 1567,
    tags: ["Red Team", "SQLi", "Auth Bypass"],
    team: "red",
    challenges: [],
  },
  {
    id: "red-2",
    title: "RED-2: SQLi Data Extraction",
    description: "Challenge 2: Use UNION-based SQL injection to extract hidden user data and password hashes.",
    icon: Database,
    difficulty: "Intermediate",
    duration: "45 min",
    participants: 840,
    tags: ["Red Team", "SQLi", "Data Exfiltration"],
    team: "red",
    challenges: [],
  },
  {
    id: "red-3",
    title: "RED-3: Reflected XSS",
    description: "Challenge 3: Execute JavaScript payloads via search parameters to trigger alerts.",
    icon: Terminal,
    difficulty: "Intermediate",
    duration: "30 min",
    participants: 334,
    tags: ["Red Team", "XSS", "Reflected"],
    team: "red",
    challenges: [],
  },
  {
    id: "red-4",
    title: "RED-4: Persistent XSS",
    description: "Challenge 4: Inject a permanent payload into the database that executes whenever a user views the page.",
    icon: Server,
    difficulty: "Intermediate",
    duration: "45 min",
    participants: 678,
    tags: ["Red Team", "XSS", "Stored"],
    team: "red",
    challenges: [],
  },

  // --- BLUE TEAM ROOMS ---
  {
     id: "blue-1",
     title: "BLUE-1: SIEM Alert Triage",
     description: "Analyze logs to identify and classify suspicious authentication events.",
     icon: Shield,
     difficulty: "Beginner",
     duration: "30 min",
     participants: 1234,
     tags: ["Blue Team", "SIEM", "SOC"],
     team: "blue",
     challenges: [],
  },
  {
     id: "blue-2",
     title: "BLUE-2: Memory Forensics",
     description: "Analyze memory dumps to find hidden malware artifacts and injected code.",
     icon: Cpu,
     difficulty: "Intermediate",
     duration: "60 min",
     participants: 543,
     tags: ["Blue Team", "Forensics", "Volatility"],
     team: "blue",
     challenges: [],
  },
  {
     id: "blue-3",
     title: "BLUE-3: Network Traffic Analysis",
     description: "Inspect PCAP files to detect command and control (C2) communication.",
     icon: Network,
     difficulty: "Intermediate",
     duration: "45 min",
     participants: 789,
     tags: ["Blue Team", "Wireshark", "Network"],
     team: "blue",
     challenges: [],
  },
  {
     id: "blue-4",
     title: "BLUE-4: Incident Response",
     description: "Execute containment and eradication strategies during a simulated ransomware attack.",
     icon: Activity,
     difficulty: "Advanced",
     duration: "90 min",
     participants: 321,
     tags: ["Blue Team", "IR", "Ransomware"],
     team: "blue",
     challenges: [],
  },
];

export default function Rooms() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

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
              Select a room to begin your challenge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allRooms.map((room, index) => (
              <div key={room.id} onClick={() => setSelectedRoom(room)} className="cursor-pointer">
                <RoomCard
                  {...room}
                  delay={0.03 * index}
                  onJoin={() => setSelectedRoom(room)}
                />
              </div>
            ))}
          </div>
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