import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  iconBgColor?: string;
  delay?: number;
  className?: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  delay = 0,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 opacity-0 animate-slide-up",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
      data-testid={`feature-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* hover glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <div
          className={cn(
            "mb-4 flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-inset ring-white/5",
            iconBgColor
          )}
        >
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>

        <h3 className="mb-1.5 font-display text-base font-semibold text-foreground">
          {title}
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
