import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4">
      <FileQuestion className="h-14 w-14 text-muted-foreground mb-4" aria-hidden />
      <h1 className="text-2xl font-bold text-foreground font-display text-center">
        Page not found
      </h1>
      <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
        That URL does not match anything on this site. Head back to the home page
        or open the room catalog.
      </p>
      <div className="flex flex-wrap gap-3 mt-8 justify-center">
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/rooms">Browse rooms</Link>
        </Button>
      </div>
    </div>
  );
}
