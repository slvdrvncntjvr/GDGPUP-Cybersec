import { Link } from "wouter";
import { Shield, Github, Twitter, Linkedin, Youtube } from "lucide-react";
import logo from "./GDGCybersec-Assets/GDGAscii2.1.png";

const footerLinks = {
  Product: [
    { label: "Home", href: "/" },
    { label: "Rooms", href: "/rooms" },
    { label: "Community Hub", href: "/community" },
    { label: "My Progress", href: "/dashboard" },
  ],
  Community: [
    { label: "Join Community", href: "/community" },
    { label: "Events", href: "/community" },
    { label: "Study Jams", href: "/community" },
    { label: "Discord", href: "/community" },
  ],
  Resources: [
    { label: "Rooms Catalog", href: "/rooms" },
    { label: "Team Paths", href: "/rooms" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Community Guide", href: "/community" },
  ],
  Company: [
    { label: "About", href: "/community" },
    { label: "Contact", href: "/community" },
    { label: "Privacy", href: "/community" },
    { label: "Terms", href: "/community" },
  ],
};

const socialLinks = [
  { icon: Github, href: "https://github.com/slvdrvncntjvr/GDGPUP-Cybersec", label: "GitHub" },
  { icon: Twitter, href: "https://x.com/googledevs", label: "Twitter" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/google-developers/", label: "LinkedIn" },
  { icon: Youtube, href: "https://www.youtube.com/@GoogleDevelopers", label: "YouTube" },
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
                    alt="Logo"
                    className="w-10 h-10 object-contain"  // GDG Logo (ASCII)
                    />
                  <div>
                    <span className="font-display font-semibold text-foreground block">
                      Cybersecurity GDG
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Learn security by doing
                    </span>
                  </div>
                </div>
              </Link>

              <p className="text-sm text-muted-foreground max-w-xs mb-6">
                A community-led initiative focused on hands-on cybersecurity
                learning for students and professionals.
              </p>

              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-md bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.label}
                    data-testid={`social-${social.label.toLowerCase()}`}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-semibold text-foreground mb-4 text-sm">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}>
                        <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2024 Cybersecurity GDG Department. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/community">
              <span className="hover:text-foreground cursor-pointer">Terms</span>
            </Link>
            <Link href="/community">
              <span className="hover:text-foreground cursor-pointer">Privacy</span>
            </Link>
            <Link href="/community">
              <span className="hover:text-foreground cursor-pointer">Cookies</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}