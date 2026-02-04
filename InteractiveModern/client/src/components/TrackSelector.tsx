import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Shield, Crosshair, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface Track {
  id: "defense" | "offense";
  title: string;
  icon: typeof Shield | typeof Crosshair;
  description: string;
  color: string;
  bgColor: string;
}

const tracks: Track[] = [
  {
    id: "defense",
    title: "Defense Track",
    icon: Shield,
    description: "Threat hunting, IR playbooks, SIEM triage, and hardening labs.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "offense",
    title: "Offense Track",
    icon: Crosshair,
    description: "Recon, web vulns, privesc, and AD attack paths in realistic labs.",
    color: "text-cyber-red",
    bgColor: "bg-cyber-red/10",
  },
];

export default function TrackSelector() {
  return (
    <section className="py-16 md:py-24 bg-card/30" data-testid="track-selector">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Defense vs Offense — choose your track
            </h2>
            <p className="text-base text-muted-foreground">
              Pick the focus that matches your goals. Explore rooms tailored for
              blue team defense or red team attack.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 opacity-0 animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
            {tracks.map((track) => {
              const Icon = track.icon;
              return (
                <div
                  key={track.id}
                  className="p-5 rounded-xl bg-card border border-border/50 hover:border-border transition-colors"
                  data-testid={`track-card-${track.id}`}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-md flex items-center justify-center mb-3",
                      track.bgColor
                    )}
                  >
                    <Icon className={cn("w-5 h-5", track.color)} />
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground mb-1.5">
                    {track.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {track.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
