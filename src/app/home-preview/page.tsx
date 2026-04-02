import HeroSection from "@/components/sections/HeroSection";
import LimitedDiscounts from "@/components/sections/LimitedDiscounts";
import FeaturesBento from "@/components/sections/FeaturesBento";
import ProcessFlow from "@/components/sections/ProcessFlow";
import CtaFinal from "@/components/sections/CtaFinal";
import MarqueeStrip from "@/components/MarqueeStrip";
import { fetchTopHistoricalSellers } from "@/lib/store/storeServices";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  // Top 3 histórico: detalle_ventas → tienda (categoria='SEDISCIPULO') → count → sort
  const topProducts = await fetchTopHistoricalSellers(3);

  return (
    <>
      <HeroSection topProducts={topProducts} />
      <MarqueeStrip />
      <LimitedDiscounts />
      <FeaturesBento />
      <ProcessFlow />
      <CtaFinal />
    </>
  );
}
