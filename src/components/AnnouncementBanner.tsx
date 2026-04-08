"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();

  if (!visible) return null;
  if (pathname === "/" || pathname === "/home-preview") return null;

  return (
    <div className="relative z-50 w-full bg-black text-white py-2.5 px-4 flex items-center justify-center gap-3 text-sm font-medium tracking-wide">
      {/* Texto con loop infinito */}
      <div className="overflow-hidden flex items-center gap-6 whitespace-nowrap">
        <span className="font-mono text-xs text-white/50 uppercase tracking-widest hidden sm:inline">
          🌿
        </span>
        <span className="font-sans text-sm text-white/90">
          Envío gratis en compras sobre{" "}
          <span className="text-white font-semibold">$39.990</span>
          {" "}— Solo por tiempo limitado
        </span>
        <span className="hidden sm:inline text-white/30">•</span>
        <span className="hidden sm:inline font-sans text-sm text-white/70 italic">
          Diseñado para quienes viven su fe.
        </span>
      </div>

      {/* Botón cerrar */}
      <button
        onClick={() => setVisible(false)}
        aria-label="Cerrar banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
      >
        <X size={14} />
      </button>
    </div>
  );
}
