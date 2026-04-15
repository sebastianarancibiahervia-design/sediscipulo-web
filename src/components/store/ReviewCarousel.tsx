"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { ProductReview } from "@/lib/store/storeServices";
import StarRating from "./StarRating";

interface ReviewCarouselProps {
  reviews: ProductReview[];
}

export default function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!reviews.length) return null;

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 350);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mt-16 pt-12 border-t border-black/5">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[10px] font-bold text-charcoal/30 uppercase tracking-[0.2em] mb-1">
            Opiniones de Clientes
          </h3>
          <p className="text-sm text-charcoal/40">
            {reviews.length} {reviews.length === 1 ? "calificación" : "calificaciones"}
          </p>
        </div>

        {reviews.length > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2.5 rounded-xl border transition-all ${
                canScrollLeft
                  ? "border-black/10 hover:bg-black/5 text-charcoal"
                  : "border-black/5 text-charcoal/15 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2.5 rounded-xl border transition-all ${
                canScrollRight
                  ? "border-black/10 hover:bg-black/5 text-charcoal"
                  : "border-black/5 text-charcoal/15 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex-shrink-0 w-[320px] p-6 bg-neutral-50 rounded-2xl border border-black/5 snap-start hover:border-black/10 transition-all group"
          >
            {/* Header: Name + Date */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold text-charcoal text-sm leading-tight">
                  {review.cliente_nombre}
                </p>
                <p className="text-[10px] font-mono text-charcoal/30 mt-0.5">
                  {formatDate(review.created_at)}
                </p>
                {review.variacion_texto && (
                  <p className="text-[9px] font-mono font-medium text-charcoal/40 mt-1 uppercase tracking-wider">
                    {review.variacion_texto}
                  </p>
                )}
              </div>
              <Quote
                size={18}
                className="text-charcoal/5 group-hover:text-charcoal/10 transition-colors flex-shrink-0"
              />
            </div>

            {/* Stars */}
            <div className="mb-4">
              <StarRating value={review.stars} size={14} />
            </div>

            {/* Comment */}
            {review.comment && (
              <p className="text-sm text-charcoal/60 leading-relaxed line-clamp-4">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
