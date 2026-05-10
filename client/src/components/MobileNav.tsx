import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Users, LayoutGrid } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { openAuthModal } from "@/lib/openAuthModal";

export default function MobileNav() {
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isLoggedIn } = useAuth();

  type Item =
    | { key: string; icon: typeof Home; label: string; href: string }
    | { key: string; icon: typeof Home; label: string; requiresAuthFor: string };

  const navItems: Item[] = useMemo(() => {
    const items: Item[] = [
      { key: "home", icon: Home, label: "Home", href: "/" },
      isLoggedIn
        ? { key: "labs", icon: BookOpen, label: "Labs", href: "/rooms" }
        : {
            key: "labs",
            icon: BookOpen,
            label: "Labs",
            requiresAuthFor: "/rooms",
          },
      { key: "community", icon: Users, label: "Community", href: "/community" },
    ];
    if (isLoggedIn) {
      items.push({
        key: "progress",
        icon: LayoutGrid,
        label: "Progress",
        href: "/dashboard",
      });
    }
    return items;
  }, [isLoggedIn]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isActivePath = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  const itemClass = (active: boolean) =>
    cn(
      "flex flex-col items-center gap-1 p-2 rounded-md min-w-[52px] transition-colors",
      active ? "text-primary" : "text-muted-foreground active:text-foreground"
    );

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-xl border-t border-border/50 transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
      data-testid="mobile-nav"
    >
      <div className="flex items-center justify-around py-2 px-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          if ("requiresAuthFor" in item) {
            return (
              <button
                key={item.key}
                type="button"
                className={itemClass(false)}
                data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                onClick={() => openAuthModal("login", item.requiresAuthFor)}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium leading-tight text-center">
                  {item.label}
                </span>
              </button>
            );
          }

          const active = isActivePath(item.href);

          return (
            <Link
              key={item.key}
              href={item.href}
              className={itemClass(active)}
              data-testid={`mobile-nav-${item.label.toLowerCase()}`}
            >
              <Icon className={cn("w-5 h-5", active && "text-primary")} />
              <span className="text-[10px] font-medium leading-tight text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
