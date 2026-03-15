import Image from "next/image";

export default function PedidosPersonalizadosPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white text-charcoal px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-sans font-bold">
            Pedidos <span className="font-serif italic text-black">Personalizados</span>
          </h1>
          <p className="text-xl text-charcoal/60 leading-relaxed max-w-2xl mx-auto">
            Diseñamos prendas exclusivas con alta fidelidad para iglesias, ministerios o grupos.
            Trabajamos con bordado y DTF de primera selección.
          </p>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-black/5 group">
              <Image
                src={`/imagenes_personalizados/foto${num}.jpg`} // Assuming they are named foto1, foto2, foto3 or something we can adapt. We will use absolute placeholders and adjust after if needed. But usually we must know the exact filenames.
                alt={`Trabajo personalizado ${num}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>

        {/* Form Formulario */}
        <div className="bg-neutral-50 rounded-3xl p-8 md:p-12 shadow-sm border border-black/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-charcoal"></div>
          
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold font-sans">Cuéntanos tu idea</h2>
            <p className="text-charcoal/60 mt-2">Completa el formulario y te contactaremos a la brevedad.</p>
          </div>

          <form 
            name="personalizados" 
            method="POST" 
            data-netlify="true" 
            encType="multipart/form-data" 
            className="space-y-6 max-w-2xl mx-auto"
          >
            <input type="hidden" name="form-name" value="personalizados" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="nombre" className="text-sm font-semibold text-charcoal/80">Nombre Completo</label>
                <input required type="text" id="nombre" name="nombre" className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-charcoal" placeholder="Ej. Juan Pérez" />
              </div>
              <div className="space-y-2">
                <label htmlFor="telefono" className="text-sm font-semibold text-charcoal/80">Número de Contacto</label>
                <input required type="tel" id="telefono" name="telefono" className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-charcoal" placeholder="+56 9 1234 5678" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-charcoal/80">Correo Electrónico</label>
              <input required type="email" id="email" name="email" className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-charcoal" placeholder="tu@correo.com" />
            </div>

            <div className="space-y-2">
              <label htmlFor="detalles" className="text-sm font-semibold text-charcoal/80">Detalles del pedido</label>
              <textarea required id="detalles" name="detalles" rows={4} className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-charcoal resize-none" placeholder="Cantidad aproximada, tipo de prenda, fechas estimadas..."></textarea>
            </div>

            <div className="space-y-2">
              <label htmlFor="referencia" className="text-sm font-semibold text-charcoal/80">Imagen de referencia (Opcional)</label>
              <input type="file" id="referencia" name="referencia" accept="image/*" className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-sm text-charcoal/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-charcoal/5 file:text-charcoal hover:file:bg-charcoal/10" />
            </div>

            <button type="submit" className="w-full bg-charcoal text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5">
              Enviar Solicitud
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
