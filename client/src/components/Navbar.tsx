import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shield, User } from "lucide-react";
import AuthModal from "./AuthModal";

// Simplified Nav Structure based on your request
interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Rooms", href: "/rooms" },
  { label: "Community Hub", href: "/community" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // Mock logged-in state (Replace with actual auth context later)
  const isLoggedIn = false; 

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
            {/* Logo Area */}
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
                    GDG Cybersecurity
                  </span>
                  <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">
                    Community-led security learning
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
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
              ))}
            </div>

            {/* Right Side Actions (Login / Account) */}
            <div className="flex items-center gap-3">
              
              {/* Account Link (Always visible or conditional based on requirements) */}
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex text-muted-foreground hover:text-foreground gap-2"
                  data-testid="button-account"
                >
                  <User className="w-4 h-4" />
                  Account
                </Button>
              </Link>

              {/* Login Button */}
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hidden sm:flex"
                onClick={openLogin}
                data-testid="button-login"
              >
                Log In
              </Button>

              {/* Mobile Menu Trigger */}
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
                      {navLinks.map((link) => (
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
                          >
                            {link.label}
                          </Button>
                        </Link>
                      ))}
                      
                      {/* Mobile Account Link */}
                      <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
                         <Button variant="ghost" className="w-full justify-start gap-2">
                           <User className="w-4 h-4" /> Account
                         </Button>
                      </Link>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-border">
                      <Button
                        className="w-full"
                        onClick={() => {
                          setIsMobileOpen(false);
                          openLogin();
                        }}
                      >
                        Log In
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