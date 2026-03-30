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
          className="object-cover object-top opacity-60"
          priority
        />
        {/* Dark Gradient Overlay for the preset organic tech vibe */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none mix-blend-overlay" />
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className="relative z-10 container mx-auto px-6 lg:px-12 flex flex-col items-center text-center max-w-4xl pt-24"
      >
        <span className="inline-block py-1 px-3 border border-clay/30 rounded-full text-clay text-xs tracking-widest font-mono uppercase mb-6 bg-charcoal/80 backdrop-blur-md">
          Conócenos
        </span>
        <h1 className="text-5xl md:text-7xl font-sans font-bold text-cream mb-8 leading-tight">
          Nuestra <span className="font-serif italic text-clay">Historia</span>
        </h1>
        <p className="text-lg md:text-xl text-cream/80 max-w-2xl font-light leading-relaxed mb-6">
          Somos Seba y Danna. Él Ingeniero Civil Industrial y ella Diseñadora Gráfica; ambos amamos a Dios y a la iglesia local.
        </p>
        <p className="text-base md:text-lg text-cream/60 max-w-2xl font-light leading-relaxed">
          Vimos cómo nuestras profesiones podían unirse en un proyecto en común: diseñar prendas de ropa alineadas a la verdad bíblica. Así es como nace <strong>SeDiscipulo</strong>.
        </p>
      </div>
    </section>
  );
}
