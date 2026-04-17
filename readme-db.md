# Arquitectura de Datos - SeDiscipulo

Este documento detalla la estructura de la base de datos en Supabase, las relaciones entre tablas y las restricciones clave para el funcionamiento operativo del sistema.

## Tablas del Sistema

### `categorias_producto`
Define la jerarquía de clasificación de los productos en la tienda.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único (PK). |
| `nombre` | VARCHAR | Nombre de la categoría (ej: "CAMISETAS", "LIBROS"). |
| `slug` | VARCHAR | Identificador amigable para URL. |
| `familia` | VARCHAR | Grupo superior (ej: "ROPA", "LIBRERIA", "ACCESORIOS"). |
| `tipo` | VARCHAR | Clasificación técnica (Enum: `PRODUCTO`, `SERVICIO`). |
| `activo` | BOOLEAN | Estado de visibilidad en el sistema. |
| `created_at` | TIMESTAMPTZ | Fecha de creación. |

> [!IMPORTANT]
> **Restricción `tipo_check`**: Solo permite valores definidos. Para productos físicos (incluyendo libros), usar siempre `tipo = 'PRODUCTO'`.

### `tienda`
Maestro de productos disponibles para la venta.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único (PK). |
| `producto_tienda` | VARCHAR | Nombre comercial del producto. |
| `valor_tienda` | INT | Precio de venta. |
| `categoria` | VARCHAR | Filtro principal (actualmente `SEDISCIPULO`). |
| `subcategorias` | UUID[] | Array de IDs de `categorias_producto`. |
| `url_video` | TEXT | URL de video (FB Reels o YouTube) para el producto. |
| `activo` | BOOLEAN | Control de publicación. |

### `tienda_calificaciones`
Almacena las reseñas y valoraciones de los productos por parte de los clientes.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único (PK). |
| `id_tienda` | UUID | FK a `tienda(id)`. |
| `id_cliente` | UUID | FK a `clientes(id)`. |
| `stars` | INT | Calificación de 1 a 5. |
| `comment` | TEXT | Comentario de la reseña. |
| `created_at` | TIMESTAMPTZ | Fecha de creación. |

> [!IMPORTANT]
> **Integridad de Datos**: Existe una restricción `UNIQUE(id_tienda, id_cliente)` para evitar duplicidad de reseñas por producto por usuario.

### `ventas_esperando_stock`
Almacena los productos de una venta que no pudieron ser procesados por falta de inventario (patrón Waitlist o Backorder).

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único (PK). |
| `id_cliente` | UUID | FK a `clientes(id)`. |
| `id_tienda` | UUID | FK a `tienda(id)`. |
| `id_venta_original` | UUID | FK a `ventas(id)` (Nullable) donde ocurrió el quiebre. |
| `cantidad` | INT | Cantidad solicitada originalmente. |
| `precio_ofertado` | INT | Precio ofrecido en el momento de la venta original (opcional para mantener precio). |
| `estado_aviso` | VARCHAR | Ej: `Esperando stock`, `Notificado`, `Comprado_posteriormente`. |
| `created_at` | TIMESTAMPTZ | Fecha de creación del registro. |

## Relaciones Clave
- **Filtros de Tienda**: Un producto en `tienda` se vincula a múltiples registros de `categorias_producto` a través de la columna `subcategorias`.
- **Jerarquía UI**: `familia` (Agrupador) -> `nombre` (Categoría específica).

## Funciones y Automatizaciones
- **Realtime**: Las tablas de `tienda` e `inventario_base` tienen habilitado Supabase Realtime para actualizaciones de stock en vivo.
