"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateSlug } from "@/lib/store/storeServices";
import { 
  Package, 
  User as UserIcon, 
  LogOut, 
  ChevronRight, 
  Clock, 
  Settings,
  CreditCard,
  History,
  Loader2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  X,
  MapPin,
  Fingerprint,
  Mail,
  AlertCircle,
  Upload,
  Coins,
  Copy,
  Check,
  Eye
} from "lucide-react";
import { uploadPaymentReceipt, processOrderPayment } from "@/lib/store/storeServices";
import Image from "next/image";

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
}

function PaymentModal({ order, onClose, onRefresh }: { order: any; onClose: () => void; onRefresh: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `Sebastián Arancibia\n20.728.532-3\nBanco de Chile\nCuenta Vista\n00-011-88211-05\nsebastian.arancibiahervia@gmail.com`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Por favor selecciona una imagen del comprobante");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const receiptPath = await uploadPaymentReceipt(file, order.numero);
      await processOrderPayment(order, receiptPath);
      onRefresh();
      onClose();
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Error al procesar el pago");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden border border-black/10 animate-in fade-in zoom-in-95 duration-300">
        <div className="p-10 md:p-12">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-sans font-bold text-charcoal">Realizar Pago</h3>
            <button onClick={onClose} className="p-2 text-charcoal/40 hover:bg-black/5 rounded-full"><X size={20} /></button>
          </div>

          <div className="mb-8 p-6 bg-neutral-50 rounded-2xl border border-black/5">
            <p className="text-xs font-mono font-bold text-charcoal/40 uppercase tracking-widest mb-3">Monto a Transferir</p>
            <p className="text-4xl font-mono font-bold text-charcoal">${order.monto_total?.toLocaleString('es-CL')}</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider underline decoration-clay/30 underline-offset-4">Datos de Transferencia</h4>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black/5 hover:bg-black/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                {copied ? <><Check size={12} className="text-green-600" /> Copiado</> : <><Copy size={12} /> Copiar Datos</>}
              </button>
            </div>
            <div className="grid grid-cols-[80px_1fr] md:grid-cols-[110px_1fr] gap-x-4 gap-y-3 text-sm">
              <span className="text-charcoal/40 font-medium whitespace-nowrap">Nombre:</span> <span className="font-bold">Sebastián Arancibia</span>
              <span className="text-charcoal/40 font-medium whitespace-nowrap">RUT:</span> <span className="font-bold">20.728.532-3</span>
              <span className="text-charcoal/40 font-medium whitespace-nowrap">Banco:</span> <span className="font-bold">Banco de Chile</span>
              <span className="text-charcoal/40 font-medium whitespace-nowrap">Tipo:</span> <span className="font-bold">Cuenta Vista</span>
              <span className="text-charcoal/40 font-medium whitespace-nowrap">Cuenta:</span> <span className="font-bold">00-011-88211-05</span>
              <span className="text-charcoal/40 font-medium whitespace-nowrap">Email:</span> <span className="font-bold break-all">sebastian.arancibiahervia@gmail.com</span>
            </div>
          </div>

          <div className="pt-6 border-t border-black/5">
            <label className="block text-sm font-bold text-charcoal mb-4">Cargar Comprobante</label>
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`w-full py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${file ? 'border-green-400 bg-green-50/30' : 'border-black/10 group-hover:border-charcoal/30'}`}>
                {file ? (
                  <>
                    <CheckCircle2 className="text-green-500 mb-2" size={32} />
                    <span className="text-xs font-bold text-green-700 truncate max-w-[200px]">{file.name}</span>
                  </>
                ) : (
                  <>
                    <Upload className="text-charcoal/20 mb-2" size={32} />
                    <span className="text-xs font-bold text-charcoal/40">Haz clic o arrastra una imagen</span>
                  </>
                )}
              </div>
            </div>
            {error && <p className="text-red-500 text-xs mt-3 font-medium">{error}</p>}
          </div>

          <button 
            onClick={handleSubmit}
            disabled={!file || uploading}
            className="w-full mt-8 py-5 bg-charcoal text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-black/10"
          >
            {uploading ? <Loader2 size={24} className="animate-spin" /> : "Informar Pago"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const router = useRouter();
  const [showReceipt, setShowReceipt] = useState(false);

  const handleProductLink = (item: any) => {
    if (item.tienda?.activo && item.tienda?.categoria === 'SEDISCIPULO') {
      const slug = generateSlug(item.tienda.producto_tienda);
      router.push(`/tienda/${slug}`);
    } else {
      router.push(`/tienda/no-disponible?name=${encodeURIComponent(item.tienda?.producto_tienda || 'Producto')}`);
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={onClose} />
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden border border-black/5 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-sans font-bold text-charcoal">Detalle del Pedido</h3>
                <p className="text-charcoal/60 text-sm">Realizado el {new Date(order.created_at).toLocaleDateString('es-CL')}</p>
              </div>
              <button onClick={onClose} className="p-2 text-charcoal/40 hover:text-charcoal hover:bg-black/5 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-black/5">
                <p className="text-[10px] font-mono font-bold text-charcoal/40 uppercase tracking-widest mb-1">Estado Pedido</p>
                <p className="text-sm font-bold text-charcoal">{order.estado_pedido || 'Stock por confirmar'}</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-2xl border border-black/5">
                <p className="text-[10px] font-mono font-bold text-charcoal/40 uppercase tracking-widest mb-1">Estado Pago</p>
                <p className="text-sm font-bold text-charcoal">{order.estado_pago || 'Pendiente'}</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {order.detalle_ventas?.map((detalle: any) => (
                <div key={detalle.id} className="flex gap-4 p-4 rounded-2xl border border-black/5 bg-white group hover:border-charcoal/20 transition-all">
                  <div className="relative w-20 h-24 bg-neutral-50 rounded-xl overflow-hidden border border-black/5 flex-shrink-0">
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_CRM_BASE_URL}${detalle.tienda?.imagen_url || '/placeholder.png'}`}
                      alt={detalle.tienda?.producto_tienda || "Producto"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-bold text-charcoal leading-tight mb-1">{detalle.tienda?.producto_tienda || "Item Especial"}</h4>
                    <p className="text-xs text-charcoal/60 mb-2">Cantidad: {detalle.cantidad} • ${detalle.valor_unitario?.toLocaleString('es-CL')} c/u</p>
                    <button 
                      onClick={() => handleProductLink(detalle)}
                      className="text-xs font-bold text-charcoal flex items-center gap-1.5 hover:underline"
                    >
                      Ver en tienda <ExternalLink size={12} />
                    </button>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <p className="text-sm font-mono font-bold text-charcoal">${detalle.valor_total?.toLocaleString('es-CL')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-black/5 space-y-4">
              {order.cupones && (
                <div className="flex justify-between items-center text-green-600 bg-green-50/50 p-4 rounded-2xl border border-green-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 bg-green-100 rounded">CUPÓN</span>
                    <span className="font-bold">{order.cupones.codigo}</span>
                  </div>
                  <span className="font-mono font-bold">-${order.monto_descuento?.toLocaleString('es-CL')}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center px-2">
                <span className="text-lg font-medium text-charcoal/60">Total Pedido</span>
                <span className="text-3xl font-mono font-bold text-charcoal">${order.monto_total?.toLocaleString('es-CL')}</span>
              </div>

              {order.movimientos?.[0]?.comprobante_url && (
                <div className="mt-6 pt-6 border-t border-black/5">
                  <button 
                    onClick={() => setShowReceipt(true)}
                    className="w-full py-4 bg-neutral-50 hover:bg-black/5 border border-black/5 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold text-charcoal transition-all group"
                  >
                    <Eye size={18} className="text-charcoal/40 group-hover:text-charcoal transition-colors" /> Ver Comprobante de Pago
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReceipt && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-md" onClick={() => setShowReceipt(false)} />
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden border border-black/10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-bold text-charcoal">Comprobante de Pago</h4>
                <button onClick={() => setShowReceipt(false)} className="p-2 text-charcoal/40 hover:bg-black/5 rounded-full"><X size={20} /></button>
              </div>
              <div className="relative aspect-[4/3] bg-neutral-50 rounded-2xl overflow-hidden border border-black/5 shadow-inner">
                <img 
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/movimientos_bancarios/${order.movimientos[0].comprobante_url}`} 
                  alt="Comprobante de pago"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-6 flex gap-3">
                <a 
                  href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/movimientos_bancarios/${order.movimientos[0].comprobante_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-4 bg-charcoal text-white rounded-xl font-bold text-center hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink size={18} /> Ver Pantalla Completa
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ProfileClient() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pedidos" | "datos">("pedidos");
  const [clientData, setClientData] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<any | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  
  // Settings form states
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rut, setRut] = useState("");
  const [direccion, setDireccion] = useState("");
  
  // Password form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/auth/login");
        return;
      }

      setUser(session.user);
      
      // Fetch data from 'clientes' table
      const { data: client } = await supabase
        .from("clientes")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (client) {
        setClientData(client);
        setNombre(client.nombre || "");
        setTelefono(client.telefono || "");
        
        // Parse RUT and Direction from 'notas'
        if (client.notas) {
          const rutMatch = client.notas.match(/RUT:\s*(.*)/);
          const dirMatch = client.notas.match(/Dirección:\s*(.*)/);
          if (rutMatch) setRut(rutMatch[1]);
          if (dirMatch) setDireccion(dirMatch[1]);
        }
        
        fetchOrders(client.id);
      }
      
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const fetchOrders = async (clientId: number) => {
    setLoadingPedidos(true);
    // Fetch from 'ventas' using the exact column names provided by the user
    const { data: sales, error } = await supabase
      .from("ventas")
      .select(`
        *,
        cupones (
          codigo,
          descuento_porcentaje
        ),
        movimientos (
          comprobante_url
        ),
        detalle_ventas (
          *,
          tienda (*)
        )
      `)
      .eq("id_cliente", clientId)
      .order("created_at", { ascending: false });

    if (!error && sales) {
      setPedidos(sales);
    }
    setLoadingPedidos(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    
    const notasFormatted = `RUT: ${rut}\nDirección: ${direccion}`;
    
    const { error } = await supabase
      .from("clientes")
      .update({
        nombre,
        telefono,
        notas: notasFormatted
      })
      .eq("user_id", user?.id);

    if (!error) {
      alert("¡Datos actualizados correctamente!");
    }
    setSavingSettings(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(false);

    if (newPassword !== confirmPassword) {
      setPassError("Las contraseñas nuevas no coinciden");
      return;
    }

    setLoading(true);
    
    // First verify current password by re-signing in (Supabase way to confirm current pass)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email || "",
      password: currentPassword,
    });

    if (signInError) {
      setPassError("La contraseña actual es incorrecta");
      setLoading(false);
      return;
    }

    // Now update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      setPassError(updateError.message);
    } else {
      setPassSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading && !clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-charcoal/40" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-neutral-50 rounded-3xl p-8 border border-black/5 sticky top-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-charcoal rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {nombre?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-xl font-bold text-charcoal truncate">{nombre || "Usuario"}</h2>
                <p className="text-xs font-mono text-charcoal/40 truncate">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab("pedidos")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'pedidos' ? 'bg-charcoal text-white shadow-md shadow-charcoal/10' : 'text-charcoal/60 hover:bg-black/5'}`}
              >
                <Package size={18} /> Mis Pedidos
              </button>
              <button 
                onClick={() => setActiveTab("datos")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'datos' ? 'bg-charcoal text-white shadow-md shadow-charcoal/10' : 'text-charcoal/60 hover:bg-black/5'}`}
              >
                <UserIcon size={18} /> Mis Datos
              </button>
              <hr className="my-4 border-black/5" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut size={18} /> Cerrar Sesión
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:w-3/4">
          {activeTab === "pedidos" ? (
            <div>
              <header className="mb-10">
                <h1 className="text-4xl font-sans font-bold text-charcoal mb-2">Historial de <span className="font-serif italic text-black">Pedidos</span></h1>
                <p className="text-charcoal/60">Gestiona tus compras y pedidos activos</p>
              </header>

              {loadingPedidos ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="animate-spin text-charcoal/20" size={32} />
                </div>
              ) : pedidos.length === 0 ? (
                <div className="bg-neutral-50 rounded-3xl p-12 text-center border border-dashed border-black/10">
                  <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4 text-charcoal/30">
                    <History size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-2">Aún no tienes pedidos</h3>
                  <p className="text-charcoal/60 mb-8 max-w-sm mx-auto">Cuando realices una compra o se te asigne un pedido especial, aparecerá aquí.</p>
                  <button 
                    onClick={() => router.push("/tienda")}
                    className="px-8 py-3 bg-charcoal text-white rounded-xl font-bold hover:bg-black transition-colors"
                  >
                    Ir a la Tienda
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {pedidos.map((pedido) => (
                    <div key={pedido.id} className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="bg-neutral-50 p-6 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex gap-8">
                          <div>
                            <p className="text-[10px] font-mono font-bold text-charcoal/40 uppercase tracking-widest mb-1">Fecha</p>
                            <p className="text-sm font-bold text-charcoal">{new Date(pedido.created_at).toLocaleDateString('es-CL')}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono font-bold text-charcoal/40 uppercase tracking-widest mb-1">Total</p>
                            <p className="text-sm font-bold text-charcoal">${pedido.monto_total?.toLocaleString('es-CL')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            pedido.estado_pedido === 'Entregado' ? 'bg-green-100 text-green-700' : 
                            pedido.estado_pedido === 'Cancelado' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {pedido.estado_pedido || 'En Proceso'}
                          </span>
                          <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            pedido.estado_pago === 'Pagado' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {pedido.estado_pago || 'Pendiente'}
                          </span>
                          {pedido.estado_pedido?.toUpperCase() === 'PEDIDO CONFIRMADO' && pedido.estado_pago?.toUpperCase() === 'POR PAGAR' && (
                            <button 
                              onClick={() => setPaymentOrder(pedido)}
                              className="px-4 py-2 bg-clay text-white rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-clay/10"
                            >
                              <Coins size={14} /> Ir a pagar
                            </button>
                          )}
                          <button 
                            onClick={() => setSelectedOrder(pedido)}
                            className="p-2 text-charcoal/40 hover:text-charcoal hover:bg-black/5 rounded-full transition-all"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                          {pedido.detalle_ventas?.map((detalle: any) => (
                            <div key={detalle.id} className="flex-shrink-0 flex items-center gap-4 p-3 rounded-2xl bg-neutral-50 border border-black/5 min-w-[280px]">
                              <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden border border-black/5">
                                <Image 
                                  src={`${process.env.NEXT_PUBLIC_CRM_BASE_URL}${detalle.tienda?.imagen_url || '/placeholder.png'}`}
                                  alt={detalle.tienda?.producto_tienda || "Producto"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-charcoal truncate max-w-[180px]">{detalle.tienda?.producto_tienda || "Item Especial"}</h4>
                                <p className="text-[10px] text-charcoal/60 mt-0.5">Cantidad: {detalle.cantidad} • ${detalle.valor_unitario?.toLocaleString('es-CL')}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              <section>
                <header className="mb-10">
                  <h1 className="text-4xl font-sans font-bold text-charcoal mb-2">Mis <span className="font-serif italic text-black">Datos</span></h1>
                  <p className="text-charcoal/60">Gestiona tu información personal y de envío</p>
                </header>

                <div className="bg-neutral-50 rounded-3xl p-10 border border-black/5">
                  <form className="space-y-6 max-w-2xl" onSubmit={handleUpdateProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-mono font-medium text-charcoal/70 mb-2 uppercase tracking-wider">Nombre Completo</label>
                        <input 
                          type="text" 
                          value={nombre} 
                          onChange={(e) => setNombre(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:ring-2 focus:ring-charcoal/20 transition-all outline-none"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-xs font-mono font-medium text-charcoal/70 mb-2 uppercase tracking-wider">Teléfono</label>
                        <input 
                          type="tel" 
                          value={telefono} 
                          onChange={(e) => setTelefono(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:ring-2 focus:ring-charcoal/20 transition-all outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-mono font-medium text-charcoal/70 mb-2 uppercase tracking-wider flex justify-between items-center">
                          <span>Correo Electrónico</span>
                          <span className="text-[9px] text-charcoal/40 lowercase italic font-normal">No editable</span>
                        </label>
                        <div className="relative">
                          <input 
                            disabled 
                            type="email" 
                            value={user?.email || ""} 
                            className="w-full px-4 py-3 bg-neutral-100 border border-black/5 rounded-xl text-charcoal/40 cursor-not-allowed"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Link href="mailto:sediscipulo@agenciatab.cl" className="text-[10px] font-bold text-charcoal hover:underline">Contactar soporte</Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-black/5">
                      <h3 className="text-xs font-mono font-bold text-charcoal/30 mb-6 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={14} /> Datos de Envío
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-mono font-medium text-charcoal/70 mb-2 uppercase tracking-wider">RUT</label>
                          <input 
                            type="text" 
                            value={rut} 
                            placeholder="12.345.678-9"
                            onChange={(e) => setRut(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:ring-2 focus:ring-charcoal/20 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono font-medium text-charcoal/70 mb-2 uppercase tracking-wider">Dirección de Envío</label>
                          <input 
                            type="text" 
                            value={direccion} 
                            placeholder="Calle 123, Ciudad"
                            onChange={(e) => setDireccion(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:ring-2 focus:ring-charcoal/20 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button 
                        type="submit"
                        disabled={savingSettings}
                        className="px-10 py-4 bg-charcoal text-white rounded-xl font-bold hover:bg-black transition-all hover:scale-[1.02] shadow-lg flex items-center gap-2 disabled:opacity-50"
                      >
                        {savingSettings ? <Loader2 size={18} className="animate-spin" /> : "Guardar Cambios"}
                      </button>
                    </div>
                  </form>
                </div>
              </section>

              <section>
                <div className="bg-neutral-50 rounded-3xl p-10 border border-black/5">
                  <header className="mb-8">
                    <h3 className="text-xl font-bold text-charcoal flex items-center gap-2">
                      <Fingerprint size={20} className="text-black/20" /> Seguridad
                    </h3>
                    <p className="text-sm text-charcoal/60 mt-1">Cambia tu contraseña de acceso</p>
                  </header>

                  <form className="space-y-6 max-w-2xl" onSubmit={handleChangePassword}>
                    {passError && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600 text-sm">
                        <AlertCircle size={18} className="flex-shrink-0" />
                        <p>{passError}</p>
                      </div>
                    )}
                    {passSuccess && (
                      <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex gap-3 text-green-600 text-sm">
                        <CheckCircle2 size={18} className="flex-shrink-0" />
                        <p>Contraseña actualizada correctamente</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-mono font-medium text-charcoal/70 mb-2 uppercase tracking-wider">Contraseña Actual</label>
                        <input 
                          required
                          type="password" 
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:ring-2 focus:ring-charcoal/20 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-medium text-charcoal/70 mb-2 uppercase tracking-wider">Nueva Contraseña</label>
                        <input 
                          required
                          type="password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:ring-2 focus:ring-charcoal/20 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-medium text-charcoal/70 mb-2 uppercase tracking-wider">Confirmar Nueva Contraseña</label>
                        <input 
                          required
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:ring-2 focus:ring-charcoal/20 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        className="px-8 py-3 bg-neutral-200 text-charcoal rounded-xl font-bold hover:bg-charcoal hover:text-white transition-all"
                      >
                        Actualizar Contraseña
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}

      {/* Payment Modal */}
      {paymentOrder && (
        <PaymentModal 
          order={paymentOrder} 
          onClose={() => setPaymentOrder(null)} 
          onRefresh={() => fetchOrders(clientData.id)}
        />
      )}
    </div>
  );
}
