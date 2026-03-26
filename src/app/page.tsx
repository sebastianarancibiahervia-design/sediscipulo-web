import HeroSection from "@/components/sections/HeroSection";
import LimitedDiscounts from "@/components/sections/LimitedDiscounts";
import FeaturesBento from "@/components/sections/FeaturesBento";
import ProcessFlow from "@/components/sections/ProcessFlow";
import CtaFinal from "@/components/sections/CtaFinal";
import { fetchActiveStoreProducts } from "@/lib/store/storeServices";

export default async function Home() {
  const products = await fetchActiveStoreProducts();
  
  // Find top seller based on sales count
  const topProduct = products.length > 0 
    ? [...products].sort((a, b) => b.totalSales - a.totalSales)[0]
    : null;

  return (
    <>
      <HeroSection topProduct={topProduct} />
      <LimitedDiscounts />
      <FeaturesBento />
      <ProcessFlow />
      <CtaFinal />
    </>
  );
}
