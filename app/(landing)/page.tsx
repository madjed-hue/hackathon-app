import { LandingNavbar } from "@/components/landing-navbar";
import { LandingHero } from "@/components/landing-hero";

const LandingPage = () => {
  return (
    <div className="h-full relative">
      <div className="main_dashboard">
        <div className="gradient" />
      </div>
      <LandingNavbar />
      <LandingHero />
    </div>
  );
};

export default LandingPage;
