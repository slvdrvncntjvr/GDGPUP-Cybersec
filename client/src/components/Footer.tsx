import { Link } from "wouter";
import { Shield, Linkedin, Youtube, Facebook, Instagram } from "lucide-react";

// Simplified Footer Links
const footerLinks = {
  Platform: [
    { label: "Rooms", href: "/rooms" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Community: [
    { label: "Community Hub", href: "/community" },
  ],
  "About Us": [
    { label: "About", href: "/about" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border/50" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            
            {/* Logo and Socials Column */}
            <div className="col-span-2">
              <Link href="/">
                <div className="flex items-center gap-3 mb-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="font-display font-semibold text-foreground block">
                      GDG Cybersecurity
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

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="col-span-1">
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
            &copy; 2025-2026 GDG PUP Cybersecurity Department. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer">Term 4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}