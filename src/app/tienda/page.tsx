import { Suspense } from "react";
import Link from "next/link";
import TiendaClient from "@/components/store/TiendaClient";
import { fetchActiveStoreProducts } from "@/lib/store/storeServices";

export const revalidate = 0; // Fetch dynamic data always, as the store varies.

export default async function TiendaPage() {
  const products = await fetchActiveStoreProducts();

  return (
    <div className="pt-4 pb-24 min-h-[70vh] bg-white text-charcoal px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<div className="py-20 text-center animate-pulse">Cargando catálogo desde Supabase...</div>}>
          <TiendaClient initialProducts={products} />
        </Suspense>

        {/* Banner Pedidos Personalizados */}
        <div className="mt-20 relative bg-[#1A1A1A] rounded-3xl overflow-hidden p-8 md:p-12 border border-black/10 shadow-xl flex flex-col items-center text-center group">
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-black z-0"></div>
          <div className="absolute inset-0 opacity-20 z-0 bg-noise mix-blend-overlay"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight">
              ¿Buscas algo más <span className="font-serif italic text-white/90">específico</span>?
            </h3>
            <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto">
              Creamos prendas exclusivas y hechas a medida para tu iglesia, ministerio o grupo musical, manteniendo nuestra excelencia en algodón premium.
            </p>
            <div className="pt-6">
              <Link href="/pedidos-personalizados" className="inline-block px-8 py-4 bg-white text-charcoal font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                Ver Pedidos Personalizados
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
