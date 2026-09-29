---
name: notion-libreria
description: Gestión, administración y sincronización de bases de datos de Notion para Más que libros (Segunda Vuelta Libros). Usar cuando se requiera consultar, modificar esquemas, sincronizar stock, gestionar pedidos o configurar nuevas bases de datos y propiedades en Notion.
---

# Skill: Gestión de Notion para Más que libros

Esta skill centraliza la configuración, los identificadores oficiales y los procedimientos para interactuar mediante API con las bases de datos de Notion de la librería.

---

## 🔑 Credenciales y Variables de Entorno

El token de integración está guardado en el archivo `.env` del proyecto:
* `NOTION_API_KEY`: Token de integración interno (`ntn_...`).
* `NOTION_INVENTARIO_DB_ID`: `3e358b98-802d-8034-8058-f75a48890b65`
* `NOTION_PEDIDOS_DB_ID`: `3e658b98-802d-80fe-b360-f0a979af8118`
* `N8N_ORDER_WEBHOOK`: `https://3fxpxm31.rpcld.cc/webhook/pedido-recibido`

> [!NOTE]
> La versión de la API de Notion estándar utilizada es `2022-06-28`.

---

## 🗄️ Bases de Datos Oficiales y Esquemas

### 1. `Inventario - Más que libros`
* **ID:** `3e358b98-802d-8034-8058-f75a48890b65`
* **Propósito:** Catálogo de libros físicos disponibles y vendidos.

| Propiedad | Tipo | Opciones / Descripción |
| :--- | :--- | :--- |
| `Nombre` | **title** | Título oficial del libro |
| `SKU` | **rich_text** | Identificador único de ocasión (ej. `SVL-0001`, `SVL-0002`...) |
| `ISBN` | **rich_text** | ISBN-10 o ISBN-13 (ej. `9788467228656`) |
| `Estado publicación` | **select** | `Pendiente` (rojo), `Publicado` (verde), `Reservado` (naranja), `Vendido` (gris) |
| `Estado físico` | **select** | `Como nuevo`, `Muy bueno`, `Bueno`, `Aceptable` |
| `Cantidad en Inventario` | **number** | 1 (generalmente ejemplar único en segunda mano) |
| `Autor` | **rich_text** | Nombre de los autores |
| `Género` | **select** | `Novela`, `Hardware`, `Accesorios`, etc. |
| `Año` | **number** | Año de publicación |
| `Portada` | **url** | Enlace a la imagen de portada |
| `Sinopsis` | **rich_text** | Resumen o descripción |
| `Fecha entrada` | **created_time** | Fecha de creación automática |

---

### 2. `Pedidos - Más que libros`
* **ID:** `3e658b98-802d-80fe-b360-f0a979af8118`
* **Propósito:** Registro de compras recibidas desde la tienda web, WhatsApp u otros canales.

| Propiedad | Tipo | Opciones / Descripción |
| :--- | :--- | :--- |
| `Nº Pedido` | **title** | Código del pedido (ej. `PED-2026-001`) |
| `Cliente` | **rich_text** | Nombre y apellidos del comprador |
| `Email` | **email** | Correo electrónico de contacto |
| `Fecha` | **date** | Fecha de realización del pedido |
| `Estado pedido` | **select** | `Pagado` 🟢, `Incidencia` 🔴, `Pendiente` 🟡, `Preparando` 🔵, `Enviado` 🟣, `Cancelado` ⚪ |
| `Importe total` | **number** | Formato: Euro (€) |
| `Plataforma` | **select** | `Web`, `WhatsApp`, `Instagram`, `Manual` |
| `Dirección envío` | **rich_text** | Dirección física o recogida en Jerez |
| `Artículos` | **rich_text** | Resumen con títulos y SKUs |
| `Notas` | **rich_text** | Incidencias de stock o notas del cliente |

---

## 🛠️ Herramientas y Scripts Disponibles

El proyecto incluye el cliente [`scripts/notion-api.js`](file:///c:/Users/kamea/libreria-online/scripts/notion-api.js) para realizar operaciones sin dependencias externas:

```bash
# Consultar inventario
node scripts/notion-api.js inventory

# Consultar pedidos
node scripts/notion-api.js orders

# Buscar libro por SKU o ISBN
node scripts/notion-api.js find SVL-0001
```

---

## 🔄 Conexión con n8n
* El webhook de entrada de pedidos se conecta al flujo [`automatizaciones/flujos-n8n/02-gestion-pedidos.json`](file:///c:/Users/kamea/libreria-online/automatizaciones/flujos-n8n/02-gestion-pedidos.json).
* Cuando se recibe un pedido, busca en `Inventario` por SKU y cambia `Estado publicación` a `Reservado`.
* Registra el pedido en `Pedidos` con estado `Pagado` (o `Incidencia` si el libro ya no estaba publicado).
