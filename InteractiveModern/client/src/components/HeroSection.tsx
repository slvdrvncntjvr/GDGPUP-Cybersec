import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Shield3D from "./Shield3D";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="text-left">
            <h1
              className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-foreground mb-6 leading-[1.1] opacity-0 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              Cybersecurity GDG Department{" "}
              <span className="text-primary">— learn by doing</span>
            </h1>

            <p
              className="text-base sm:text-lg text-muted-foreground max-w-lg mb-8 opacity-0 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Hands-on rooms and guided paths covering blue-team defense and
              red-team offense. Built for community learners and campus
              chapters.
            </p>

            <div
              className="flex flex-wrap gap-3 opacity-0 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Link href="/signup">
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                  data-testid="button-hero-start"
                >
                  Start Free
                </Button>
              </Link>
              <Link href="/rooms">
                <Button
                  variant="outline"
                  className="px-6"
                  data-testid="button-hero-explore"
                >
                  Explore Rooms
                </Button>
              </Link>
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
