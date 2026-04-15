"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, PackageOpen, X } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

function CotizacionModal({ onClose }: { onClose: () => void }) {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    fetch("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(Array.from(formData.entries()) as [string, string][]).toString(),
    }).then(() => setEnviado(true))
      .catch((error) => console.error("Error al enviar el formulario:", error));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-[fadeSlideUp_0.3s_ease_both]">
        {/* Header */}
        <div className="bg-[#1A1A1A] px-8 pt-8 pb-6">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={16} />
          </button>
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-4 text-white">
            <PackageOpen size={20} />
          </div>
          <h3 className="text-xl font-bold text-white font-sans">Solicitar Cotización</h3>
          <p className="text-white/60 text-sm mt-1">Te contactamos en menos de 24 horas.</p>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {enviado ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h4 className="font-bold text-charcoal text-lg mb-1">¡Solicitud enviada!</h4>
              <p className="text-charcoal/60 text-sm">Pronto te contactaremos para organizar tu pedido.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-full bg-[#1A1A1A] text-white text-sm font-bold hover:opacity-90 transition-opacity">
                Cerrar
              </button>
            </div>
          ) : (
              <form onSubmit={handleSubmit} name="cotizacion" className="space-y-4">
                <input type="hidden" name="form-name" value="cotizacion" />
              {[
                { id: "nombre", label: "Nombre", type: "text", placeholder: "Tu nombre completo" },
                { id: "telefono", label: "Número de teléfono", type: "tel", placeholder: "+56 9 XXXX XXXX" },
                { id: "correo", label: "Correo", type: "email", placeholder: "tu@correo.com" },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-xs font-semibold text-charcoal/60 mb-1.5 uppercase tracking-wide font-mono">
                    {label}
                  </label>
                  <input
                    id={id}
                    type={type}
                    required
                    placeholder={placeholder}
                    name={id}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-neutral-50 text-charcoal text-sm placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal/30 transition-all"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="detalle" className="block text-xs font-semibold text-charcoal/60 mb-1.5 uppercase tracking-wide font-mono">
                  Detalle de cotización
                </label>
                <textarea
                  id="detalle"
                  required
                  rows={4}
                  placeholder="Ej: 30 poleras talla M para retiro de jóvenes, con diseño personalizado..."
                  name="detalle"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 bg-neutral-50 text-charcoal text-sm placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal/30 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1A1A1A] text-white font-bold text-sm hover:opacity-90 active:scale-98 transition-all"
              >
                Enviar solicitud
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeaturesBento() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".bento-card", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      {showModal && <CotizacionModal onClose={() => setShowModal(false)} />}

      <section ref={containerRef} className="py-24 bg-neutral-50 relative">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-black/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-charcoal mb-4">
              Vestimenta con <span className="font-serif italic text-black font-medium">propósito</span>
            </h2>
            <p className="text-charcoal/60 max-w-xl text-lg">
              Combinamos manufactura de grado premium con diseños que proclaman la verdad, creados para resistir el tiempo y el uso diario.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-[600px]">

            {/* Card 1: Verdad Bíblica — Imagen editorial de fondo */}
            <div className="bento-card group relative col-span-1 rounded-3xl overflow-hidden shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-end p-10">
              <Image
                src="/imagen_colgador.jpg"
                alt="Prendas SeDiscipulo"
                fill
                className="object-cover grayscale group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

              <div className="absolute inset-0 flex items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-black/70 backdrop-blur-md z-20">
                <div className="w-full max-w-sm bg-white border border-black/10 rounded-2xl p-8 shadow-2xl transform scale-95 group-hover:scale-100 transition-transform duration-700">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen size={24} className="text-charcoal" />
                    <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-charcoal origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-out delay-200"></div>
                    </div>
                  </div>
                  <p className="font-serif italic text-2xl md:text-3xl text-charcoal/90 leading-tight">
                    &ldquo;Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.&rdquo;
                  </p>
                  <p className="font-mono text-sm text-charcoal/40 mt-6 uppercase tracking-widest font-bold">Colosenses 3:23</p>
                </div>
              </div>

              <div className="relative z-30 mt-auto transform translate-y-4 group-hover:-translate-y-4 transition-transform duration-500">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 text-white group-hover:opacity-0 transition-opacity duration-300">
                  <BookOpen size={28} />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold font-sans text-white mb-3 group-hover:opacity-0 transition-opacity duration-300">Diseños Alineados a la Verdad</h3>
                <p className="text-white/70 max-w-md text-lg leading-relaxed group-hover:opacity-0 transition-opacity duration-300">Mensajes extraídos directamente de la escritura para proclamar el evangelio de forma clara e intencional.</p>
              </div>
            </div>

            {/* Card 2: Pedidos Especiales — Layout vertical para acomodarlo a la columna */}
            <div className="bento-card relative col-span-1 rounded-3xl bg-[#1A1A1A] border border-black/10 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full">

              {/* Contenido en la mitad superior */}
              <div className="p-10 flex-shrink-0 relative z-20">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white backdrop-blur-sm">
                  <PackageOpen size={28} />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold font-sans text-white mb-4 pr-10">Creaciones Especiales para Congregaciones</h3>
                <p className="text-white/60 text-lg mb-8 leading-relaxed max-w-md">Realizamos prendas exclusivas para ministerios o eventos. Nos adaptamos a tu visión para glorificar a Dios.</p>
                <Link
                  href="/pedidos-personalizados"
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-[#1A1A1A] font-bold shadow-lg hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wide"
                >
                  Ver Opciones
                </Link>
              </div>

              {/* Galería acordeón en la mitad inferior ocupando el resto del espacio */}
              <div className="flex flex-1 gap-2 p-6 pt-0 w-full overflow-hidden">
                {[
                  { src: "/imagenes_personalizados/pers_campamento_jovenes.jpg", label: "Campamentos" },
                  { src: "/imagenes_personalizados/pers_eventos_especiales.jpg", label: "Eventos" },
                  { src: "/imagenes_personalizados/pers_equipos_multimedia.jpg", label: "Equipos" },
                ].map(({ src, label }) => (
                  <div
                    key={label}
                    className="relative overflow-hidden rounded-2xl flex-1 min-w-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:flex-[3] group"
                  >
                    <Image
                      src={src}
                      alt={label}
                      fill
                      className="object-cover grayscale brightness-50 group-hover:brightness-95 group-hover:grayscale-0 transition-all duration-700"
                      sizes="(max-width: 1024px) 33vw, 15vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute bottom-4 left-0 right-0 text-center text-white text-xs font-sans font-bold tracking-wider uppercase px-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
}
