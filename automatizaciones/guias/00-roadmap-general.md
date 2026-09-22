# Roadmap de Automatización — Segunda Vuelta Libros

**Objetivo:** Transformar la gestión manual de la librería online en un sistema operativo automatizado, escalable y eficiente.

**Principio rector:** Automatizar primero lo repetitivo y medible, no lo más vistoso. Cada fase debe funcionar antes de pasar a la siguiente.

---

## Arquitectura base

| Herramienta | Función en el sistema |
|---|---|
| **Web/Ecommerce** | Canal de venta y escaparate (ya casi listo) |
| **Notion o Google Sheets** | Base de datos operativa: inventario, pedidos, clientes |
| **n8n** | Cerebro de automatización: conecta todas las piezas |
| **Gmail** | Comunicaciones con clientes y notificaciones internas |
| **Google Drive** | Almacenamiento de facturas, etiquetas, documentos |
| **Claude / IA** | Catalogación, redacción de descripciones, análisis, copiloto |
| **Voiceflow** | Chatbot de atención al cliente (cuando haya FAQs definidas) |

---

## Fase 1: Inventario y catalogación automática

> **Prioridad máxima.** Es el cuello de botella real: cada libro es único y requiere catalogación individual.

### Flujo automatizado

```
ISBN (escaneado o escrito)
  → Buscar metadatos del libro (título, autor, editorial, año, portada, sinopsis)
  → Crear registro en base de datos (Notion/Sheets)
  → Evaluar estado físico (como nuevo, muy bueno, bueno, aceptable)
  → Sugerir precio según estado + mercado
  → Generar descripción de producto con IA
  → Publicar en la web (o marcar para revisión humana)
```

### Campos mínimos de la base de datos

| Campo | Tipo | Ejemplo |
|---|---|---|
| ID interno | Auto | SVL-00142 |
| ISBN | Texto | 9788420472156 |
| Título | Texto | El nombre de la rosa |
| Autor | Texto | Umberto Eco |
| Editorial | Texto | Alfaguara |
| Año | Número | 1984 |
| Género | Categoría | Novela histórica |
| Estado | Categoría | Como nuevo / Muy bueno / Bueno / Aceptable |
| Coste de adquisición | Número | 2,50 € |
| Precio de venta | Número | 9,90 € |
| Ubicación física | Texto | Estantería B-3 |
| Estado de publicación | Categoría | Pendiente / Publicado / Vendido / Retirado |
| Fecha de entrada | Fecha | 2026-09-22 |
| Portada | URL/Imagen | (auto desde API) |
| Sinopsis | Texto largo | (auto desde API) |

### APIs para metadatos de libros (a verificar)

- **Open Library** — gratuita, sin API key, buena cobertura
- **Google Books API** — gratuita, incluye portadas y sinopsis
- **ISBNdb** — de pago, más completa en datos comerciales
- **WorldCat** — amplia cobertura bibliográfica

### Recomendación

- Empezar con Open Library (gratuita) y complementar con Google Books si faltan datos
- Mantener **revisión humana antes de publicar** durante los primeros 2-3 meses
- Una vez validado el flujo, activar publicación automática

---

## Fase 2: Gestión de pedidos y stock

> Evita el riesgo crítico: vender un libro único que ya no está disponible.

### Flujo automatizado

```
Pedido recibido en la web
  → n8n detecta el nuevo pedido
  → Actualiza estado del libro: Disponible → Reservado
  → Notificación interna (email/Telegram)
  → Generar etiqueta de envío (si se integra con Correos/SEUR/DHL)
  → Preparar paquete (control humano)
  → Confirmar envío → estado: Enviado
  → Email automático al cliente con número de seguimiento
  → Estado final: Vendido
```

### Estados de inventario

| Estado | Significado |
|---|---|
| Disponible | En venta en la web |
| Reservado | Pedido realizado, pendiente de envío |
| Enviado | Paquete en tránsito |
| Vendido | Transacción completada |
| Devuelto | Devolución del cliente |
| Retirado | Fuera de venta (baja, pérdida, regalo) |

### Integraciones clave

- **Web → n8n:** Webhook o API del ecommerce (WooCommerce, Shopify, etc.)
- **n8n → Notion/Sheets:** Actualización automática del registro de inventario
- **n8n → Gmail:** Emails transaccionales al cliente
- **n8n → Google Drive:** Guardar etiquetas y albaranes generados

---

## Fase 3: Marketing automático

> Publicar libros nuevos sin esfuerzo manual en redes y email.

### Flujo automatizado

```
Nuevo libro publicado en la web
  → n8n detecta la publicación
  → Claude genera copy para redes sociales (formato Instagram + Facebook)
  → Publicación programada en redes (o cola de aprobación)
  → Añadir a newsletter semanal de novedades
  → Segmentación: notificar a clientes interesados en ese género
```

### Calendario editorial sugerido

| Canal | Frecuencia | Contenido |
|---|---|---|
| Instagram | 3-4 por semana | Libro destacado, foto + descripción breve |
| Newsletter | 1 por semana | Resumen de novedades + libro de la semana |
| Facebook | 2 por semana | Novedades + promociones |
| YouTube Shorts | 1-2 por semana | Vídeo corto de libro destacado (aprovecha tu experiencia en YouTube) |

### Herramientas

- **Buffer o Metricool** para programación social (conector n8n disponible)
- **Mailchimp o Brevo** para newsletter (planes gratuitos suficientes al inicio)
- **Canva** para plantillas de imágenes (ya lo usas)

---

## Fase 4: Atención al cliente con IA

