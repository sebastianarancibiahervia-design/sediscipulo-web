import { supabase } from '../supabase';

export interface InventarioBase {
  id: number;
  talla: string;
  color: string;
}

export interface Diseno {
  id: number;
  color: string;
}

export interface TiendaItem {
  id: number;
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
  
  const salesMap = new Map<number, number>();
  salesData?.forEach((s: any) => {
    salesMap.set(s.id_tienda, (salesMap.get(s.id_tienda) || 0) + 1);
  });

  // Cast type correctly based on user structure
  const rawItems = (data as unknown) as TiendaItem[];

  // Group by producto_tienda
  const groupedMap = new Map<string, GroupedProduct>();

  for (const item of rawItems) {
    if (!item.producto_tienda) continue;
    
    const name = item.producto_tienda;
    
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
    }

    const group = groupedMap.get(name)!;
    
    // Add sales weight
    const itemSales = salesMap.get(item.id) || 0;
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
    
    // Fallback images and descriptions to the first found
    if (!group.imagePrincipal && item.imagen_principal) {
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
