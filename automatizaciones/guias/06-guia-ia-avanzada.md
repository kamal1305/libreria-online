# Guía: Fase 6 — IA avanzada para Segunda Vuelta Libros

## n8n + reglas inteligentes + preparación para LLM

---

## Resumen del sistema

La Fase 6 aporta inteligencia de negocio sin depender de una API de IA externa. Tres flujos de n8n analizan tus datos de Notion y generan recomendaciones accionables:

```
1. IA Precios y Rebajas (cron semanal)
   → Analiza inventario + ventas
   → Detecta libros parados, márgenes bajos, géneros top
   → Crea recomendaciones en Notion
   → Te envía un email con el resumen

2. Copiloto Interno (webhook bajo demanda)
   → Le preguntas en lenguaje natural
   → Te responde con datos operativos al instante
   → 9 consultas predefinidas

3. Recomendador de Libros (webhook bajo demanda)
   → Le das un SKU, ISBN o género
   → Te devuelve 3-5 libros similares disponibles
   → Útil para fichas de producto, newsletter y chatbot
```

---

## Lo que funciona sin API de IA

Todo lo que se entrega en esta fase funciona con **reglas y lógica programada en n8n Code nodes**. No necesitas ninguna API de IA (OpenAI, Anthropic, etc.) para usarlo.

### Qué hace cada flujo con reglas

| Flujo | Lógica | Sin API |
|---|---|---|
| Precios y rebajas | Días en stock, margen, género top, precio mínimo | Sí |
| Copiloto interno | Consultas estructuradas a Notion, resumen de datos | Sí |
| Recomendador | Puntuación por género, autor, precio, estado físico | Sí |

### Qué necesitaría IA real (fase futura)

| Funcionalidad | Tecnología | Cuándo |
|---|---|---|
| Chat libre en lenguaje natural | LLM (Claude, GPT) | Cuando quieras preguntar cualquier cosa |
| Redacción natural de explicaciones | LLM | Para emails más humanos |
| Foto de lote → identificar libros | Visión + OCR | Cuando compres lotes grandes |
| Recomendación semántica por contenido | Embeddings | Para recomendar por trama/tema |

---

## Paso 1: Crear la base de datos "IA Decisiones" en Notion

El conector de Notion llegó a su límite, así que necesitas crear esta base manualmente. Es rápido:

1. En Notion, ve a la página **"Segunda Vuelta Libros – Plan Agencia IA"**
2. Escribe `/table` → selecciona **Table - Full page**
3. Llama a la base **"IA Decisiones - Segunda Vuelta Libros"**
4. Renombra la primera propiedad a `Titulo` (tipo: Title)
5. Añade estas propiedades:

| Propiedad | Tipo | Opciones (si es Select) |
|---|---|---|
| Titulo | Title | — |
| Tipo recomendacion | Select | Precio, Rebaja, Promocion, Compra lote, Recomendador |
| SKU | Text | — |
| Libro | Text | — |
| Autor | Text | — |
| Genero | Select | Novela, Novela historica, Ciencia ficcion, Fantasia, Terror, Thriller, Ensayo, Poesia, Teatro, Infantil, Biografia, Historia, Otros |
| Precio actual | Number | Formato: Euro |
| Precio sugerido | Number | Formato: Euro |
| Motivo | Text | — |
| Confianza | Select | Baja, Media, Alta |
| Accion sugerida | Select | Mantener, Rebajar, Promocionar, Revisar, Comprar, No comprar |
| Estado | Select | Pendiente, Aprobada, Aplicada, Descartada |
| Fecha | Date | — |

6. Copia el ID de la base de datos (los 32 caracteres del final de la URL)

---

## Paso 2: Importar los tres flujos n8n

### Flujo 1: IA Precios y Rebajas

1. n8n → **Workflows** → **Import from File** → `n8n_workflow_ia_precios.json`
2. En el nodo **"Crear Recomendacion"**, reemplaza `IA_DECISIONES_DATABASE_ID` por el ID de tu base "IA Decisiones"
3. Configura credenciales: Notion (ya configurada) y Gmail (ya configurada)
4. Activa el flujo

**Reglas que aplica:**

| Regla | Condición | Acción |
|---|---|---|
| Rebaja +90 días | Libro publicado +90 días sin vender | Rebajar 20% (mínimo margen 50%) |
| Rebaja +60 días | Libro publicado +60 días sin vender | Rebajar 10% |
| Promocionar +30 días | Libro +30 días sin vender | Generar marketing o destacar |
| Género top | Género más vendido + margen alto | Destacar en newsletter |
| Margen bajo | Margen < 40% | Sugerir subida de precio |
| Margen muy alto | Margen > 150% + venta reciente | Sugerir subida del 10% |

### Flujo 2: Copiloto Interno

1. Importa `n8n_workflow_ia_copiloto.json`
2. Configura credenciales de Notion
3. Activa el flujo
4. Copia la URL del webhook

**Cómo usarlo:**

```bash
# Ejemplo con curl
curl -X POST https://tu-n8n/webhook/copiloto-interno \
  -H "Content-Type: application/json" \
  -d '{"consulta": "que libros rebajar?"}'
```

**Consultas disponibles:**

