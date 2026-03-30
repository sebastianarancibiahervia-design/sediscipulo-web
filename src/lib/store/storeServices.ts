import { supabase } from '../supabase';

export interface InventarioBase {
  id: string;
  talla: string;
  color: string;
}

export interface Diseno {
  id: string;
  color: string;
}

export interface TiendaItem {
  id: string;
  producto_tienda: string;
  valor_tienda: number;
  categoria: string | null;
  descripcion: string | null;
  imagen_principal: string;
  imagen_url: string;
  imagen_url_2: string | null;
  activo: boolean;
  subcategorias: string[] | null; // Array of UUIDs
  inventario_base: InventarioBase | null;
  disenos: Diseno | null;
}

export interface CategoriaProducto {
  id: string; // UUID
  nombre: string;
}

export interface GroupedProduct {
  name: string;
  slug: string;
  price: number;
  categories: string[];
  subcategories: string[]; // List of names
  description: string;
  imagePrincipal: string; 
  totalSales: number;
  variations: TiendaItem[];
}

export interface DetallePromocion {
  id: string;
  id_promocion: string;
  id_tienda: string;
  precio_promocional: number;
  unidades_limitadas: number | null;
  unidades_vendidas: number;
  tienda?: TiendaItem;
}

export interface Promocion {
  id: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
  detalle_promociones?: DetallePromocion[];
}

export async function fetchActivePromotions(): Promise<Promocion[]> {
  const today = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('promociones')
    .select(`
      id,
      nombre,
      fecha_inicio,
      fecha_fin,
      activa,
      detalle_promociones (
        id,
        id_promocion,
        id_tienda,
        precio_promocional,
        unidades_limitadas,
        unidades_vendidas,
        tienda (
          id,
          producto_tienda,
          valor_tienda,
          imagen_url
        )
      )
    `)
    .eq('activa', true)
    .lte('fecha_inicio', today)
    .gte('fecha_fin', today);
    
  if (error) {
    console.error("Error fetching active promotions:", error);
    return [];
  }
  
  // Filter out exhausted promotional stock on the client processing side
  const validData = (data as any[]).map(promo => {
    if (promo.detalle_promociones) {
      promo.detalle_promociones = promo.detalle_promociones.filter((detail: any) => 
        detail.unidades_limitadas === null || detail.unidades_vendidas < detail.unidades_limitadas
      );
    }
    return promo;
  });
  
  return validData as Promocion[];
}

