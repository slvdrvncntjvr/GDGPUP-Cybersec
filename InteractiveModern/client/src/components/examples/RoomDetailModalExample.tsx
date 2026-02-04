import { useState } from "react";
import RoomDetailModal from "../RoomDetailModal";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const sampleRoom = {
  id: "siem-triage",
  title: "SIEM Alert Triage",
  description:
    "Learn to investigate suspicious logins and lateral movement using a SIEM dashboard. This room covers log analysis, correlation rules, and incident prioritization techniques used by SOC analysts.",
  icon: Shield,
  difficulty: "Beginner" as const,
  duration: "45 min",
  participants: 1234,
  tags: ["Blue Team", "SIEM", "Log Analysis", "SOC"],
  team: "blue" as const,
  progress: 65,
  objectives: [
    "Understand SIEM alert structure and severity levels",
    "Correlate events across multiple log sources",
    "Prioritize incidents based on business impact",
    "Document findings in an incident report",
  ],
  prerequisites: ["Basic networking concepts", "Understanding of log formats"],
  challenges: [
    {
      id: "ch-1",
      title: "Understanding Alert Types",
      description: "Learn to classify different types of security alerts.",
      completed: true,
      points: 50,
    },
    {
      id: "ch-2",
      title: "Log Correlation",
      description: "Connect events from firewall, endpoint, and auth logs.",
      completed: true,
      points: 100,
    },
    {
      id: "ch-3",
      title: "Lateral Movement Detection",
      description: "Identify signs of an attacker moving through the network.",
      completed: false,
      points: 150,
    },
    {
      id: "ch-4",
      title: "Incident Report",
      description: "Create a comprehensive incident report for stakeholders.",
      completed: false,
      points: 100,
    },
  ],
};

export default function RoomDetailModalExample() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-8 bg-background min-h-screen">
      <Button onClick={() => setOpen(true)}>Open Room Details</Button>
      <RoomDetailModal open={open} onOpenChange={setOpen} room={sampleRoom} />
    </div>
  );
}
