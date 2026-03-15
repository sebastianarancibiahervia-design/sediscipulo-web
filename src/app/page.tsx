import HeroSection from "@/components/sections/HeroSection";
import SocialProof from "@/components/sections/SocialProof";
import FeaturesBento from "@/components/sections/FeaturesBento";
import ProcessFlow from "@/components/sections/ProcessFlow";
import CtaFinal from "@/components/sections/CtaFinal";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SocialProof />
      <FeaturesBento />
      <ProcessFlow />
      <CtaFinal />
    </>
  );
}
