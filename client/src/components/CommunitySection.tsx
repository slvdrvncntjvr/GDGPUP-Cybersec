import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { openAuthModal } from "@/lib/openAuthModal";

const howItWorks = [
  "Join via email — your chapter admins can point you to Discord and events.",
  "Attend monthly workshops and live labs.",
  "After sign-in, open the training labs and track XP on your dashboard.",
  "Collaborate on blue-team and red-team study paths.",
];

const cards = [
  {
    icon: Users,
    title: "Chapters & Meetups",
    description: "Campus chapters and meetups on labs, talks, and CTF practice nights.",
  },
  {
    icon: Calendar,
    title: "Workshops & Events",
    description: "Workshops on threat hunting, web exploitation, and incident response.",
  },
];

export default function CommunitySection() {
  const { isLoggedIn } = useAuth();

  return (
    <section
      className="relative py-16 md:py-24 bg-card/30 border-t border-border/50"
      data-testid="community-section"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent"
        aria-hidden
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Cybersecurity · GDG PUP
            </h2>
            <p className="text-base text-muted-foreground mb-6">
              A hands-on pillar of Google Developer Groups on Campus at PUP. Learn with
              the chapter—then jump into gated labs once you&apos;re logged in.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {cards.map((card, index) => (
                <div
                  key={card.title}
                  className="p-4 rounded-xl bg-card border border-border/50"
                  data-testid={`community-card-${index}`}
                >
                  <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center mb-3">
                    <card.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-sm text-foreground mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/community">
                <Button size="sm" className="gap-1.5" data-testid="button-join-department">
                  Community Hub
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              {isLoggedIn ? (
                <Button variant="outline" size="sm" asChild data-testid="button-browse-rooms">
                  <Link href="/rooms">Open labs</Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="button-browse-rooms"
                  onClick={() => openAuthModal("login", "/rooms")}
                >
                  Sign in for labs
                </Button>
              )}
            </div>
          </div>

          <div className="opacity-0 animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
            <div className="p-5 rounded-xl bg-card border border-border/50">
              <h3 className="font-display text-base font-semibold text-foreground mb-4">
                How it works
              </h3>

              <ul className="space-y-3">
                {howItWorks.map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
