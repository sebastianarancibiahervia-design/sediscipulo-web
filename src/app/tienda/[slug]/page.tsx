import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchProductGroupBySlug } from "@/lib/store/storeServices";
import ProductDetailClient from "@/components/store/ProductDetailClient";

export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProductGroupBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="pt-4 pb-24 min-h-[70vh] bg-white text-charcoal px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<div className="py-20 text-center animate-pulse">Cargando producto...</div>}>
          <ProductDetailClient product={product} />
        </Suspense>
      </div>
    </div>
  );
}
