import { Link } from "wouter";
import {
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  ExternalLink,
} from "lucide-react";
import logo from "./GDGCybersec-Assets/GDGAscii2.1.png";

/** Simple TikTok glyph (Lucide omits brand). */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

/** Simple Discord glyph. */
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

const socialLinks = [
  { Icon: Facebook, href: "https://www.facebook.com/gdg.pupmnl", label: "Facebook" },
  { Icon: Instagram, href: "https://www.instagram.com/gdg.pupmnl", label: "Instagram" },
  { Icon: Linkedin, href: "https://www.linkedin.com/company/gdgpup", label: "LinkedIn" },
  { Icon: TikTokIcon, href: "https://www.tiktok.com/@gdg.pupmnl", label: "TikTok" },
  { Icon: Youtube, href: "https://www.youtube.com/@gdgpupmnl", label: "YouTube" },
  { Icon: DiscordIcon, href: "https://discord.com/channels/1010229130320674886/1148223753050931360", label: "Discord" },
];

const footerExplore = [
  { label: "Home", href: "/", internal: true },
  { label: "Community Hub", href: "/community", internal: true },
  { label: "Training labs", href: "/rooms", internal: true },
  { label: "My Progress", href: "/dashboard", internal: true },
];

const gdSites = [
  { label: "GDG PUP Nexus", href: "https://gdgpup.org/products" },
  { label: "GDG Cosmos", href: "https://cosmos.gdgpup.org/" },
  { label: "UI/UX Photobooth", href: "https://cutephotobooth-smoky.vercel.app/" },
  {
    label: "Dept. GitHub",
    href: "https://github.com/slvdrvncntjvr/GDGPUP-Cybersec",
  },
];

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border/50" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            <div className="col-span-2">
              <Link href="/">
                <div className="flex items-center gap-3 mb-4 cursor-pointer">
                  <img
                    src={logo}
                    alt="GDG Cybersec"
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <span className="font-display font-semibold text-foreground block">
                      Cybersecurity · GDG PUP
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Google Developer Groups on Campus — PUP Manila
                    </span>
                  </div>
                </div>
              </Link>

              <p className="text-sm text-muted-foreground max-w-xs mb-4">
                Hands-on labs extending{" "}
                <a
                  href="https://gdgpup.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  GDG PUP Nexus
                </a>
                .
              </p>

              <div className="flex flex-wrap items-center gap-2 mb-6">
                {socialLinks.map((social) => {
                  const Cmp = social.Icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-md bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={social.label}
                      title={social.label}
                    >
                      <Cmp className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <a
                  href="mailto:gdg.pup.cybersec@gmail.com"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 text-primary" />
                  gdg.pup.cybersec@gmail.com
                </a>
                <a
                  href="mailto:gdg.pupmnl@gmail.com"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 text-primary/80" />
                  gdg.pupmnl@gmail.com
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4 text-sm">Explore</h3>
              <ul className="space-y-3">
                {footerExplore.map((link) =>
                  link.internal ? (
                    <li key={link.label}>
                      <Link href={link.href}>
                        <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ) : null
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4 text-sm">GDG&nbsp;chapter</h3>
              <ul className="space-y-3">
                {gdSites.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h3 className="font-semibold text-foreground mb-4 text-sm">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/community">
                    <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      Workshops & jams
                    </span>
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/gdg.pupmnl"
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Chapter updates (Facebook)
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.com/channels/1010229130320674886/1148223753050931360"
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    Discord server
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Google Developer Groups on Campus PUP —
            Cybersecurity department. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/community">
              <span className="hover:text-foreground cursor-pointer">Community</span>
            </Link>
            <a href="mailto:gdg.pup.cybersec@gmail.com" className="hover:text-foreground">
              Contact cybersec
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
