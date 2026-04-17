"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GroupedProduct, fetchActivePromotions, Promocion, fetchProductReviews, ProductReview, fetchRelatedProductsByName } from "@/lib/store/storeServices";
import ProductCard, { getProductImageUrl } from "./ProductCard";
import { useCart } from "../CartProvider";
import StarRating from "./StarRating";
import ReviewCarousel from "./ReviewCarousel";

export default function ProductDetailClient({ product }: { product: GroupedProduct }) {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const [activePromos, setActivePromos] = useState<Promocion[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<GroupedProduct[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  useEffect(() => {
    async function loadPromos() {
      const data = await fetchActivePromotions();
      setActivePromos(data);
    }
    loadPromos();
  }, []);

  // Fetch reviews for all variations of this product
  useEffect(() => {
    async function loadReviews() {
      const variationIds = product.variations.map(v => v.id);
      const data = await fetchProductReviews(variationIds);
      setReviews(data);
    }
    loadReviews();
  }, [product.variations]);

  // Fetch related products
  useEffect(() => {
    async function loadRelated() {
      setLoadingRelated(true);
      const data = await fetchRelatedProductsByName(product.name, 3);
      setRelatedProducts(data);
      setLoadingRelated(false);
    }
    loadRelated();
  }, [product.name]);

  const isLibreria = product.families.includes("LIBRERIA");
  
  // Review stats
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length
    : 0;
  
  // Extract unique variation combinations
  const uniqueGarmentColors = Array.from(new Set(product.variations.map(v => v.inventario_base?.color).filter(Boolean))) as string[];
  const uniqueSizes = Array.from(new Set(product.variations.map(v => v.inventario_base?.talla).filter(Boolean))) as string[];
  
  const queryColor = searchParams.get("colorPrenda");
  const querySize = searchParams.get("talla");
  const queryDesign = searchParams.get("colorDiseno");

  const [selectedColor, setSelectedColor] = useState<string>(queryColor || uniqueGarmentColors[0] || "");
  const [selectedSize, setSelectedSize] = useState<string>(querySize || uniqueSizes[0] || "");
  const [selectedDesignColor, setSelectedDesignColor] = useState<string>(queryDesign || "");

  const uniqueDesignColors = useMemo(() => {
    const variationsForColor = product.variations.filter(v => 
      v.inventario_base?.color === selectedColor
    );
    return Array.from(new Set(variationsForColor.map(v => v.disenos?.color).filter(Boolean))) as string[];
  }, [product.variations, selectedColor]);

  useEffect(() => {
    if (uniqueDesignColors.length > 0) {
      if (!uniqueDesignColors.includes(selectedDesignColor)) {
        setSelectedDesignColor(uniqueDesignColors[0]);
      }
    } else {
      setSelectedDesignColor("");
    }
  }, [uniqueDesignColors, selectedDesignColor]);

  // Find the matching variation
  const matchedVariation = useMemo(() => {
    // For LIBRERIA: always use the first (and only) variation
    if (isLibreria) return product.variations[0] || null;
    
    return product.variations.find(v => 
      v.inventario_base?.color === selectedColor &&
      v.inventario_base?.talla === selectedSize &&
      (uniqueDesignColors.length === 0 || v.disenos?.color === selectedDesignColor)
    );
  }, [product, selectedColor, selectedSize, selectedDesignColor, uniqueDesignColors.length, isLibreria]);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    const initialPath = matchedVariation?.imagen_url || product.imagePrincipal;
    if (initialPath) {
      setActiveImage(getProductImageUrl(initialPath));
    }
  }, [product.imagePrincipal, matchedVariation?.imagen_url]);

  useEffect(() => {
    if (matchedVariation?.imagen_url) {
      setActiveImage(getProductImageUrl(matchedVariation.imagen_url));
    }
  }, [matchedVariation]);

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
  const ctaVariation = isLibreria ? product.variations[0] : matchedVariation;

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
              <Image 
                src={activeImage} 
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
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
                <Image 
                  src={getProductImageUrl(matchedVariation.imagen_url)} 
                  alt="Vista 1" 
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
              <button 
                onClick={() => setActiveImage(getProductImageUrl(matchedVariation.imagen_url_2!))}
                className={`w-20 h-24 relative rounded-xl overflow-hidden border-2 ${activeImage === getProductImageUrl(matchedVariation.imagen_url_2!) ? 'border-charcoal' : 'border-transparent'}`}
              >
                <Image 
                  src={getProductImageUrl(matchedVariation.imagen_url_2!)} 
                  alt="Vista 2" 
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-4xl lg:text-5xl font-sans font-bold text-charcoal mb-3 tracking-tight">{product.name}</h1>
          
          {/* Star Rating Summary */}
          {reviews.length > 0 && (
            <div className="flex items-center gap-2.5 mb-4">
              <StarRating value={Math.round(avgRating)} size={16} />
              <span className="text-sm text-charcoal/40 font-medium">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-xs text-charcoal/30">
                ({reviews.length} {reviews.length === 1 ? 'calificación' : 'calificaciones'})
              </span>
            </div>
          )}

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
            <p className="whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* Variation Selectors — only for non-LIBRERIA */}
          <div className="space-y-8 flex-1">
            {!isLibreria && (
              <>
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
              </>
            )}
          </div>

          {/* CTA */}
          <div className="mt-12 pt-8 border-t border-black/10">
            <button 
              disabled={!ctaVariation}
              onClick={() => {
                if (ctaVariation) {
                  addToCart({
                    id: String(ctaVariation.id),
                    name: product.name,
                    price: currentPrice,
                    image: activeImage || getProductImageUrl(product.imagePrincipal),
                    base: ctaVariation.inventario_base?.color || "",
                    diseno: ctaVariation.disenos?.color || "",
                    talla: ctaVariation.inventario_base?.talla || "",
                    quantity: 1
                  });
                }
              }}
              className={`w-full py-4 rounded-xl font-bold transition-colors ${
                ctaVariation
                  ? 'bg-charcoal text-white hover:bg-black shadow-lg hover:shadow-xl'
                  : 'bg-neutral-200 text-charcoal/40 cursor-not-allowed'
              }`}
            >
              {ctaVariation ? 'Agregar al Carrito' : 'Agotado en esta combinación'}
            </button>
          </div>
        </div>
      </div>

      {/* Video Section — Full Width, OUTSIDE the grid */}
      {product.url_video && product.url_video.trim() !== "" && (
        <div className="mt-16 pt-12 border-t border-black/5">
          <h3 className="text-[10px] font-bold text-charcoal/30 uppercase tracking-[0.2em] mb-6">
            Mensaje del Autor
          </h3>
          <div className="w-full max-w-4xl mx-auto">
            <div 
              className="relative w-full overflow-hidden rounded-2xl bg-black shadow-2xl border border-black/10"
              style={{ paddingBottom: '56.25%' }}
            >
              <VideoEmbed url={product.url_video.trim()} />
            </div>
          </div>
        </div>
      )}

      {/* Reviews Carousel — Full Width, OUTSIDE the grid */}
      <ReviewCarousel reviews={reviews} />

      {/* Related Products Section */}
      <div className="mt-20 pt-16 border-t border-black/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-charcoal">
              Nuestros clientes también se <span className="font-serif italic text-black">llevaron</span>
            </h2>
          </div>
          <Link 
            href="/tienda" 
            className="text-sm font-bold text-charcoal/40 hover:text-charcoal transition-colors flex items-center gap-2 group"
          >
            Ver catálogo completo <ChevronLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loadingRelated ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/5] bg-neutral-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.slug} producto={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Componente dedicado para embeber videos de Facebook Reels y YouTube.
 */
function VideoEmbed({ url }: { url: string }) {
  // ── YouTube ──
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('/shorts/')) {
      videoId = url.split('/shorts/')[1].split('?')[0];
    }
    
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        className="absolute top-0 left-0 w-full h-full"
        style={{ border: 'none' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  // ── Facebook ──
  if (url.includes('facebook.com')) {
    const reelMatch = url.match(/reel\/(\d+)/);
    const videoUrl = reelMatch
      ? `https://www.facebook.com/watch/?v=${reelMatch[1]}`
      : url;

    return (
      <iframe
        src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&width=1280&height=720&show_text=false`}
        className="absolute top-0 left-0 w-full h-full"
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  // ── Formato no soportado ──
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white/30 text-sm font-mono p-8 text-center">
      Formato de video no reconocido.<br />Soporta Facebook Reels y YouTube.
    </div>
  );
}
