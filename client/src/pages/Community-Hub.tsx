import { useState } from "react";
import {
  Shield,
  ExternalLink,
  Clock,
  ChevronDown,
  ArrowRight,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { openAuthModal } from "@/lib/openAuthModal";
import { cn } from "@/lib/utils";

type StudyJam = {
  id: string;
  title: string;
  description: string;
  readMinutes: number;
  badge?: string;
  coverUrl?: string;
  /** Tailwind gradient overlay when no image */
  accent: string;
};

const studyJams: StudyJam[] = [
  {
    id: "sj1",
    title: "SJ 1: Linux setup & shell basics",
    description:
      "Set up a Linux environment and build confidence with the command line—navigation, permissions, and core tools you will reuse in every lab.",
    readMinutes: 8,
    badge: "Foundations",
    accent: "from-cyber-blue/40 via-background/20 to-primary/25",
  },
  {
    id: "sj2",
    title: "SJ 2: Networking for security",
    description:
      "TCP/IP, addressing, and how protocols behave on the wire—with just enough depth to support scanning, logging, and defensive monitoring later.",
    readMinutes: 12,
    badge: "Core",
    accent: "from-primary/35 via-cyber-blue/20 to-background/30",
  },
  {
    id: "sj3",
    title: "SJ 3: Recon & port scanning",
    description:
      "A practical take on footprinting and enumeration: interpreting scan output responsibly and mapping what an attacker (or defender) can see.",
    readMinutes: 10,
    badge: "Hands-on",
    accent: "from-cyber-red/30 via-background/25 to-primary/20",
  },
  {
    id: "sj4",
    title: "SJ 4: Web apps & Burp basics",
    description:
      "HTTP in review, common web risks at a high level, and using a proxy to inspect and understand real application traffic.",
    readMinutes: 14,
    badge: "Web",
    accent: "from-primary/40 via-[hsl(var(--cyber-blue))]/25 to-card/40",
  },
];

const steps = [
  { title: "Pick a track", detail: "Defense (blue) or offense (red)." },
  { title: "Study jams", detail: "Follow the sessions below with the chapter." },
  { title: "Sign in for labs", detail: "Hands-on rooms unlock with your account." },
  { title: "Earn XP", detail: "Dashboard + leaderboard keep momentum visible." },
];

const DISCORD =
  "https://discord.com/channels/1010229130320674886/1148223753050931360";

export default function CommunityHub() {
  const [teamHover, setTeamHover] = useState<"red" | "blue" | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const excerpt = (text: string, max = 140) =>
    text.length <= max ? text : `${text.slice(0, max).trim()}…`;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)]" />
      <div className="pointer-events-none absolute top-1/3 right-0 w-[40%] h-64 bg-cyber-blue/5 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute bottom-20 left-0 w-[35%] h-48 bg-cyber-red/5 blur-3xl rounded-full" />

      <div className="relative z-20">
        <Navbar />
      </div>

      <main className="flex-1 relative z-10 px-4 sm:px-6 lg:px-10 py-10 md:py-14 max-w-7xl mx-auto w-full">
        <header className="text-center lg:text-left mb-14 max-w-3xl mx-auto lg:mx-0 space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground font-medium">
            GDG PUP · Cybersecurity
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-foreground">
            Study jams{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[hsl(var(--cyber-blue))]">
              gallery
            </span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Chapters of our practice path—session outlines you can browse like the
            Nexus stories wall. Sign in from the homepage when you are ready for the
            hands-on lab space.
          </p>
        </header>

        {/* Quick path strip — Nexus-style secondary line */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center lg:justify-start">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-xs sm:text-sm backdrop-blur-sm"
            >
              <span className="font-mono text-primary font-semibold">{i + 1}</span>
              <span className="text-foreground font-medium">{s.title}</span>
              <span className="text-muted-foreground hidden sm:inline">
                — {s.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Gallery grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {studyJams.map((jam) => {
            const expanded = expandedId === jam.id;
            return (
              <article
                key={jam.id}
                className={cn(
                  "group flex flex-col rounded-2xl border border-border/70 bg-card/90 overflow-hidden shadow-sm",
                  "transition-all duration-300 hover:border-primary/35 hover:shadow-[0_0_28px_hsl(var(--primary)/0.12)]"
                )}
              >
                <div className="relative h-48 overflow-hidden">
                  {jam.coverUrl ? (
                    <img
                      src={jam.coverUrl}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-90",
                        jam.accent
                      )}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  {jam.badge && (
                    <Badge className="absolute top-3 left-3 bg-primary/95 text-primary-foreground border-0 text-[10px] uppercase tracking-wider">
                      {jam.badge}
                    </Badge>
                  )}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-foreground/95 font-medium">
                    <Clock className="w-3.5 h-3.5 opacity-80" />
                    {jam.readMinutes} min read
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 gap-3">
                  <h2 className="font-display font-bold text-lg text-foreground leading-snug group-hover:text-primary transition-colors">
                    {jam.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                    {expanded ? jam.description : excerpt(jam.description)}
                  </p>
                  <button
                    type="button"
                    className="mt-auto flex items-center gap-1 text-sm font-medium text-primary hover:underline pt-1 text-left"
                    onClick={() => setExpandedId(expanded ? null : jam.id)}
                  >
                    {expanded ? "Show less" : "Read outline"}
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expanded && "rotate-180"
                      )}
                    />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Team pick + join */}
        <section className="mt-20 grid lg:grid-cols-2 gap-10 items-center rounded-2xl border border-border/60 bg-card/50 p-8 md:p-10 backdrop-blur-sm">
          <div>
            <h2 className="font-display text-2xl font-bold mb-2 flex items-center gap-2">
              <Shield className="w-7 h-7 text-[hsl(var(--cyber-blue))]" />
              Join the department
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Hover a side to preview the vibe—then tap sign up to get a team on your
              profile and access the lab catalog.
            </p>
            <div className="flex items-center gap-8 font-display text-2xl font-bold tracking-wide">
              <button
                type="button"
                onMouseEnter={() => setTeamHover("red")}
                onMouseLeave={() => setTeamHover(null)}
                className={cn(
                  "text-[hsl(var(--cyber-red))] transition-transform hover:scale-110",
                  teamHover === "red" && "drop-shadow-[0_0_14px_hsl(var(--cyber-red)/0.5)]"
                )}
              >
                RED
              </button>
              <span className="text-muted-foreground text-sm font-mono font-normal">
                vs
              </span>
              <button
                type="button"
                onMouseEnter={() => setTeamHover("blue")}
                onMouseLeave={() => setTeamHover(null)}
                className={cn(
                  "text-[hsl(var(--cyber-blue))] transition-transform hover:scale-110",
                  teamHover === "blue" && "drop-shadow-[0_0_14px_hsl(var(--cyber-blue)/0.5)]"
                )}
              >
                BLUE
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap justify-start lg:justify-end">
            <Button
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              onClick={() => openAuthModal("signup")}
            >
              Create account
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={DISCORD} target="_blank" rel="noreferrer" className="gap-2">
                Discord
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="mailto:gdg.pup.cybersec@gmail.com"
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                Cybersec email
              </a>
            </Button>
          </div>
        </section>
      </main>

      <div className="relative z-20">
        <Footer />
      </div>
      <MobileNav />
    </div>
  );
}
