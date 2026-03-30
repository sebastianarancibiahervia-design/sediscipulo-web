"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GroupedProduct, fetchActivePromotions, Promocion } from "@/lib/store/storeServices";
import { getProductImageUrl } from "./ProductCard";
import { useCart } from "../CartProvider";

export default function ProductDetailClient({ product }: { product: GroupedProduct }) {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const [activePromos, setActivePromos] = useState<Promocion[]>([]);

  useEffect(() => {
    async function loadPromos() {
      const data = await fetchActivePromotions();
      setActivePromos(data);
    }
    loadPromos();
  }, []);
  
  // Extract unique variation combinations
  const uniqueGarmentColors = Array.from(new Set(product.variations.map(v => v.inventario_base?.color).filter(Boolean))) as string[];
  const uniqueSizes = Array.from(new Set(product.variations.map(v => v.inventario_base?.talla).filter(Boolean))) as string[];
  
  const queryColor = searchParams.get("colorPrenda");
  const querySize = searchParams.get("talla");
  const queryDesign = searchParams.get("colorDiseno");

  // Define default states favoring url query params or fallback to the first available options
  const [selectedColor, setSelectedColor] = useState<string>(queryColor || uniqueGarmentColors[0] || "");
  const [selectedSize, setSelectedSize] = useState<string>(querySize || uniqueSizes[0] || "");
  const [selectedDesignColor, setSelectedDesignColor] = useState<string>(queryDesign || "");

  // Design colors should be based on selected garment color
  const uniqueDesignColors = useMemo(() => {
    const variationsForColor = product.variations.filter(v => 
      v.inventario_base?.color === selectedColor
    );
    return Array.from(new Set(variationsForColor.map(v => v.disenos?.color).filter(Boolean))) as string[];
  }, [product.variations, selectedColor]);

  // Update design color when garment color changes if current isn't valid
  useEffect(() => {
    if (uniqueDesignColors.length > 0) {
      if (!uniqueDesignColors.includes(selectedDesignColor)) {
        setSelectedDesignColor(uniqueDesignColors[0]);
      }
    } else {
      setSelectedDesignColor("");
    }
  }, [uniqueDesignColors]);

  // Find the matching variation
  const matchedVariation = useMemo(() => {
    return product.variations.find(v => 
      v.inventario_base?.color === selectedColor &&
      v.inventario_base?.talla === selectedSize &&
      (uniqueDesignColors.length === 0 || v.disenos?.color === selectedDesignColor)
    );
  }, [product, selectedColor, selectedSize, selectedDesignColor, uniqueDesignColors.length]);

  // Handle active image display
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Initialize active image
  useEffect(() => {
    const initialPath = matchedVariation?.imagen_url || product.imagePrincipal;
    if (initialPath) {
      setActiveImage(getProductImageUrl(initialPath));
    }
  }, [product.imagePrincipal]); // Run once on mount or if product changes

  useEffect(() => {
    if (matchedVariation?.imagen_url) {
      setActiveImage(getProductImageUrl(matchedVariation.imagen_url));
    }
  }, [matchedVariation]);

  // Check if a specific combination exists (so we can gray out unavailable sizes for a color)
  const isVariationAvailable = (color: string, size: string, designColor: string) => {
    return product.variations.some(v => 
      v.inventario_base?.color === color &&
      v.inventario_base?.talla === size &&
      (uniqueDesignColors.length === 0 || v.disenos?.color === designColor)
    );
  };

  const activePromoMatch = useMemo(() => {
    if (!matchedVariation) return null;
    let match = null;
    for (const promo of activePromos) {
      if (!match) {
        match = promo.detalle_promociones?.find(d => d.id_tienda === matchedVariation.id);
      }
    }
    return match || null;
  }, [matchedVariation, activePromos]);

  const currentPrice = activePromoMatch ? activePromoMatch.precio_promocional : product.price;

  return (
    <div className="bg-white">
      <Link href="/tienda" className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors mb-8 text-sm font-medium">
        <ChevronLeft size={16} /> Volver a la Tienda
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] relative bg-neutral-100 rounded-3xl overflow-hidden border border-black/5">
            {activeImage && !activeImage.endsWith('/') ? (
              <img 
                src={activeImage} 
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-12">
                <p className="text-sm font-mono font-bold text-charcoal/20 uppercase tracking-widest leading-relaxed">
                  Imagen en<br/>construcción...
                </p>
                <div className="w-12 h-0.5 bg-black/5 mt-4"></div>
              </div>
            )}
          </div>
          {/* Thumbnails if we have multiple images for the variation */}
          {matchedVariation?.imagen_url_2 && (
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveImage(getProductImageUrl(matchedVariation.imagen_url))}
                className={`w-20 h-24 relative rounded-xl overflow-hidden border-2 ${activeImage === getProductImageUrl(matchedVariation.imagen_url) ? 'border-charcoal' : 'border-transparent'}`}
              >
                <img src={getProductImageUrl(matchedVariation.imagen_url)} alt="Vista 1" className="object-cover w-full h-full" />
              </button>
              <button 
                onClick={() => setActiveImage(getProductImageUrl(matchedVariation.imagen_url_2!))}
                className={`w-20 h-24 relative rounded-xl overflow-hidden border-2 ${activeImage === getProductImageUrl(matchedVariation.imagen_url_2!) ? 'border-charcoal' : 'border-transparent'}`}
              >
                <img src={getProductImageUrl(matchedVariation.imagen_url_2!)} alt="Vista 2" className="object-cover w-full h-full" />
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-4xl lg:text-5xl font-sans font-bold text-charcoal mb-4 tracking-tight">{product.name}</h1>
          <div className="mb-6 flex items-center gap-4">
            <p className="text-2xl font-mono text-charcoal/80">${currentPrice.toLocaleString('es-CL')}</p>
            {activePromoMatch && (
              <p className="text-lg font-mono text-red-500/60 line-through decoration-1">${product.price.toLocaleString('es-CL')}</p>
            )}
            {activePromoMatch && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-md font-mono animate-pulse">OFERTA</span>
            )}
          </div>
          
          <div className="prose prose-sm text-charcoal/60 mb-8 max-w-none">
            <p>{product.description}</p>
          </div>

          <div className="space-y-8 flex-1">
            {/* Color Prenda */}
            {uniqueGarmentColors.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-3">Color de Prenda</h3>
                <div className="flex flex-wrap gap-3">
                  {uniqueGarmentColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                        selectedColor === color 
                          ? 'border-charcoal bg-charcoal text-white' 
                          : 'border-black/10 text-charcoal hover:border-black/30 bg-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Diseño Color */}
            {uniqueDesignColors.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-3">Color de Diseño</h3>
                <div className="flex flex-wrap gap-3">
                  {uniqueDesignColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedDesignColor(color)}
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                        selectedDesignColor === color 
                          ? 'border-charcoal bg-charcoal text-white' 
                          : 'border-black/10 text-charcoal hover:border-black/30 bg-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Talla */}
            {uniqueSizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">Talla</h3>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {uniqueSizes.sort((a,b) => {
                    const order = ["S", "M", "L", "XL", "XXL", "XXXL"];
                    return order.indexOf(a) - order.indexOf(b);
                  }).map(size => {
                    const isAvailable = isVariationAvailable(selectedColor, size, selectedDesignColor);
                    return (
                      <button
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 rounded-lg text-sm font-bold border transition-colors ${
                          selectedSize === size 
                            ? 'border-charcoal bg-charcoal text-white' 
                            : !isAvailable 
                              ? 'border-black/5 text-charcoal/20 bg-neutral-50 cursor-not-allowed'
                              : 'border-black/10 text-charcoal hover:border-black/30 bg-white'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-12 pt-8 border-t border-black/10">
            <button 
              disabled={!matchedVariation}
              onClick={() => {
                if (matchedVariation) {
                  addToCart({
                    id: String(matchedVariation.id),
                    name: product.name,
                    price: currentPrice,
                    image: activeImage || getProductImageUrl(product.imagePrincipal),
                    base: matchedVariation.inventario_base?.color || "",
                    diseno: matchedVariation.disenos?.color || "",
                    talla: matchedVariation.inventario_base?.talla || "",
                    quantity: 1
                  });
                }
              }}
              className={`w-full py-4 rounded-xl font-bold transition-colors ${
                matchedVariation 
                  ? 'bg-charcoal text-white hover:bg-black shadow-lg hover:shadow-xl'
                  : 'bg-neutral-200 text-charcoal/40 cursor-not-allowed'
              }`}
            >
              {matchedVariation ? 'Agregar al Carrito' : 'Agotado en esta combinación'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
