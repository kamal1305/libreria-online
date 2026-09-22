# Guía: Dashboard de analítica y métricas de venta

## Segunda Vuelta Libros · n8n + Google Sheets + Looker Studio

---

## Resumen del sistema

```
Cron semanal (lunes 9:00)
  → n8n consulta las 4 bases de Notion (inventario, ventas, pedidos, soporte)
  → Calcula más de 30 métricas en un Code node
  → Envía email con el reporte semanal completo
  → Escribe una fila de métricas en Google Sheets
  → Google Sheets alimenta el dashboard de Looker Studio
```

---

## Lo que ya está listo

1. **Base de datos de Ventas creada en Notion** (una fila por libro vendido)
   - [Ver Ventas en Notion](https://app.notion.com/p/eaefb7ca23544f648bb0189349d59130)
   - Campos: título, nº pedido, SKU, ISBN, autor, género, plataforma, precio venta, coste, margen €, margen %, días en stock, estado pedido, fecha venta

2. **Venta de prueba creada**: "Crónica de una muerte anunciada" con margen calculado

3. **Flujo n8n de métricas semanales** (`n8n_workflow_metricas.json`)

---

## Métricas que calcula el flujo

### Ventas
| Métrica | Descripción |
|---|---|
| Ventas totales (semana/mes) | Ingresos en euros |
| Nº de pedidos | Pedidos de la semana |
| Nº de libros vendidos | Unidades vendidas |
| Ticket medio | Venta media por pedido |
| Ventas por plataforma | Desglose por Web, WhatsApp, Instagram... |
| Top géneros vendidos | Los 5 géneros que más se venden |
| Top autores vendidos | Los 5 autores que más se venden |

### Rentabilidad
| Métrica | Descripción |
|---|---|
| Coste total de libros vendidos | Lo que te costaron los libros vendidos |
| Margen bruto (€) | Beneficio total |
| Margen bruto (%) | Porcentaje de beneficio |
| Margen por género | Rentabilidad de cada género |

### Inventario
| Métrica | Descripción |
|---|---|
| Stock disponible | Libros en venta |
| Stock reservado | Libros con pedido en curso |
| Stock vendido | Libros vendidos |
| Stock retirado | Libros fuera de venta |
| Valor del inventario | Precio de venta total del stock |
| Coste del inventario | Coste de adquisición del stock |
| Libros sin vender +30/+60/+90 días | Candidatos a rebaja |
| Stock por género | Distribución del catálogo |
| Libros publicados sin marketing | Pendientes de generar copy |

### Soporte
| Métrica | Descripción |
|---|---|
| Tickets abiertos | Pendientes de resolver |
| Tickets por tema | Distribución de consultas |
| Tickets urgentes | Prioridad alta/urgente |

### Alertas automáticas
- Libros sin vender más de 30/60/90 días
- Libros publicados sin marketing generado
- Tickets urgentes pendientes

---

## Paso 1: Configurar Google Sheets

Crea un nuevo Google Sheet con estas pestañas (tabs):

### Pestaña: `metricas_semanales`

Encabezados en la fila 1 (copia exacto):

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fecha | periodo | ventas_semana | ventas_mes | num_pedidos | libros_vendidos | ticket_medio | margen_bruto_eur | margen_pct | stock_disponible | valor_inventario | coste_inventario | libros_sin_vender_30 | libros_sin_vender_60 | libros_sin_vender_90 | tickets_abiertos | num_alertas |

### Pestaña: `ventas_lineas`

Encabezados:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fecha_venta | num_pedido | sku | isbn | titulo | autor | genero | plataforma | precio_venta | coste | margen_eur | margen_pct | dias_stock | estado_pedido |

El flujo de n8n añadirá una fila a `metricas_semanales` cada lunes. Para `ventas_lineas`, puedes añadir un nodo adicional al flujo que vuelque las ventas de la semana.

---

## Paso 2: Importar el flujo n8n

1. n8n → **Workflows** → **Import from File**
2. Selecciona `n8n_workflow_metricas.json`
3. Configura credenciales:
   - **Notion**: ya la tienes configurada
   - **Gmail**: ya la tienes configurada
   - **Google Sheets**: crea una nueva credencial de Google OAuth2 en el nodo "Google Sheets"

4. En el nodo **Google Sheets**, selecciona:
   - Document: tu Google Sheet creado
   - Sheet: `metricas_semanales`

---

## Paso 3: Configurar Looker Studio

1. Ve a [lookerstudio.google.com](https://lookerstudio.google.com)
2. Crea un nuevo informe → **Google Sheets** como fuente
3. Selecciona tu hoja `metricas_semanales`
4. Conecta los datos

### Diseño del dashboard

#### Página 1: Resumen ejecutivo

| Gráfico | Tipo | Datos |
|---|---|---|
| KPI: Ventas semana | Tarjeta (Scorecard) | Suma de `ventas_semana` |
| KPI: Libros vendidos | Tarjeta | `libros_vendidos` |
| KPI: Margen bruto | Tarjeta | `margen_bruto_eur` |
| KPI: Ticket medio | Tarjeta | `ticket_medio` |
| Evolución de ventas | Gráfico de líneas | `fecha` → `ventas_semana` |
| Margen % a lo largo del tiempo | Gráfico de líneas | `fecha` → `margen_pct` |
| Alertas activas | Tabla | `fecha`, `num_alertas` |

#### Página 2: Inventario

| Gráfico | Tipo | Datos |
|---|---|---|
| KPI: Stock disponible | Tarjeta | `stock_disponible` |
| KPI: Valor inventario | Tarjeta | `valor_inventario` |
| KPI: Coste inventario | Tarjeta | `coste_inventario` |
| Libros sin vender por antigüedad | Gráfico de barras | `libros_sin_vender_30`, `_60`, `_90` |
| Evolución del stock | Gráfico de líneas | `fecha` → `stock_disponible` |

#### Página 3: Soporte y alertas

| Gráfico | Tipo | Datos |
|---|---|---|
| KPI: Tickets abiertos | Tarjeta | `tickets_abiertos` |
| Evolución de tickets | Gráfico de líneas | `fecha` → `tickets_abiertos` |
| Alertas por semana | Tabla | `fecha`, `num_alertas` |

#### Página 4: Ventas detalladas (opcional)

Conecta la pestaña `ventas_lineas` como segunda fuente de datos:

| Gráfico | Tipo | Datos |
|---|---|---|
| Ventas por género | Gráfico de barras | `genero` → `precio_venta` |
| Ventas por plataforma | Gráfico circular | `plataforma` → `precio_venta` |
| Top autores | Tabla | `autor`, suma de `precio_venta` |
| Margen por género | Gráfico de barras | `genero` → `margen_eur` |
| Días en stock vs. precio | Gráfico de dispersión | `dias_stock` → `precio_venta` |

---

## Ejemplo de email semanal

Cada lunes a las 9:00 recibirás un email como este:

```
REPORTE SEMANAL - SEGUNDA VUELTA LIBROS
Periodo: Semana del 2026-09-15 al 2026-09-22

=== VENTAS ===
Ventas de la semana: 45,50 eur
Ventas del mes: 120,00 eur
Número de pedidos: 5
Libros vendidos: 5
Ticket medio: 9,10 eur

Ventas por plataforma:
  Web: 36,50 eur, WhatsApp: 9,00 eur

Top géneros vendidos:
  Novela (3), Thriller (1), Ensayo (1)

Top autores vendidos:
  García Márquez (2), Allende (1), Pérez-Reverte (1), Savater (1)

=== RENTABILIDAD ===
Margen bruto: 32,50 eur (71,1%)

=== INVENTARIO ===
Stock disponible: 45 libros
Valor del inventario: 380,00 eur
Libros sin vender +30 días: 8
Libros sin vender +90 días: 2

Libros publicados sin marketing: 3

=== SOPORTE ===
Tickets abiertos: 1
Tickets urgentes: 0

=== ALERTAS (3) ===
8 libros sin vender en más de 30 días
2 libros sin vender en más de 90 días - considerar rebaja
3 libros publicados sin marketing generado
```

---

## Importante: alimentar la base de Ventas

Para que las métricas funcionen correctamente, cada vez que se venda un libro debes crear una entrada en la base de **Ventas** de Notion con:

- Título del libro
- Nº de pedido
- SKU
- Precio de venta y coste
- Margen calculado
- Días en stock
- Fecha de venta

### Automatización recomendada

Puedes modificar el flujo de pedidos (Fase 2) para que, cuando un pedido se complete, cree automáticamente las líneas de venta en esta base. Esto lo haremos cuando me digas qué plataforma de ecommerce usas.

---

## Resumen de las 6 bases de datos en Notion

| Base de datos | Función | URL |
|---|---|---|
| Inventario | Libros en stock, SKU, estado, precios | [Ver](https://app.notion.com/p/382e26a38bcc4c1c9bb565b020ebbe27) |
| Pedidos | Registro de pedidos y seguimiento | [Ver](https://app.notion.com/p/3eab2f92894c44409a95537bc69ed910) |
| Marketing | Borradores de posts y newsletter | [Ver](https://app.notion.com/p/6d8b2d0cf2e64740805a66b7f8012a9a) |
| FAQ | Preguntas frecuentes del chatbot | [Ver](https://app.notion.com/p/25956ca56a444b1db96ab012cab862d0) |
| Soporte | Tickets de incidencias | [Ver](https://app.notion.com/p/81f36a12088244048a57568b8be42b24) |
| Ventas | Líneas de venta para analítica | [Ver](https://app.notion.com/p/eaefb7ca23544f648bb0189349d59130) |

---

## Estado del roadmap completo

| Fase | Entregables | Estado |
|---|---|---|
| 1. Inventario | Flujo ISBN → Notion | Listo |
| 2. Pedidos | Webhook → reservar stock → registro | Listo |
| 3. Marketing | Cron diario → borradores de copy | Listo |
| 4. Atención al cliente | Chatbot + FAQ + tickets | Listo |
| 5. Analítica | Métricas semanales + dashboard | Listo (esta fase) |
| 6. IA avanzada | Recomendador, precio dinámico | Pendiente |

---

*Guía generada el 22 de septiembre de 2026 para Segunda Vuelta Libros*
