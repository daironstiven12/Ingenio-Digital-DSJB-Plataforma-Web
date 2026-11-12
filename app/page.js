import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Specializations from "@/components/sections/Specializations";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import ValueProp from "@/components/sections/ValueProp";
import DigitalLab from "@/components/sections/DigitalLab";
import Team from "@/components/sections/Team";
import FinalCTA from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Specializations />
      <FeaturedProjects />
      <ValueProp />
      <DigitalLab />
      <Team />
      <FinalCTA />
    </>
  );
}
