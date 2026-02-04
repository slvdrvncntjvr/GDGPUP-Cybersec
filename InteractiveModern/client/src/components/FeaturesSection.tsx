import FeatureCard from "./FeatureCard";
import { Shield, Crosshair, Award, Server, Terminal, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Defensive Blue Team",
    description:
      "SIEM, log analysis, threat hunting, incident response, and hardening labs.",
    iconColor: "text-primary",
    iconBgColor: "bg-primary/10",
  },
  {
    icon: Crosshair,
    title: "Offensive Red Team",
    description:
      "Web exploitation, privilege escalation, OSINT, and network penetration labs.",
    iconColor: "text-cyber-red",
    iconBgColor: "bg-cyber-red/10",
  },
  {
    icon: Award,
    title: "Cert Prep Paths",
    description:
      "Guided paths for Security+, CEH, eJPT, and more with exam-style challenges.",
    iconColor: "text-chart-4",
    iconBgColor: "bg-chart-4/10",
  },
  {
    icon: Server,
    title: "Real Scenarios",
    description:
      "Mission-based rooms simulating enterprise networks and realistic attack chains.",
    iconColor: "text-primary",
    iconBgColor: "bg-primary/10",
  },
  {
    icon: Terminal,
    title: "Built-in Tools",
    description:
      "Browser terminals, code runners, packet analyzers, and vulnerable apps.",
    iconColor: "text-cyber-blue",
    iconBgColor: "bg-cyber-blue/10",
  },
  {
    icon: Users,
    title: "Community Progress",
    description:
      "Badges, leaderboards, and chapter contributions from the GDG Department.",
    iconColor: "text-chart-5",
    iconBgColor: "bg-chart-5/10",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-background" data-testid="features-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3 opacity-0 animate-slide-up">
            Everything you need to learn security by doing
          </h2>
          <p className="text-base text-muted-foreground opacity-0 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Interactive rooms, guided paths, and hands-on labs led by the
            Cybersecurity GDG Department.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={0.08 * (index + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
