"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ChevronLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.updateUser({
      password: password
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 text-center">
        <h2 className="text-4xl font-sans font-bold tracking-tight text-charcoal">
          Nueva <span className="font-serif italic text-black">Contraseña</span>
        </h2>
        <p className="mt-2 text-sm text-charcoal/60">
          Ingresa tu nueva contraseña para recuperar el acceso
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-4 border border-black/5 sm:rounded-3xl sm:px-10 shadow-xl shadow-black/[0.02]">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-2">¡Contraseña actualizada!</h3>
              <p className="text-charcoal/60 text-sm">Serás redirigido al inicio de sesión en unos segundos...</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleReset}>
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-medium text-charcoal/70 mb-1.5 uppercase tracking-wider">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal/30">
                    <Lock size={18} />
                  </div>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-neutral-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal/40 transition-all text-charcoal placeholder-charcoal/30"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-charcoal/70 mb-1.5 uppercase tracking-wider">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal/30">
                    <Lock size={18} />
                  </div>
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-neutral-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal/40 transition-all text-charcoal placeholder-charcoal/30"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-charcoal text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all hover:scale-[1.02] shadow-lg disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : "Actualizar Contraseña"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