// Utility to create URL-friendly slugs
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Remove diacritics
    .replace(/[\/\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export async function fetchActiveStoreProducts(): Promise<GroupedProduct[]> {
  const { data, error } = await supabase
    .from('tienda')
    .select(`
      id, 
      producto_tienda, 
      valor_tienda, 
      categoria, 
      descripcion, 
      imagen_principal, 
      imagen_url, 
      imagen_url_2, 
      activo,
      subcategorias,
      inventario_base (id, talla, color),
      disenos (id, color)
    `)
    .eq('activo', true)
    .eq('categoria', 'SEDISCIPULO')
    
  if (error) {
    console.error("Error fetching products from supabase:", error);
    return [];
  }

  // Fetch Category labels
  const { data: catData } = await supabase
    .from('categorias_producto')
    .select('id, nombre')
    .eq('activo', true);

  const categoryMap = new Map<string, string>();
  catData?.forEach((c: any) => categoryMap.set(c.id, c.nombre));

  // Fetch Sales counts from detalle_ventas
  const { data: salesData } = await supabase
    .from('detalle_ventas')
    .select('id_tienda');
  
  const salesMap = new Map<string, number>();
  salesData?.forEach((s: any) => {
    salesMap.set(s.id_tienda, (salesMap.get(s.id_tienda) || 0) + 1);
  });

  // Cast type correctly based on user structure
  const rawItems = (data as unknown) as TiendaItem[];

  // Group by producto_tienda
  const groupedMap = new Map<string, GroupedProduct>();
  const topVariationSales = new Map<string, number>();

  for (const item of rawItems) {
    if (!item.producto_tienda) continue;
    
    const name = item.producto_tienda;
    const itemSales = salesMap.get(item.id) || 0;
    
    if (!groupedMap.has(name)) {
      // Create new group
      groupedMap.set(name, {
        name: name,
        slug: generateSlug(name),
        price: item.valor_tienda, 
        categories: item.categoria ? [item.categoria] : [],
        subcategories: [],
        description: item.descripcion || '',
        imagePrincipal: item.imagen_principal || '',
        totalSales: 0,
        variations: [],
      });
      if (item.imagen_principal) {
        topVariationSales.set(name, itemSales);
      }
    }

    const group = groupedMap.get(name)!;
    
    // Add cumulative sales weight to the group
    if (groupedMap.has(name) && item.id !== rawItems.find(r => r.producto_tienda === name)?.id) {
        // Just adding safety to not double count the first item which might have already been counted before?
        // Wait, the original code did `group.totalSales += itemSales` for ALL items, including the first one!
        // The first item was NOT added to totalSales when the group was created (totalSales: 0).
        // So I must add it here!
    }
    group.totalSales += itemSales;
    
    // Add missing category if any
    if (item.categoria && !group.categories.includes(item.categoria)) {
      group.categories.push(item.categoria);
    }

    // Resolve subcategories
    if (item.subcategorias && Array.isArray(item.subcategorias)) {
      item.subcategorias.forEach(subId => {
        const label = categoryMap.get(subId);
        if (label && !group.subcategories.includes(label)) {
          group.subcategories.push(label);
        }
      });
    }
    
    // Update imagePrincipal if this variation has more sales and has an image
    const currentTop = topVariationSales.get(name) ?? -1;
    if (item.imagen_principal && itemSales > currentTop) {
      topVariationSales.set(name, itemSales);
      group.imagePrincipal = item.imagen_principal;
    } else if (!group.imagePrincipal && item.imagen_principal) {
      // Fallback
      group.imagePrincipal = item.imagen_principal;
    }

    if (!group.description && item.descripcion) {
      group.description = item.descripcion;
    }
    
    group.variations.push(item);
  }

  return Array.from(groupedMap.values());
}

export async function fetchProductGroupBySlug(slug: string): Promise<GroupedProduct | null> {
  const allGroups = await fetchActiveStoreProducts();
  const product = allGroups.find(p => p.slug === slug);
  return product || null;
}

export interface Coupon {
  id: string;
  codigo: string;
  descuento_porcentaje: number;
  activo: boolean;
  fecha_caducidad: string;
  max_usos: number;
}

export async function validateCoupon(code: string, userId: string): Promise<{ success: boolean; discount?: number; couponId?: string; message?: string }> {
  const { data: coupon, error } = await supabase
    .from('cupones')
    .select('*')
    .eq('codigo', code)
    .single();

  if (error || !coupon) {
    return { success: false, message: "El código de cupón no existe." };
  }

  const now = new Date();
  const expirationDate = new Date(coupon.fecha_caducidad);

  if (!coupon.activo || now > expirationDate) {
    return { success: false, message: "El cupón ha expirado o no está activo." };
  }

  // 1. Fetch internal client ID for this user
  const { data: client, error: clientErr } = await supabase
    .from('clientes')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (clientErr || !client) {
    console.error("Error fetching client for coupon validation:", clientErr);
    return { success: false, message: "No se encontró registro de cliente para este usuario." };
  }

  const clientId = client.id;

  // 2. Check usage limit for this user in ventas using the real id_cliente
  const { count, error: countError } = await supabase
    .from('ventas')
    .select('*', { count: 'exact', head: true })
    .eq('id_cliente', clientId)
    .eq('id_cupon', coupon.id);

  if (countError) {
    console.error("Error checking coupon usage:", countError);
    return { success: false, message: "Error al validar el uso del cupón." };
  }

  if (count !== null && count >= coupon.max_usos) {
    return { success: false, message: `Has alcanzado el límite de usos (${coupon.max_usos}) para este cupón.` };
  }

  return { 
    success: true, 
    discount: coupon.descuento_porcentaje / 100, 
    couponId: coupon.id 
  };
}

export interface OrderItem {
  id_tienda: string;
  cantidad: number;
  valor_unitario: number;
  descripcion: string;
}

export async function createOrder(
  authUid: string, 
  items: OrderItem[], 
  subtotal: number, 
  total: number, 
  couponId?: string
) {
  // 0. Get internal Client ID and details from clientes table
  console.log("Creating order for authUid:", authUid);
  const { data: client, error: clientError } = await supabase
    .from('clientes')
    .select('id, nombre, email')
    .eq('user_id', authUid)
    .single();

  if (clientError || !client) {
    console.error("Error fetching client ID:", clientError);
    throw new Error(`No se encontró cliente para UID ${authUid}. Por favor revisa si tu perfil está completo.`);
  }

  const clientId = client.id;
  const clientEmail = client.email;
  const clientName = client.nombre;
  console.log("Found clientId:", clientId);

  // 0.1 Strict Coupon Validation (Prevent double use at the moment of purchase)
  if (couponId) {
    const { data: coupon, error: couponErr } = await supabase
      .from('cupones')
      .select('max_usos, codigo')
      .eq('id', couponId)
      .single();
    
    if (!couponErr && coupon) {
      const { count } = await supabase
        .from('ventas')
        .select('*', { count: 'exact', head: true })
        .eq('id_cliente', clientId)
        .eq('id_cupon', couponId);
      
      if (count !== null && count >= coupon.max_usos) {
        throw new Error(`El cupón ${coupon.codigo} ya alcanzó su límite de usos para tu cuenta.`);
      }
    }
  }

  // 1. Get next correlative number
  const { data: lastOrders, error: fetchError } = await supabase
    .from('ventas')
    .select('numero')
    .order('numero', { ascending: false })
    .limit(1);

  const nextOrderNumber = (lastOrders && lastOrders.length > 0) 
    ? (lastOrders[0].numero || 0) + 1 
    : 1;

  // 2. Insert into ventas
  const { data: venta, error: ventaError } = await supabase
    .from('ventas')
    .insert({
      id_cliente: clientId,
      nombre_cliente: clientName,
      id_cupon: couponId || null,
      monto_total: Math.round(total),
      monto_descuento: Math.round(subtotal - total),
      estado_pedido: "Stock por confirmar",
      estado_pago: "Por pagar",
      numero: nextOrderNumber
    })
    .select()
    .single();

  if (ventaError) {
    console.error("Error creating venta record:", ventaError);
    throw new Error(`Error al procesar el pedido (Ventas): ${ventaError.message}`);
  }

  // 3. Insert into detalle_ventas
  const detailRecords = items.map(item => ({
    id_venta: venta.id,
    id_tienda: item.id_tienda,
    cantidad: item.cantidad,
    valor_unitario: Math.round(item.valor_unitario),
    descripcion: item.descripcion
  }));

  const { error: detailError } = await supabase
    .from('detalle_ventas')
    .insert(detailRecords);

  if (detailError) {
    console.error("Error creating detalle_ventas records:", detailError);
    throw new Error(`Error en el detalle de venta: ${detailError.message}`);
  }

  // 4. Update promotional stock if applicable
  try {
    const activePromos = await fetchActivePromotions();
    for (const item of items) {
      for (const promo of activePromos) {
        const match = promo.detalle_promociones?.find(d => d.id_tienda === item.id_tienda);
        if (match) {
          // Increment unidades_vendidas
          const newSoldCounter = match.unidades_vendidas + item.cantidad;
          const { error: promoUpdateErr } = await supabase
            .from('detalle_promociones')
            .update({ unidades_vendidas: newSoldCounter })
            .eq('id', match.id);
          
          if (promoUpdateErr) {
            console.error(`Error updating promotion stock for ${item.id_tienda}:`, promoUpdateErr);
          }
        }
      }
    }
  } catch (promoErr) {
    console.error("Error processing promotional stock adjustments:", promoErr);
  }

  return { ...venta, email: clientEmail };
}

export async function uploadPaymentReceipt(file: File, orderNumber: number) {
  const fileExt = file.name.split('.').pop();
  const fileName = `receipt_V${orderNumber}_${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { data, error } = await supabase.storage
    .from('movimientos_bancarios')
    .upload(filePath, file);

  if (error) throw error;
  return data.path;
}

export async function processOrderPayment(order: any, receiptPath: string) {
  // 1. Update status in 'ventas' table
  const { error: ventaError } = await supabase
    .from('ventas')
    .update({ 
      estado_pago: 'Pagado'
    })
    .eq('id', order.id);

  if (ventaError) throw ventaError;

  // 2. Create record in 'movimientos' table
  const { error: movError } = await supabase
    .from('movimientos')
    .insert({
      identificador: `V${order.numero}`,
      id_banco_desde: null,
      id_banco_hacia: 'cc3680a7-4e5f-4c0b-9f0d-6d924d596ccf',
      monto: order.monto_total,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'Ingreso',
      comprobante_url: receiptPath,
      descripcion: 'POR REVISAR',
      id_venta: order.id,
      estado: 'Por confirmar'
    });

  if (movError) {
    console.error("Error creating bank movement record:", movError);
    throw new Error(`Error al registrar el movimiento bancario: ${movError.message}`);
  }
  // Note: We don't rollback the sale status here to avoid weird UI states, 
  // but in a production app we might use a RPC or transaction.

  return { success: true };
}
