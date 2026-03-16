"use client";

import Link from "next/link";
import { ShoppingBag, Menu, User, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import Image from "next/image";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isTiendaOpen, setIsTiendaOpen] = useState(false);
  const { items, itemsCount, cartTotal, removeFromCart } = useCart();

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
              {/* Spacer bridge to close the gap between the text and the dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 h-3" />
              <div
                className={`absolute top-[calc(100%+0.75rem)] left-1/2 -translate-x-1/2 w-48 bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl shadow-xl flex flex-col py-2 overflow-hidden transition-all duration-200 ${isTiendaOpen ? 'opacity-100 visible pointer-events-auto translate-y-0' : 'opacity-0 invisible pointer-events-none -translate-y-2'}`}
              >
                <Link href="/tienda" onClick={() => setIsTiendaOpen(false)} className="px-5 py-2 hover:bg-black/5 text-sm font-medium text-charcoal/80 hover:text-black transition-colors">Ver todo</Link>
                <Link href="/tienda?categoria=Textil" onClick={() => setIsTiendaOpen(false)} className="px-5 py-2 hover:bg-black/5 text-sm font-medium text-charcoal/80 hover:text-black transition-colors">Textil</Link>
                <Link href="/tienda?categoria=Accesorios" onClick={() => setIsTiendaOpen(false)} className="px-5 py-2 hover:bg-black/5 text-sm font-medium text-charcoal/80 hover:text-black transition-colors">Accesorios</Link>
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
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="text-sm font-medium text-charcoal flex items-center gap-2 hover:text-black transition-colors"
            >
              <User size={16} />
              <span className="hidden lg:block">Iniciar Sesión</span>
            </button>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="group relative flex items-center justify-center gap-2 px-6 py-2.5 bg-charcoal text-white rounded-xl text-sm font-semibold transition-all hover:bg-black hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
            >
              <div className="relative">
                <ShoppingBag size={18} />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-[18px] h-[18px] bg-charcoal text-clay border border-clay rounded-full text-[10px] flex items-center justify-center font-bold">
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
                <span className="absolute top-1 right-1 w-[16px] h-[16px] bg-charcoal text-white rounded-full text-[9px] flex items-center justify-center font-bold transition-all">
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
              <button onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }} className="text-base font-medium text-charcoal flex items-center gap-2">
                <User size={18} /> Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>

    {/* Cart Slide-over panel */}
    {isCartOpen && (
      <>
        {/* Overlay */}
        <div className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-[60]" onClick={() => setIsCartOpen(false)} />
        {/* Panel */}
        <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] border-l border-black/5 transform transition-transform duration-300 ease-in-out flex flex-col">
          <div className="p-6 border-b border-black/5 flex items-center justify-between">
            <h2 className="text-xl font-sans font-bold text-charcoal flex items-center gap-2">
              <ShoppingBag size={20} /> Tu Carrito
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-black/5 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col">
            {itemsCount === 0 ? (
              <div className="text-center my-auto">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4 text-charcoal/30">
                  <ShoppingBag size={32} />
                </div>
                <p className="text-lg font-medium text-charcoal mb-2">Tu carrito está vacío</p>
                <p className="text-charcoal/60 mb-6 text-sm">Aún no has agregado productos a tu carrito de compras.</p>
                <Link href="/tienda" onClick={() => setIsCartOpen(false)} className="inline-block px-6 py-3 bg-charcoal text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors">
                  Explorar la Tienda
                </Link>
              </div>
            ) : (
              <div className="w-full flex-1 flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-2xl border border-black/5 bg-neutral-50 relative group">
                    <div className="relative w-20 h-24 bg-white rounded-xl overflow-hidden border border-black/5 flex-shrink-0">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <h4 className="font-sans font-bold text-charcoal leading-tight pr-6">{item.name}</h4>
                      <p className="text-xs text-charcoal/60 mt-1 mb-2 capitalize">
                        {item.base} — {item.diseno} — Talla {item.talla}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="font-mono text-sm font-semibold text-charcoal">${item.price.toLocaleString('es-CL')} <span className="text-[10px] text-charcoal/50 font-normal">x{item.quantity}</span></span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-4 right-4 text-charcoal/30 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {itemsCount > 0 && (
            <div className="p-6 border-t border-black/5 bg-white">
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-charcoal">Subtotal</span>
                <span className="font-mono font-bold text-lg text-charcoal">${cartTotal.toLocaleString('es-CL')}</span>
              </div>
              <button className="w-full py-4 bg-charcoal text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-sm">
                Proceder al Checkout
              </button>
            </div>
          )}
        </div>
      </>
    )}

    {/* Login Modal */}
    {isLoginOpen && (
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={() => setIsLoginOpen(false)} />
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-black/5 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-8">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-6 right-6 p-2 text-charcoal/40 hover:text-charcoal hover:bg-black/5 rounded-full transition-colors">
              <X size={20} />
            </button>
            
            <div className="mb-8">
              <h3 className="text-2xl font-sans font-bold text-charcoal mb-2">Únete a la Familia</h3>
              <p className="text-charcoal/60 text-sm">Regístrate para compras más rápidas, seguimiento de pedidos y acceso a diseños exclusivos.</p>
            </div>
            {/* For Netlify Forms parsing */}
            <form name="registro" data-netlify="true" netlify-honeypot="bot-field" hidden>
              <input type="text" name="nombre" />
              <input type="tel" name="telefono" />
              <input type="email" name="email" />
            </form>

            <form className="space-y-4" name="registro" method="POST" data-netlify="true" onSubmit={(e) => { 
              e.preventDefault(); 
              const formData = new FormData(e.currentTarget);
              fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(Array.from(formData.entries()) as [string, string][]).toString(),
              }).then(() => setIsLoginOpen(false))
                .catch((error) => console.error(error));
            }}>
              <input type="hidden" name="form-name" value="registro" />
              <div>
                <label className="block text-xs font-mono font-medium text-charcoal/70 mb-1.5 uppercase tracking-wider">Nombre Completo</label>
                <input required type="text" name="nombre" className="w-full px-4 py-3 bg-neutral-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal/40 transition-all text-charcoal placeholder-charcoal/30" placeholder="Ej. Juan Pérez" />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-charcoal/70 mb-1.5 uppercase tracking-wider">Número de Teléfono</label>
                <input required type="tel" name="telefono" className="w-full px-4 py-3 bg-neutral-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal/40 transition-all text-charcoal placeholder-charcoal/30" placeholder="+56 9 1234 5678" />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-charcoal/70 mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
                <input required type="email" name="email" className="w-full px-4 py-3 bg-neutral-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal/40 transition-all text-charcoal placeholder-charcoal/30" placeholder="tu@correo.com" />
              </div>
              
              <button type="submit" className="w-full mt-6 py-4 bg-charcoal text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all hover:scale-[1.02] shadow-sm">
                Continuar
              </button>
            </form>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
