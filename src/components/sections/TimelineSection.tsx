"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TIMELINE_DATA = [
  {
    id: "01",
    date: "Febrero 2025",
    title: "El Comienzo",
    description: "Nuestra historia como SeDiscipulo comienza oficialmente. Llenos de expectativas y fe, comenzamos a trazar este camino uniendo nuestras profesiones y nuestra pasión por el diseño con propósito.",
    image: null,
  },
  {
    id: "02",
    date: "Marzo 2025",
    title: "Primera Prenda",
    description: "En una conferencia organizada por Instituto Satélite (del cual ambos somos parte), pusimos nuestro primer stand de ropa sin tantas expectativas de cómo nos podía ir. Una anécdota interesante: Seba es un poco ansioso, y antes de tener la primera prenda en las manos, ya había lanzado publicidad en Instagram. Recibimos muchos mensajes ese día alabando la calidad y los diseños, lo que nos motivó profundamente.",
    image: "/nosotros/primera_prenda.JPG",
  },
  {
    id: "03",
    date: "2025 - 2026",
    title: "Crecimiento y Mejora",
    description: "De ahí en adelante seguimos trabajando cada día por mejorar la calidad de nuestros productos, las telas, el entalle de las prendas y por sobre todo, la experiencia del usuario.",
    image: null,
  },
  {
    id: "04",
    date: "Marzo 2026",
    title: "Lanzamiento Web",
    description: "Coronando un año de aprendizaje constante, lanzamos nuestra plataforma oficial sediscipulo.cl, un espacio creado a medida para reflejar nuestro sello de excelencia.",
    image: "/nosotros/pagina-web.png",
  }
];

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Vertical line progression
      gsap.fromTo(
        ".timeline-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          }
        }
      );

      // Fade up each item as it enters view
      const items = gsap.utils.toArray<HTMLElement>(".timeline-item");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 50, filter: "blur(5px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play reverse play reverse",
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 relative bg-cream">
      <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none mix-blend-overlay" />
      
      <div className="container mx-auto px-6 lg:px-12 relative">
        {/* Timeline Center Line */}
        <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-charcoal/10 transform lg:-translate-x-1/2">
          <div className="timeline-line absolute top-0 left-0 w-full h-full bg-clay origin-top" />
        </div>

        <div className="space-y-24">
          {TIMELINE_DATA.map((item, index) => {
            // "primera_prenda" is index 1. User wants text on the left, image on the right.
            const textOnLeft = index % 2 !== 0;

            return (
              <div 
                key={item.id} 
                className="timeline-item relative flex flex-col lg:flex-row items-center w-full lg:min-h-[300px]"
              >
                {/* Center Node */}
                <div className="absolute left-6 lg:left-1/2 top-4 lg:top-1/2 -ml-2 lg:-ml-3 w-4 h-4 lg:w-6 lg:h-6 lg:-translate-y-1/2 rounded-full bg-moss border-4 border-cream z-10 shadow-sm" />

                {/* Text Block */}
                <div className={`w-full lg:w-1/2 pl-16 lg:pl-0 flex flex-col ${
                  textOnLeft 
                    ? 'lg:pr-16 lg:text-right lg:items-end order-1 lg:order-1' 
                    : 'lg:pl-16 lg:text-left lg:items-start order-1 lg:order-2'
                }`}>
                  <span className="text-clay font-mono text-sm tracking-widest font-bold mb-2 block">{item.date}</span>
                  <h3 className="text-3xl font-serif italic text-charcoal mb-4">{item.title}</h3>
                  <p className="text-charcoal/70 text-base md:text-lg leading-relaxed max-w-md font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Image Block (if any, otherwise empty half) */}
                <div className={`w-full lg:w-1/2 pl-16 lg:pl-0 flex flex-col mt-6 lg:mt-0 ${
                  textOnLeft 
                    ? 'lg:pl-16 order-2 lg:order-2 lg:items-start' 
                    : 'lg:pr-16 order-2 lg:order-1 lg:items-end'
                }`}>
                  {item.image && (
                    <div className={`rounded-[2rem] overflow-hidden ${textOnLeft ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform duration-500 max-w-[90%] lg:max-w-lg w-full border border-charcoal/5 group`}>
                      <div className="relative w-full h-auto">
                        <Image 
                          src={item.image} 
                          alt={item.title} 
                          width={1200}
                          height={1200}
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
