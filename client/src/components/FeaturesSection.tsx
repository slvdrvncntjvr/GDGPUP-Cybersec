import FeatureCard from "./FeatureCard";
import { Shield, Crosshair, Award, Server, Terminal, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Blue team (defense)",
    description:
      "Host hardening, logs, monitoring basics, and incident-response style scenarios.",
    iconColor: "text-primary",
    iconBgColor: "bg-primary/10",
  },
  {
    icon: Crosshair,
    title: "Red team (offense)",
    description:
      "Web exploitation, privilege escalation concepts, and adversary-style labs.",
    iconColor: "text-cyber-red",
    iconBgColor: "bg-cyber-red/10",
  },
  {
    icon: Award,
    title: "Session map (RED / BLUE 1–4)",
    description:
      "Eight PDF-aligned rooms so you can follow the official workshop structure.",
    iconColor: "text-chart-4",
    iconBgColor: "bg-chart-4/10",
  },
  {
    icon: Server,
    title: "Hands-on writeups",
    description:
      "Step-by-step instructions and verification tips inside each room modal.",
    iconColor: "text-primary",
    iconBgColor: "bg-primary/10",
  },
  {
    icon: Terminal,
    title: "Tracked progress",
    description:
      "Earn XP as you complete challenges—leaderboards reflect how the chapter is leveling up together.",
    iconColor: "text-cyber-blue",
    iconBgColor: "bg-cyber-blue/10",
  },
  {
    icon: Users,
    title: "Chapter-led",
    description:
      "Built for GDG On Campus PUP — cybersec department, extending Nexus.",
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
            What you can do here
          </h2>
          <p className="text-base text-muted-foreground opacity-0 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Eight guided rooms, team-aware challenges, and XP that match the official
            catalog — no inflated promises.
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
