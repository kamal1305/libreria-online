# 📚 Plan Maestro de Automatización e Inteligencia Artificial
## Más que libros (Segunda Vuelta Libros) · Arquitectura Integral

> **Objetivo Estratégico:** Transformar la librería de ocasión en un negocio de comercio electrónico de vanguardia, automatizando el 90% de las tareas operativas, manuales y repetitivas para permitir que dos personas con empleos a tiempo completo gestionen cientos de libros, pedidos y acciones de marketing dedicando menos de 30-45 minutos al día.

---

## 🗺️ 1. Resumen Ejecutivo y Estado de las Fases

| Fase | Entregables Clave | Archivos / Flujo n8n | Impacto en el Tiempo | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **Fase 1: Inventario** | ISBN → Google Books / OpenLibrary → Registro automático en Notion | `flujos-n8n/01-alta-isbn-notion.json`<br>`guias/01-guia-alta-automatica-isbn.md` | **Ahorra 25h+** en cada lote de 200-300 libros. Catalogación en 2 seg. | Listo para importar |
| **Fase 2: Pedidos** | Webhook Web → Reserva de Stock inmediata → Notificación cliente y gestión interna | `flujos-n8n/02-gestion-pedidos.json`<br>`guias/02-guia-gestion-pedidos.md` | **Evita vender el mismo libro usado dos veces**. Automatiza recibos y avisos. | Listo para importar |
| **Fase 3: Marketing** | Cron semanal → Redacción de copys persuasivos para Instagram / Redes con IA | `flujos-n8n/03-marketing-automatico.json`<br>`guias/03-guia-marketing-automatico.md` | **Cero bloqueo de hoja en blanco**. 3 posts listos cada semana sin esfuerzo. | Listo para importar |
| **Fase 4: Atención Cliente** | Chatbot Voiceflow + Backend n8n con FAQs + Escalado a WhatsApp humano | `flujos-n8n/04-backend-chatbot.json`<br>`guias/04-guia-atencion-cliente-ia.md`<br>`guias/04-diseno-chatbot-voiceflow.md` | Resuelve dudas 24/7 de envíos y recogida en Jerez sin interrumpir vuestro trabajo. | Listo para importar |
| **Fase 5: Analítica** | Métricas semanales automatizadas por email + Cuadro de mando en Looker Studio | `flujos-n8n/05-metricas-semanales.json`<br>`guias/05-guia-dashboard-metricas.md` | Control absoluto de ingresos, márgenes y libros estancados sin abrir hojas de cálculo. | Listo para importar |
| **Fase 6: IA Avanzada** | Motor de recomendación de libros en la web + Rebajas dinámicas + Copiloto Telegram | `flujos-n8n/06-ia-precios-rebajas.json`<br>`flujos-n8n/07-ia-copiloto-interno.json`<br>`guias/06-guia-ia-avanzada.md` | Sube el ticket medio de compra en la web y permite consultar stock desde el móvil. | Listo para importar |

---

## 🏛️ 2. Arquitectura Tecnológica del Ecosistema

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CANAL DE VENTA & CLIENTES                       │
│   Web Next.js 16 (Vercel) + App Móvil PWA + WhatsApp Oficial + Instagram │
└──────────────────┬───────────────────────────────┬─────────────────────┘
                   │ Webhooks                      │ API / Chat Widget
                   ▼                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        CEREBRO: n8n (ORQUESTADOR)                      │
│                                                                        │
│  [Flujo 1] Ingesta ISBN         [Flujo 2] Checkout & Stock             │
│  [Flujo 3] Generador Copy IA     [Flujo 4] Backend Chatbot              │
│  [Flujo 5] Reporte Semanal      [Flujo 6] Pricing & Rebajas Dinámicas  │
│  [Flujo 7] Copiloto Telegram                                           │
└──────────────────┬───────────────────────────────┬─────────────────────┘
                   │                               │
                   ▼                               ▼
