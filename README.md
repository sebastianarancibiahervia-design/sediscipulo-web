# SeDiscipulo - SaaS de Gestión y Tienda

Sistema operativo profesional diseñado para la gestión integral de ventas, inventario y catálogo de productos de SeDiscipulo.

## Módulos del Sistema

### 1. Dashboard de Control
Visualización de métricas críticas: ventas del día, ingresos mensuales y productos más populares.

### 2. Tienda Online (Catálogo)
Módulo público de exhibición con sistema de filtrado avanzado por Familias y Categorías.
- **Jerarquía**: Familia (Ropa, Accesorios, Librería) -> Categoría específica.
- **Filtro Sediscipulo**: Solo muestra contenido bajo la etiqueta operativa `SEDISCIPULO`.

### 3. Gestión de Inventario (CRUD)
Control total sobre stock, variantes (tallas/colores) y diseños personalizados.

### 4. Ventas y Pagos
Manejo de pedidos, integración con estados de pago y carga de comprobantes mediante Supabase Storage.

## Stack Tecnológico
- **Frontend**: React 19 + Next.js (Turbopack).
- **Estilos**: Tailwind CSS 3.4.
- **Backend & DB**: Supabase.
- **Animaciones**: GSAP para micro-interacciones.

## Principios de Diseño
- **Operational Clean**: Interfaz rápida y clara para productividad real.
- **Velocidad Cognitiva**: Entendimiento instantáneo de la navegación operativa.
