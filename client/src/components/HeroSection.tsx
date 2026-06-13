import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { openAuthModal } from "@/lib/openAuthModal";
import { useAuth } from "@/hooks/useAuth";
import HeroEmblem from "./HeroEmblem";
import { ArrowRight, Shield, Crosshair, Trophy } from "lucide-react";

const GRID_BG = `
  linear-gradient(rgba(34,197,94,0.07) 1px, transparent 1px),
  linear-gradient(90deg, rgba(34,197,94,0.07) 1px, transparent 1px)
`;

export default function HeroSection() {
  const { isLoggedIn } = useAuth();

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-background">
      {/* Ambient background: aurora spotlights + faded grid */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute left-1/2 top-[-15%] h-[55vh] w-[85vw] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-[-15%] top-[10%] h-[45vh] w-[45vw] rounded-full bg-cyber-blue/10 blur-[130px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[45vh] w-[45vw] rounded-full bg-chart-4/10 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
          style={{ backgroundImage: GRID_BG, backgroundSize: "56px 56px" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6 md:py-28">
        <div
          className="mb-8 flex justify-center opacity-0 animate-scale-in"
          style={{ animationDelay: "0.1s" }}
        >
          <HeroEmblem />
        </div>

        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary opacity-0 animate-slide-up sm:text-xs"
          style={{ animationDelay: "0.15s" }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          GDG On Campus · Cybersecurity
        </div>

        <h1
          className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground opacity-0 animate-slide-up sm:text-5xl md:text-6xl"
          style={{ animationDelay: "0.2s" }}
        >
          Practice security{" "}
          <span className="bg-gradient-to-r from-primary via-cyber-blue to-primary bg-clip-text text-transparent">
            with your chapter
          </span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground opacity-0 animate-slide-up sm:text-lg"
          style={{ animationDelay: "0.3s" }}
        >
          Defense and offense tracks, workshop-style briefings, and hands-on labs
          — built by the cybersecurity department as part of{" "}
          <span className="font-medium text-foreground/90">GDG PUP Nexus</span>.
        </p>

        <div
          className="mt-8 flex flex-col items-center justify-center gap-3 opacity-0 animate-slide-up sm:flex-row"
          style={{ animationDelay: "0.4s" }}
        >
          {!isLoggedIn ? (
            <>
              <Button
                size="lg"
                className="group w-full gap-2 bg-primary px-7 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 sm:w-auto"
                data-testid="button-hero-start"
                onClick={() => openAuthModal("signup")}
              >
                Get started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-primary/30 px-7 hover:bg-primary/5 sm:w-auto"
                data-testid="button-hero-explore"
                onClick={() => openAuthModal("login", "/rooms")}
              >
                Sign in to open labs
              </Button>
            </>
          ) : (
            <>
              <Button
                size="lg"
                className="group w-full gap-2 bg-primary px-7 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 sm:w-auto"
                asChild
                data-testid="button-hero-start"
              >
                <Link href="/rooms">
                  Open training labs
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full px-7 sm:w-auto" asChild>
                <Link href="/dashboard">My progress</Link>
              </Button>
            </>
          )}
        </div>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground opacity-0 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <span className="inline-flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />8 guided rooms
          </span>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <span className="inline-flex items-center gap-2">
            <Crosshair className="h-4 w-4 text-cyber-red" />
            Red &amp; Blue tracks
          </span>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <span className="inline-flex items-center gap-2">
            <Trophy className="h-4 w-4 text-chart-4" />
            XP &amp; leaderboards
          </span>
        </div>
      </div>
    </section>
  );
}
