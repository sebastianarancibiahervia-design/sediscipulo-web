"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SocialProof() {
  const logos = [
    "Evangelio Puro", "Seminarios", "Gracia Abundante", 
    "Comunidad Cristiana", "La Respuesta", "Edificando Vidas"
  ];

  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP infinite marquee loop
    const ctx = gsap.context(() => {
      const container = marqueeRef.current;
      if (!container) return;

      const items = container.querySelectorAll('.marquee-item');
      
      // Calculate total width using first duplicated set
      const totalWidth = Array.from(items).reduce((acc, el) => acc + (el as HTMLElement).offsetWidth, 0) / 2;
      
      gsap.to(container, {
        x: -totalWidth,
        duration: 30, // speed
        ease: "none",
        repeat: -1,
      });

    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-12 bg-white border-y border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        <p className="text-sm font-mono text-charcoal/40 uppercase tracking-widest font-semibold">
          Vestimenta pastoral confiada por
        </p>
      </div>
      
      <div className="relative w-full overflow-hidden flex items-center group">
        {/* We add multiple gradients for fading edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
        
        <div ref={marqueeRef} className="flex whitespace-nowrap items-center px-8 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
          {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
            <div key={index} className="flex-none marquee-item inline-flex items-center">
              <span className="font-serif italic text-2xl md:text-3xl text-charcoal font-bold tracking-wider mx-12">
                {logo}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-black/20"></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
