"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/CartProvider";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Trash2, Plus, Minus, Ticket, ArrowRight, ShoppingBag, CheckCircle2, Clock, Package, Truck, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { validateCoupon, createOrder, OrderItem } from "@/lib/store/storeServices";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export default function CheckoutPage() {
  const { items, itemsCount, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponId, setCouponId] = useState<string | undefined>(undefined);
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [orderEmail, setOrderEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const applyCoupon = async () => {
    if (!user) {
      setCouponError("Debes iniciar sesión para usar cupones.");
      return;
    }
    
    setIsApplying(true);
    setCouponError("");
    
    try {
      const result = await validateCoupon(coupon, user.id);
      if (result.success) {
        setDiscount(cartTotal * (result.discount || 0));
        setCouponId(result.couponId);
      } else {
        setCouponError(result.message || "Cupón no válido");
        setDiscount(0);
        setCouponId(undefined);
      }
    } catch (error) {
      setCouponError("Error al validar el cupón.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleProcessOrder = async () => {
    if (!user) return;

    setIsProcessing(true);
    try {
      const orderItems: OrderItem[] = items.map(item => ({
        id_tienda: item.id,
        cantidad: item.quantity,
        valor_unitario: item.price,
        descripcion: `${item.name} (${item.base}, ${item.talla}, ${item.diseno})`
      }));

      const finalTotal = cartTotal - discount;
      const result = await createOrder(user.id, orderItems, cartTotal, finalTotal, couponId);
      
      setOrderNumber(result.numero);
      setOrderEmail(result.email);
      setShowSuccessModal(true);
      clearCart();
    } catch (error: any) {
      console.error("Error processing order:", error);
      alert(error.message || "Hubo un error al procesar tu pedido. Por favor intenta nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const finalTotal = cartTotal - discount;

  useGSAP(() => {
    gsap.fromTo(".checkout-anim", 
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        clearProps: "all"
      }
    );
  }, []);

  if (itemsCount === 0 && !showSuccessModal) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center bg-[#FAF8F5]">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
          <ShoppingBag size={40} className="text-charcoal/20" />
        </div>
        <h1 className="text-4xl font-sans font-bold text-charcoal mb-4">Tu carrito está vacío</h1>
        <p className="text-charcoal/50 mb-10 max-w-md mx-auto">Parece que aún no has seleccionado productos para tu pedido.</p>
        <Link 
          href="/tienda" 
          className="px-10 py-4 bg-charcoal text-white rounded-2xl font-bold hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
        >
          Explorar Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#FAF8F5] text-charcoal relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/tienda" className="checkout-anim inline-flex items-center gap-2 text-charcoal/40 hover:text-charcoal transition-colors mb-12 font-medium">
          <ChevronLeft size={18} /> Volver a la Tienda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Content: Order Summary Review */}
          <div className="lg:col-span-8 space-y-8">
            <div className="checkout-anim">
              <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-2 text-charcoal">Revisar Pedido</h1>
              <p className="text-charcoal/60 font-medium">Revisa los detalles de tus productos antes de finalizar.</p>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="checkout-anim flex flex-col sm:flex-row gap-6 p-6 md:p-8 bg-white rounded-[3rem] border border-black/10 shadow-md hover:shadow-xl hover:shadow-black/10 transition-all duration-500 group">
                  <div className="relative w-full sm:w-32 aspect-[4/5] sm:aspect-square bg-neutral-100 rounded-2xl overflow-hidden border border-black/5 flex-shrink-0">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl md:text-2xl font-sans font-bold text-charcoal leading-tight pr-8">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-charcoal/20 hover:text-red-500 transition-all p-2 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold mb-1">Base</span>
                          <span className="text-sm font-semibold capitalize">{item.base}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold mb-1">Diseño</span>
                          <span className="text-sm font-semibold capitalize">{item.diseno}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold mb-1">Talla</span>
                          <span className="text-sm font-semibold">{item.talla}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-8">
                      <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-black/5">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white text-charcoal transition-all"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-mono font-bold text-lg">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white text-charcoal transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <span className="block text-charcoal/50 text-xs font-bold uppercase tracking-widest mb-1">Precio</span>
                        <span className="text-2xl font-mono font-bold text-charcoal">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Totals & Coupons */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
            {/* Coupon Card */}
            <div className="checkout-anim p-8 bg-white rounded-[3rem] border border-black/10 shadow-md">
              <h3 className="text-lg font-bold text-charcoal mb-6 flex items-center gap-2">
                <Ticket size={20} className="text-charcoal/60" /> Cupón de Descuento
              </h3>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Código"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className={`w-full px-5 py-4 bg-neutral-50 border ${couponError ? 'border-red-200 focus:border-red-400' : 'border-black/5 focus:border-charcoal'} rounded-2xl outline-none transition-all font-medium text-charcoal uppercase tracking-widest`}
                  />
                  {discount > 0 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in">
                      <ArrowRight size={20} />
                    </div>
                  )}
                </div>
                <button 
                  onClick={applyCoupon}
                  disabled={!coupon || isApplying}
                  className="px-6 py-4 bg-charcoal text-white rounded-2xl font-bold hover:bg-black disabled:bg-neutral-200 disabled:text-charcoal/20 transition-all flex items-center justify-center min-w-[100px]"
                >
                  {isApplying ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Aplicar'}
                </button>
              </div>
              {couponError && <p className="text-red-500 text-xs mt-3 ml-2 font-medium">{couponError}</p>}
              {discount > 0 && <p className="text-green-600 text-xs mt-3 ml-2 font-medium">¡Cupón aplicado con éxito!</p>}
            </div>

            {/* Price Summary Card */}
            <div className="checkout-anim p-10 bg-charcoal text-white rounded-[2.5rem] shadow-2xl shadow-black/20 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10">
                <h3 className="text-2xl font-sans font-bold mb-8">Resumen</h3>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-white/60 font-medium">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">${cartTotal.toLocaleString('es-CL')}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-green-400 font-medium">
                      <span>Descuento</span>
                      <span className="font-mono">-${discount.toLocaleString('es-CL')}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-white/60 font-medium">
                    <span>Despacho</span>
                    <span className="text-xs uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-white/80">Calculado en pago</span>
                  </div>
                  
                  <div className="h-px bg-white/10 my-8" />
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="block text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 leading-none">TOTAL A PAGAR</span>
                      <span className="text-4xl font-mono font-bold leading-none tracking-tight">${finalTotal.toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleProcessOrder}
                  disabled={isProcessing}
                  className="w-full mt-10 py-5 bg-white text-charcoal rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-[0.97] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] disabled:bg-white/50"
                >
                  {isProcessing ? <div className="w-6 h-6 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : <>Procesar Compra <ArrowRight size={20} /></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setShowSuccessModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-700">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-8 right-8 p-2 text-charcoal/20 hover:text-charcoal hover:bg-black/5 rounded-full transition-all"
            >
              <X size={24} />
            </button>

            <div className="p-10 md:p-14 text-center">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-charcoal mb-4">Pedido Recibido #{orderNumber}</h2>
              <p className="text-charcoal/60 text-lg mb-10 max-w-sm mx-auto">Tu pedido ha sido registrado con éxito y ha entrado en la etapa de **confirmación de stock**.</p>
              
              {/* Flow Diagram */}
              <div className="relative mb-12">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-100 -translate-y-1/2 z-0" />
                <div className="relative z-10 flex justify-between">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-charcoal text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                      <Clock size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal">Stock</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 text-charcoal/30 flex items-center justify-center border-2 border-white">
                      <CheckCircle2 size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/30">Confirmado</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 text-charcoal/30 flex items-center justify-center border-2 border-white">
                      <Package size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/30">Producción</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 text-charcoal/30 flex items-center justify-center border-2 border-white">
                      <Truck size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/30">Entregado</span>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 p-8 rounded-[2rem] border border-black/5 text-left mb-10">
                <h4 className="font-bold text-charcoal mb-3 flex items-center gap-2">
                  <Clock size={18} className="text-charcoal/40" /> Próximos pasos
                </h4>
                <p className="text-sm text-charcoal/60 leading-relaxed">
                  Estamos verificando disponibilidad. Una vez confirmado, te enviaremos un correo electrónico a <span className="font-bold text-charcoal">{orderEmail}</span> con los detalles para realizar el pago y pasar tu pedido al estado "Confirmado".
                </p>
              </div>

              <Link 
                href="/tienda" 
                onClick={() => setShowSuccessModal(false)}
                className="inline-flex items-center gap-2 px-10 py-4 bg-charcoal text-white rounded-2xl font-bold hover:bg-black transition-all hover:scale-105"
              >
                Volver a la Tienda <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
