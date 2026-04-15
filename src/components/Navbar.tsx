"use client";

import Link from "next/link";
import { ShoppingBag, Menu, User, X, Trash2, ChevronRight, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/components/CartProvider";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTiendaOpen, setIsTiendaOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { items, itemsCount, cartTotal, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useGSAP(() => {
    if (isCartOpen) {
      // Open animation
      gsap.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.4,
        ease: "power2.out"
      });
      gsap.to(drawerRef.current, {
        x: 0,
        duration: 0.6,
        ease: "power4.out"
      });
      gsap.fromTo(".cart-item-anim", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out", delay: 0.2 }
      );
    } else {
      // Close animation
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.in"
      });
      gsap.to(drawerRef.current, {
        x: "100%",
        duration: 0.5,
        ease: "power4.in"
      });
    }
  }, { dependencies: [isCartOpen], scope: drawerRef });

  return (
    <>
    <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-white/80 border-b border-black/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <Image src="/logo_sediscipulo.png" alt="SeDiscipulo" width={140} height={40} className="h-10 w-auto object-contain" priority />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            {/* Tienda Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsTiendaOpen(true)}
              onMouseLeave={() => setIsTiendaOpen(false)}
            >
              <Link href="/tienda" className={`text-sm font-medium transition-colors duration-300 ${isTiendaOpen ? 'text-black' : 'text-charcoal/80 hover:text-black'}`}>
                Tienda
              </Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 h-3" />
              <div
                className={`absolute top-[calc(100%+0.75rem)] left-1/2 -translate-x-1/2 w-48 bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl shadow-xl flex flex-col py-2 overflow-hidden transition-all duration-200 ${isTiendaOpen ? 'opacity-100 visible pointer-events-auto translate-y-0' : 'opacity-0 invisible pointer-events-none -translate-y-2'}`}
              >
                <Link href="/tienda" onClick={() => setIsTiendaOpen(false)} className="px-5 py-2 hover:bg-black/5 text-sm font-medium text-charcoal/80 hover:text-black transition-colors">Ver todo</Link>
              </div>
            </div>
            <Link href="/nosotros" className="text-sm font-medium text-charcoal/80 hover:text-black transition-colors duration-300">
              Nosotros
            </Link>
            <Link href="/contacto" className="text-sm font-medium text-charcoal/80 hover:text-black transition-colors duration-300">
              Contacto
            </Link>
            <Link href="/blog" className="text-sm font-medium text-charcoal/80 hover:text-black transition-colors duration-300">
              Blog
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href={user ? "/perfil" : "/auth/login"}
              className="text-sm font-medium text-charcoal flex items-center gap-2 hover:text-black transition-colors"
            >
              <User size={16} />
              <span className="hidden lg:block">{user ? "Mi Cuenta" : "Iniciar Sesión"}</span>
            </Link>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="group relative flex items-center justify-center gap-2 px-6 py-2.5 bg-charcoal text-white rounded-xl text-sm font-semibold transition-all hover:bg-black hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
            >
              <div className="relative">
                <ShoppingBag size={18} />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-[18px] h-[18px] bg-charcoal text-clay border border-clay rounded-full text-[10px] flex items-center justify-center font-bold animate-in zoom-in duration-300">
                    {itemsCount}
                  </span>
                )}
              </div>
              <span>Carrito</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-4">
            <button onClick={() => setIsCartOpen(!isCartOpen)} className="text-charcoal p-2 relative">
              <ShoppingBag size={20} />
              {itemsCount > 0 && (
                <span className="absolute top-1 right-1 w-[16px] h-[16px] bg-charcoal text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                  {itemsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-charcoal p-2"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-black/5">
          <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3 flex flex-col gap-4 mt-4">
            <Link href="/tienda" className="block text-base font-medium text-charcoal/80 hover:text-black">Tienda</Link>
            <Link href="/nosotros" className="block text-base font-medium text-charcoal/80 hover:text-black">Nosotros</Link>
            <Link href="/contacto" className="block text-base font-medium text-charcoal/80 hover:text-black">Contacto</Link>
            <Link href="/blog" className="block text-base font-medium text-charcoal/80 hover:text-black">Blog</Link>
            <hr className="border-black/5 my-4" />
            <div className="flex items-center gap-4">
              <Link 
                href={user ? "/perfil" : "/auth/login"}
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-base font-medium text-charcoal flex items-center gap-2"
              >
                <User size={18} /> {user ? "Mi Cuenta" : "Iniciar Sesión"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>

    {/* Cart Drawer */}
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm opacity-0 invisible pointer-events-auto" 
        onClick={() => setIsCartOpen(false)} 
      />
      
      {/* Panel */}
      <div 
        ref={drawerRef}
        className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-black/5 flex flex-col translate-x-full pointer-events-auto overflow-hidden rounded-l-[2.5rem]"
      >
        <div className="p-8 border-b border-black/5 flex items-center justify-between bg-neutral-50/50">
          <h2 className="text-2xl font-sans font-bold text-charcoal flex items-center gap-3">
            <ShoppingBag size={24} className="text-charcoal" /> Tu Carrito
          </h2>
          <div className="absolute top-8 right-8 flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/50">Carrito de Compras</span>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-3 bg-black/5 hover:bg-black/10 rounded-full transition-all hover:scale-110 active:scale-90"
            >
              <X size={20} className="text-charcoal" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 flex flex-col custom-scrollbar">
          {itemsCount === 0 ? (
            <div className="text-center my-auto px-4">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6 text-charcoal/20">
                <ShoppingBag size={40} />
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-3">Tu carrito está vacío</h3>
              <p className="text-charcoal/50 mb-8 max-w-[240px] mx-auto">Explora nuestra colección y encuentra algo especial para ti.</p>
              <Link 
                href="/tienda" 
                onClick={() => setIsCartOpen(false)} 
                className="inline-flex items-center gap-2 px-8 py-4 bg-charcoal text-white rounded-2xl font-bold hover:bg-black transition-all hover:scale-105 active:scale-95"
              >
                Ir a la Tienda <ChevronRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="w-full flex-1 flex flex-col gap-6">
              {!user && (
                <div className="cart-item-anim p-8 bg-cream border border-clay/10 rounded-[2.5rem] mb-4 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-clay/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                      <User size={20} className="text-clay" />
                    </div>
                    <h4 className="text-xl font-bold text-charcoal mb-2 leading-tight">¿Listo para hacer tu pedido?</h4>
                    <p className="text-sm font-medium text-charcoal/50 mb-6 leading-relaxed">
                      Inicia sesión para que podamos gestionar tu stock y procesar tu pedido de forma personalizada.
                    </p>
                    <Link 
                      href="/auth/login" 
                      onClick={() => setIsCartOpen(false)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-white text-sm rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-black/10"
                    >
                      Iniciar Sesión <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              )}
              {items.map((item) => (
                <div key={item.id} className="cart-item-anim flex gap-5 p-5 rounded-[2rem] border border-black/5 bg-white relative group hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
                  <div className="relative w-24 h-28 bg-neutral-50 rounded-2xl overflow-hidden border border-black/5 flex-shrink-0 shadow-sm">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <h4 className="font-sans font-bold text-charcoal text-lg leading-tight pr-8">{item.name}</h4>
                    <p className="text-xs font-medium text-charcoal/60 mt-1.5 mb-3 uppercase tracking-wider">
                      {item.base} • {item.diseno} • {item.talla}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="font-mono text-charcoal font-bold">
                        ${item.price.toLocaleString('es-CL')} 
                        <span className="ml-2 text-[10px] text-charcoal/60 font-normal">CANT. {item.quantity}</span>
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-5 right-5 text-charcoal/20 hover:text-red-500 transition-all p-1 hover:scale-110"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {itemsCount > 0 && (
          <div className="p-8 border-t border-black/5 bg-[#FAF8F5] rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-8 px-2">
              <span className="text-charcoal/60 font-medium">Subtotal Estimado</span>
              <span className="font-mono font-bold text-2xl text-charcoal">${cartTotal.toLocaleString('es-CL')}</span>
            </div>
            {user ? (
              <Link 
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-5 bg-charcoal text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10 text-lg"
              >
                Proceder al Checkout <ChevronRight size={20} />
              </Link>
            ) : (
              <Link 
                href="/auth/login"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-5 bg-clay text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-clay/10 text-lg text-center"
              >
                Inicia sesión para pagar <ChevronRight size={20} />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
