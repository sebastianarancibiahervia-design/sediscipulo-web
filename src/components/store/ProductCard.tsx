"use client";

import Link from "next/link";
import Image from "next/image";

import { GroupedProduct } from "@/lib/store/storeServices";

interface ProductCardProps {
  producto: GroupedProduct;
}

/**
 * Helper para obtener la URL completa de la imagen usando la variable de entorno.
 * En Next.js accedemos a process.env.NEXT_PUBLIC_CRM_BASE_URL en lugar de import.meta.env
 */
export function getProductImageUrl(imagePath: string): string {
  if (!imagePath) return "";
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const baseUrl = process.env.NEXT_PUBLIC_CRM_BASE_URL || "";
  // Evitar doble barra si ya la tiene
  return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const fullImageUrl = getProductImageUrl(producto.imagePrincipal);

  return (
    <Link href={`/tienda/${producto.slug}`} className="group flex flex-col">
      <div className="relative aspect-[4/5] bg-neutral-100 rounded-2xl overflow-hidden border border-black/5 mb-4 group-hover:border-black/20 transition-all shadow-sm group-hover:shadow-xl">
        
        {/* Usando la etiqueta solicitada y Next Image como ejemplo */}
        {fullImageUrl && !fullImageUrl.endsWith('/') ? (
          <Image 
            src={fullImageUrl} 
            alt={producto.name} 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center p-6 text-center">
            <p className="text-xs font-mono font-bold text-charcoal/20 uppercase tracking-widest leading-loose">
              Imagen en<br/>construcción...
            </p>
          </div>
        )}
        
        {/* Next.js Image Component (Recomendado para optimización) 
        <Image
          src={fullImageUrl}
          alt={producto.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        */}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-sans font-bold text-lg text-charcoal group-hover:underline decoration-2 underline-offset-4">
          {producto.name}
        </h3>
        <p className="font-mono text-sm text-charcoal/60">
          ${producto.price.toLocaleString('es-CL')}
        </p>
      </div>
    </Link>
  );
}
