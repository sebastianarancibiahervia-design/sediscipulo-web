export default function PoliticaPrivacidad() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white text-charcoal px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-neutral">
        <h1 className="text-4xl font-sans font-bold mb-8">Política de <span className="font-serif italic text-black">Privacidad</span></h1>
        
        <p className="text-lg text-charcoal/60 mb-8">
          En SeDiscipulo, valoramos y respetamos tu privacidad. Esta política detalla cómo manejamos tus datos personales.
        </p>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">1. Información que recolectamos</h2>
          <p>
            Al registrarte o realizar una compra, recolectamos información necesaria para la gestión del servicio, incluyendo: 
            Nombre, correo electrónico, número de teléfono y dirección de despacho (opcional).
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">2. Uso de la Información</h2>
          <p>
            Tus datos se utilizan exclusivamente para:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Procesar y enviar tus pedidos.</li>
            <li>Gestionar tu cuenta de usuario y acceso al historial de pedidos.</li>
            <li>Contactarte en relación a cotizaciones de pedidos personalizados.</li>
            <li>Mejorar nuestra experiencia de servicio.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">3. Almacenamiento Seguro</h2>
          <p>
            Utilizamos infraestructura de clase mundial para asegurar que tus datos estén encriptados y protegidos contra accesos no autorizados. No compartimos ni vendemos tu información a terceros.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">4. Tus Derechos</h2>
          <p>
            Puedes acceder, rectificar o eliminar tus datos personales en cualquier momento desde tu sección "Mi Cuenta". Para la eliminación total de la cuenta, puedes contactarnos directamente.
          </p>
        </section>

        <div className="pt-8 border-t border-black/5 mt-12 text-sm text-charcoal/40 font-mono">
          Última actualización: Marzo 2026
        </div>
      </div>
    </div>
  );
}
