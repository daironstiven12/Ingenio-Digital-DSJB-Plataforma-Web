import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Specializations from "@/components/sections/Specializations";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import ValueProp from "@/components/sections/ValueProp";
import DigitalLab from "@/components/sections/DigitalLab";
import TeamSection from "@/components/sections/TeamSection";
import FinalCTA from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Specializations />
      <FeaturedProjectsSection />
      <ValueProp />
      <DigitalLab />
      <TeamSection />
      <FinalCTA />
    </>
  );
}
