import { HeroSection } from "@/components/sections/HeroSection";
import { CapabilitySection } from "@/components/sections/CapabilitySection";
import { StatisticsSection } from "@/components/sections/StatisticsSection";
import { SystemsShowcase } from "@/components/sections/SystemsShowcase";
import { RecognitionSection } from "@/components/sections/RecognitionSection";
import { FoundersSection } from "@/components/sections/FoundersSection";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CapabilitySection />
      <StatisticsSection />
      <SystemsShowcase />
      <RecognitionSection />
      <FoundersSection />
      <CTASection />
    </>
  );
}
