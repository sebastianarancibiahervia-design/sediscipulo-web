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
            variationDesc: `${color} (${talla}) - ${diseno}`
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
  }, [loading, displayItems.length]);

  return (
    <section ref={sectionRef} className="py-20 bg-[#FAF8F5] border-y border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-charcoal tracking-tight mb-4">
              Descuentos por tiempo limitado
            </h2>
            <p className="text-charcoal/60 max-w-xl font-sans text-lg leading-relaxed">
              Descubre nuestros productos en promoción. Unidades limitadas hasta agotar stock o finalizar el tiempo.
            </p>
          </div>
          <Link href="/tienda" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-charcoal border-b-2 border-charcoal pb-1 hover:text-charcoal/60 hover:border-charcoal/60 transition-colors">
            Ver todo
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center opacity-50">
            <div className="w-8 h-8 rounded-full border-2 border-charcoal border-t-transparent animate-spin"></div>
          </div>
        ) : displayItems.length > 0 ? (
          <div className="relative group">
            {displayItems.length > 4 && (
              <>
                <button 
                  onClick={() => scroll("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-30 bg-white shadow-lg border border-black/5 text-charcoal p-3 rounded-full hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 disabled:opacity-0 focus:outline-none"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => scroll("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-30 bg-white shadow-lg border border-black/5 text-charcoal p-3 rounded-full hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 disabled:opacity-0 focus:outline-none"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
            >
              {displayItems.map((item) => (
                <Link href={`/tienda/${item.slug}`} key={item.id} className="discount-card relative flex-none w-[280px] md:w-[320px] bg-white rounded-3xl p-4 shadow-sm border border-black/5 snap-start shrink-0 group hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[4/5] relative bg-neutral-100 rounded-2xl overflow-hidden mb-4">
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-20 font-mono shadow-sm flex items-center gap-1.5 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      <CountdownTimer targetDate={item.fechaFin} />
                    </div>
                    {/* Product image area */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-700 z-10"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-6 text-center z-10 relative">
                         <p className="text-xs font-mono font-bold text-charcoal/20 uppercase tracking-widest leading-loose">
                           Sin<br/>Imagen
                         </p>
                      </div>
                    )}
                  </div>
                  <div className="px-2">
                    <h3 className="font-outfit font-semibold text-lg text-charcoal leading-tight mb-1">{item.name}</h3>
                    <p className="text-xs font-medium text-charcoal/50 mb-3">{item.variationDesc}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-red-500 font-bold font-mono">${item.newPrice.toLocaleString('es-CL')}</span>
                      <span className="text-charcoal/40 text-sm font-mono line-through decoration-1 text-red-500/50">${item.oldPrice.toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 bg-white rounded-3xl border border-black/5 text-center text-charcoal/60 font-medium">
            Próximamente nuevos descuentos...
          </div>
        )}
      </div>
    </section>
  );
}
