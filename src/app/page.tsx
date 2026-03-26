"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, Phone, Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import gsap from "gsap";

export default function ComingSoonPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Basic entrance animation
    gsap.from(".animate-up", {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    });
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 0. Check if email already exists
    const { data: existingClient } = await supabase
      .from("clientes")
      .select("id, user_id")
      .eq("email", formData.email)
      .single();

    if (existingClient && existingClient.user_id) {
      setError("Ya eres parte de nuestra comunidad. ¡Te avisaremos pronto!");
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
        fuente: "PAGINA WEB - LANZAMIENTO",
      };

      const { error: dbError } = await supabase
        .from("clientes")
        .upsert(clientData, { onConflict: 'email' });

      if (dbError) console.error("Error linking client:", dbError);

      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/cover-webpage.jpg" alt="SeDiscipulo" fill className="object-cover opacity-20 grayscale brightness-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent" />
        </div>

        <div className="max-w-md w-full text-center relative z-10">
          <div className="w-20 h-20 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/20">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-4xl font-sans font-bold text-white mb-4">¡Te has unido a nuestra comunidad!</h2>
          <p className="text-white/60 mb-10 leading-relaxed">
            Serás de los primeros en conocer las novedades del lanzamiento oficial de nuestra web. ¡Mantente atento a tu correo, porque el lanzamiento vendrá con un regalito especial para ti!
          </p>
          <div className="pt-4">
            <Image src="/logo_sediscipulo.png" alt="SeDiscipulo" width={120} height={40} className="mx-auto opacity-50 contrast-125" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal flex flex-col md:flex-row relative overflow-hidden">
      {/* Background for Mobile / Left side for Desktop */}
      <div className="absolute inset-0 md:relative md:w-1/2 h-full z-0">
        <Image
          src="/cover-webpage.jpg"
          alt="SeDiscipulo Launch"
          fill
          className="object-cover opacity-50 grayscale brightness-[0.3] md:brightness-50 transition-all duration-[2s] blur-[2px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-black/60 z-10" />

        {/* Logo and Intro Text Wrapper */}
        <div className="absolute inset-0 flex flex-col items-center md:items-start justify-start pt-[35vh] md:pt-[15vh] p-8 md:p-20 z-20 text-center md:text-left">
          <div className="animate-up mb-12 flex-shrink-0">
            <Image src="/logo_sediscipulo.png" alt="SeDiscipulo" width={220} height={80} className="invert brightness-0 contrast-200" />
          </div>

          <h1 className="animate-up text-5xl md:text-7xl font-sans font-bold text-white leading-tight mb-6 tracking-tight drop-shadow-2xl">
            Nuestra web está <br />
            <span className="font-serif italic text-white/90 font-medium tracking-wide">por despertar</span>
          </h1>

          <p className="animate-up text-lg md:text-xl text-white/80 max-w-lg mb-12 leading-relaxed font-light drop-shadow-md">
            Estamos preparando una experiencia única alineada a la Verdad. Únete antes del lanzamiento oficial para recibir novedades exclusivas y el primer acceso a nuestra colección con propósito.
          </p>
        </div>
      </div>

      {/* Right side: Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-30 bg-charcoal md:bg-neutral-50 min-h-[650px] md:min-h-0">
        <div className="w-full max-w-lg">
          <div className="bg-charcoal md:bg-white p-8 md:p-12 md:rounded-[3rem] md:shadow-2xl border border-white/5 md:border-black/5 animate-up">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-sans font-bold text-white md:text-charcoal mb-2">Sé parte del inicio</h2>
              <p className="text-white/50 md:text-charcoal/50 text-sm">Completa tus datos para recibir beneficios exclusivos por lanzamiento.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-500/10 md:bg-red-50 border border-red-500/20 md:border-red-100 rounded-2xl flex gap-3 text-red-500 md:text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono font-medium text-white/40 md:text-charcoal/50 mb-2 uppercase tracking-widest">Nombre</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 md:text-charcoal/20" />
                    <input
                      required
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 md:bg-neutral-50 border border-white/10 md:border-black/10 rounded-2xl text-white md:text-charcoal focus:ring-2 focus:ring-white/20 md:focus:ring-charcoal/10 transition-all outline-none"
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono font-medium text-white/40 md:text-charcoal/50 mb-2 uppercase tracking-widest">Teléfono</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 md:text-charcoal/20" />
                    <input
                      required
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 md:bg-neutral-50 border border-white/10 md:border-black/10 rounded-2xl text-white md:text-charcoal focus:ring-2 focus:ring-white/20 md:focus:ring-charcoal/10 transition-all outline-none"
                      placeholder="+56 9..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-white/40 md:text-charcoal/50 mb-2 uppercase tracking-widest">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 md:text-charcoal/20" />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 md:bg-neutral-50 border border-white/10 md:border-black/10 rounded-2xl text-white md:text-charcoal focus:ring-2 focus:ring-white/20 md:focus:ring-charcoal/10 transition-all outline-none"
                    placeholder="ejemplo@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-white/40 md:text-charcoal/50 mb-2 uppercase tracking-widest">Contraseña</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 md:text-charcoal/20" />
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 md:bg-neutral-50 border border-white/10 md:border-black/10 rounded-2xl text-white md:text-charcoal focus:ring-2 focus:ring-white/20 md:focus:ring-charcoal/10 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-5 bg-white md:bg-charcoal text-charcoal md:text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 group"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : (
                  <>
                    Quiero registrarme <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center md:text-right text-white/30 md:text-charcoal/30 text-[10px] font-mono tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} SEDISCIPULO - TIENDA DE ROPA CRISTIANA
          </p>
        </div>
      </div>
    </div>
  );
}
