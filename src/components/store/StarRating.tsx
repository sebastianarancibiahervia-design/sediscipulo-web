"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  max?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  size?: number;
}

export default function StarRating({ 
  value, 
  max = 5, 
  interactive = false, 
  onChange, 
  size = 16 
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = interactive && hoverValue > 0 ? hoverValue : value;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1;
        const isFilled = starIndex <= displayValue;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starIndex)}
            onMouseEnter={() => interactive && setHoverValue(starIndex)}
            onMouseLeave={() => interactive && setHoverValue(0)}
            className={`transition-all duration-150 ${
              interactive 
                ? 'cursor-pointer hover:scale-125 active:scale-95' 
                : 'cursor-default'
            }`}
          >
            <Star
              size={size}
              className={`transition-colors duration-150 ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : interactive && hoverValue > 0
                    ? 'fill-amber-100 text-amber-200'
                    : 'fill-transparent text-black/10'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
