"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function LimitedDiscounts() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  // Productos importados desde el catálogo con 10% de descuento
  const placeholders = [
    { 
      id: "maranata-back", 
      name: "Maranata Back - Polera Oversized", 
      oldPrice: "$18.000", 
      newPrice: "$16.200",
      image: "/maranata-back.jpg",
      slug: "maranata-back-oversized"
    },
    { 
      id: "g315-polera", 
      name: "Genesis 3:15 - Polera", 
      oldPrice: "$14.000", 
      newPrice: "$12.600",
      image: "/catalogo/genesis315_polera_acidwash/black_baw_front.png",
      slug: "genesis-315-polera-acid-wash"
    },
    { 
      id: "g315-crew", 
      name: "Genesis 3:15 - Crew", 
      oldPrice: "$20.000", 
      newPrice: "$18.000",
      image: "/catalogo/genesis315_crew_acidwash/black_baw_front.png",
      slug: "genesis-315-crew-acid-wash"
    },
    { 
      id: "g315-hoodie", 
      name: "Genesis 3:15 - Hoodie", 
      oldPrice: "$24.000", 
      newPrice: "$21.600",
      image: "/catalogo/genesis315_hoodie_acidwash/black_color_front.png",
      slug: "genesis-315-hoodie-acid-wash"
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-[#FAF8F5] border-y border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-charcoal tracking-tight mb-4">
              Descuentos por tiempo limitado
            </h2>
            <p className="text-charcoal/60 max-w-xl font-mono text-sm leading-relaxed">
              Descubre nuestras piezas premium en oferta. Unidades limitadas hasta agotar stock.
            </p>
          </div>
          <Link href="/tienda" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-charcoal border-b-2 border-charcoal pb-1 hover:text-charcoal/60 hover:border-charcoal/60 transition-colors">
            Ver todo
          </Link>
        </div>

        {/* Carousel Space */}
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory slide-container">
          {placeholders.map((item) => (
            <Link href={`/tienda/${item.slug}`} key={item.id} className="discount-card relative block min-w-[280px] md:min-w-[320px] bg-white rounded-3xl p-4 shadow-sm border border-black/5 snap-start group hover:shadow-xl transition-all duration-300">
              <div className="aspect-[4/5] relative bg-neutral-100 rounded-2xl overflow-hidden mb-4">
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-20 font-mono shadow-sm">
                  -10%
                </div>
                {/* Product image area */}
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 z-10"
                />
              </div>
              <div className="px-2">
                <h3 className="font-outfit font-semibold text-lg text-charcoal mb-2">{item.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-red-500 font-bold">{item.newPrice}</span>
                  <span className="text-charcoal/40 text-sm line-through decoration-1">{item.oldPrice}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
