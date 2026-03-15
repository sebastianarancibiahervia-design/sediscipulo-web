"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Shirt, PackageOpen, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function CotizacionModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ nombre: "", telefono: "", correo: "", detalle: "" });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar envío a sarancibiahervia@gmail.com (EmailJS / Resend / API Route)
    setEnviado(true);
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
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    value={form[id as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [id]: e.target.value })}
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
                  value={form.detalle}
                  onChange={(e) => setForm({ ...form, detalle: e.target.value })}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[360px]">

            {/* Card 1: Verdad Bíblica — Imagen editorial de fondo */}
            <div className="bento-card group relative col-span-1 md:col-span-2 rounded-3xl overflow-hidden shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-end p-8">
              <Image
                src="/imagen_colgador.jpg"
                alt="Prendas SeDiscipulo"
                fill
                className="object-cover grayscale group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

              <div className="absolute inset-0 flex items-center justify-center p-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-black/60 backdrop-blur-sm z-20">
                <div className="w-full max-w-md bg-white border border-black/10 rounded-xl p-6 shadow-2xl transform scale-95 group-hover:scale-105 transition-transform duration-700">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen size={20} className="text-charcoal" />
                    <div className="h-2 w-24 bg-black/10 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-charcoal origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-out"></div>
                    </div>
                  </div>
                  <p className="font-serif italic text-2xl text-charcoal/90 leading-snug">
                    &ldquo;Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.&rdquo;
                  </p>
                  <p className="font-mono text-xs text-charcoal/40 mt-4 uppercase tracking-widest font-bold">Colosenses 3:23</p>
                </div>
              </div>

              <div className="relative z-30 mt-auto">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 text-white group-hover:opacity-0 transition-opacity duration-300">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-2xl font-bold font-sans text-white mb-2 group-hover:opacity-0 transition-opacity duration-300">Diseños Alineados a la Verdad</h3>
                <p className="text-white/70 max-w-md group-hover:opacity-0 transition-opacity duration-300">Mensajes extraídos directamente de la escritura para proclamar el evangelio de forma clara e intencional.</p>
              </div>
            </div>

            {/* Card 2: Alto Gramaje */}
            <div className="bento-card group relative col-span-1 rounded-3xl bg-white border border-black/5 overflow-hidden shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl p-8 flex flex-col justify-between">
              <div className="w-full mt-4 mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-mono text-xs text-charcoal/50 font-semibold">Grosor / GSM</span>
                  <span className="font-mono gap-1 font-bold text-charcoal text-xl flex items-baseline">
                    <span className="block tabular-nums transition-all">180</span>
                    <span className="text-xs text-charcoal/40 font-normal">→ 350+</span>
                  </span>
                </div>
                <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden relative border border-black/5">
                  <div className="absolute top-0 left-0 h-full w-[40%] bg-black/10 rounded-full"></div>
                  <div className="absolute top-0 left-0 h-full w-[40%] bg-charcoal rounded-full origin-left group-hover:w-[95%] transition-all duration-1000 ease-out"></div>
                </div>
              </div>

              <div className="relative z-20">
                <div className="w-12 h-12 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center mb-6 text-charcoal">
                  <Shirt size={24} />
                </div>
                <h3 className="text-2xl font-bold font-sans text-charcoal mb-2">Algodón Premium</h3>
                <p className="text-charcoal/60">Telas de alto gramaje que resisten lavados y mantienen su forma.</p>
              </div>
            </div>

            {/* Card 3: Al por mayor */}
            <div className="bento-card relative col-span-1 md:col-span-3 rounded-3xl bg-[#1A1A1A] border border-black/10 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">

              {/* Texto izquierdo */}
              <div className="flex-shrink-0 md:w-80 relative z-20">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 text-white">
                  <PackageOpen size={24} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold font-sans text-white mb-4">Diseños Personalizados al por Mayor</h3>
                <p className="text-white/70 text-base mb-4">Ideal para retiros espirituales, iglesias o ministerios enteros. Adaptamos el diseño a la visión de tu congregación.</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2.5 rounded-full bg-white text-[#1A1A1A] text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  Solicitar Cotización
                </button>
              </div>

              {/* Galería acordeón */}
              <div className="flex flex-1 gap-3 h-48 md:h-56 w-full overflow-hidden rounded-2xl">
                {[
                  { src: "/imagenes_personalizados/pers_campamento_jovenes.jpg", label: "Campamento" },
                  { src: "/imagenes_personalizados/pers_eventos_especiales.jpg", label: "Eventos especiales" },
                  { src: "/imagenes_personalizados/pers_equipos_multimedia.jpg", label: "Equipos de servicio" },
                ].map(({ src, label }) => (
                  <div
                    key={label}
                    className="relative overflow-hidden rounded-xl flex-1 min-w-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:flex-[3]"
                  >
                    <Image
                      src={src}
                      alt={label}
                      fill
                      className="object-cover grayscale brightness-75 hover:brightness-90 transition-all duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-0 right-0 text-center text-white text-[10px] font-mono font-semibold tracking-widest uppercase px-2 leading-tight">
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
