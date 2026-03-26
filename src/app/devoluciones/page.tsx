import { MessageCircle, Mail, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function DevolucionesPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white text-charcoal px-4 sm:px-6 lg:px-8 uppercase-titles">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-sans font-bold mb-8 italic-serif">Política de <span className="font-serif italic text-black font-normal normal-case">Devoluciones</span></h1>
        
        <div className="bg-neutral-50 rounded-3xl p-8 md:p-12 border border-black/5 shadow-sm">
          <p className="text-lg text-charcoal/70 mb-8 leading-relaxed">
            En SeDiscipulo buscamos que tu experiencia sea satisfactoria. Si necesitas gestionar una devolución, por favor considera lo siguiente:
          </p>

          <div className="space-y-12">
            <section className="space-y-4">
              <h2 className="text-xs font-mono font-bold text-charcoal/40 uppercase tracking-widest">Contacto Directo</h2>
              <p className="text-charcoal/80">
                Para cualquier gestión de devolución, cambio o problema con tu producto, debes contactarnos a través de nuestros canales oficiales:
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a 
                  href="mailto:contacto@sediscipulo.cl" 
                  className="flex items-center gap-3 px-6 py-4 bg-white border border-black/10 rounded-2xl font-bold hover:shadow-lg transition-all"
                >
                  <Mail size={18} /> contacto@sediscipulo.cl
                </a>
                <a 
                  href="https://wa.me/56933473640" 
                  target="_blank"
                  className="flex items-center gap-3 px-6 py-4 bg-charcoal text-white rounded-2xl font-bold hover:bg-black transition-all"
                >
                  <MessageCircle size={18} /> Mensaje al WhatsApp
                </a>
              </div>
            </section>

            <section className="space-y-4 pt-8 border-t border-black/5">
              <h2 className="text-xs font-mono font-bold text-charcoal/40 uppercase tracking-widest">Condiciones Generales</h2>
              <ul className="space-y-3 text-sm text-charcoal/60">
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-charcoal mt-1.5 flex-shrink-0"></span>
                  Los productos deben estar en perfecto estado, sin signos de uso y en su empaque original.
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-charcoal mt-1.5 flex-shrink-0"></span>
                  Dispones de 10 días desde la recepción del producto para solicitar una devolución.
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-charcoal mt-1.5 flex-shrink-0"></span>
                  Los productos personalizados solo aplican devolución por fallas de fabricación.
                </li>
              </ul>
            </section>
          </div>
        </div>

        <Link href="/tienda" className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal mt-12 transition-colors font-medium">
          <ChevronLeft size={16} /> Volver a la Tienda
        </Link>
      </div>
    </div>
  );
}
