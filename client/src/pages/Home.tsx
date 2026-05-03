import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DefenseOffenseRooms from "@/components/DefenseOffenseRooms";
import TrackSelector from "@/components/TrackSelector";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import FloatingSupportBot from "@/components/FloatingSupportBot";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DefenseOffenseRooms />
        <TrackSelector />
        <CommunitySection />
      </main>
      <Footer />
      <MobileNav />
      <FloatingSupportBot />
    </div>
  );
}
