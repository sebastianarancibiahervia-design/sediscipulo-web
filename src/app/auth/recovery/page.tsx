"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Mail, ChevronLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RecoveryPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check if user exists in 'clientes' table as requested
    const { data: client, error: clientError } = await supabase
      .from("clientes")
      .select("id")
      .eq("email", email)
      .single();

    if (clientError || !client) {
      setError("No encontramos una cuenta asociada a este correo. Regístrate para crear una nueva.");
      setLoading(false);
      return;
    }

    const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (recoveryError) {
      setError(recoveryError.message);
      setLoading(false);
    } else {
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
          <h2 className="text-4xl font-sans font-bold text-charcoal mb-4">Correo enviado</h2>
          <p className="text-charcoal/60 mb-8 max-w-sm mx-auto">
            Hemos enviado las instrucciones para restablecer tu contraseña a <span className="font-bold text-charcoal">{email}</span>.
          </p>
          <Link 
            href="/auth/login" 
            className="inline-flex items-center justify-center px-8 py-4 bg-charcoal text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:scale-[1.02]"
          >
            Volver al Inicio de Sesión
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
          <ChevronLeft size={16} /> Volver al Inicio de Sesión
        </Link>
        <h2 className="text-center text-4xl font-sans font-bold tracking-tight text-charcoal">
          Recuperar <span className="font-serif italic text-black">Contraseña</span>
        </h2>
        <p className="mt-2 text-center text-sm text-charcoal/60">
          Ingresa tu correo y te enviaremos un enlace de recuperación
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-4 border border-black/5 sm:rounded-3xl sm:px-10 shadow-xl shadow-black/[0.02]">
          <form className="space-y-6" onSubmit={handleRecovery}>
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={18} className="flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-medium text-charcoal/70 mb-1.5 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal/30">
                  <Mail size={18} />
                </div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-neutral-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal/40 transition-all text-charcoal placeholder-charcoal/30"
                  placeholder="tu@correo.com"
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
                "Enviar Instrucciones"
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-black/5 text-center">
            <p className="text-sm text-charcoal/60">
              ¿Recordaste tu contraseña?{" "}
              <Link href="/auth/login" className="font-bold text-charcoal hover:underline decoration-2 underline-offset-4">
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