| Consulta natural | Comando | Respuesta |
|---|---|---|
| "qué libros rebajar?" | libros_para_rebajar | Libros +30 días en stock |
| "libros sin marketing" | libros_sin_marketing | Publicados sin copy |
| "géneros más rentables" | generos_mas_rentables | Ranking de margen por género |
| "libros parados 90 días" | libros_parados_90 | Candidatos a retirar |
| "resumen inventario" | resumen_inventario | Stock, valor, margen |
| "stock por género" | stock_por_genero | Distribución del catálogo |
| "ventas por plataforma" | ventas_por_plataforma | Ventas por canal |
| "tickets abiertos" | tickets_abiertos | Soporte pendiente |
| "margen bajo" | margen_bajo | Libros con margen < 40% |
| "ayuda" | ayuda | Lista de comandos |

### Flujo 3: Recomendador de Libros

1. Importa `n8n_workflow_ia_recomendador.json`
2. Configura credenciales de Notion
3. Activa el flujo
4. Copia la URL del webhook

**Cómo usarlo:**

```bash
# Por SKU
curl -X POST https://tu-n8n/webhook/recomendador \
  -H "Content-Type: application/json" \
  -d '{"sku": "SVL-0001", "limite": 5}'

# Por ISBN
curl -X POST https://tu-n8n/webhook/recomendador \
  -H "Content-Type: application/json" \
  -d '{"isbn": "9788420683146"}'

# Por género
curl -X POST https://tu-n8n/webhook/recomendador \
  -H "Content-Type: application/json" \
  -d '{"genero": "Novela", "autor": "Garcia Marquez", "limite": 3}'
```

**Algoritmo de puntuación:**

| Factor | Puntos |
|---|---|
| Mismo género | +3 |
| Mismo autor | +5 |
| Precio similar (±3€) | +2 |
| Estado físico similar | +1 |
| Margen alto (>60%) | +1 (bonus) |

**Respuesta de ejemplo:**

```json
{
  "libroReferencia": "Crónica de una muerte anunciada",
  "totalRecomendaciones": 3,
  "recomendaciones": [
    {
      "titulo": "El amor en los tiempos del cólera",
      "autor": "García Márquez",
      "genero": "Novela",
      "precio": 8.5,
      "sku": "SVL-0003",
      "puntuacion": 9,
      "razones": "mismo autor, mismo genero, precio similar"
    }
  ]
}
```

---

## Paso 3: Integrar el recomendador en tu web

Cuando tu página web tenga la ficha de un libro, puedes llamar al webhook del recomendador para mostrar "Libros similares":

```javascript
// Ejemplo de integración en tu web
const respuesta = await fetch('https://tu-n8n/webhook/recomendador', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sku: 'SVL-0001', limite: 5 })
});
const data = await respuesta.json();

// Mostrar los libros recomendados
data.recomendaciones.forEach(libro => {
  console.log(`${libro.titulo} - ${libro.precio}€`);
});
```

---

## Paso 4: Integrar el copiloto en Telegram o WhatsApp (opcional)

Puedes conectar el copiloto a Telegram usando el nodo de Telegram de n8n:

1. Crea un bot en Telegram con @BotFather
2. En n8n, añade un nodo **Telegram Trigger** antes de "Interpretar Consulta"
3. El texto del mensaje de Telegram se pasa como `consulta`
4. La respuesta del copiloto se envía como mensaje de Telegram

---

## Flujo de trabajo semanal con IA

```
Lunes 9:00  → Email con métricas de la semana (Fase 5)
Lunes 10:00 → Email con recomendaciones de IA (Fase 6)
              → Revisar recomendaciones en "IA Decisiones" (Notion)
              → Aprobar o descartar cada una
              → Aplicar rebajas en tu web
Miércoles    → Usar el copiloto para consultar estado
Viernes      → Usar el recomendador para la newsletter
```

---

## Cómo aprobar y aplicar recomendaciones

Cada lunes, el flujo de IA crea recomendaciones en la base "IA Decisiones" de Notion:

1. Abre la base [IA Decisiones en Notion](https://app.notion.com)
2. Filtra por `Estado: Pendiente`
3. Revisa cada recomendación:
   - **Aprobar**: cambia Estado a "Aprobada"
   - **Descartar**: cambia Estado a "Descartada"
4. Para las aprobadas, aplica el cambio en tu web:
   - Rebajas: actualiza el precio en tu ecommerce
   - Promociones: usa el marketing generado (Fase 3)
   - Revisiones: ajusta el precio según tu criterio
5. Marca como "Aplicada" cuando hayas hecho el cambio

---

## Futuro: añadir IA generativa

Cuando quieras dar el salto a IA con LLM, solo necesitas:

1. **Añadir una API key** (OpenAI, Anthropic, o tu modelo local) en n8n
2. **Añadir un nodo AI** antes del email en el flujo de precios, para que redacte el reporte de forma más natural
3. **Sustituir el Code node del copiloto** por un nodo AI Agent que pueda responder preguntas libres
4. **Añadir un nodo de embeddings** al recomendador para buscar por similitud semántica

La estructura actual está diseñada para que esta evolución sea fácil: solo se cambia el nodo de procesamiento, no todo el flujo.

---

## Resumen del sistema completo

| Fase | Entregables | Estado |
|---|---|---|
| 1. Inventario | Flujo ISBN → Notion | Listo |
| 2. Pedidos | Webhook → reservar stock → registro | Listo |
| 3. Marketing | Cron → borradores de copy | Listo |
| 4. Atención al cliente | Chatbot + FAQ + tickets | Listo |
| 5. Analítica | Métricas + dashboard + Looker Studio | Listo |
| 6. IA avanzada | Precios, copiloto, recomendador | Listo (esta fase) |

**Total: 7 bases de datos en Notion, 8 flujos de n8n, 6 guías**

---

*Guía generada el 22 de septiembre de 2026 para Segunda Vuelta Libros*
