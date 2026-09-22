# Guía de configuración: Alta automática de libros por ISBN

## Segunda Vuelta Libros · n8n + Open Library + Notion

---

## Resumen del flujo

```
Introduces un ISBN
  → n8n busca el libro en Open Library (título, autor, año, portada)
  → n8n obtiene la descripción completa del libro
  → n8n normaliza los datos y asigna un género
  → n8n crea la ficha en tu base de datos de Notion
  → Estado: Pendiente (para tu revisión antes de publicar)
```

**Tiempo estimado de configuración:** 20-30 minutos

---

## Lo que ya está listo

Ya he creado para ti:

1. **Base de datos en Notion** con todos los campos necesarios
   - Ubicada en tu página "Segunda Vuelta Libros – Plan Agencia IA"
   - [Ver base de datos en Notion](https://app.notion.com/p/382e26a38bcc4c1c9bb565b020ebbe27)
2. **Libro de prueba** ya creado: "Crónica de una muerte anunciada" de García Márquez
3. **Archivo de flujo n8n** listo para importar (`n8n_workflow_isbn_to_notion.json`)

---

## Paso 1: Importar el flujo en n8n

1. Abre tu instancia de n8n
2. Haz clic en **Workflows** → **Import from File**
3. Selecciona el archivo `n8n_workflow_isbn_to_notion.json`
4. Verás un flujo con estos nodos:
   - **Manual Trigger** — punto de inicio
   - **ISBN Input** — donde escribes el ISBN
   - **Open Library Search** — busca el libro por ISBN
   - **Libro encontrado?** — verifica si hay resultados
   - **Open Library Works** — obtiene descripción y sujetos
   - **Normalizar Datos** — limpia y estructura todo
   - **Crear en Notion** — crea la ficha en tu base de datos
   - **Respuesta / No Encontrado** — mensajes de confirmación

---

## Paso 2: Configurar credenciales de Notion en n8n

1. En el nodo **Crear en Notion**, verás un aviso de credenciales
2. Haz clic en **Create New** → **Notion API**
3. Necesitas crear una integración en Notion:
   - Ve a [notion.so/my-integrations](https://www.notion.so/my-integrations)
   - Crea una nueva integración llamada "n8n Segunda Vuelta"
   - Copia el **Internal Integration Secret** (empieza por `ntn_`)
   - Pégalo en n8n
4. Vuelve a Notion y abre la base de datos de inventario
   - [Base de datos de inventario](https://app.notion.com/p/382e26a38bcc4c1c9bb565b020ebbe27)
5. Haz clic en los tres puntos (`...`) → **Connections** → busca "n8n Segunda Vuelta" → **Confirm**
6. En n8n, el nodo "Crear en Notion" debería poder conectarse ahora

---

## Paso 3: Verificar el Database ID

El flujo ya incluye el ID de tu base de datos: `382e26a3-8bcc-4c1c-9bb5-65b020ebbe27`

Si n8n no lo detecta automáticamente:
1. Abre el nodo **Crear en Notion**
2. En el campo **Database**, busca y selecciona "Inventario - Segunda Vuelta Libros"
3. Si no aparece, usa el ID manualmente

---

## Paso 4: Probar el flujo

1. Haz clic en **Test Workflow** (o ejecuta desde el Manual Trigger)
2. El ISBN por defecto es `9788420683146` (Crónica de una muerte anunciada)
3. Para probar con otro libro, edita el nodo **ISBN Input** y cambia el valor
4. Verifica que se crea una nueva entrada en tu base de datos de Notion
5. Comprueba que tiene: título, autor, año, género, portada, sinopsis

### ISBNs de prueba

| ISBN | Libro |
|---|---|
| 9780747532699 | Harry Potter y la piedra filosofal |
| 9780140328721 | Matilda (Roald Dahl) |
| 9788420683146 | Crónica de una muerte anunciada |

---

## Cómo funciona cada nodo

### Manual Trigger
Punto de inicio. Se ejecuta cuando tú lo decides. Más adelante puedes sustituirlo por un Webhook para activarlo desde una app móvil o un formulario.

### ISBN Input
Extrae el ISBN de la entrada. Por defecto usa uno de prueba, pero puedes cambiarlo o conectarlo a un formulario.

### Open Library Search
Hace una petición HTTP a:
```
https://openlibrary.org/search.json?isbn={ISBN}
```
Devuelve: título, autor, año de publicación, ID de portada.

### Open Library Works
Hace una segunda petición para obtener detalles completos:
```
https://openlibrary.org/works/{workKey}.json
```
Devuelve: descripción, sujetos/géneros.

### Normalizar Datos
Código JavaScript que:
- Limpia y estructura todos los datos
- Construye la URL de la portada
- Mapea los sujetos de Open Library a tus categorías de Notion
- Trunca la descripción si es muy larga (máx. 2000 caracteres)

### Crear en Notion
Crea una nueva página en tu base de datos con todos los campos rellenados. El libro queda en estado **Pendiente** para tu revisión.

### Respuesta
Devuelve un resumen: título, autor, ISBN, género, URL de Notion y portada.

---

## Personalización

### Cambiar el estado físico por defecto
En el nodo **Crear en Notion**, busca la propiedad "Estado físico" y cambia "Bueno" por el estado que prefieras. O déjalo vacío para rellenarlo manualmente.

### Añadir precio automático
Si quieres que el flujo sugiera un precio, puedes añadir un nodo de IA entre "Normalizar Datos" y "Crear en Notion" que estime el precio según el estado, año y género. Esto lo veremos en una fase posterior.

### Activar por Webhook (acceso desde móvil)
Sustituye el **Manual Trigger** por un nodo **Webhook**. Así podrás enviar ISBNs desde tu móvil o un formulario y el flujo se ejecutará automáticamente.

### Fallback a Google Books
Si Open Library no encuentra un libro, puedes añadir un nodo HTTP Request a Google Books como alternativa:
```
https://www.googleapis.com/books/v1/volumes?q=isbn:{ISBN}
```
Google Books ofrece más datos en español y suele tener mejor cobertura para ediciones españolas.

---

## Próximos pasos del roadmap

| Fase | Qué sigue | Cuándo |
|---|---|---|
| Fase 1 (actual) | Alta automática por ISBN → Notion | Ahora |
| Fase 1b | Publicación automática en la web | Cuando tengas el flujo probado |
| Fase 2 | Gestión de pedidos y stock | Tras Fase 1 |
| Fase 3 | Marketing automático | Tras Fase 2 |

### Para la Fase 1b (publicación en la web)
Necesitaré saber qué plataforma usa tu web:
- WooCommerce / WordPress
- Shopify
- PrestaShop
- Tienda Nube
- Web personalizada

Con esa información puedo diseñar el flujo de publicación automática del producto en tu tienda.

---

*Guía generada el 22 de septiembre de 2026 para Segunda Vuelta Libros*
