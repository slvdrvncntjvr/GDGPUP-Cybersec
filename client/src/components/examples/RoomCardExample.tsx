import RoomCard from "../RoomCard";
import { Shield, Crosshair } from "lucide-react";

export default function RoomCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-background">
      <RoomCard
        id="siem-triage"
        title="SIEM Alert Triage"
        description="Investigate suspicious logins and lateral movement using a SIEM dashboard."
        icon={Shield}
        difficulty="Beginner"
        duration="45 min"
        tags={["Blue Team", "SIEM", "Log Analysis"]}
        team="blue"
        progress={65}
        delay={0}
      />
      <RoomCard
        id="web-sqli"
        title="Web Exploitation: SQLi"
        description="Identify injection points, exfiltrate data, and craft safe payloads."
        icon={Crosshair}
        difficulty="Intermediate"
        duration="60 min"
        tags={["Red Team", "Web", "SQLi"]}
        team="red"
        delay={0.1}
      />
    </div>
  );
}
