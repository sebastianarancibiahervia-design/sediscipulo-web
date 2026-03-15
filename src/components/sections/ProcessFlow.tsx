"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingCart, Package, Truck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessFlow() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Flow line animation
      gsap.to(".flow-line", {
        strokeDashoffset: 0,
        duration: 2,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom center",
          scrub: 1,
        },
      });

      // Nodes animation
      gsap.from(".process-node", {
        scale: 0.8,
        opacity: 0,
        y: 30,
        stagger: 0.3,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 bg-white border-t border-black/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-sans font-bold text-charcoal mb-4">
            Trabajamos bajo el modelo <span className="font-serif italic text-black font-medium">"Print on demand"</span>
          </h2>
          <p className="text-charcoal/60 max-w-2xl mx-auto text-lg">
            No mantenemos stock de nuestros diseños, sino que los creamos exclusivamente bajo tu pedido.
          </p>
        </div>

        <div className="relative">
          {/* SVG Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-[40%] left-[10%] w-[80%] h-1 -translate-y-1/2 z-0">
            <svg width="100%" height="20" className="opacity-30 overflow-visible">
               <line 
                 x1="0" y1="10" x2="100%" y2="10" 
                 stroke="#CC5833" 
                 strokeWidth="2" 
                 strokeDasharray="10 10" 
                 className="flow-line"
                 style={{ strokeDashoffset: '1000' }}
               />
               <circle cx="0" cy="10" r="4" fill="#CC5833" />
               <circle cx="50%" cy="10" r="4" fill="#CC5833" />
               <circle cx="100%" cy="10" r="4" fill="#CC5833" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
            {/* Step 1 */}
            <div className="process-node flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-white border border-black/10 shadow-sm flex items-center justify-center mb-6 text-charcoal group hover:scale-110 hover:shadow-lg transition-all duration-300">
                <ShoppingCart size={32} className="group-hover:rotate-12 transition-transform" />
              </div>
              <h3 className="text-xl font-bold font-sans text-charcoal mb-2">1. Haz tu pedido</h3>
              <p className="text-charcoal/60 text-sm max-w-xs">Elige tu diseño favorito y la prenda que te acompañará. Inmediatamente lo ingresamos a producción.</p>
            </div>

            {/* Step 2 */}
            <div className="process-node flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-white border border-black/10 shadow-sm flex items-center justify-center mb-6 text-charcoal group hover:scale-110 hover:shadow-lg transition-all duration-300">
                <Package size={32} className="group-hover:-rotate-12 transition-transform" />
              </div>
              <h3 className="text-xl font-bold font-sans text-charcoal mb-2">2. Preparamos tu entrega</h3>
              <p className="text-charcoal/60 text-sm max-w-xs">Tu prenda pasa a nuestro taller donde es estampada con dedicación, asegurando la más alta calidad.</p>
            </div>

            {/* Step 3 */}
            <div className="process-node flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-white border border-black/10 shadow-sm flex items-center justify-center mb-6 text-charcoal group hover:scale-110 hover:shadow-lg transition-all duration-300">
                <Truck size={32} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <h3 className="text-xl font-bold font-sans text-charcoal mb-2">3. Enviamos a todo Chile</h3>
              <p className="text-charcoal/60 text-sm max-w-xs">Recibe tus productos rápidamente y de forma segura y protegida en la puerta de tu hogar.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
