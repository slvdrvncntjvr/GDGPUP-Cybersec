import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { openAuthModal } from "@/lib/openAuthModal";
import { useAuth } from "@/hooks/useAuth";
import Shield3D from "./Shield3D";

const heroPills = [
  "Blue & red team paths",
  "Workshop-style briefings",
  "XP & chapter progress",
  "Labs after sign-in",
];

export default function HeroSection() {
  const { isLoggedIn } = useAuth();

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-background">
      {/* Top accent line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent z-10" />

      {/* Ambient color fields (Nexus-style depth) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-[20%] -right-[10%] w-[min(70vw,520px)] h-[min(70vw,520px)] rounded-full bg-cyber-blue/[0.12] blur-[100px] animate-hero-drift-1"
          aria-hidden
        />
        <div
          className="absolute top-[30%] -left-[15%] w-[min(65vw,480px)] h-[min(65vw,480px)] rounded-full bg-cyber-red/[0.09] blur-[90px] animate-hero-drift-2"
          aria-hidden
        />
        <div
          className="absolute bottom-[-15%] right-[15%] w-[min(55vw,380px)] h-[min(55vw,380px)] rounded-full bg-primary/[0.14] blur-[80px] animate-hero-drift-3"
          aria-hidden
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.08] via-transparent to-background" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] animate-slow-pulse"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 10%, transparent 75%)",
        }}
      />

      {/* Soft vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_45%,transparent_0%,hsl(var(--background)_/_0.15)_45%,hsl(var(--background)_/_0.92)_100%)]"
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="text-left">
            <p
              className="text-xs uppercase tracking-[0.2em] text-primary/90 font-medium mb-4 opacity-0 animate-slide-up"
              style={{ animationDelay: "0.05s" }}
            >
              GDG On Campus · PUP Cybersecurity
            </p>
            <h1
              className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-foreground mb-6 leading-[1.08] opacity-0 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              Practice security{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-300 to-primary">
                with your chapter
              </span>
            </h1>

            <p
              className="text-base sm:text-lg text-muted-foreground max-w-lg mb-6 opacity-0 animate-slide-up leading-relaxed"
              style={{ animationDelay: "0.2s" }}
            >
              Defense and offense tracks, workshop-style briefings, and hands-on labs
              — built by the cybersecurity department as part of{" "}
              <span className="text-foreground/90 font-medium">
                GDG PUP Nexus
              </span>
              . Sign in to access the training space and track your progress.
            </p>

            <div
              className="flex flex-wrap gap-2 mb-8 opacity-0 animate-slide-up"
              style={{ animationDelay: "0.25s" }}
            >
              {heroPills.map((label) => (
                <span
                  key={label}
                  className="text-[11px] sm:text-xs px-2.5 py-1 rounded-full border border-border/60 bg-card/40 text-muted-foreground backdrop-blur-sm"
                >
                  {label}
                </span>
              ))}
            </div>

            <div
              className="flex flex-wrap gap-3 opacity-0 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              {!isLoggedIn ? (
                <>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 shadow-lg shadow-primary/20"
                    data-testid="button-hero-start"
                    onClick={() => openAuthModal("signup")}
                  >
                    Get started
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6 border-primary/30 hover:bg-primary/5"
                    data-testid="button-hero-explore"
                    onClick={() => openAuthModal("login", "/rooms")}
                  >
                    Sign in to open labs
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 shadow-lg shadow-primary/20"
                    asChild
                    data-testid="button-hero-start"
                  >
                    <Link href="/rooms">Open training labs</Link>
                  </Button>
                  <Button variant="outline" className="px-6" asChild>
                    <Link href="/dashboard">My progress</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div
            className="relative flex items-center justify-center opacity-0 animate-scale-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[min(100%,420px)] aspect-square rounded-full bg-primary/[0.06] blur-3xl animate-pulse-glow" />
            </div>
            <div className="relative rounded-[2rem] border border-primary/10 bg-gradient-to-b from-card/30 to-transparent p-6 sm:p-10 shadow-[0_0_80px_-20px_hsl(var(--primary)/0.35)] backdrop-blur-[2px]">
              <Shield3D />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
