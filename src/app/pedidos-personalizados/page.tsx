import Link from "next/link";

export default function PedidosPersonalizadosPage() {
  return (
    <div className="pt-32 pb-24 min-h-[70vh] bg-white text-charcoal px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-sans font-bold">
          Pedidos <span className="font-serif italic text-black">Personalizados</span>
        </h1>
        <p className="text-xl text-charcoal/60 leading-relaxed">
          Diseñamos prendas exclusivas con alta fidelidad para iglesias, ministerios o grupos. 
          Pronto estaremos actualizando esta sección con toda la información sobre nuestros pedidos personalizados y ventas al por mayor.
        </p>
        
        <div className="pt-8">
          <Link 
            href="/contacto" 
            className="inline-flex items-center justify-center px-8 py-4 bg-charcoal text-white rounded-xl text-lg font-bold transition-all hover:bg-black hover:shadow-[0_0_30px_rgba(0,0,0,0.15)] hover:-translate-y-1"
          >
            Contáctanos para más detalles
          </Link>
        </div>
      </div>
    </div>
  );
}
