"use client";

import Link from "next/link";
import { ChevronLeft, Mail, MessageCircle } from "lucide-react";

export default function NoDisponiblePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md">
        <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-8 text-charcoal/20">
          <Mail size={40} />
        </div>
        <h1 className="text-3xl font-sans font-bold text-charcoal mb-4">Producto no disponible para <span className="font-serif italic text-black">compra directa</span></h1>
        <p className="text-charcoal/60 mb-8">
          Este producto es personalizado o ya no se encuentra en nuestro catálogo de tienda inmediata. 
          Pero no te preocupes, ¡aún podemos fabricarlo para ti!
        </p>
        
        <div className="bg-neutral-50 rounded-3xl p-8 border border-black/5 mb-8">
          <p className="text-sm font-medium text-charcoal mb-4">Para adquirir este producto, contáctanos directamente:</p>
          <div className="space-y-4">
            <a 
              href="mailto:sediscipulo@agenciatab.cl" 
              className="flex items-center justify-center gap-3 w-full py-3 bg-charcoal text-white rounded-xl font-bold hover:bg-black transition-all"
            >
              <Mail size={18} /> sediscipulo@agenciatab.cl
            </a>
            <a 
              href="https://wa.me/56933473640" 
              target="_blank"
              className="flex items-center justify-center gap-3 w-full py-3 border border-charcoal/20 text-charcoal rounded-xl font-medium hover:bg-black/5 transition-all"
            >
              <MessageCircle size={18} /> Contactar por WhatsApp
            </a>
          </div>
        </div>

        <Link href="/tienda" className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors font-medium">
          <ChevronLeft size={16} /> Volver a la Tienda
        </Link>
      </div>
    </div>
  );
}