┌──────────────────────────────────┐ ┌──────────────────────────────────┐
│        BASE DE DATOS: NOTION      │ │         SERVICIOS Y MODELOS      │
│  1. Inventario de Libros         │ │  • Google Books API / OpenLibrary│
│  2. Pedidos & Ventas             │ │  • Modelos IA (Claude / OpenAI)  │
│  3. Clientes                     │ │  • Gmail & Google Drive          │
│  4. FAQs                         │ │  • Voiceflow (Chatbot)           │
│  5. Tickets de Soporte           │ │  • Looker Studio (Dashboards)    │
│  6. Métricas Históricas          │ │  • Telegram Bot (Copiloto)       │
│  7. IA Decisiones (Rebajas/Precios│                                    │
└──────────────────────────────────┘ └──────────────────────────────────┘
```

---

## 📋 3. Bases de Datos de Notion (Estructura de Datos)

Para conectar los flujos de n8n, se utilizan las siguientes 7 bases de datos en Notion:

### 1. `Inventario - Segunda Vuelta Libros`
* `Titulo` (Title): Título del libro.
* `ISBN` (Text): Código ISBN-10 o ISBN-13.
* `SKU` (Text): Identificador interno (ej. `SVL-0001`).
* `Autor` (Text): Nombre del autor/a.
* `Genero` (Select): Novela negra, Ciencia ficción, Fantasía, Romance, etc.
* `Precio venta` (Number - Euro): PVP en web.
* `Coste compra` (Number - Euro): Coste unitario de adquisición.
* `Estado fisico` (Select): Como nuevo, Muy bueno, Bueno, Aceptable.
* `Stock` (Number): Unidades disponibles (habitualmente 1 en ocasión).
* `Estado` (Select): Borrador, En revision, Publicado, Vendido, Retirado.
* `Portada URL` (Url): Enlace de la portada.
* `Sinopsis` (Text): Resumen del libro.
* `Fecha publicacion` (Date): Fecha de alta.
* `Dias en stock` (Formula): Días transcurridos desde el alta sin venderse.

### 2. `Pedidos - Segunda Vuelta Libros`
* `ID Pedido` (Title): Código de pedido (ej. `PED-2026-001`).
* `Cliente` (Text / Relation): Nombre del comprador.
* `Email` (Email): Correo de contacto.
* `Telefono` (Phone): Teléfono para envíos o Bizum.
* `Libros` (Text): Lista de títulos o SKUs comprados.
* `Total` (Number - Euro): Importe total.
* `Metodo pago` (Select): Bizum, Transferencia, Tarjeta.
* `Tipo entrega` (Select): Recogida Jerez (Gratis), Envío Península.
* `Estado pedido` (Select): Pendiente pago, Pagado, Preparando, Enviado, Entregado, Cancelado.
* `Fecha` (Date): Timestamp del pedido.

### 3. `Clientes - Segunda Vuelta Libros`
* `Nombre` (Title): Nombre del cliente.
* `Email` (Email): Correo electrónico.
* `Telefono` (Phone): Teléfono.
* `Total pedidos` (Number): Recuento de compras.
* `Gasto acumulado` (Number - Euro): LTV (Customer Lifetime Value).
* `Ciudad` (Text): Para segmentar promociones locales en Jerez o nacionales.

### 4. `FAQs - Segunda Vuelta Libros`
* `Pregunta` (Title): Pregunta frecuente.
* `Respuesta` (Text): Respuesta oficial redactada.
* `Categoria` (Select): Envios, Pagos, Devoluciones, Recogida, Compra lotes.
* `Activa` (Checkbox): Si el bot debe usarla.

### 5. `Tickets - Segunda Vuelta Libros`
* `Asunto` (Title): Motivo del ticket o consulta.
* `Cliente` (Text): Nombre o email del usuario.
* `Canal` (Select): Web Chat, WhatsApp, Email.
* `Prioridad` (Select): Baja, Media, Alta.
* `Estado` (Select): Abierto, En curso, Resuelto.

### 6. `Metricas - Segunda Vuelta Libros`
* `Semana` (Title): Ej. `2026-W38`.
* `Ventas totales` (Number - Euro): Facturación de la semana.
* `Libros vendidos` (Number): Unidades.
* `Ticket medio` (Number - Euro): Gasto promedio por pedido.
* `Margen bruto medio` (Percent): Margen porcentual.
* `Libros parados +60d` (Number): Inventario estancado.

### 7. `IA Decisiones - Segunda Vuelta Libros`
* `Titulo` (Title): Nombre de la recomendación.
* `Tipo recomendacion` (Select): Precio, Rebaja, Promocion, Compra lote.
* `SKU` / `Libro` / `Autor` / `Genero`: Datos del libro analizado.
* `Precio actual` / `Precio sugerido` (Number - Euro): Ajuste dinámico de precio.
* `Motivo` (Text): Razón propuesta por la IA (ej. "Sin ventas tras 90 días").
* `Accion sugerida` (Select): Rebajar 10%, Rebajar 20%, Promocionar, Revisar.
* `Estado` (Select): Pendiente, Aprobada, Aplicada, Descartada.

---

## ⚡ 4. Inventario de Flujos n8n Disponibles

Todos los flujos listos para importar están alojados en la subcarpeta `automatizaciones/flujos-n8n/`:

1. **`01-alta-isbn-notion.json`**:
   - Webhook de entrada recibe `{ isbn, estado_fisico, coste }`.
   - Consulta Google Books API / OpenLibrary API.
   - Si faltan datos, una IA de respaldo los completa.
   - Crea automáticamente la ficha completa con portada en Notion.
2. **`02-gestion-pedidos.json`**:
   - Recibe la notificación de compra de la web.
   - Actualiza el stock en Notion a "Vendido" para evitar ventas duplicadas.
   - Envía email de confirmación al cliente y alerta por Telegram a los administradores.
3. **`03-marketing-automatico.json`**:
   - Se ejecuta por cron (ej. martes y jueves a las 10:00).
   - Elige libros destacados o recién llegados.
   - La IA redacta 3 variantes de copy (storytelling, llamada a la acción y formato breve con hashtags).
4. **`04-backend-chatbot.json`**:
   - Conecta el widget de Voiceflow con la base de datos de Notion.
   - Responde automáticamente a dudas de envíos, recogida en Jerez y estado de pedidos por ID.
5. **`05-metricas-semanales.json`**:
   - Cada lunes a las 09:00 calcula las ventas, costes, márgenes y rotación de stock.
   - Envía un informe ejecutivo por email y actualiza la tabla para Looker Studio.
6. **`06-ia-precios-rebajas.json`**:
   - Analiza los libros que llevan más de 60 o 90 días publicados.
   - Aplica algoritmos de rebaja prudente respetando el margen mínimo y genera propuestas en "IA Decisiones".
7. **`07-ia-copiloto-interno.json`**:
   - Endpoint webhook conectado a Telegram / WhatsApp.
   - Permite consultar en lenguaje natural: *"¿Qué libros tenemos de novela histórica?"*, *"¿Cuánto hemos vendido esta semana?"* o *"¿Qué libros deberíamos rebajar?"*.

---

## 🎯 5. Orden de Ejecución Recomendado (Paso a Paso)

Para no saturarse y tener resultados útiles desde el primer día:

```
[Semana 1] FASE 1: Alta automática por ISBN (Para procesar el lote de 300 libros)
     │
     ▼
[Semana 2] FASE 2: Gestión de Pedidos y Stock (Para tener la tienda segura sin doble venta)
     │
     ▼
[Semana 3] FASE 3 & FASE 5: Marketing de Copys + Métricas Semanales
     │
     ▼
[Semana 4] FASE 4: Chatbot Web (Filtrando preguntas frecuentes y derivando a WhatsApp)
     │
     ▼
[Semana 5] FASE 6: Recomendador web y Copiloto de Telegram
```

---

*Documentación unificada y centralizada en `automatizaciones/` — Más que libros.*
