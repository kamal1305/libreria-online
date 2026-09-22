# Diseño del chatbot de Voiceflow

## Segunda Vuelta Libros · Asistente de atención al cliente

---

## Persona del bot

**Nombre:** Asistente Segunda Vuelta
**Tono:** Cercano, amable, profesional. Usa "tú" (no "usted").
**Idioma:** Español
**Objetivo:** Resolver dudas frecuentes, consultar estado de pedidos y escalar a humano cuando sea necesario.

---

## Estructura del bot

### 1. Saludo inicial

```
¡Hola! Soy el asistente de Segunda Vuelta Libros. 
¿En qué puedo ayudarte?

Puedo ayudarte con:
• Envíos y devoluciones
• Estado de tu pedido
• Reservas de libros
• Compra de libros de segunda mano
• Información de contacto

Escribe tu consulta o elige una opción.
```

### 2. Intents (intenciones)

| Intent | Palabras clave | Acción |
|---|---|---|
| `faq_envios` | envío, enviar, tarda, plazo, coste, transporte | Llamar al backend n8n (intent: faq, query: texto del usuario) |
| `faq_devoluciones` | devolución, devolver, reembolso, cambio | Llamar al backend n8n (intent: faq, query: texto del usuario) |
| `faq_reservas` | reservar, apartar, guardar, reservar libro | Llamar al backend n8n |
| `faq_estado_libro` | estado, condición, calidad, desperfectos | Llamar al backend n8n |
| `faq_pagos` | pago, pagar, tarjeta, paypal, bizum, transferencia | Llamar al backend n8n |
| `faq_compra_libros` | vender, comprar libros, lotes, colección | Llamar al backend n8n |
| `faq_contacto` | contacto, contactar, whatsapp, email, dirección, visitar | Llamar al backend n8n |
| `order_status` | pedido, mi pedido, dónde está, estado del pedido | Pedir order_id + email, luego llamar al backend |
| `escalation` | persona, humano, hablar con alguien, no entiendo, agente | Crear ticket y escalar |

### 3. Variables del bot

| Variable | Tipo | Descripción |
|---|---|---|
| `customer_name` | text | Nombre del cliente (opcional) |
| `customer_email` | text | Email del cliente (necesario para pedidos) |
| `order_id` | text | Número de pedido (necesario para pedidos) |
| `query` | text | Texto de la consulta del usuario |
| `intent` | text | Intención detectada: faq, order_status, escalation |
| `backend_response` | text | Respuesta recibida del backend n8n |
| `needs_escalation` | boolean | Si la consulta requiere escalado a humano |
| `channel` | text | Canal de origen: Web, WhatsApp, Instagram |

### 4. Flujo de conversación

#### Ruta A: FAQ general

```
Usuario escribe consulta
  → Voiceflow detecta intent (faq_*)
  → Envia a n8n: { intent: "faq", query: "texto del usuario" }
  → n8n busca en FAQ de Notion
  → n8n responde con la respuesta
  → Voiceflow muestra la respuesta
  → Pregunta: "¿Te ha ayudado? ¿Necesitas algo más?"
    → Si: vuelve al menú
    → No: ofrece escalar a humano
```

#### Ruta B: Consulta de pedido

```
Usuario: "¿Dónde está mi pedido?"
  → Voiceflow detecta intent: order_status
  → Voiceflow pide: "Para consultar tu pedido necesito el número de pedido (ej: PED-001) y el email con el que lo hiciste."
  → Usuario proporciona order_id y email
  → Voiceflow envía a n8n: { intent: "order_status", order_id: "PED-001", customer_email: "..." }
  → n8n busca en Notion (pedidos)
  → n8n responde con el estado
  → Voiceflow muestra: "Tu pedido PED-001 está en estado: Pagado. Importe: 9,90€..."
  → Pregunta: "¿Te ha ayudado?"
```

#### Ruta C: Escalado a humano

