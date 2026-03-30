import HeroNosotros from "@/components/sections/HeroNosotros";
import TimelineSection from "@/components/sections/TimelineSection";
import CtaFinal from "@/components/sections/CtaFinal";

// Add specific metadata for SEO based on global rules
export const metadata = {
  title: "Nosotros | SeDiscipulo",
  description: "Conoce la historia de SeDiscipulo, una marca creada por Danna y Sebastián para diseñar prendas alineadas a la verdad bíblica.",
};

export default function NosotrosPage() {
  return (
    <main className="bg-white overflow-hidden">
      <HeroNosotros />
      <TimelineSection />
      <CtaFinal />
    </main>
  );
}
