"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ChevronLeft, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message === "Invalid login credentials" ? "Credenciales inválidas. Verifica tu correo y contraseña." : authError.message);
      setLoading(false);
    } else {
      router.push("/tienda");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors mb-8 text-sm font-medium">
          <ChevronLeft size={16} /> Volver al Inicio
        </Link>
        <h2 className="text-center text-4xl font-sans font-bold tracking-tight text-charcoal">
          Bienvenido de <span className="font-serif italic text-black">nuevo</span>
        </h2>
        <p className="mt-2 text-center text-sm text-charcoal/60">
          Ingresa a tu cuenta para gestionar tus pedidos
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-4 border border-black/5 sm:rounded-3xl sm:px-10 shadow-xl shadow-black/[0.02]">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={18} className="flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-mono font-medium text-charcoal/70 mb-1.5 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal/30">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-neutral-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal/40 transition-all text-charcoal placeholder-charcoal/30"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-mono font-medium text-charcoal/70 mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal/30">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-neutral-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal/40 transition-all text-charcoal placeholder-charcoal/30"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/auth/recovery" className="font-medium text-charcoal/60 hover:text-black transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-charcoal text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-black/5 text-center">
            <p className="text-sm text-charcoal/60">
              ¿No tienes cuenta?{" "}
              <Link href="/auth/signup" className="font-bold text-charcoal hover:underline decoration-2 underline-offset-4">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
