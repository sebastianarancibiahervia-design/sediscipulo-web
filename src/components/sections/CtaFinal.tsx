import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaFinal() {
  return (
    <section className="py-24 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-neutral-100 border border-black/5 overflow-hidden px-6 py-20 text-center flex flex-col items-center justify-center group hover:border-black/10 transition-colors duration-500 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-80 z-0"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-sans font-bold text-charcoal mb-6">
              Viste con <span className="font-serif italic text-black">Propósito</span>
            </h2>
            <p className="text-lg text-charcoal/70 mb-10">
              Inicia una conversación sin decir una palabra. Explora nuestra serie completa de poleras y crewnecks premium.
            </p>
            <Link
              href="/tienda"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-charcoal text-white rounded-full text-lg font-bold transition-all hover:bg-black hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Ver Colección Completa
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
