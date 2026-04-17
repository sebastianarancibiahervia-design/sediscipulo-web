# Hoja de Ruta - SeDiscipulo

Registro de arreglos, mejoras e ideas para la evolución del sistema.

## Implementaciones Recientes
- [x] **Optimización de Servidor**: Migración a Next.js 15 con Turbopack para inicios en < 4s.
- [x] **Filtros de Doble Nivel**: Jerarquía `Familia > Categoría` implementada en la Tienda.
- [x] **Vistas de Producto Dinámicas**: Interfaz simplificada para `LIBRERIA` (sin selectores de ropa).
- [x] **Soporte de Video**: Integración de FB Reels y YouTube en el detalle del producto.
- [x] **Sistema de Calificaciones**: Valoración con estrellas (1-5) y comentarios para compradores.
- [x] **Estabilización de Producción**: Limpieza exhaustiva de ESLint, corrección de dependencias y validación de build v12 exitosa.

## Próximos Pasos
- [ ] **Buscador Global**: Mejorar la Topbar con búsqueda predictiva de productos.
- [ ] **Check de Consistencia**: Auditar que todos los productos tengan asignada una familia válida.
- [ ] **Reportes de Venta por Familia**: Visualización en el Dashboard de métricas por grupo.
- [ ] **Gestión de Waitlist (CRM)**: Agregar funcionalidad en el SaaS interno para mover productos sin stock hacia la tabla `ventas_esperando_stock`.
- [ ] **Integración WhatsApp API**: Sistema automático de notificaciones para cuando un carrito pase a `Pedido confirmado`, enviando el detalle de montos finales y productos que entraron a lista de espera.
