import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden" data-testid="cta-section">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6 opacity-0 animate-fade-in">
          <Zap className="w-4 h-4" />
          Start learning today
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 opacity-0 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Ready to level up your security skills?
        </h2>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Join thousands of learners mastering cybersecurity through hands-on
          rooms, guided paths, and community-driven practice.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link href="/signup">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 gap-2 group"
              data-testid="button-cta-start"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/rooms">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              data-testid="button-cta-explore"
            >
              Explore Rooms
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-12 pt-10 border-t border-border/50 opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            20+ interactive rooms
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4 text-primary" />
            Real-world scenarios
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4 text-primary" />
            No setup required
          </div>
        </div>
      </div>
    </section>
  );
}
