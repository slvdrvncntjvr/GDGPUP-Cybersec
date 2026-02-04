import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Target, Users, User } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BookOpen, label: "Rooms", href: "/rooms" },
  { icon: Target, label: "Paths", href: "/paths" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: User, label: "Profile", href: "/profile" },
];

export default function MobileNav() {
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-xl border-t border-border/50 transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
      data-testid="mobile-nav"
    >
      <div className="flex items-center justify-around py-2 px-4 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <button
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-md min-w-[56px] transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground active:text-foreground"
                )}
                data-testid={`mobile-nav-${item.label.toLowerCase()}`}
              >
                <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
