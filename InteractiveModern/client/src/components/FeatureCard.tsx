import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  iconBgColor?: string;
  delay?: number;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  delay = 0,
}: FeatureCardProps) {
  return (
    <div
      className="group relative p-5 rounded-xl bg-card border border-border/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80 opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}s` }}
      data-testid={`feature-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="relative">
        <div
          className={cn(
            "w-10 h-10 rounded-md flex items-center justify-center mb-3",
            iconBgColor
          )}
        >
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>

        <h3 className="font-display text-base font-semibold text-foreground mb-1.5">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
