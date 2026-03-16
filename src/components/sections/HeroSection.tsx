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
    <section ref={heroRef} className="relative pt-32 pb-20 bg-charcoal overflow-hidden perspective-[1200px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/maranata-back.jpg" 
          alt="Nueva colección" 
          fill 
          className="object-cover opacity-80 mix-blend-overlay blur-md scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-charcoal line-noise"></div>
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="hero-element inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-white/90 mb-8 tracking-wide backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse border border-white/20"></span>
            Nueva Colección Disponible
          </div>
          
          <h1 className="hero-element text-5xl md:text-7xl font-sans font-bold text-white leading-tight mb-6 tracking-tight">
            Eleva tu estilo con{" "}
            <span className="font-serif italic text-white/90 font-medium tracking-wide">
              verdad bíblica
            </span>
          </h1>
          
          <p className="hero-element text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Diseños premium, algodón de alto gramaje y mensaje pastoral. No es solo vestimenta; es un testimonio vivo que acompaña tu caminar.
          </p>
          
          <div className="hero-element flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tienda"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-charcoal rounded-xl text-base font-semibold transition-all hover:bg-neutral-100 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] w-full sm:w-auto"
            >
              <ShoppingCart size={18} />
              Comprar
            </Link>
            <Link 
              href="/nosotros"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl text-base font-medium backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/30 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white group-hover:bg-white transition-colors">
                <ArrowRight size={12} className="group-hover:text-charcoal transition-colors" />
              </span>
              Conócenos
            </Link>
          </div>
        </div>

        {/* 3D Mockup Container */}
        <div className="mt-20 relative max-w-5xl mx-auto" style={{ perspective: "1200px" }}>
          <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/0 rounded-3xl blur opacity-30"></div>
          <div
            ref={mockupRef}
            className="w-full aspect-[4/5] sm:aspect-video md:aspect-[21/9] bg-charcoal/50 rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/10 backdrop-blur-md flex items-center justify-center relative transform-gpu group"
          >
            {/* The actual image fake dashboard/mockup */}
            <div className="w-full h-full relative bg-charcoal">
               <Image 
                src="/maranata-back.jpg"
                alt="Maranata back oversized Mockup"
                fill
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-charcoal w-full h-full mix-blend-multiply opacity-60"></div>
               
               {/* Overlay UI to make it feel more tool-like */}
               <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 p-5 bg-charcoal/80 backdrop-blur-xl rounded-2xl border border-white/10 z-20 shadow-2xl transition-transform duration-500 hover:-translate-y-2">
                 <p className="font-mono text-xs text-white/50 mb-2 uppercase tracking-widest">EL MÁS VENDIDO</p>
                 <p className="font-outfit text-xl md:text-2xl font-bold text-white mb-3">Maranata back oversized</p>
                 <Link href="/tienda/maranata-back-oversized" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white font-medium border-b border-white/20 pb-0.5 transition-colors">
                   Ver Producto <ArrowRight size={14} />
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
