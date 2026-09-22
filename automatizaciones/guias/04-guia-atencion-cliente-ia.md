# Guía: Atención al cliente con IA

## Segunda Vuelta Libros · Voiceflow + n8n + Notion

---

## Resumen del sistema

```
Cliente entra en la web
  → Chatbot de Voiceflow saluda y ofrece ayuda
  → Detecta la intención del cliente (FAQ, pedido, escalado)
  → Backend n8n procesa la consulta:
     · FAQ: busca en base de datos de Notion y responde
     · Pedido: consulta estado (requiere nº pedido + email)
     · Escalado: crea ticket en Notion + te avisa por email
  → Bot responde al cliente
  → Si no puede resolver: escala a humano automáticamente
```

---

## Lo que ya está listo

1. **Base de datos FAQ en Notion** con 10 preguntas frecuentes publicadas
   - [Ver FAQ en Notion](https://app.notion.com/p/25956ca56a444b1db96ab012cab862d0)
   - Categorías: envíos, devoluciones, reservas, estado del libro, pagos, compra de libros, contacto

2. **Base de datos de Soporte/Tickets en Notion**
   - [Ver Soporte en Notion](https://app.notion.com/p/81f36a12088244048a57568b8be42b24)
   - Gestión de incidencias escaladas desde el chatbot

3. **Flujo n8n de backend del chatbot** (`n8n_workflow_soporte.json`)

4. **Documento de diseño del chatbot de Voiceflow** (`diseno_chatbot_voiceflow.md`)

---

## Paso 1: Importar el flujo n8n

1. n8n → **Workflows** → **Import from File**
2. Selecciona `n8n_workflow_soporte.json`
3. Configura credenciales de Notion y Gmail (ya las tienes de los flujos anteriores)
4. El webhook se activará en: `https://tu-n8n-url/webhook/soporte-chatbot`

### Nodos del flujo:
- **Webhook Soporte** — recibe consultas de Voiceflow
- **Procesar Consulta** — extrae intent, query, datos del cliente
- **Tipo Consulta** — separa FAQ de consulta de pedido
- **Buscar FAQ** — consulta la base de FAQ en Notion
- **Emparejar FAQ** — busca la mejor coincidencia por palabras clave
- **Buscar Pedido** — consulta el estado (requiere nº pedido + email por privacidad)
- **Escalar?** — decide si crear ticket de soporte
- **Crear Ticket** — crea incidencia en Notion
- **Notificar Escalado** — te envía email de aviso
- **Responder** — devuelve la respuesta a Voiceflow

---

## Paso 2: Revisar y completar las FAQ

Las 10 FAQ creadas tienen marcadores **[REVISAR]** donde necesitas confirmar datos específicos de tu negocio:

| FAQ | Qué revisar |
|---|---|
| ¿Cuánto tarda el envío? | Transportista y plazos exactos |
| ¿Cuánto cuesta el envío? | Tarifa de envío y umbral para envío gratis |
| ¿Hacéis devoluciones? | Política de devoluciones exacta |
| ¿Puedo reservar un libro? | Tiempo de reserva (48h sugerido) |
| ¿Qué métodos de pago aceptáis? | Métodos disponibles en tu plataforma |
| ¿Compráis libros de segunda mano? | Géneros que compras y condiciones |
| ¿Cómo puedo contactaros? | WhatsApp, email, Instagram |
| ¿Puedo ver los libros en persona? | Dirección y horarios |
| ¿Hacéis envíos a otros países? | Política de envíos internacionales |

**Para editar:** abre cada entrada en la base de FAQ de Notion y reemplaza los [REVISAR] con tus datos reales.

---

## Paso 3: Construir el bot en Voiceflow

Sigue el documento `diseno_chatbot_voiceflow.md` que incluye:
- Persona del bot
- Intents y palabras clave
- Variables
- Flujos de conversación (FAQ, pedidos, escalado)
- Mensajes exactos en español
- Configuración del webhook

### Pasos resumidos:
1. Crear nuevo proyecto en Voiceflow (español)
2. Bloque de saludo con el menú de opciones
3. Bloques HTTP Request que llaman al webhook de n8n
4. Bloques de texto que muestran las respuestas
5. Bloque de captura de datos (nombre, email) para escalado
6. Bloque de despedida

---

## Paso 4: Probar el backend

### Payload de prueba — FAQ

```json
{
  "intent": "faq",
  "query": "cuanto tarda el envio",
  "channel": "Web"
}
```

Respuesta esperada:
```json
{
  "response": "Los envios tardan entre 24-48 horas laborables dentro de la peninsula...",
  "action": "respond"
}
```

### Payload de prueba — Pedido

```json
{
  "intent": "order_status",
  "order_id": "PED-001",
  "customer_email": "maria@email.com",
  "channel": "Web"
}
```

### Payload de prueba — Escalado

```json
{
  "intent": "escalation",
  "query": "Tengo un problema con mi pedido",
  "customer_name": "Maria",
  "customer_email": "maria@email.com",
  "channel": "Web"
}
```

---

## Cómo funciona el emparejamiento de FAQ

El backend de n8n busca la FAQ que mejor coincida con la consulta del cliente usando un sistema de puntuación:

1. **Coincidencia por pregunta** (+5 puntos): si la consulta incluye la pregunta o viceversa
2. **Coincidencia por palabras clave** (+3 puntos): si la consulta incluye alguna palabra clave de la FAQ
3. **Coincidencia por palabras** (+1 punto): por cada palabra de la consulta que aparezca en la pregunta

La FAQ con mayor puntuación se devuelve. Si ninguna FAQ supera 0 puntos, se ofrece escalar a humano.

---

## Sistema de escalado

### Cuándo se escala automáticamente:
- La FAQ tiene marcado "Escalar a humano" (devoluciones, reservas, compra de libros, envíos internacionales)
- El cliente pide hablar con una persona
- No se encuentra respuesta en la FAQ

### Qué pasa cuando se escala:
1. Se crea un ticket en la base de Soporte de Notion (estado: Nuevo)
2. Recibes un email con los datos del cliente y su consulta
3. El cliente recibe el mensaje: "He pasado tu consulta al equipo y te responderemos lo antes posible por email"

### Tu flujo de trabajo tras recibir un ticket:
1. Revisar el ticket en Notion (base de Soporte)
2. Contactar al cliente por email
3. Actualizar el estado del ticket: Nuevo → En revisión → Respondido → Cerrado

---

## Privacidad y seguridad

- **Consulta de pedidos:** requiere siempre número de pedido + email. No se devuelven datos de pedido solo con el número.
- **Datos del cliente:** el bot solo pide nombre y email cuando es necesario (escalado o consulta de pedido).
- **No se almacenan conversaciones completas:** el bot solo guarda la consulta específica en el ticket de soporte cuando se escala.

---

## Resumen de las 5 bases de datos en Notion

| Base de datos | Función | URL |
|---|---|---|
| Inventario | Libros en stock, SKU, estado, precios | [Ver](https://app.notion.com/p/382e26a38bcc4c1c9bb565b020ebbe27) |
| Pedidos | Registro de pedidos y seguimiento | [Ver](https://app.notion.com/p/3eab2f92894c44409a95537bc69ed910) |
| Marketing | Borradores de posts y newsletter | [Ver](https://app.notion.com/p/6d8b2d0cf2e64740805a66b7f8012a9a) |
| FAQ | Preguntas frecuentes para el chatbot | [Ver](https://app.notion.com/p/25956ca56a444b1db96ab012cab862d0) |
| Soporte | Tickets de incidencias escaladas | [Ver](https://app.notion.com/p/81f36a12088244048a57568b8be42b24) |

---

## Estado del roadmap completo

| Fase | Estado |
|---|---|
| 1. Inventario y catalogación por ISBN | Listo |
| 2. Gestión de pedidos y stock | Listo |
| 3. Marketing automático | Listo |
| 4. Atención al cliente con IA | Listo (esta fase) |
| 5. Analítica y dashboard | Siguiente |
| 6. Innovación con IA | Pendiente |

---

*Guía generada el 22 de septiembre de 2026 para Segunda Vuelta Libros*
