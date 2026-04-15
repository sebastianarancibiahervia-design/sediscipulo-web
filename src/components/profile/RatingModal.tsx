"use client";

import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle2, Send } from "lucide-react";
import Image from "next/image";
import StarRating from "../store/StarRating";
import { 
  fetchReviewableProducts, 
  submitProductReview 
} from "@/lib/store/storeServices";

interface RatingModalProps {
  clientId: string;
  onClose: () => void;
}

interface ReviewableProduct {
  id_tienda: string;
  producto_tienda: string;
  imagen_url: string;
  variacion_texto?: string;
}

export default function RatingModal({ clientId, onClose }: RatingModalProps) {
  const [products, setProducts] = useState<ReviewableProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchReviewableProducts(clientId);
      setProducts(data);
      setLoading(false);
    }
    load();
  }, [clientId]);

  const handleSubmit = async (idTienda: string) => {
    const stars = ratings[idTienda];
    if (!stars) {
      setErrors(prev => ({ ...prev, [idTienda]: "Selecciona una calificación" }));
      return;
    }

    setSubmitting(idTienda);
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[idTienda];
      return copy;
    });

    const result = await submitProductReview(
      idTienda,
      clientId,
      stars,
      comments[idTienda] || ""
    );

    if (result.success) {
      setSubmitted(prev => new Set(prev).add(idTienda));
    } else {
      setErrors(prev => ({ ...prev, [idTienda]: result.error || "Error al enviar" }));
    }
    setSubmitting(null);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden border border-black/10 animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-sans font-bold text-charcoal">Calificar Productos</h3>
              <p className="text-sm text-charcoal/50 mt-1">Comparte tu experiencia con otros compradores</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-charcoal/40 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="py-16 flex justify-center">
              <Loader2 className="animate-spin text-charcoal/20" size={32} />
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 size={48} className="mx-auto text-green-400 mb-4" />
              <p className="text-charcoal/60 font-medium">¡Ya calificaste todos tus productos!</p>
              <p className="text-xs text-charcoal/30 mt-2">Gracias por compartir tu opinión</p>
            </div>
          ) : (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
              {products.map((product) => {
                const isSubmitted = submitted.has(product.id_tienda);
                const isCurrentlySubmitting = submitting === product.id_tienda;

                return (
                  <div
                    key={product.id_tienda}
                    className={`p-5 rounded-2xl border transition-all ${
                      isSubmitted
                        ? "bg-green-50/50 border-green-100"
                        : "bg-neutral-50 border-black/5 hover:border-black/10"
                    }`}
                  >
                    <div className="flex gap-4 items-start">
                      {/* Product Image */}
                      <div className="relative w-16 h-20 bg-white rounded-xl overflow-hidden border border-black/5 flex-shrink-0">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_CRM_BASE_URL}${product.imagen_url || '/placeholder.png'}`}
                          alt={product.producto_tienda}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info + Rating */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="font-bold text-charcoal text-sm leading-tight mb-0.5 truncate flex-shrink-0" title={product.producto_tienda}>
                          {product.producto_tienda}
                        </h4>
                        {product.variacion_texto && (
                          <p className="text-[10px] text-charcoal/40 font-mono mb-2 truncate" title={product.variacion_texto}>
                            {product.variacion_texto}
                          </p>
                        )}
                        <div className={!product.variacion_texto ? "mt-2" : ""}>

                        {isSubmitted ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 size={16} />
                            <span className="text-sm font-medium">¡Calificación enviada!</span>
                          </div>
                        ) : (
                          <>
                            {/* Star selector */}
                            <div className="mb-3">
                              <StarRating
                                value={ratings[product.id_tienda] || 0}
                                interactive
                                onChange={(val) =>
                                  setRatings((prev) => ({ ...prev, [product.id_tienda]: val }))
                                }
                                size={22}
                              />
                            </div>

                            {/* Comment */}
                            <textarea
                              rows={2}
                              placeholder="Escribe un comentario (opcional)..."
                              value={comments[product.id_tienda] || ""}
                              onChange={(e) =>
                                setComments((prev) => ({
                                  ...prev,
                                  [product.id_tienda]: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 bg-white border border-black/10 rounded-xl text-sm text-charcoal placeholder:text-charcoal/20 focus:ring-2 focus:ring-charcoal/10 outline-none resize-none transition-all"
                            />

                            {errors[product.id_tienda] && (
                              <p className="text-red-500 text-xs mt-1.5 font-medium">
                                {errors[product.id_tienda]}
                              </p>
                            )}

                            {/* Submit */}
                            <button
                              onClick={() => handleSubmit(product.id_tienda)}
                              disabled={isCurrentlySubmitting}
                              className="mt-3 px-5 py-2 bg-charcoal text-white rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50 shadow-md shadow-black/5"
                            >
                              {isCurrentlySubmitting ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Send size={14} />
                              )}
                              Enviar Calificación
                            </button>
                          </>
                        )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
