export default function TerminosCondiciones() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white text-charcoal px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-neutral">
        <h1 className="text-4xl font-sans font-bold mb-8">Términos y <span className="font-serif italic text-black font-normal">Condiciones</span></h1>
        
        <p className="text-lg text-charcoal/60 mb-10">
          Bienvenido a SeDiscipulo. Al utilizar nuestro sitio web y servicios, aceptas los siguientes términos y condiciones.
        </p>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">1. Envíos y Despacho</h2>
          <p>
            Realizamos despachos a todo Chile a través de empresas de courier externas.
          </p>
          <div className="bg-neutral-50 p-6 rounded-2xl border border-black/5 font-medium mb-4">
            ⚠️ <strong>Importante:</strong> Todas las compras que conllevan un despacho mediante una empresa de courier, el costo del mismo debe ser asumido íntegramente por el cliente (envío por cobrar o pagado en origen según la empresa).
          </div>
          <p className="text-sm text-charcoal/60">
            SeDiscipulo no se hace responsable por retrasos causados por la empresa de logística, aunque prestaremos toda la ayuda necesaria para gestionar seguimiento.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">2. Productos y Stock</h2>
          <p>
            Las imágenes son referenciales y buscamos la mayor fidelidad posible. En productos textiles, las medidas pueden variar ligeramente (1-2cm). El stock está sujeto a disponibilidad inmediata o tiempos de producción indicados en cada producto.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">3. Pedidos Personalizados</h2>
          <p>
            Los pedidos personalizados requieren de una aprobación previa del diseño por parte del cliente. Una vez confirmada la producción de un artículo personalizado, no se aceptan desestimientos de compra.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">4. Pagos</h2>
          <p>
            Todas las transacciones se realizan a través de pasarelas de pago seguras. El pedido solo se procesará una vez confirmado el pago total de la orden.
          </p>
        </section>

        <div className="pt-8 border-t border-black/5 mt-12 text-sm text-charcoal/40 font-mono">
          © 2026 SeDiscipulo • Todos los derechos reservados
        </div>
      </div>
    </div>
  );
}
