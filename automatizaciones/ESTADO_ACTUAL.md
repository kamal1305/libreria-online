# 📌 Estado del Proyecto: Más que libros (Segunda Vuelta Libros)
**Última actualización:** 25 de septiembre de 2026 · Cierre de sesión

---

## ✅ Resumen del Trabajo Realizado (Fase 1 y Fase 2 Completadas)

### 1. Fase 1: Inventario Automatizado por ISBN (Completada)
* **Entregable:** Catálogo en Notion con ISBN, título, autor, portada, sinopsis y estado.
* **Base de datos de Notion:** `Inventario - Más que libros` (ID: `3e358b98-802d-8034-8058-f75a48890b65`).
* **SKUs asignados:** Cada libro dispone de un identificador único de formato `SVL-0001`, `SVL-0002`, etc.

### 2. Fase 2: Gestión y Reserva de Pedidos en Tiempo Real (Completada y Activa)
* **Objetivo:** Evitar sobreventas de libros únicos de segunda mano y registrar pedidos automáticamente.
* **Webhook en Producción (Activo 24/7):**
  👉 `https://3fxpxm31.rpcld.cc/webhook/pedido-recibido`
* **Base de datos de Notion:** `Pedidos - Más que libros` (ID: `3e658b98-802d-80fe-b360-f0a979af8118`).
* **Flujo n8n:** [`automatizaciones/flujos-n8n/02-gestion-pedidos.json`](file:///c:/Users/kamea/libreria-online/automatizaciones/flujos-n8n/02-gestion-pedidos.json)
  * Arquitectura lineal directa (sin bloqueos ni loops complejos).
  * Busca el libro en Notion por SKU vía API.
  * Cambia el estado del libro de `Publicado` a `Reservado` en tiempo real.
  * Registra el pedido en Notion con: Nº Pedido, Cliente, Email, Fecha, Estado (`Pagado` / `Incidencia`), Importe total (€), Plataforma, Dirección de envío, Artículos y Notas.
  * Envía notificación por correo a `masquelibrosjerez@gmail.com` vía SMTP.
  * Responde al canal de venta confirmando el estado de la reserva.
* **Skill del proyecto:** [`.agents/skills/notion-libreria/SKILL.md`](file:///c:/Users/kamea/libreria-online/.agents/skills/notion-libreria/SKILL.md)

---

## 🧭 Por dónde continuar cuando volvamos

### 3. Conexión Tienda Web con n8n y Reserva en Notion (Completada)
* **API Route creada:** [`src/app/api/orders/reserve/route.ts`](file:///c:/Users/kamea/libreria-online/src/app/api/orders/reserve/route.ts)
* **Frontend integrado:** [`src/components/CartDrawer.tsx`](file:///c:/Users/kamea/libreria-online/src/components/CartDrawer.tsx)
* **Comportamiento:** Al pulsar el botón *"Finalizar pedido por WhatsApp"*, se abre WhatsApp con el mensaje formateado y, en segundo plano, se envía la orden al webhook de n8n para que el ejemplar quede automáticamente marcado como `Reservado` en Notion y se cree el registro en `Pedidos - Más que libros`.
* **Aviso visual:** Se muestra al cliente la confirmación *"✓ Ejemplar reservado en Notion para tu pedido"*.

---

## 🧭 Por dónde continuar cuando volvamos

Al retomar este proyecto, las tareas pendientes son:

1. **Fase 3: Marketing y Generación de Copys para Redes con IA:**
   * Archivos listos: `automatizaciones/flujos-n8n/03-marketing-automatico.json` y `automatizaciones/guias/03-guia-marketing-automatico.md`.
   * Cron semanal para elegir libros destacados del inventario y redactar 3 variantes de copy (storytelling, llamada a la acción y breve para Instagram/X).

3. **Fase 4: Chatbot de Atención al Cliente (Voiceflow + n8n):**
   * Archivos listos: `automatizaciones/flujos-n8n/04-backend-chatbot.json` y `automatizaciones/guias/04-guia-atencion-cliente-ia.md`.
   * Resolución de dudas frecuentes sobre recogida en Jerez, envíos y seguimiento de pedidos por código.

---

## 🛠️ Utilidades y Scripts en el Repositorio

* `node scripts/notion-api.js inventory` ➔ Lista libros, SKUs y estados actuales en Notion.
* `node scripts/notion-api.js orders` ➔ Lista los pedidos registrados en Notion.
* `node scripts/notion-api.js find <texto>` ➔ Busca cualquier libro en Notion por SKU, ISBN o título.
* `node scripts/test-order-webhook.js` ➔ Lanza un pedido de prueba al webhook de n8n.
* `node scripts/reset-book-status.js` ➔ Restablece el libro de prueba a `Publicado`.
