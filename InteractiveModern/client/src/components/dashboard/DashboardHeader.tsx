import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Bell, LayoutGrid } from "lucide-react";

type Props = {
  title?: string;
  subtitle?: string;
  onNotificationsClick?: () => void;
};

export default function DashboardHeader({
  title = "User Dashboard",
  subtitle = "Track your XP, completed rooms, and submissions.",
  onNotificationsClick,
}: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {/* Keep ONE primary rooms redirect on the page */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2" onClick={onNotificationsClick}>
          <Bell className="h-4 w-4" />
          Notifications
        </Button>

        <Button asChild size="sm" className="gap-2">
          <Link href="/rooms">
            <LayoutGrid className="h-4 w-4" />
            Browse Rooms
          </Link>
        </Button>
      </div>
    </div>
  );
}