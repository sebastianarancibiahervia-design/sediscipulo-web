"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ShoppingCart, Check, ShieldCheck, Undo2, Truck, Plus, Minus } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import gsap from "gsap";

const TALLAS = ["XS", "S", "M", "L", "XL", "2XL"];
const COLORES_BASE = ["Negro"];

const COLORES_DISENO: Record<string, string[]> = {
  Negro: ["Color", "Blanco y Negro"],
};

const getImagePath = (diseno: string, view: 'front' | 'back') => {
  const d = diseno.toLowerCase();

  if (d === 'blanco y negro' || d === 'baw') return `/catalogo/genesis315_hoodie_acidwash/black_color_${view}.png`; // fallback to color since baw wasn't provided
  if (d === 'color') return `/catalogo/genesis315_hoodie_acidwash/black_color_${view}.png`;

  return `/catalogo/genesis315_hoodie_acidwash/black_color_${view}.png`;
};

export default function ProductPage() {
  const { addToCart } = useCart();
  const [selectedTalla, setSelectedTalla] = useState<string>("L");
  const [selectedBase, setSelectedBase] = useState<string>("Negro");
  const [selectedDiseno, setSelectedDiseno] = useState<string>("Color");
  const [selectedView, setSelectedView] = useState<'front' | 'back'>('front');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // When base color changes, ensure design color is valid
  useEffect(() => {
    if (!COLORES_DISENO[selectedBase].includes(selectedDiseno)) {
      setSelectedDiseno(COLORES_DISENO[selectedBase][0]);
    }
  }, [selectedBase, selectedDiseno]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".product-anim", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleAddToCart = () => {
    setIsAdding(true);

    addToCart({
      id: `g315-hoodie-${selectedBase}-${selectedDiseno}-${selectedTalla}`.toLowerCase().replace(/ /g, '-'),
      name: "Genesis 3:15 - Hoodie Acid Wash",
      price: 24000,
      image: getImagePath(selectedDiseno, selectedView),
      base: selectedBase,
      diseno: selectedDiseno,
      talla: selectedTalla,
      quantity,
    });

    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div ref={containerRef} className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="product-anim flex items-center gap-2 text-sm text-charcoal/50 font-mono mb-8">
          <a href="/tienda" className="hover:text-charcoal transition-colors">Tienda</a>
          <span>/</span>
          <span className="text-charcoal font-semibold">Genesis 3:15 - Hoodie Acid Wash</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left Column: Image Gallery */}
          <div className="product-anim sticky top-32">
            <div className="relative aspect-[4/5] bg-neutral-100 rounded-3xl overflow-hidden border border-black/5 shadow-sm">
              <Image
                src={getImagePath(selectedDiseno, selectedView)}
                alt={`Genesis 3:15 Hoodie Acid Wash vista ${selectedView}`}
                fill
                className="object-cover object-center transition-all duration-700 hover:scale-105"
              />

              <div className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-xs font-mono text-charcoal shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                PREMIUM
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div onClick={() => setSelectedView('front')} className={`aspect-[4/5] rounded-xl bg-neutral-100 border ${selectedView === 'front' ? 'border-charcoal' : 'border-black/5 hover:border-black/20'} overflow-hidden relative cursor-pointer transition-all`}>
                <Image
                  src={getImagePath(selectedDiseno, 'front')}
                  alt="Thumbnail Front"
                  fill
                  className={`object-cover transition-opacity duration-300 ${selectedView === 'front' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                />
              </div>
              <div onClick={() => setSelectedView('back')} className={`aspect-[4/5] rounded-xl bg-neutral-100 border ${selectedView === 'back' ? 'border-charcoal' : 'border-black/5 hover:border-black/20'} overflow-hidden relative cursor-pointer transition-all`}>
                <Image
                  src={getImagePath(selectedDiseno, 'back')}
                  alt="Thumbnail Back"
                  fill
                  className={`object-cover transition-opacity duration-300 ${selectedView === 'back' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="product-anim flex flex-col pt-4">
            <h1 className="text-4xl md:text-5xl font-sans font-bold text-charcoal mb-4">
              Genesis 3:15 <span className="font-serif italic text-black font-medium block mt-2">Hoodie Acid Wash</span>
            </h1>
            <p className="text-2xl font-mono font-semibold text-charcoal mb-6">$24.000 <span className="text-sm text-charcoal/40 font-normal">CLP</span></p>

            <p className="text-charcoal/70 text-lg mb-10 leading-relaxed">
              El hoodie perfecto para aquellos que valoran el estilo profundo. Efecto acid wash vintage, diseño basado en la promesa del Génesis, con una capucha amplia y bolsillo tipo canguro. Construido con la mayor tecnología DTF para resiliencia gráfica extrema.
            </p>

            <div className="space-y-8 mb-12">
              {/* Color Base Selector */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-sm text-charcoal font-semibold uppercase tracking-wider">Color Base</span>
                  <span className="text-sm text-charcoal/60">{selectedBase}</span>
                </div>
                <div className="flex gap-4">
                  {COLORES_BASE.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedBase(color)}
                      className={`relative w-full py-4 px-6 rounded-2xl border ${selectedBase === color ? 'border-charcoal bg-black/5' : 'border-black/10 bg-white'} transition-all hover:border-black/30 flex items-center justify-center`}
                    >
                      <span className="font-medium text-charcoal">{color}</span>
                      {selectedBase === color && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-charcoal rounded-full flex items-center justify-center">
                          <Check size={8} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Diseño Selector */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-sm text-charcoal font-semibold uppercase tracking-wider">Color Diseño</span>
                  <span className="text-sm text-charcoal/60">{selectedDiseno}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {COLORES_DISENO[selectedBase].map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedDiseno(color)}
                      className={`px-5 py-2.5 rounded-xl border ${selectedDiseno === color ? 'border-charcoal bg-charcoal text-white shadow-md' : 'border-black/10 bg-white text-charcoal'} transition-all hover:bg-black/5 hover:text-charcoal font-medium`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tallas Selector */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-sm text-charcoal font-semibold uppercase tracking-wider">Talla</span>
                  <a href="#" className="text-sm text-charcoal/50 hover:text-charcoal underline decoration-black/20 underline-offset-4 transition-colors">Guía de tallas</a>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {TALLAS.map(talla => (
                    <button
                      key={talla}
                      onClick={() => setSelectedTalla(talla)}
                      className={`py-3 rounded-xl border font-mono text-lg transition-all ${selectedTalla === talla ? 'border-charcoal bg-charcoal text-white shadow-md' : 'border-black/10 text-charcoal hover:border-black/30'}`}
                    >
                      {talla}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cantidad Selector */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-sm text-charcoal font-semibold uppercase tracking-wider">Cantidad</span>
                </div>
                <div className="flex items-center justify-between border border-black/10 rounded-xl bg-white w-32 p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-black/5 rounded-lg transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-mono font-medium text-lg w-8 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-black/5 rounded-lg transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Container */}
            <div className="bg-neutral-50 p-6 rounded-3xl border border-black/5 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold transition-all shadow-sm ${isAdding ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(5,150,105,0.3)] scale-[0.98]' : 'bg-charcoal text-white hover:bg-black hover:scale-[1.01] hover:shadow-xl active:scale-95'}`}
              >
                {isAdding ? (
                  <>
                    <Check size={22} className="animate-bounce" />
                    ¡Agregado al Carrito!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={22} />
                    Añadir al Carrito — ${(24000 * quantity).toLocaleString('es-CL')}
                  </>
                )}
              </button>
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-black/5 text-charcoal">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal">Calidad Premium</h4>
                  <p className="text-charcoal/60 mt-1">Confección en algodón grueso de exportación.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-black/5 text-charcoal">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal">Envíos Rápidos</h4>
                  <p className="text-charcoal/60 mt-1">Despachamos a todo Chile en 48 hrs hábiles.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <div className="p-2 rounded-lg bg-black/5 text-charcoal">
                  <Undo2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal">Garantía de Satisfacción</h4>
                  <p className="text-charcoal/60 mt-1">Si la talla no te queda, ofrecemos cambios sin costo durante los primeros 10 días.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
