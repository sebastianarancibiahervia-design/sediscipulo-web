"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { fetchActivePromotions, Promocion, generateSlug } from "@/lib/store/storeServices";
import { getProductImageUrl } from "@/components/store/ProductCard";

gsap.registerPlugin(ScrollTrigger);

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const end = new Date(targetDate).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft("00:00:00");
        return true; // ended
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const formatted = `${days > 0 ? days + 'd ' : ''}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setTimeLeft(formatted);
      return false;
    };

    calculateTime();
    const interval = setInterval(() => {
      if (calculateTime()) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return <span>{timeLeft || "Calculando..."}</span>;
}

export default function LimitedDiscounts() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [promotions, setPromotions] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const data = await fetchActivePromotions();
      setPromotions(data);
      setLoading(false);
    }
    init();
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350; // approximate width of one card + gaps
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const displayItems = useMemo(() => {
    const items: any[] = [];
    promotions.forEach(promo => {
      promo.detalle_promociones?.forEach(detail => {
        const name = detail.tienda?.producto_tienda;
        if (name) {
          const color = detail.tienda?.inventario_base?.color || "N/A";
          const talla = detail.tienda?.inventario_base?.talla || "N/A";
          const diseno = detail.tienda?.disenos?.color || "Sin diseño";
          
          let queryString = [];
          if (color !== "N/A") queryString.push(`colorPrenda=${encodeURIComponent(color)}`);
          if (talla !== "N/A") queryString.push(`talla=${encodeURIComponent(talla)}`);
          if (diseno !== "Sin diseño") queryString.push(`colorDiseno=${encodeURIComponent(diseno)}`);
          
          const searchParams = queryString.length > 0 ? `?${queryString.join('&')}` : "";

          items.push({
            id: detail.id,
            name: name,
            slug: `${generateSlug(name)}${searchParams}`,
            image: getProductImageUrl(detail.tienda?.imagen_url || ""),
            newPrice: detail.precio_promocional,
            oldPrice: detail.tienda?.valor_tienda || 0,
            fechaFin: promo.fecha_fin,
            variationDesc: `${color} (${talla}) - ${diseno}`,
            disponibles: detail.unidades_limitadas !== null ? Math.max(0, detail.unidades_limitadas - detail.unidades_vendidas) : null
          });
        }
      });
    });
    return items;
  }, [promotions]);

  useEffect(() => {
    if (loading || displayItems.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(".discount-card", {
        y: 50,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, displayItems.length]);  return (
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 font-medium text-xs font-mono uppercase tracking-widest rounded-full mb-4 border border-red-100">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
              Ofertas Flash
            </div>
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-charcoal tracking-tight mb-4">
              Descuentos especiales
            </h2>
            <p className="text-charcoal/60 font-sans text-lg leading-relaxed">
              Unidades estrictamente limitadas. Estos diseños no volverán a este precio.
            </p>
          </div>
          <Link href="/tienda" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-charcoal bg-neutral-100 hover:bg-neutral-200 px-6 py-3 rounded-full transition-colors">
            Ver colección completa <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-10 h-10 rounded-full border-2 border-charcoal/20 border-t-charcoal animate-spin"></div>
          </div>
        ) : displayItems.length > 0 ? (
          <div className="relative group/carousel -mx-4 sm:mx-0">
            {displayItems.length > 3 && (
              <>
                <button 
                  onClick={() => scroll("left")}
                  className="absolute left-4 md:-left-6 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur border border-black/5 text-charcoal p-4 rounded-full shadow-xl hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 focus:outline-none"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => scroll("right")}
                  className="absolute right-4 md:-right-6 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur border border-black/5 text-charcoal p-4 rounded-full shadow-xl hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 focus:outline-none"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 md:gap-6 overflow-x-auto pb-12 px-4 sm:px-0 snap-x snap-mandatory scrollbar-hide"
            >
              {displayItems.map((item) => (
                <Link 
                  href={`/tienda/${item.slug}`} 
                  key={item.id} 
                  className="discount-card relative flex-none w-[300px] md:w-[400px] aspect-[4/5] bg-charcoal rounded-[2rem] overflow-hidden snap-start shrink-0 group hover:shadow-2xl hover:shadow-charcoal/20 transition-all duration-500"
                >
                  {/* Imagen de fondo */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 z-0">
                       <p className="text-white/20 font-mono text-sm tracking-[0.2em]">SIN IMAGEN</p>
                    </div>
                  )}

                  {/* Degradado para que se lea el texto */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 z-10" />

                  {/* Badge de tiempo en top-left */}
                  <div className="absolute top-5 left-5 z-20">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                       <CountdownTimer targetDate={item.fechaFin} />
                    </div>
                  </div>

                  {/* Contenido inferior */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white/70 font-mono text-[10px] md:text-xs uppercase tracking-widest mb-2 line-clamp-1">
                        {item.variationDesc}
                      </p>
                      <h3 className="font-outfit font-bold text-2xl md:text-3xl text-white leading-tight mb-4 line-clamp-2">
                        {item.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-baseline gap-3">
                          <span className="text-white font-mono font-bold text-xl md:text-2xl">${item.newPrice.toLocaleString('es-CL')}</span>
                          <span className="text-white/40 text-sm font-mono line-through decoration-1">${item.oldPrice.toLocaleString('es-CL')}</span>
                        </div>
                        {item.disponibles !== null && (
                          <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 px-3 py-1.5 rounded-xl">
                            <p className="text-[10px] md:text-xs font-bold text-red-100 font-sans tracking-wide">
                              {item.disponibles} EN STOCK
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-24 bg-neutral-50 rounded-[2rem] border border-neutral-100 text-center flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-neutral-200/50 rounded-2xl mb-4"></div>
             <p className="text-charcoal/50 font-medium text-lg">Pronto nuevas colecciones flash.</p>
          </div>
        )}
      </div>
    </section>
  );
}
