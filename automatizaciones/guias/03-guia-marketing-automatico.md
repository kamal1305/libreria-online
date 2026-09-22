# Guía: Marketing automático de libros

## Segunda Vuelta Libros · n8n + Notion + Gmail

---

## Resumen del flujo

```
Cron diario (9:00)
  → Busca en Notion libros "Publicado" sin marketing generado
  → Para cada libro genera 3 borradores:
     · Instagram (copy con emojis y hashtags)
     · Facebook (copy descriptivo, tono cercano)
     · Newsletter (formato email, info completa)
  → Crea los borradores en la base de datos de Marketing
  → Marca el libro como "Marketing generado" en el inventario
  → Te envía email con el resumen
```

**Objetivo:** Que cada libro nuevo publicado tenga copy listo para revisar y programar en redes sociales, sin escribir nada a mano.

---

## Lo que ya está listo

1. **Inventario actualizado** con dos campos nuevos:
   - **Marketing generado** (checkbox) — evita duplicados
   - **Fecha marketing** (fecha) — control de cuándo se generó
   - [Ver inventario](https://app.notion.com/p/382e26a38bcc4c1c9bb565b020ebbe27)

2. **Base de datos de Marketing creada** en Notion:
   - [Ver base de datos de marketing](https://app.notion.com/p/6d8b2d0cf2e64740805a66b7f8012a9a)
   - Campos: título, SKU, ISBN, libro, autor, canal, estado, fecha sugerida, copy corto, copy largo, hashtags, URL portada, URL producto, notas

3. **Flujo n8n importable** (`n8n_workflow_marketing.json`)

---

## Paso 1: Importar el flujo en n8n

1. n8n → **Workflows** → **Import from File**
2. Selecciona `n8n_workflow_marketing.json`
3. Nodos del flujo:
   - **Cron Diario 9AM** — ejecuta el flujo cada día a las 9:00
   - **Buscar Libros Publicados** — consulta Notion por libros en estado "Publicado" sin marketing generado
   - **Generar Copy** — crea los textos para Instagram, Facebook y Newsletter
   - **Crear Borrador** — guarda cada borrador en la base de Marketing de Notion
   - **Marcar Generado** — actualiza el inventario para evitar duplicados
   - **Resumen + Notificar Email** — te envía un email con el resumen

---

## Paso 2: Configurar credenciales

- **Notion**: usa la credencial que ya configuraste en los flujos anteriores
- **Gmail**: usa la credencial que ya configuraste en el flujo de pedidos

---

## Paso 3: Probar el flujo

1. Asegúrate de tener al menos un libro con estado "Publicado" y "Marketing generado" sin marcar en Notion
2. Haz clic en **Test Workflow**
3. Verifica:
   - Se crean 3 borradores en la base de Marketing (Instagram, Facebook, Newsletter)
   - El libro se marca como "Marketing generado" en el inventario
   - Recibes un email con el resumen

### Ejemplo de lo que se genera

Para el libro "Crónica de una muerte anunciada" de García Márquez:

**Instagram (copy corto):**
> Nuevo en Segunda Vuelta: "Crónica de una muerte anunciada" de Gabriel García Márquez

**Instagram (copy largo):**
> Nuevo libro en la librería.
>
> "Crónica de una muerte anunciada" de Gabriel García Márquez (1981)
>
> Género: Novela
> Estado: Muy bueno
> Precio: 9,90 eur
>
> Un hombre regresa al pueblo donde nació para investigar un asesinato que ocurrió hace 27 años...
>
> Disponible en nuestra tienda online.
>
> #novela #literatura #lectura #segundavuelta #librossegundamano #jerez #libreria

**Newsletter (extracto):**
> Hola,
>
> Esta semana te traemos una novedad especial:
>
> "Crónica de una muerte anunciada" de Gabriel García Márquez (1981)
>
> Género: Novela
> Estado: Muy bueno
> Precio: 9,90 eur
>
> Un hombre regresa al pueblo donde nació para investigar un asesinato...
>
> Un saludo,
> Segunda Vuelta Libros

---

## Estados de los borradores

| Estado | Significado |
|---|---|
| Borrador | Generado automáticamente, pendiente de revisión |
| Revisar | Has revisado el copy y está listo para programar |
| Programado | Programado en la herramienta de redes sociales |
| Publicado | Ya publicado en el canal correspondiente |
| Descartado | No se va a publicar |

---

## Plantillas de copy por canal

### Instagram
- Tono: visual, emojis, hashtags
- Longitud: hasta 2200 caracteres
- Incluye: título, autor, año, género, estado, precio, sinopsis breve
- Hashtags: por género + #segundavuelta #librossegundamano #jerez #libreria

### Facebook
- Tono: cercano, conversacional
- Longitud: más descriptivo que Instagram
- Incluye: mismo datos + llamada a la acción ("escríbeme o pásate por la tienda")
- Menciona que es ejemplar único

### Newsletter
- Tono: formal pero cercano
- Formato: email estructurado con saludo y despedida
- Incluye: datos completos + sinopsis extendida + enlace al producto
- Sin hashtags

---

## Personalización

### Cambiar el horario del cron
En el nodo **Cron Diario 9AM**, puedes cambiar:
- La hora de ejecución (por defecto: 9:00)
- La frecuencia (diaria, cada 2 días, semanal...)

### Añadir YouTube Shorts
El flujo genera 3 canales por libro. Para añadir YouTube Shorts:
1. Duplica el bloque de Instagram en el Code node "Generar Copy"
2. Cambia el canal a "YouTube Shorts"
3. Adapta el copy para vídeo (más corto, gancho visual)

### Mejorar el copy con IA (opcional)
Cuando tengas una API key de OpenAI o Anthropic:
1. Añade un nodo HTTP Request después de "Generar Copy"
2. Envía el copy a la API con un prompt como: "Mejora este texto para Instagram de forma atractiva y natural"
3. Usa la respuesta mejorada en el nodo "Crear Borrador"

Por ahora, las plantillas generan copy de calidad suficiente para empezar.

### Newsletter semanal real
El flujo genera items de Newsletter en estado "Borrador". Para enviarla:
1. Revisa los borradores de Newsletter en Notion
2. Aprueba los que quieras incluir (cambia estado a "Revisar")
3. Crea un segundo flujo n8n que:
   - Se ejecute los viernes
   - Busque items de Newsletter en estado "Revisar"
   - Compile el email final
   - Lo envíe a través de Brevo, Mailchimp o Gmail

---

## Resumen de las 3 bases de datos en Notion

| Base de datos | Función | URL |
|---|---|---|
| Inventario | Libros en stock, estado, precios, SKU | [Ver](https://app.notion.com/p/382e26a38bcc4c1c9bb565b020ebbe27) |
| Pedidos | Registro de pedidos y seguimiento | [Ver](https://app.notion.com/p/3eab2f92894c44409a95537bc69ed910) |
| Marketing | Borradores de posts y newsletter | [Ver](https://app.notion.com/p/6d8b2d0cf2e64740805a66b7f8012a9a) |

Todo está bajo la página "Segunda Vuelta Libros – Plan Agencia IA" en tu Notion.

---

## Próximos pasos del roadmap

| Fase | Estado |
|---|---|
| Fase 1: Inventario y catalogación por ISBN | Listo |
| Fase 2: Gestión de pedidos y stock | Listo |
| Fase 3: Marketing automático | Listo (este flujo) |
| Fase 4: Atención al cliente con IA | Siguiente |
| Fase 5: Analítica y dashboard | Pendiente |
| Fase 6: Innovación con IA | Pendiente |

---

*Guía generada el 22 de septiembre de 2026 para Segunda Vuelta Libros*
