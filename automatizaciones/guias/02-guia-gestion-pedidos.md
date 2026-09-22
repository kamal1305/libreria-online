# Guía: Gestión automática de pedidos

## Segunda Vuelta Libros · n8n + Notion + Gmail

---

## Resumen del flujo

```
Pedido recibido (webhook desde tu tienda)
  → n8n procesa el pedido (cliente, items, total)
  → Para cada libro: busca en Notion por SKU
    → Si está "Publicado": lo marca como "Reservado"
    → Si no está disponible: genera incidencia
  → Crea registro de pedido en Notion
  → Te envía email de notificación
  → Responde a tu tienda con confirmación
```

**Objetivo:** Evitar sobreventas de libros únicos y tener todo el seguimiento automatizado.

---

## Lo que ya está listo

1. **Base de datos de Inventario actualizada** con campo SKU automático (formato SVL-0001)
   - [Ver inventario en Notion](https://app.notion.com/p/382e26a38bcc4c1c9bb565b020ebbe27)

2. **Base de datos de Pedidos creada** con campos: Nº pedido, cliente, email, fecha, estado, importe, plataforma, dirección, tracking, artículos y notas
   - [Ver pedidos en Notion](https://app.notion.com/p/3eab2f92894c44409a95537bc69ed910)

3. **Flujo n8n importable** (`n8n_workflow_pedidos.json`)

---

## Paso 1: Importar el flujo en n8n

1. Abre n8n → **Workflows** → **Import from File**
2. Selecciona `n8n_workflow_pedidos.json`
3. Verás el flujo con estos nodos:
   - **Webhook Pedido** — recibe el pedido desde tu tienda
   - **Procesar Pedido** — extrae y valida los datos
   - **Iterar Items** — procesa cada libro del pedido
   - **Buscar Libro** — busca el SKU en el inventario de Notion
   - **Verificar Disponibilidad** — comprueba si está publicado
   - **Reservar?** — decide si reservar o marcar incidencia
   - **Marcar Reservado** — cambia el estado a "Reservado"
   - **Finalizar Pedido** — recopila resultados
   - **Crear Registro** — crea el pedido en la base de Pedidos
   - **Notificar Email** — te envía un email con el resumen
   - **Responder** — confirma a tu tienda

---

## Paso 2: Configurar credenciales

Necesitas tres credenciales en n8n:

### Notion (si ya la configuraste en el flujo anterior, sáltalo)
1. En los nodos "Buscar Libro", "Marcar Reservado" y "Crear Registro"
2. Selecciona la credencial de Notion que ya creaste

### Gmail
1. En el nodo **Notificar Email**, haz clic en **Create New** → **Google OAuth2 API**
2. Autoriza tu cuenta de Gmail
3. Verifica que el destinatario es correcto (por defecto: kamearcos61@gmail.com)

---

## Paso 3: Probar el flujo

### Datos de prueba (payload)

Copia este JSON y úsalo para probar el webhook:

```json
{
  "order_id": "PED-001",
  "customer_name": "María González",
  "customer_email": "maria.gonzalez@email.com",
  "platform": "Web",
  "shipping_address": "Calle Larga 15, 11402 Jerez de la Frontera",
  "payment_status": "paid",
  "total": 9.90,
  "items": [
    {
      "sku": "SVL-0001",
      "title": "Crónica de una muerte anunciada",
      "price": 9.90,
      "quantity": 1
    }
  ]
}
```

### Cómo probar

**Opción A — Desde n8n (prueba local):**
1. Haz clic en **Test Workflow**
2. n8n te dará una URL de webhook temporal
3. Envía un POST a esa URL con el payload de prueba (usando Postman, curl, o n8n HTTP Request node)

**Opción B — Con curl:**
```bash
curl -X POST https://tu-n8n-url/webhook/pedido-recibido \
  -H "Content-Type: application/json" \
  -d '{"order_id":"PED-001","customer_name":"María González","customer_email":"maria@email.com","platform":"Web","shipping_address":"Calle Larga 15, Jerez","payment_status":"paid","total":9.90,"items":[{"sku":"SVL-0001","title":"Crónica de una muerte anunciada","price":9.90,"quantity":1}]}'
```

### Qué esperar

1. El libro "Crónica de una muerte anunciada" cambia a **Reservado** en Notion
2. Se crea un registro en la base de Pedidos con estado **Pagado**
3. Recibes un email con el resumen del pedido
4. El webhook responde con `{"success": true, "status": "procesado"}`

---

## Formato del payload del pedido

Tu tienda online debe enviar este formato al webhook:

| Campo | Tipo | Descripción |
|---|---|---|
| order_id | string | Identificador único del pedido |
| customer_name | string | Nombre del cliente |
| customer_email | string | Email del cliente |
| platform | string | Origen: Web, WhatsApp, Instagram, Facebook |
| shipping_address | string | Dirección de envío completa |
| payment_status | string | Estado del pago: paid, pending, failed |
| total | number | Importe total en euros |
| items | array | Lista de artículos |
| items[].sku | string | SKU del libro (formato SVL-XXXX) |
| items[].title | string | Título del libro |
| items[].price | number | Precio del libro |
| items[].quantity | number | Cantidad (normalmente 1) |

---

## Importante: El campo SKU

El campo **SKU** es la pieza clave que conecta tu tienda online con Notion. Cada libro en Notion tiene ahora un SKU automático (SVL-0001, SVL-0002, etc.).

### Para que el flujo funcione correctamente:
- Cada producto de tu tienda debe incluir el SKU como referencia
- El SKU de la tienda debe coincidir con el SKU de Notion
- Si un libro no tiene SKU en la tienda, el flujo lo marcará como incidencia

### Cómo adaptar el payload a tu plataforma:

**WooCommerce:**
- El SKU del producto se mapea directamente al SKU del webhook
- Necesitarás un adaptador en n8n que transforme el payload de WooCommerce al formato canónico

**Shopify:**
- Usar el SKU o el "variant_id" como referencia
- Adaptar el payload en n8n con un Code node

**PrestaShop / Tienda Nube:**
- Mismo principio: mapear el SKU del producto al campo `items[].sku`

---

## Estados del pedido en Notion

| Estado | Significado | Acción requerida |
|---|---|---|
| Pendiente | Pedido recibido, pago pendiente | Esperar confirmación de pago |
| Pagado | Pago confirmado, listo para preparar | Preparar el paquete |
| Preparando | Paquete en preparación | Generar etiqueta de envío |
| Enviado | Paquete enviado | Email al cliente con tracking |
| Entregado | Paquete entregado | Cerrar pedido |
| Cancelado | Pedido cancelado | Liberar libro (volver a Publicado) |
| Incidencia | Problema con el stock | Revisar manualmente |

---

## Qué hacer si hay una incidencia

El flujo marca una incidencia cuando:
- Un SKU no se encuentra en el inventario
- Un libro no está en estado "Publicado" (ya vendido, retirado, etc.)

**Recibirás:**
- Un email con los detalles de la incidencia
- El pedido se crea en Notion con estado "Incidencia"
- Los libros que sí estaban disponibles se reservan correctamente

**Acción manual:**
1. Revisar el libro problemático en Notion
2. Si el libro ya no está disponible: contactar al cliente para ofrecer alternativa o reembolso
3. Actualizar el estado del pedido manualmente en Notion

---

## Próximos pasos

| Mejora | Cuándo |
|---|---|
| Adaptar el payload a tu plataforma exacta (WooCommerce/Shopify/etc.) | Cuando me digas qué plataforma usas |
| Email automático al cliente de confirmación | Cuando el flujo esté probado |
| Generación automática de etiquetas de envío | Fase posterior |
| Tracking automático al cliente | Fase posterior |

### Pregunta clave para el siguiente paso

¿Qué plataforma usa tu tienda online? (WooCommerce, Shopify, PrestaShop, Tienda Nube, web personalizada...) Con esa información puedo crear el adaptador exacto que conecte tu tienda con este flujo.

---

*Guía generada el 22 de septiembre de 2026 para Segunda Vuelta Libros*
