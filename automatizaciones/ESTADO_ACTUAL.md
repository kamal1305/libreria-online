# 📌 Estado del Proyecto: Más que libros (Segunda Vuelta Libros)
**Última actualización:** 29 de septiembre de 2026 · Cierre de sesión

---

## ✅ Resumen del Trabajo Realizado

### 1. Catálogo Oficial e Inventario en Notion
* **Catálogo cargado:** 99 libros reales con ISBN, portadas, sinopsis y SKUs asignados (`SVL-0001` a `SVL-0099`).
* **Base de datos de Notion:** `Inventario - Más que libros` (ID: `3e358b98-802d-8034-8058-f75a48890b65`).
* **Categorías:** Agrupadas en 7 macro-familias (Novela y Narrativa, Suspense y Misterio, Historia y Ensayo, Juvenil e Infantil, Desarrollo y Filosofía, Clásicos, Otros).

### 2. Sistema de Escaneo de Libros para Mac y PC (Completado)
* **Pantalla Web para Mac/Móvil:** `http://<IP-LOCAL>:3000/escanear` (o `/escanear` en producción).
  * Diseñada para trabajar cómodamente desde el Mac o portátil de su mujer conectando la pistola lectora USB o Bluetooth.
  * Autocompletado de metadatos mediante Google Books API y Open Library.
  * Asignación automática de SKU correlativo (`SVL-0100`, `SVL-0101`, etc.).
  * Detección automática de género y sugerencia de precio.
  * Detección de duplicados en Notion para evitar sobreventas o errores.
  * Sonidos de confirmación en el navegador (Web Audio API) y registro directo en Notion.
* **Script CLI de Terminal:**
  * Windows: Acceso directo en el Escritorio y archivo [`Escanear_Libros.bat`](file:///c:/Users/kamea/libreria-online/Escanear_Libros.bat) o comando `npm run escanear`.
  * macOS: Archivo ejecutable de doble clic [`Escanear_Libros.command`](file:///c:/Users/kamea/libreria-online/Escanear_Libros.command).
* **Guía rápida:** [`automatizaciones/guias/01b-guia-escaner-pistola.md`](file:///c:/Users/kamea/libreria-online/automatizaciones/guias/01b-guia-escaner-pistola.md).

### 3. Gestión y Reserva de Pedidos en Tiempo Real
* **Webhook en Producción:** `https://3fxpxm31.rpcld.cc/webhook/pedido-recibido`
* **Base de datos de Notion:** `Pedidos - Más que libros` (ID: `3e658b98-802d-80fe-b360-f0a979af8118`).
* **Integración Tienda:** [`src/app/api/orders/reserve/route.ts`](file:///c:/Users/kamea/libreria-online/src/app/api/orders/reserve/route.ts) y carrito [`src/components/CartDrawer.tsx`](file:///c:/Users/kamea/libreria-online/src/components/CartDrawer.tsx). Al pulsar "Finalizar pedido por WhatsApp", reserva el ejemplar en Notion y registra el pedido.

### 4. PWA y Rendimiento Móvil
* Service Worker configurado con estrategia **Network First** y refresco automático (`reg.update()`) para evitar cachés obsoletas en móviles y ordenadores.

---

## 🧭 Por dónde continuar cuando volvamos

1. **Fase 3: Marketing y Generación de Copys para Redes con IA:**
   * Archivos listos: `automatizaciones/flujos-n8n/03-marketing-automatico.json` y `automatizaciones/guias/03-guia-marketing-automatico.md`.
   * Cron semanal para redactar 3 variantes de copys (storytelling, llamada a la acción y breve para redes).

2. **Fase 4: Chatbot de Atención al Cliente (Voiceflow + n8n):**
   * Archivos listos: `automatizaciones/flujos-n8n/04-backend-chatbot.json` y `automatizaciones/guias/04-guia-atencion-cliente-ia.md`.
   * Resolución de dudas frecuentes sobre recogida en Jerez, envíos y seguimiento de pedidos por código.

---

## 🛠️ Utilidades y Scripts en el Repositorio

* `npm run escanear` ➔ Ejecuta el escáner interactivo en terminal.
* `node scripts/notion-api.js inventory` ➔ Lista libros, SKUs y estados actuales en Notion.
* `node scripts/notion-api.js orders` ➔ Lista los pedidos registrados en Notion.
* `node scripts/notion-api.js find <texto>` ➔ Busca cualquier libro en Notion por SKU, ISBN o título.
* `node scripts/test-order-webhook.js` ➔ Lanza un pedido de prueba al webhook de n8n.
* `node scripts/reset-book-status.js` ➔ Restablece el libro de prueba a `Publicado`.