> Primero definir los procesos, luego automatizar.

### Paso 1: Base de conocimiento (FAQ)

Documentar respuestas a las preguntas frecuentes:

- ¿Cuánto tarda el envío?
- ¿Puedo reservar un libro?
- ¿Hacéis devoluciones?
- ¿Qué métodos de pago aceptáis?
- ¿Podéis buscar un libro concreto?
- ¿Compráis libros de segunda mano?

### Paso 2: Chatbot con Voiceflow

```
Cliente entra en la web
  → Chatbot saluda y ofrece ayuda
  → Resuelve FAQ automáticamente
  → Si es consulta de pedido → consulta estado en tiempo real
  → Si es queja/devolución/queja → escala a humano (email o WhatsApp)
```

### Paso 3: WhatsApp Business (opcional)

- Mensajes automáticos de confirmación de pedido y envío
- Plantillas para consultas frecuentes
- Escalado a humano para casos complejos

---

## Fase 5: Analítica y toma de decisiones

> Datos para decidir qué comprar, qué rebajar y qué promocionar.

### Dashboard semanal

| Métrica | Para qué sirve |
|---|---|
| Ventas totales (semana/mes) | Seguir el negocio |
| Margen por libro | Rentabilidad real |
| Ticket medio | Estrategia de precios |
| Rotación por género | Qué géneros comprar más |
| Libros sin vender +30 días | Candidatos a rebaja |
| Coste de adquisición medio | Control de compras |
| Tiempo medio de venta | Eficiencia del catálogo |
| Top 10 géneros vendidos | Guía de compras futuras |

### Alertas automáticas

- Libro sin vender en X días → sugerir rebaja de precio
- Margen por debajo de umbral → revisar estrategia de precios
- Stock bajo en un género → alerta de reposición
- Pico de ventas de un autor → buscar más libros de ese autor

### Herramientas

- **Google Looker Studio** (gratis) conectado a Google Sheets para dashboard visual
- **n8n** para generar reportes automáticos y enviarlos por email cada lunes

---

## Fase 6: Innovación avanzada con IA

> Cuando las fases 1-5 estén operativas, escalar con inteligencia artificial.

### Casos de uso avanzados

1. **Recomendador de libros**
   - Motor de recomendaciones: "Si te gustó X, también te puede gustar Y"
   - Basado en el historial de compras del cliente y similitud de géneros/autores

2. **Precio dinámico asistido por IA**
   - Ajuste automático de precios según antigüedad, demanda, precios de mercado
   - Rebajas progresivas: un libro que no se vende baja de precio automáticamente cada 30 días

3. **Compra inteligente de lotes**
   - Foto del lote → IA identifica títulos y condiciones → estimación de valor
   - Decisión rápida: comprar o no, y a qué precio

4. **Copiloto interno (agente IA)**
   - Asistente que responde preguntas operativas: "¿Qué libros rebajar esta semana?", "¿Qué género está vendiendo más?", "¿Qué precio poner a este libro?"
   - Integrado con la base de datos de inventario y ventas

5. **Valoración automática de lotes por foto**
   - Subir foto de una estantería o caja de libros → IA detecta ISBNs → genera lista con precios estimados
   - Útil para comprar colecciones enteras de particulares

---

## Orden recomendado de implementación

```
Fase 1: Inventario y catalogación  ← EMPEZAR AQUÍ
    ↓
Fase 2: Pedidos y stock
    ↓
Fase 3: Marketing automático
    ↓
Fase 4: Atención al cliente
    ↓
Fase 5: Analítica y decisiones
    ↓
Fase 6: Innovación con IA
```

Cada fase construye sobre la anterior. No saltarse pasos: la analítica (Fase 5) no funciona sin datos limpios del inventario (Fase 1).

---

## MVP de 30 días: Empezar ya

### Semana 1: Base de datos
- Crear la base de datos en Notion (o Google Sheets) con los campos mínimos
- Dar de alta manualmente los libros que ya tienes en stock
- Estructurar las categorías y estados

### Semana 2: Flujo de catalogación automática
- Configurar un webhook en n8n que reciba un ISBN
- Conectar con Open Library API para obtener metadatos
- Crear registro automático en Notion con todos los datos
- Añadir generación de descripción con Claude

### Semana 3: Publicación en la web
- Conectar n8n con tu plataforma ecommerce (WooCommerce/Shopify)
- Flujo: ISBN → metadatos → Notion → publicación automática (con revisión humana)
- Probar con 10-15 libros reales

### Semana 4: Pedidos básicos
- Configurar notificación automática cuando entra un pedido
- Actualizar estado del libro a "Reservado" automáticamente
- Email automático al cliente de confirmación

---

## Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Datos sucios en el inventario | Automatizaciones erróneas | Estandarizar formatos desde el día 1 |
| Confiar precios 100% a la IA | Precios incorrectos | Revisión humana durante 2-3 meses |
| Sobreventa de libros únicos | Cliente insatisfecho | Reserva automática al recibir pedido |
| Publicar sin revisión | Errores en la web | Cola de aprobación en la Fase 1 |
| Dependencia total de una API | Caída del servicio | Tener API de respaldo (Open Library + Google Books) |
| Automatizar antes de tener proceso | Caos | Definir el proceso manual primero, luego automatizar |

---

## Próximo paso

Diseñar el **primer flujo concreto**: la alta automática de un libro por ISBN con n8n + Open Library + Notion. Esto te dará resultados visibles en la primera semana y es la base de todo lo demás.

---

*Documento generado el 22 de septiembre de 2026 para Segunda Vuelta Libros*
