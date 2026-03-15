"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Filter, ChevronDown } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

type Category = "Textil" | "Accesorios";
type Subcategory = "Acid Wash" | "Oversized" | "Poleras" | "Polerones" | "Totebags";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  badge?: {
    text: string;
    type: "pulse" | "normal";
  };
  optionsText: string;
  categories: Category[];
  subcategories: Subcategory[];
};

const PRODUCTS: Product[] = [
  {
    id: "maranata-back",
    name: "Maranata Back - Polera Oversized",
    slug: "maranata-back-oversized",
    price: 18000,
    image: "/maranata-back.jpg",
    badge: { text: "BEST SELLER", type: "pulse" },
    optionsText: "Chocolate / Arena / Negro",
    categories: ["Textil"],
    subcategories: ["Poleras", "Oversized"],
  },
  {
    id: "g315-polera",
    name: "Genesis 3:15 - Polera",
    slug: "genesis-315-polera-acid-wash",
    price: 14000,
    image: "/catalogo/genesis315_polera_acidwash/black_baw_front.png",
    badge: { text: "NUEVO", type: "normal" },
    optionsText: "Acid Wash Negro",
    categories: ["Textil"],
    subcategories: ["Poleras", "Acid Wash"],
  },
  {
    id: "g315-crew",
    name: "Genesis 3:15 - Crew",
    slug: "genesis-315-crew-acid-wash",
    price: 20000,
    image: "/catalogo/genesis315_crew_acidwash/black_baw_front.png",
    optionsText: "Acid Wash Negro",
    categories: ["Textil"],
    subcategories: ["Polerones", "Acid Wash"],
  },
  {
    id: "g315-hoodie",
    name: "Genesis 3:15 - Hoodie",
    slug: "genesis-315-hoodie-acid-wash",
    price: 24000,
    image: "/catalogo/genesis315_hoodie_acidwash/black_color_front.png",
    badge: { text: "PREMIUM", type: "normal" },
    optionsText: "Acid Wash Negro",
    categories: ["Textil"],
    subcategories: ["Polerones", "Acid Wash"],
  },
];

function TiendaFiltersAndGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initCat = searchParams.get('categoria');

  const [sortOrder, setSortOrder] = useState<"def" | "asc" | "desc">("def");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    if (initCat === "Textil") setActiveFilter("cat-Textil");
    else if (initCat === "Accesorios") setActiveFilter("cat-Accesorios");
    else setActiveFilter("all");
  }, [initCat, searchParams]);

  const handleFilterChange = (val: string) => {
    setActiveFilter(val);
    router.replace('/tienda', { scroll: false });
  };

  const filteredProducts = PRODUCTS.filter(p => {
    if (activeFilter === "all") return true;
    if (activeFilter.startsWith("cat-")) {
      const c = activeFilter.replace("cat-", "");
      return p.categories.includes(c as Category);
    }
    if (activeFilter.startsWith("sub-")) {
      const sc = activeFilter.replace("sub-", "");
      return p.subcategories.includes(sc as Subcategory);
    }
    return true;
  }).sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    return 0;
  });

  return (
    <>
      {/* Header */}
      <div className="mb-12 border-b border-black/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-sans font-bold mb-4">Catálogo de <span className="font-serif italic text-black">Colección</span></h1>
          <p className="text-lg text-charcoal/60 max-w-2xl">
            Explora nuestros diseños disponibles. Fabricados con técnicas de alto nivel para proclamar la verdad con excelencia.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filter Dropdown */}
          <div className="relative group">
            <select 
              value={activeFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="appearance-none bg-neutral-100 border border-black/5 text-charcoal text-sm font-medium rounded-lg px-4 py-2.5 pr-10 outline-none cursor-pointer focus:border-black/20 hover:bg-neutral-200 transition-colors"
            >
              <option value="all">Ver todo</option>
              <optgroup label="Categorías">
                <option value="cat-Textil">Textil</option>
                <option value="cat-Accesorios">Accesorios</option>
              </optgroup>
              <optgroup label="Subcategorías (Textil)">
                <option value="sub-Acid Wash">Acid Wash</option>
                <option value="sub-Oversized">Oversized</option>
                <option value="sub-Poleras">Poleras</option>
                <option value="sub-Polerones">Polerones</option>
              </optgroup>
              <optgroup label="Subcategorías (Accesorios)">
                <option value="sub-Totebags">Totebags</option>
              </optgroup>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/50" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative group">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="appearance-none bg-neutral-100 border border-black/5 text-charcoal text-sm font-medium rounded-lg px-4 py-2.5 pr-10 outline-none cursor-pointer focus:border-black/20 hover:bg-neutral-200 transition-colors"
            >
              <option value="def">Ordenar por Destacados</option>
              <option value="asc">Precio: Menor a Mayor</option>
              <option value="desc">Precio: Mayor a Menor</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/50" />
          </div>
        </div>
      </div>

      {/* Product Grid - Full Width without Sidebar */}
      <div className="w-full">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-neutral-50 rounded-2xl border border-black/5">
            <Filter size={32} className="text-charcoal/20 mb-4" />
            <h3 className="text-xl font-bold text-charcoal mb-2">Sin resultados</h3>
            <p className="text-charcoal/60 max-w-sm">No encontramos productos que coincidan con estos filtros ahora mismo.</p>
            <button 
              onClick={() => handleFilterChange("all")}
              className="mt-6 px-6 py-2 bg-charcoal text-white rounded-lg font-medium hover:bg-black transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.slice(0, 10).map((product) => (
              <Link href={`/tienda/${product.slug}`} key={product.id} className="group flex flex-col">
                <div className="relative aspect-[4/5] bg-neutral-100 rounded-2xl overflow-hidden border border-black/5 mb-4 group-hover:border-black/20 transition-all shadow-sm group-hover:shadow-xl">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {product.badge && (
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[10px] font-mono font-bold text-charcoal uppercase tracking-wider shadow-sm">
                      {product.badge.type === "pulse" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      )}
                      {product.badge.text}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <h3 className="font-sans font-bold text-lg text-charcoal group-hover:underline decoration-2 underline-offset-4 truncate">{product.name}</h3>
                    <p className="text-sm text-charcoal/50 mt-1 truncate">{product.optionsText}</p>
                  </div>
                  <p className="font-mono font-semibold text-charcoal whitespace-nowrap">${product.price.toLocaleString('es-CL')}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

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
    </>
  );
}

export default function TiendaPage() {
  return (
    <div className="pt-32 pb-24 min-h-[70vh] bg-white text-charcoal px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<div className="py-20 text-center animate-pulse">Cargando catálogo...</div>}>
          <TiendaFiltersAndGrid />
        </Suspense>
      </div>
    </div>
  );
}
