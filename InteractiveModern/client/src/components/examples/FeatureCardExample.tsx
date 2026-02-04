import FeatureCard from "../FeatureCard";
import { Shield, Crosshair, Award, Server, Terminal, Users } from "lucide-react";

export default function FeatureCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-background">
      <FeatureCard
        icon={Shield}
        title="Defensive Blue Team"
        description="SIEM, log analysis, threat hunting, incident response, and hardening labs."
        iconColor="text-primary"
        iconBgColor="bg-primary/10"
        delay={0}
      />
      <FeatureCard
        icon={Crosshair}
        title="Offensive Red Team"
        description="Web exploitation, privilege escalation, OSINT, and network penetration labs."
        iconColor="text-cyber-red"
        iconBgColor="bg-cyber-red/10"
        delay={0.1}
      />
      <FeatureCard
        icon={Award}
        title="Cert Prep Paths"
        description="Guided paths for Security+, CEH, eJPT, and more with exam-style challenges."
        iconColor="text-chart-4"
        iconBgColor="bg-chart-4/10"
        delay={0.2}
      />
      <FeatureCard
        icon={Server}
        title="Real Scenarios"
        description="Mission-based rooms simulating enterprise networks and realistic attack chains."
        iconColor="text-primary"
        iconBgColor="bg-primary/10"
        delay={0.3}
      />
      <FeatureCard
        icon={Terminal}
        title="Built-in Tools"
        description="Browser terminals, code runners, packet analyzers, and vulnerable apps."
        iconColor="text-cyber-blue"
        iconBgColor="bg-cyber-blue/10"
        delay={0.4}
      />
      <FeatureCard
        icon={Users}
        title="Community Progress"
        description="Badges, leaderboards, and chapter contributions from the GDG Department."
        iconColor="text-chart-5"
        iconBgColor="bg-chart-5/10"
        delay={0.5}
      />
    </div>
  );
}
