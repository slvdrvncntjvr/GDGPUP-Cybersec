import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { openAuthModal } from "@/lib/openAuthModal";
import { useAuth } from "@/hooks/useAuth";
import Shield3D from "./Shield3D";

export default function HeroSection() {
  const { isLoggedIn } = useAuth();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent" />
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34,197,94,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,197,94,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "56px 56px",
          }}
        />
      </div>

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
              <span className="text-primary">with your chapter</span>
            </h1>

            <p
              className="text-base sm:text-lg text-muted-foreground max-w-lg mb-8 opacity-0 animate-slide-up leading-relaxed"
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
            <Shield3D />
          </div>
        </div>
      </div>
    </section>
  );
}
