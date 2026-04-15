"use client";

import { useState, useMemo } from "react";
import { Filter, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { GroupedProduct } from "@/lib/store/storeServices";

export default function TiendaClient({ initialProducts }: { initialProducts: GroupedProduct[] }) {
  const [selectedFamily, setSelectedFamily] = useState<string>("TODOS");
  const [selectedCategory, setSelectedCategory] = useState<string>("TODOS");
  const [sortOrder, setSortOrder] = useState<string>("destacados");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Extract families and categories mapping
  const categoryStructure = useMemo(() => {
    const families = new Set<string>();
    const familyToCats = new Map<string, Set<string>>();

    initialProducts.forEach(p => {
      p.families.forEach(f => {
        families.add(f);
        if (!familyToCats.has(f)) familyToCats.set(f, new Set());
        
        // Find which categories of this product belong to this family
        // Note: In a real scenario, we might need a more precise mapping, 
        // but for now we'll assume the product's subcategories belong to its families.
        p.subcategories.forEach(s => familyToCats.get(f)!.add(s));
      });
    });

    return {
      families: Array.from(families).sort(),
      familyToCats: familyToCats
    };
  }, [initialProducts]);

  // Determine which subcategories to show in the second bar
  const visibleCategories = useMemo(() => {
    if (selectedFamily === "TODOS") {
      const allCats = new Set<string>();
      categoryStructure.familyToCats.forEach(cats => cats.forEach(c => allCats.add(c)));
      return Array.from(allCats).sort();
    }
    return Array.from(categoryStructure.familyToCats.get(selectedFamily) || []).sort();
  }, [selectedFamily, categoryStructure]);

  // Filtering
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];
    
    // Filter by Family
    if (selectedFamily !== "TODOS") {
      result = result.filter(p => p.families.includes(selectedFamily));
    }

    // Filter by Category
    if (selectedCategory !== "TODOS") {
      result = result.filter(p => p.subcategories.includes(selectedCategory));
    }

    // Sorting
    if (sortOrder === "destacados") {
      result.sort((a, b) => b.totalSales - a.totalSales);
    } else if (sortOrder === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "alpha-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "alpha-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [initialProducts, selectedFamily, selectedCategory, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFamilyChange = (family: string) => {
    setSelectedFamily(family);
    setSelectedCategory("TODOS"); // Reset category when family changes
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-sans font-bold">
              Catálogo <span className="font-serif italic text-black">SeDiscipulo</span>
            </h1>
            <p className="text-lg text-charcoal/60 max-w-2xl">
              Explora nuestros diseños disponibles
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-4 self-start md:self-auto">
            <div className="relative group min-w-[200px]">
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full appearance-none bg-neutral-100 border border-black/5 text-charcoal text-sm font-medium rounded-lg px-4 py-2.5 pr-10 outline-none cursor-pointer focus:border-black/20 hover:bg-neutral-200 transition-colors"
              >
                <option value="destacados">Ordenar por: Destacados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="alpha-asc">Nombre: A - Z</option>
                <option value="alpha-desc">Nombre: Z - A</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/50" />
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col gap-4 border-y border-black/5 py-8">
          {/* Level 1: Families */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-charcoal/30 uppercase tracking-[0.2em] px-1">Familia</span>
            <div className="flex flex-nowrap overflow-x-auto gap-3 scrollbar-hide no-scrollbar pb-2">
              <button
                onClick={() => handleFamilyChange("TODOS")}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  selectedFamily === "TODOS"
                    ? "bg-charcoal text-white border-charcoal shadow-md scale-105"
                    : "bg-white text-charcoal/40 border-black/5 hover:border-black/20"
                }`}
              >
                TODOS
              </button>
              {categoryStructure.families.map((family) => (
                <button
                  key={family}
                  onClick={() => handleFamilyChange(family)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-bold transition-all border uppercase ${
                    selectedFamily === family
                      ? "bg-charcoal text-white border-charcoal shadow-md scale-105"
                      : "bg-white text-charcoal/40 border-black/5 hover:border-black/20"
                  }`}
                >
                  {family}
                </button>
              ))}
            </div>
          </div>

          {/* Level 2: Categories (Nombre) */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-bold text-charcoal/30 uppercase tracking-[0.2em] px-1">Categoría</span>
            <div className="flex flex-nowrap overflow-x-auto gap-3 scrollbar-hide no-scrollbar pb-2">
              <button
                onClick={() => handleCategoryChange("TODOS")}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  selectedCategory === "TODOS"
                    ? "bg-charcoal/80 text-white border-charcoal/80 shadow-sm"
                    : "bg-neutral-50 text-charcoal/40 border-black/5 hover:border-black/20"
                }`}
              >
                {selectedFamily === "TODOS" ? "TODAS" : `TODO EN ${selectedFamily}`}
              </button>
              {visibleCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-bold transition-all border uppercase ${
                    selectedCategory === cat
                      ? "bg-charcoal/80 text-white border-charcoal/80 shadow-sm"
                      : "bg-neutral-50 text-charcoal/40 border-black/5 hover:border-black/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      <div className="w-full">
        {paginatedProducts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-neutral-50 rounded-2xl border border-black/5">
            <Filter size={32} className="text-charcoal/20 mb-4" />
            <h3 className="text-xl font-bold text-charcoal mb-2">Sin resultados</h3>
            <p className="text-charcoal/60 max-w-sm">No encontramos productos que coincidan con estos filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.slug} producto={product} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 pt-12 border-t border-black/5">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border transition-all ${
              currentPage === 1 
                ? "text-charcoal/20 border-black/5 cursor-not-allowed" 
                : "text-charcoal border-black/10 hover:border-black/30 bg-white"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                  currentPage === i + 1
                    ? "bg-charcoal text-white shadow-md scale-105"
                    : "text-charcoal/40 hover:text-charcoal bg-neutral-50 hover:bg-neutral-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg border transition-all ${
              currentPage === totalPages 
                ? "text-charcoal/20 border-black/5 cursor-not-allowed" 
                : "text-charcoal border-black/10 hover:border-black/30 bg-white"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
