import HeroSection from "@/components/sections/HeroSection";
import LimitedDiscounts from "@/components/sections/LimitedDiscounts";
import FeaturesBento from "@/components/sections/FeaturesBento";
import ProcessFlow from "@/components/sections/ProcessFlow";
import CtaFinal from "@/components/sections/CtaFinal";

export default function Home() {
  return (
    <>
      <HeroSection />
      <LimitedDiscounts />
      <FeaturesBento />
      <ProcessFlow />
      <CtaFinal />
    </>
  );
}
