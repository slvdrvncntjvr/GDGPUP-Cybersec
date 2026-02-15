import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shield, User, LayoutGrid, LogOut } from "lucide-react";
import AuthModal from "./AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Simplified Nav Structure
interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Rooms", href: "/rooms" },
  { label: "Community Hub", href: "/community" },
  { label: "About", href: "/about" },
];

type StoredUser = {
  name?: string;
  avatarUrl?: string;
};

// Temporary client-side “logged in” signal until backend wires session.
// Backend devs can swap this logic to context / cookie session / /api/me.
function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem("gdg_user");
    if (!raw) return null;
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export default function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [storedUser, setStoredUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setStoredUser(getStoredUser());
    const onStorage = () => setStoredUser(getStoredUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isLoggedIn = useMemo(() => !!storedUser, [storedUser]);

  const openLogin = () => {
    setAuthMode("login");
    setAuthModalOpen(true);
  };

  const logout = () => {
    localStorage.removeItem("gdg_user");
    setStoredUser(null);
  };

  const displayName = storedUser?.name ?? "User";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U";

  // Copy links in the desired order: Rooms, (My Progress), Community Hub, About
  // "My Progress" is shown ONLY when logged in.
  const desktopLinks: NavLink[] = useMemo(() => {
    if (!isLoggedIn) return navLinks;
    return [
      { label: "Rooms", href: "/rooms" },
      { label: "My Progress", href: "/dashboard" },
      { label: "Community Hub", href: "/community" },
      { label: "About", href: "/about" },
    ];
  }, [isLoggedIn]);

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
              {desktopLinks.map((link) => (
                <Link key={link.label} href={link.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-muted-foreground hover:text-foreground ${
                      location === link.href ? "text-foreground bg-accent" : ""
                    }`}
                    data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      data-testid="button-user-menu"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={storedUser?.avatarUrl ?? ""}
                          alt={displayName}
                        />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    {/* Keep Dashboard item in menu (still useful even with top nav link) */}
                    <DropdownMenuItem asChild className="gap-2">
                      <Link href="/dashboard">
                        <LayoutGrid className="w-4 h-4" />
                        My Progress
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="gap-2">
                      <Link href="/account">
                        <User className="w-4 h-4" />
                        Account
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="gap-2" onClick={logout}>
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hidden sm:flex"
                    onClick={openLogin}
                    data-testid="button-login"
                  >
                    Log In
                  </Button>
                </>
              )}

              {/* Mobile Menu Trigger */}
              <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-80 bg-card">
                  <div className="flex flex-col gap-6 mt-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-display font-semibold">Cybersecurity GDG</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      {/* Mobile links in the same desired order */}
                      <Link
                        href="/rooms"
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start ${
                            location === "/rooms" ? "bg-accent" : ""
                          }`}
                        >
                          Rooms
                        </Button>
                      </Link>

                      {isLoggedIn && (
                        <Link
                          href="/dashboard"
                          onClick={() => setIsMobileOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className={`w-full justify-start gap-2 ${
                              location === "/dashboard" ? "bg-accent" : ""
                            }`}
                          >
                            <LayoutGrid className="w-4 h-4" />
                            My Progress
                          </Button>
                        </Link>
                      )}

                      <Link
                        href="/community"
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start ${
                            location === "/community" ? "bg-accent" : ""
                          }`}
                        >
                          Community Hub
                        </Button>
                      </Link>

                      <Link
                        href="/about"
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start ${
                            location === "/about" ? "bg-accent" : ""
                          }`}
                        >
                          About
                        </Button>
                      </Link>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-border">
                      {!isLoggedIn ? (
                        <Button
                          className="w-full"
                          onClick={() => {
                            setIsMobileOpen(false);
                            openLogin();
                          }}
                        >
                          Log In
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={() => {
                            setIsMobileOpen(false);
                            logout();
                          }}
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} defaultMode={authMode} />
    </>
  );
}

/**
 * Dev tip:
 * To simulate logged-in:
 * localStorage.setItem("gdg_user", JSON.stringify({ name: "Sparky", avatarUrl: "" }))
 * location.reload()
 *
 * To logout:
 * localStorage.removeItem("gdg_user"); location.reload()
 */