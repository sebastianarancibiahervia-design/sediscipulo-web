"use client";

import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";

export default function ThankYouPersonalizadoPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-xl shadow-green-100/50">
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-sans font-bold text-charcoal">
            ¡Muchas gracias <br />
            <span className="font-serif italic text-black">por cotizar!</span>
          </h1>
          <p className="text-lg text-charcoal/60 leading-relaxed">
            Hemos recibido tu solicitud de pedido personalizado. Nos pondremos en contacto contigo a la brevedad para dar vida a tu proyecto.
          </p>
        </div>

        <div className="pt-8 flex flex-col gap-4">
          <Link 
            href="/tienda" 
            className="flex items-center justify-center gap-3 w-full py-4 bg-charcoal text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <ShoppingBag size={18} /> Explorar la Tienda
          </Link>
          <Link 
            href="/" 
            className="flex items-center justify-center gap-3 w-full py-4 border border-black/5 rounded-2xl font-semibold text-charcoal/60 hover:text-charcoal hover:bg-black/5 transition-all"
          >
            Volver al inicio <ArrowRight size={16} />
          </Link>
        </div>

        <div className="pt-12 border-t border-black/5 mt-12">
          <p className="text-xs text-charcoal/40 font-mono tracking-widest uppercase">
            #SeDiscipulo • Viste con Propósito
          </p>
        </div>
      </div>
    </div>
  );
}
