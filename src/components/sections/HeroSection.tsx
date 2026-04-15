"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { GroupedProduct } from "@/lib/store/storeServices";
import { getProductImageUrl } from "@/components/store/ProductCard";

gsap.registerPlugin(ScrollTrigger);

const RANK_LABELS = [
  { rank: "#1", desc: "Más Vendido" },
  { rank: "#2", desc: "Más Popular" },
  { rank: "#3", desc: "Favorito del Mes" },
];

const FALLBACK: GroupedProduct = {
  name: "Maranata Back Oversized",
  slug: "maranata-back-oversized",
  price: 0,
  categories: [],
  subcategories: [],
  families: [],
  url_video: "",
  description: "",
  imagePrincipal: "/maranata-back.jpg",
  totalSales: 0,
  variations: [],
};

export default function HeroSection({
  topProducts,
}: {
  topProducts: GroupedProduct[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAlt, setShowAlt] = useState(false); // false = "SeDiscipulo", true = "verdad bíblica"
  const [textFading, setTextFading] = useState(false);

  const displayProducts =
    topProducts.length > 0 ? topProducts.slice(0, 3) : [FALLBACK];
  const numProducts = displayProducts.length;

  // ── Texto alternante cada ~1 segundo ──────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setTextFading(true);
      setTimeout(() => {
        setShowAlt((prev) => !prev);
        setTextFading(false);
      }, 250);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // ── ScrollTrigger: cambia producto según progreso del scroll ───────────────
  useEffect(() => {
    if (!sectionRef.current || numProducts <= 1) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const idx = Math.min(
          Math.floor(self.progress * numProducts),
          numProducts - 1
        );
        setActiveIndex(idx);
      },
    });

    return () => st.kill();
  }, [numProducts]);

  // ── Animación de entrada ───────────────────────────────────────────────────
  useEffect(() => {
    gsap.fromTo(
      ".hero-element",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" }
    );
  }, []);

  return (
    // Outer wrapper: N×100vh para que el sticky tenga recorrido de scroll
    <div
      ref={sectionRef}
      style={{ height: `${numProducts * 100}vh` }}
      className="relative bg-charcoal"
    >
      {/* ── Contenedor sticky pinned ─────────────────────────────────────── */}
      <div className="sticky top-0 h-screen overflow-hidden bg-charcoal">

        {/* Fondos: imagen de cada producto, se intercambian con fade */}
        <div className="absolute inset-0 z-0">
          {displayProducts.map((product, i) => {
            const url = getProductImageUrl(product.imagePrincipal);
            return (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  i === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                {url && !url.endsWith("/") && (
                  <Image
                    src={url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority={i === 0}
                    sizes="100vw"
                  />
                )}
              </div>
            );
          })}
          {/* Gradientes sobre la imagen */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/30 to-charcoal/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/20 to-transparent" />
        </div>

        {/* Glow ambiental */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none z-0" />

        {/* ── Contenido principal ────────────────────────────────────────── */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-20 gap-10 md:gap-14">

          {/* Columna izquierda: texto */}
          <div className="max-w-2xl">
            <h1 className="hero-element text-5xl md:text-7xl font-sans font-bold text-white leading-tight mb-6 tracking-tight">
              Vístete con{" "}
              <span
                className={`inline-block transition-all duration-[250ms] ease-in-out font-serif italic text-white/90 font-medium tracking-wide ${
                  textFading
                    ? "opacity-0 translate-y-1"
                    : "opacity-100 translate-y-0"
                }`}
              >
                {showAlt ? "verdad bíblica" : "SeDiscipulo"}
              </span>
            </h1>

            <p className="hero-element text-base md:text-lg text-white/60 mb-8 max-w-xl leading-relaxed font-light">
              No es solo vestimenta — es un testimonio vivo que acompaña tu
              caminar con materiales de calidad y diseños con propósito.
            </p>

            <div className="hero-element flex flex-wrap gap-3">
              <Link
                href="/tienda"
                className="group flex items-center gap-2 px-6 py-3.5 bg-white text-charcoal rounded-xl text-sm font-semibold transition-all hover:bg-neutral-100 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <ShoppingCart size={16} />
                Ir a la Tienda
              </Link>
              <Link
                href="/nosotros"
                className="group flex items-center gap-3 px-6 py-3.5 bg-white/10 text-white border border-skin/30 rounded-xl text-sm font-medium backdrop-blur-sm transition-all hover:bg-white/20 hover:border-skin/60"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-skin/20 text-skin group-hover:bg-skin transition-colors">
                  <ArrowRight size={10} className="group-hover:text-charcoal transition-colors" />
                </span>
                Conócenos
              </Link>
            </div>
          </div>

          {/* Indicadores de productos (visibles si hay más de 1) */}
          {numProducts > 1 && (
            <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-6">
              {displayProducts.map((product, i) => {
                const isActive = i === activeIndex;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl backdrop-blur-md border transition-all duration-500 cursor-pointer ${
                      isActive 
                        ? "bg-white/10 border-white/20 shadow-lg" 
                        : "bg-black/20 border-white/5 opacity-60 hover:opacity-100 hover:bg-black/40"
                    }`}
                    onClick={() => setActiveIndex(i)}
                  >
                    {/* Círculo del número */}
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-bold transition-all duration-500 ${
                        isActive
                          ? "bg-white text-charcoal shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {i + 1}
                    </div>
                    {/* Textos */}
                    <div className={isActive ? "block" : "hidden sm:block"}>
                      <p className={`font-mono text-[9px] uppercase tracking-widest transition-colors ${isActive ? 'text-white/90' : 'text-white/60'}`}>
                        {RANK_LABELS[i]?.rank} {RANK_LABELS[i]?.desc}
                      </p>
                      <p className={`font-sans text-sm font-semibold truncate max-w-[140px] transition-colors ${isActive ? 'text-white' : 'text-white/80'}`}>
                        {product.name.split(' - ')[0]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Tarjeta del producto activo (Desktop) ─────────────────── */}
        <div className="hidden md:block absolute bottom-14 right-14 z-20 w-[240px] aspect-[3/4]">
          {displayProducts.map((product, i) => {
            const url = getProductImageUrl(product.imagePrincipal);
            const isActive = i === activeIndex;
            return (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-700 ease-in-out rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-charcoal ${
                  isActive
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : i < activeIndex
                    ? "opacity-0 translate-y-6 pointer-events-none"
                    : "opacity-0 -translate-y-6 pointer-events-none"
                }`}
              >
                {url && !url.endsWith("/") ? (
                  <Image
                    src={url}
                    alt={product.name}
                    fill
                    className="object-cover opacity-90"
                    sizes="240px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                    <p className="text-xs font-mono text-white/20 uppercase text-center">
                      Sin imagen
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-outfit text-sm font-bold text-white mb-2 line-clamp-2">
                    {product.name}
                  </p>
                  <Link
                    href={`/tienda/${product.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors border-b border-white/20 pb-0.5"
                  >
                    Ver Producto <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Botón del producto activo (Mobile) ─────────────────── */}
        <div className="absolute md:hidden bottom-8 left-4 right-4 z-20 h-[60px]">
          {displayProducts.map((product, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center justify-between px-4 py-3 bg-charcoal/80 backdrop-blur-md rounded-xl border border-white/10 shadow-lg ${
                  isActive
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <div className="flex-1 overflow-hidden pr-3">
                  <p className="font-outfit text-sm font-bold text-white truncate">
                    {product.name}
                  </p>
                  <p className="text-[10px] text-white/60 font-mono tracking-widest uppercase">
                    Ver detalles
                  </p>
                </div>
                <Link
                  href={`/tienda/${product.slug}`}
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white text-charcoal rounded-full hover:bg-neutral-200 transition-colors"
                >
                  <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* ── Barra de progreso (bottom) ─────────────────────────────────── */}
        {numProducts > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
            <div
              className="h-full bg-skin transition-all duration-500 ease-out"
              style={{ width: `${((activeIndex + 1) / numProducts) * 100}%` }}
            />
          </div>
        )}

        {/* ── Hint de scroll (solo si no estás en el último producto) ────── */}
        {numProducts > 1 && activeIndex < numProducts - 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">
              scroll
            </span>
            <div className="w-px h-4 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}
