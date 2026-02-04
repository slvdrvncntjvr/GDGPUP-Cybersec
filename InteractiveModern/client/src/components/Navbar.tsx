import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shield, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthModal from "./AuthModal";

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const navLinks: NavLink[] = [
  { label: "Rooms", href: "/rooms" },
  { label: "Learning Paths", href: "/paths" },
  { label: "Features", href: "/features" },
  { label: "GDG Dept.", href: "/about" },
  {
    label: "More",
    href: "#",
    children: [
      { label: "Chapters", href: "/chapters" },
      { label: "Events", href: "/events" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openLogin = () => {
    setAuthMode("login");
    setAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
            : "bg-transparent"
        }`}
        data-testid="navbar"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" data-testid="link-home">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div className="absolute inset-0 rounded-md bg-primary/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-semibold text-sm md:text-base text-foreground">
                    Cybersecurity GDG
                  </span>
                  <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">
                    Community-led security learning
                  </span>
                </div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <DropdownMenu key={link.label}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground gap-1"
                        data-testid={`nav-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-40">
                      {link.children.map((child) => (
                        <DropdownMenuItem key={child.label} asChild>
                          <Link
                            href={child.href}
                            data-testid={`nav-${child.label.toLowerCase()}`}
                          >
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link key={link.label} href={link.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-muted-foreground hover:text-foreground ${
                        location === link.href ? "text-foreground bg-accent" : ""
                      }`}
                      data-testid={`nav-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </Button>
                  </Link>
                )
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex"
                onClick={openLogin}
                data-testid="button-login"
              >
                Log in
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                onClick={openSignup}
                data-testid="button-signup"
              >
                Start Free
              </Button>

              <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid="button-mobile-menu"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-card">
                  <div className="flex flex-col gap-6 mt-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-display font-semibold">
                        Cybersecurity GDG
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      {navLinks.map((link) =>
                        link.children ? (
                          <div key={link.label} className="flex flex-col">
                            <span className="px-3 py-2 text-sm font-medium text-muted-foreground">
                              {link.label}
                            </span>
                            {link.children.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                onClick={() => setIsMobileOpen(false)}
                              >
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start pl-6"
                                  data-testid={`mobile-nav-${child.label.toLowerCase()}`}
                                >
                                  {child.label}
                                </Button>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <Button
                              variant="ghost"
                              className={`w-full justify-start ${
                                location === link.href ? "bg-accent" : ""
                              }`}
                              data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                            >
                              {link.label}
                            </Button>
                          </Link>
                        )
                      )}
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setIsMobileOpen(false);
                          openLogin();
                        }}
                      >
                        Log in
                      </Button>
                      <Button
                        className="w-full"
                        onClick={() => {
                          setIsMobileOpen(false);
                          openSignup();
                        }}
                      >
                        Start Free
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultMode={authMode}
      />
    </>
  );
}
