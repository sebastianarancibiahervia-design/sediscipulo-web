"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone, ChevronLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 0. Check if email already exists in 'clientes' table
    const { data: existingClient, error: checkError } = await supabase
      .from("clientes")
      .select("id, user_id")
      .eq("email", formData.email)
      .single();

    // If there is an existing client with a user_id, they are already fully registered
    if (existingClient && existingClient.user_id) {
      setError("Ya existe una cuenta con este correo. ¿Deseas Iniciar Sesión o Recuperar tu contraseña?");
      setLoading(false);
      return;
    }

    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.nombre,
          phone: formData.telefono,
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 2. Link or create in 'clientes' table
      const clientData = {
        user_id: authData.user.id,
        nombre: formData.nombre,
        telefono: formData.telefono,
        email: formData.email,
        fuente: "PAGINA WEB",
      };

      // We use upsert to either create a new record or update the existing one (matching by email)
      // Note: This requires the 'email' column to have a unique constraint or for Supabase to handle it
      // Since we already checked 'user_id' is null, we can safely update by email.
      const { error: dbError } = await supabase
        .from("clientes")
        .upsert(clientData, { onConflict: 'email' });

      if (dbError) {
        console.error("Error linking/inserting client:", dbError);
        // We don't block the user if auth succeeded but DB sync failed
      }
      
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 relative overflow-hidden">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-4xl font-sans font-bold text-charcoal mb-4">¡Registro exitoso!</h2>
          <p className="text-charcoal/60 mb-8 max-w-sm mx-auto">
            Hemos enviado un correo de confirmación a <span className="font-bold text-charcoal">{formData.email}</span>. Revisa tu bandeja de entrada para verificar tu cuenta.
          </p>
          <Link 
            href="/auth/login" 
            className="inline-flex items-center justify-center px-8 py-4 bg-charcoal text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:scale-[1.02]"
          >
            Ir al Inicio de Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors mb-8 text-sm font-medium">
          <ChevronLeft size={16} /> Ya tengo cuenta
        </Link>
        <h2 className="text-center text-4xl font-sans font-bold tracking-tight text-charcoal">
          Únete a la <span className="font-serif italic text-black">Familia</span>
        </h2>
        <p className="mt-2 text-center text-sm text-charcoal/60">
          Crea tu cuenta para una experiencia personalizada
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-4 border border-black/5 sm:rounded-3xl sm:px-10 shadow-xl shadow-black/[0.02]">
          <form className="space-y-5" onSubmit={handleSignup}>
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex flex-col gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                <div className="flex gap-3">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <p>{error}</p>
                </div>
                {error.includes("Ya existe una cuenta") && (
                  <div className="flex gap-4 mt-2 pt-3 border-t border-red-200">
                    <Link href="/auth/login" className="font-bold underline">Iniciar Sesión</Link>
                    <Link href="/auth/recovery" className="font-bold underline">Recuperar Contraseña</Link>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-medium text-charcoal/70 mb-1.5 uppercase tracking-wider">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal/30">
                  <User size={18} />
                </div>
                <input
                  required
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 bg-neutral-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal/40 transition-all text-charcoal placeholder-charcoal/30"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-charcoal/70 mb-1.5 uppercase tracking-wider">Número de Teléfono</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal/30">
                  <Phone size={18} />
                </div>
                <input
                  required
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 bg-neutral-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal/40 transition-all text-charcoal placeholder-charcoal/30"
                  placeholder="+56 9 1234 5678"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-charcoal/70 mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal/30">
                  <Mail size={18} />
                </div>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 bg-neutral-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal/40 transition-all text-charcoal placeholder-charcoal/30"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-charcoal/70 mb-1.5 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal/30">
                  <Lock size={18} />
                </div>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 bg-neutral-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal/40 transition-all text-charcoal placeholder-charcoal/30"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 bg-charcoal text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
