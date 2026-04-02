"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function HeroNosotros() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cinemagraphic entrance
      gsap.fromTo(
        imageRef.current,
        { scale: 1.05, opacity: 0, filter: "blur(10px)" },
        { 
          scale: 1, 
          opacity: 1, 
          filter: "blur(0px)", 
          duration: 1.8, 
          ease: "power3.out" 
        }
      );

      // Text stagger reveal
      gsap.fromTo(
        contentRef.current?.children ? Array.from(contentRef.current.children) : [],
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          stagger: 0.15, 
          ease: "power3.out",
          delay: 0.5 
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-charcoal"
    >
      {/* Background Image Setup */}
      <div 
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
      >
        <Image 
          src="/nosotros/nosotros.jpeg"
          alt="Danna y Sebastián - Creadores de SeDiscipulo"
          fill
          className="object-cover object-center opacity-60"
          priority
        />
        {/* Dark Gradient Overlay for the preset organic tech vibe */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none mix-blend-overlay" />
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className="relative z-10 container mx-auto px-8 lg:px-16 flex flex-col items-start text-left max-w-7xl pt-32"
      >
        <div className="max-w-2xl">
          <span className="inline-block py-1.5 px-4 border border-clay/30 rounded-full text-clay text-[11px] tracking-widest font-mono uppercase mb-6 bg-charcoal/80 backdrop-blur-md">
            Conócenos
          </span>
          <h1 className="text-5xl md:text-7xl font-sans font-bold text-cream mb-8 leading-tight">
            Nuestra <span className="font-serif italic text-clay font-medium">Historia</span>
          </h1>
          <p className="text-lg md:text-xl text-cream/90 font-light leading-relaxed mb-6 drop-shadow-md">
            Somos Seba y Danna. Él Ingeniero Civil Industrial y ella Diseñadora Gráfica; ambos amamos a Dios y a la iglesia local.
          </p>
          <p className="text-base md:text-lg text-cream/70 font-light leading-relaxed drop-shadow-md">
            Vimos cómo nuestras profesiones podían unirse en un proyecto en común: diseñar prendas de ropa alineadas a la verdad bíblica. Así es como nace <strong>SeDiscipulo</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
