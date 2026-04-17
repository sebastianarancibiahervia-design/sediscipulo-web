"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PedidosPersonalizadosPage() {
  const [selectedImage, setSelectedImage] = useState<null | {src: string, alt: string}>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [defaultNombre, setDefaultNombre] = useState("");
  const [defaultTelefono, setDefaultTelefono] = useState("");
  const [defaultEmail, setDefaultEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setDefaultEmail(session.user.email || "");
        
        const { data: client } = await supabase
          .from("clientes")
          .select("nombre, telefono")
          .eq("user_id", session.user.id)
          .single();
          
        if (client) {
          setDefaultNombre(client.nombre || "");
          setDefaultTelefono(client.telefono || "");
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const nombre = formData.get("nombre") as string;
      const telefono = formData.get("telefono") as string;
      const email = formData.get("email") as string;
      const detalles = formData.get("detalles") as string;
      const file = formData.get("referencia") as File;

      let imagen_url = null;

      // 1. Upload image if exists
      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("form_personalizados")
          .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        imagen_url = fileName;
      }

      // 2. Check if client already exists by email
      const { data: existingClient } = await supabase
        .from("clientes")
        .select("id")
        .eq("email", email)
        .single();

      // 3. Insert into form_personalizados
      const { error: insertError } = await supabase
        .from("form_personalizados")
        .insert({
          nombre,
          numero: telefono,
          correo: email,
          detalles,
          imagen_url,
          id_cliente: existingClient?.id || null,
          resuelto: false
        });

      if (insertError) throw insertError;

      // 4. Send email notification via FormSubmit (AJAX request with FormData for attachment)
      try {
        const formSubmitData = new FormData();
        formSubmitData.append("_subject", `Nuevo Pedido Personalizado - ${nombre}`);
        formSubmitData.append("Nombre del cliente", nombre);
        formSubmitData.append("Teléfono", telefono);
        formSubmitData.append("Correo", email);
        formSubmitData.append("Detalles del Pedido", detalles);
        
        if (file && file.size > 0) {
          formSubmitData.append("attachment", file);
        } else if (imagen_url) {
          // Fallback just in case we only have the URL
          formSubmitData.append("Enlace a Imagen de Referencia", `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/form_personalizados/${imagen_url}`);
        }

        await fetch("https://formsubmit.co/ajax/contacto@sediscipulo.cl", {
          method: "POST",
          headers: {
            "Accept": "application/json"
          },
          body: formSubmitData
        });
      } catch (emailError) {
        console.error("Error al enviar el correo de notificación:", emailError);
        // Continuamos de todas formas ya que los datos se guardaron en la base de datos
      }

      router.push("/pedidos-personalizados/gracias");
    } catch (error: Error | any) {
      console.error("Error submitting form:", error);
      alert("Hubo un error al enviar tu solicitud: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white text-charcoal px-4 sm:px-6 lg:px-8">
      {/* ... (rest of the code remains similar except onSubmit handling) */}
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
          {[
            { src: "pers_campamento_jovenes.jpg", alt: "Campamentos" },
            { src: "pers_equipos_multimedia.jpg", alt: "Equipos de servicio" },
            { src: "pers_eventos_especiales.jpg", alt: "Eventos especiales" }
          ].map((img, i) => (
            <div key={i} className="flex flex-col gap-4 group">
              <div 
                className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-sm border border-black/5 cursor-pointer group-hover:shadow-xl transition-all duration-500"
                onClick={() => setSelectedImage(img)}
              >
                <Image
                  src={`/imagenes_personalizados/${img.src}`}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-sm text-charcoal text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 shadow-sm translate-y-2 group-hover:translate-y-0">
                    Ampliar
                  </span>
                </div>
              </div>
              <h3 className="font-sans font-semibold text-charcoal text-center text-lg">{img.alt}</h3>
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
            className="space-y-6 max-w-2xl mx-auto"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="nombre" className="text-sm font-semibold text-charcoal/80">Nombre Completo</label>
                <input required type="text" id="nombre" name="nombre" value={defaultNombre} onChange={(e) => setDefaultNombre(e.target.value)} className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-charcoal" placeholder="Ej. Juan Pérez" />
              </div>
              <div className="space-y-2">
                <label htmlFor="telefono" className="text-sm font-semibold text-charcoal/80">Número de Contacto</label>
                <input required type="tel" id="telefono" name="telefono" value={defaultTelefono} onChange={(e) => setDefaultTelefono(e.target.value)} className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-charcoal" placeholder="+56 9 1234 5678" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-charcoal/80">Correo Electrónico</label>
              <input required type="email" id="email" name="email" value={defaultEmail} onChange={(e) => setDefaultEmail(e.target.value)} className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-charcoal" placeholder="tu@correo.com" />
            </div>

            <div className="space-y-2">
              <label htmlFor="detalles" className="text-sm font-semibold text-charcoal/80">Detalles del pedido</label>
              <textarea required id="detalles" name="detalles" rows={4} className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-charcoal resize-none" placeholder="Cantidad aproximada, tipo de prenda, fechas estimadas..."></textarea>
            </div>

            <div className="space-y-2">
              <label htmlFor="referencia" className="text-sm font-semibold text-charcoal/80">Imagen de referencia (Opcional)</label>
              <input type="file" id="referencia" name="referencia" accept="image/*" className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-sm text-charcoal/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-charcoal/5 file:text-charcoal hover:file:bg-charcoal/10" />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-charcoal text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50">
              {loading ? "Enviando..." : "Enviar Solicitud"}
            </button>
          </form>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-charcoal/90 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} />
          </button>
          
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={`/imagenes_personalizados/${selectedImage.src}`}
              alt={selectedImage.alt}
              width={1200}
              height={1600}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <p className="mt-4 font-sans font-semibold text-white/90 text-lg">{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </div>
  );
}
