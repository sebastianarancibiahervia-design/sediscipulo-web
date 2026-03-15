"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Play, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade up elements
      gsap.from(".hero-element", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Mockup 3D scroll effect
      gsap.fromTo(
        mockupRef.current,
        {
          rotateX: 15,
          scale: 0.9,
          y: 50,
          opacity: 0,
        },
        {
          rotateX: 0,
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom center",
            scrub: 1,
          },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden bg-white perspective-[1200px]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neutral-100 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="hero-element inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 border border-black/10 text-xs font-mono text-charcoal/80 mb-8 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
            Nueva Colección Disponible
          </div>
          
          <h1 className="hero-element text-5xl md:text-7xl font-sans font-bold text-charcoal leading-tight mb-6">
            Eleva tu estilo con{" "}
            <span className="font-serif italic text-black font-medium tracking-wide">
              verdad bíblica
            </span>
          </h1>
          
          <p className="hero-element text-lg md:text-xl text-charcoal/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Diseños premium, algodón de alto gramaje y mensaje pastoral. No es solo vestimenta; es un testimonio vivo que acompaña tu caminar.
          </p>
          
          <div className="hero-element flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tienda"
              className="group flex items-center gap-2 px-8 py-4 bg-charcoal text-white rounded-xl text-base font-semibold transition-all hover:bg-black hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]"
            >
              <ShoppingCart size={18} />
              Comprar
            </Link>
            <button className="group flex items-center gap-3 px-8 py-4 bg-black/5 text-charcoal border border-black/10 rounded-xl text-base font-medium backdrop-blur-sm transition-all hover:bg-black/10 hover:border-black/20">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black/10 text-charcoal group-hover:bg-charcoal group-hover:text-white transition-colors">
                <Play size={12} fill="currentColor" className="ml-0.5" />
              </span>
              Ver Manifiesto
            </button>
          </div>
        </div>

        {/* 3D Mockup Container */}
        <div className="mt-20 relative max-w-5xl mx-auto" style={{ perspective: "1200px" }}>
          <div
            ref={mockupRef}
            className="w-full aspect-[16/9] md:aspect-[21/9] bg-white border border-black/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-md flex items-center justify-center relative transform-gpu"
          >
            {/* Window controls mockup */}
            <div className="absolute top-0 left-0 w-full h-12 border-b border-black/5 bg-neutral-100 flex items-center px-4 gap-2 z-20">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
            </div>
            
            {/* The actual image fake dashboard/mockup */}
            <div className="w-full h-full pt-12 relative bg-neutral-100 overflow-hidden">
               <Image 
                src="/maranata-back.jpg"
                alt="Maranata back oversized Mockup"
                fill
                className="object-cover opacity-90 transition-all duration-700"
               />
               
               {/* Overlay UI to make it feel more tool-like */}
               <div className="absolute bottom-8 left-8 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-black/10 z-20 shadow-xl">
                 <p className="font-mono text-xs text-charcoal/70 mb-1">EL MÁS VENDIDO</p>
                 <p className="font-outfit font-semibold text-charcoal">Maranata back oversized</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
