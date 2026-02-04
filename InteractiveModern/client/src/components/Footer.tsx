import { Link } from "wouter";
import { Shield, Github, Twitter, Linkedin, Youtube } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Rooms", href: "/rooms" },
    { label: "Learning Paths", href: "/paths" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
  ],
  Community: [
    { label: "Chapters", href: "/chapters" },
    { label: "Events", href: "/events" },
    { label: "Blog", href: "/blog" },
    { label: "Discord", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API", href: "/api" },
    { label: "Status", href: "/status" },
    { label: "Changelog", href: "/changelog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
  ],
};

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
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
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
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
            <Link href="/terms">
              <span className="hover:text-foreground cursor-pointer">Terms</span>
            </Link>
            <Link href="/privacy">
              <span className="hover:text-foreground cursor-pointer">Privacy</span>
            </Link>
            <Link href="/cookies">
              <span className="hover:text-foreground cursor-pointer">Cookies</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