```
Usuario: "Quiero hablar con una persona"
  → Voiceflow detecta intent: escalation
  → Voiceflow: "Claro, voy a pasar tu consulta al equipo. ¿Podrías decirme tu nombre y email?"
  → Usuario proporciona nombre y email
  → Voiceflow: "¿Cuál es tu consulta?"
  → Usuario describe el problema
  → Voiceflow envía a n8n: { intent: "escalation", query: "...", customer_name: "...", customer_email: "..." }
  → n8n crea ticket en Notion (base de Soporte)
  → n8n envía email de notificación interna
  → n8n responde: "He pasado tu consulta al equipo y te responderemos lo antes posible por email."
  → Voiceflow muestra el mensaje
```

#### Ruta D: FAQ que requiere escalado

```
Usuario pregunta sobre devoluciones
  → n8n busca FAQ, encuentra la respuesta
  → La FAQ tiene marcado "Escalar a humano" = true
  → n8n responde con la info + ofrece escalar
  → Voiceflow: "Aceptamos devoluciones en 14 días... Si necesitas más detalles, puedo ponerte en contacto con una persona que te ayudará."
  → Si usuario acepta: ir a Ruta C
```

### 5. Mensajes del bot

**Saludo:**
> ¡Hola! Soy el asistente de Segunda Vuelta Libros. ¿En qué puedo ayudarte? Puedo ayudarte con envíos, devoluciones, reservas, estado de tu pedido, compra de libros o información de contacto.

**Pedir datos del pedido:**
> Para consultar el estado de tu pedido necesito el número de pedido (ej: PED-001) y el email con el que lo realizaste.

**No encuentra respuesta:**
> Lo siento, no tengo información sobre eso en este momento. Te puedo poner en contacto con una persona si lo prefieres.

**Escalado confirmado:**
> He pasado tu consulta al equipo y te responderemos lo antes posible por email.

**Despedida:**
> ¡Gracias por contactar con Segunda Vuelta Libros! Si necesitas algo más, aquí estaré. ¡Que tengas un buen día de lectura!

### 6. Configuración del webhook en Voiceflow

En Voiceflow, usa un nodo **HTTP Request** (o API block) para cada llamada al backend:

**URL:** `https://tu-n8n-url/webhook/soporte-chatbot`
**Método:** POST
**Headers:** `Content-Type: application/json`
**Body (FAQ):**
```json
{
  "intent": "faq",
  "query": "{texto_del_usuario}",
  "customer_name": "{nombre}",
  "customer_email": "{email}",
  "channel": "Web"
}
```

**Body (Pedido):**
```json
{
  "intent": "order_status",
  "order_id": "{order_id}",
  "customer_email": "{email}",
  "channel": "Web"
}
```

**Body (Escalado):**
```json
{
  "intent": "escalation",
  "query": "{consulta}",
  "customer_name": "{nombre}",
  "customer_email": "{email}",
  "channel": "Web"
}
```

**Respuesta esperada del backend:**
```json
{
  "response": "Texto de la respuesta para el usuario",
  "action": "respond"
}
```

---

## Mapa visual del flujo

```
[Inicio] → [Saludo] → [Detectar Intent]
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
    [FAQ general]      [Pedido]            [Escalado]
         │                    │                    │
    [Llamar n8n]    [Pedir order_id      [Pedir nombre
         │            + email]              + email]
    [Buscar en        │                    │
     Notion]     [Llamar n8n]         [Llamar n8n]
         │            │                    │
    [¿Escalar?]  [Responder]          [Crear ticket
     │     │                           + Email]
   [No]  [Sí]                              │
     │     └──────────────────────────────┘
     │                              │
[Responder]          [Mensaje escalado] → [Responder]
```

---

## Pasos para construir en Voiceflow

1. Crear nuevo proyecto en Voiceflow (español)
2. Crear el bloque de **Saludo** con el mensaje de bienvenida
3. Crear un bloque **Choice** con las opciones del menú
4. Para cada opción, crear un bloque **HTTP Request** que llame al webhook de n8n
5. Configurar el body del request con las variables de Voiceflow
6. Añadir un bloque **Text** que muestre la respuesta del backend (`{backend_response}`)
7. Añadir un bloque de **Despedida** o vuelta al menú
8. Para escalado: añadir bloques de captura de nombre, email y consulta antes del HTTP Request
9. Probar con el simulador de Voiceflow
10. Publicar el bot en tu web (widget de chat)

---

*Documento generado el 22 de septiembre de 2026 para Segunda Vuelta Libros*
