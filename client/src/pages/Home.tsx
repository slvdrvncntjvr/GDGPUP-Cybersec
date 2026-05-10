import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import FloatingSupportBot from "@/components/FloatingSupportBot";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen } from "lucide-react";

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        {isLoggedIn && (
          <section className="border-y border-border/60 bg-card/40 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Your labs are ready
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Continue the red-team and blue-team sessions from the catalog.
                </p>
              </div>
              <Button asChild className="shrink-0">
                <Link href="/rooms">Go to labs</Link>
              </Button>
            </div>
          </section>
        )}
        <FeaturesSection />
        <CommunitySection />
      </main>
      <Footer />
      <MobileNav />
      <FloatingSupportBot />
    </div>
  );
}
