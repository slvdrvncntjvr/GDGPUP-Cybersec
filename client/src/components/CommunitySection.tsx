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
    <section className="py-16 md:py-24 bg-card/30" data-testid="community-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <span className="mb-4 inline-block rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              The chapter
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
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
                  className="group p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30"
                  data-testid={`community-card-${index}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 ring-1 ring-inset ring-white/5 flex items-center justify-center mb-3">
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
            <div className="p-6 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm">
              <h3 className="font-display text-base font-semibold text-foreground mb-4">
                How It Works
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
