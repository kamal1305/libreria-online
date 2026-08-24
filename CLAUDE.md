# Proyecto: [NOMBRE DE LA LIBRERÍA]

## 1. Prompt maestro para Claude Code

Actúa como un equipo senior formado por: arquitecto de software, desarrollador full-stack, diseñador UX/UI, especialista SEO, experto en operaciones de librería, analista de negocio, especialista en protección de datos y QA.

Quiero crear una librería de segunda mano online para vender libros usados en España, empezando desde Jerez de la Frontera y operando inicialmente en la península. El objetivo es construir un MVP real, sencillo, rápido, accesible, preparado para SEO y ampliable.

No copies diseños, textos, marcas, datos ni código de competidores. Estudia únicamente patrones funcionales de negocios similares y documenta qué principios generales se adoptan. Las referencias de mercado incluyen Trotalibros, IberLibro, Casa del Libro Segunda Mano, Re-Read, AIDA Books&More, Wallapop y Todocoleccion. Úsalas para elaborar un análisis comparativo, no para clonarlas.

Antes de escribir código:
1. Inspecciona el repositorio y detecta la estructura existente.
2. Propón tres opciones de arquitectura y recomienda una.
3. Define el MVP, las funcionalidades posteriores y los riesgos.
4. Pregunta únicamente por decisiones que bloqueen el desarrollo. Para lo demás, elige una opción razonable y documenta la decisión.
5. Crea `docs/plan.md`, `docs/decisiones.md`, `docs/modelo-negocio.md` y `docs/requisitos.md`.
6. Divide el trabajo en fases pequeñas, verificables y reversibles.

## 2. Propuesta de producto

### Público objetivo
- Lectores que buscan libros económicos.
- Personas que quieren vender o donar sus libros.
- Coleccionistas y lectores de libros descatalogados.
- Estudiantes que buscan libros de texto usados.
- Lectores de español y, en una segunda fase, de inglés y francés.

### Propuesta de valor
- Catálogo seleccionado y descrito con honestidad.
- Fotografías reales del ejemplar cuando sea posible.
- Ficha clara con ISBN, edición, estado y defectos.
- Precios competitivos y envío agrupado.
- Compra sencilla desde móvil.
- Reutilización y segunda vida de los libros.
- Atención cercana desde Andalucía.

### MVP obligatorio
- Página de inicio.
- Catálogo con búsqueda por título, autor, ISBN y editorial.
- Filtros por género, idioma, precio, estado y formato.
- Ficha de libro con fotografías, descripción, estado, ISBN, edición, precio y disponibilidad.
- Carrito y checkout.
- Registro e inicio de sesión opcionales.
- Pago seguro mediante proveedor externo, sin almacenar datos de tarjeta.
- Cálculo de gastos de envío.
- Emails de confirmación de pedido.
- Panel privado de administración.
- Alta, edición, baja y cambio de stock.
- Importación de catálogo mediante CSV.
- Gestión de pedidos y estados.
- Cupones simples y libros destacados.
- Páginas legales y contacto.
- SEO técnico básico, sitemap, robots.txt y datos estructurados de producto.
- Diseño responsive, accesible y optimizado para velocidad.

### Fase posterior
- Compra de lotes a particulares.
- Formulario de valoración de libros.
- Recogida a domicilio.
- Programa de crédito para futuras compras.
- Marketplace con libreros colaboradores.
- Lista de deseos y alertas de ISBN.
- Recomendaciones personalizadas.
- Blog y contenido editorial.
- Integración con Instagram, TikTok y YouTube.
- Panel de métricas de margen, rotación y adquisición.

## 3. Reglas de negocio

- Un ejemplar físico usado equivale normalmente a una unidad de stock.
- No se puede vender un ejemplar reservado o vendido.
- Cada ficha debe indicar claramente el estado: como nuevo, muy bueno, bueno, aceptable o con defectos.
- Los defectos importantes deben aparecer en texto y fotografía.
- El ISBN no sustituye a la verificación del ejemplar físico.
- No publicar una ficha si faltan título, autor, precio, estado y fotografía o justificación de ausencia.
- Registrar coste de adquisición, precio de venta, comisión, embalaje, envío y margen estimado.
- Separar precio del libro, gastos de envío, descuentos e impuestos en el pedido.
- Permitir agrupar varios libros para reducir el coste de envío.
- El stock debe actualizarse de forma transaccional al confirmar el pago.
- Los libros no disponibles no deben aparecer como comprables.
- Nunca inventar datos bibliográficos; marcar la información pendiente de revisión.

## 4. Modelo de datos mínimo

Diseña y documenta entidades para:
- `Book`: id, título, autor, ISBN, editorial, año, idioma, género, formato, páginas, estado, descripción, defectos, fotografías, precio, coste, stock, slug, SEO, fechas.
- `Category` y `Tag`.
- `Customer`.
- `Cart` y `CartItem`.
- `Order` y `OrderItem`.
- `Payment`.
- `Shipment`.
- `Supplier` o `Seller`.
- `AcquisitionBatch`.
- `Coupon`.
- `AuditLog`.

Usa identificadores seguros, índices para búsqueda, restricciones de integridad y timestamps. No guardes datos de tarjeta. Diseña el esquema para poder añadir marketplace sin romper el MVP.

## 5. Arquitectura técnica

Si no existe una restricción previa, recomienda una arquitectura moderna y mantenible, por ejemplo:
- Frontend y backend tipados.
- Framework web con renderizado del servidor para SEO.
- Base de datos relacional.
- ORM con migraciones.
- Almacenamiento de imágenes compatible con S3.
- Proveedor externo de pagos.
- Servicio de correo transaccional.
- Tests unitarios, de integración y end-to-end.
- Docker para desarrollo reproducible.
- CI con lint, tipos, tests y build.

No fijes proveedores irreversibles hasta comparar coste, simplicidad, disponibilidad en España y facilidad de migración. Toda variable sensible debe estar en `.env.example`, nunca en Git.

## 6. UX/UI

Diseña una experiencia cálida, editorial y clara:
- Prioridad móvil.
- Búsqueda visible desde el primer pantallazo.
- Filtros fáciles de quitar.
- Estado del libro explicado en lenguaje normal.
- Fotos grandes y honestas.
- Botón de compra visible.
- Indicador de stock real.
- Checkout corto.
- Contraste suficiente y navegación por teclado.
- No usar ventanas emergentes innecesarias.
- No utilizar dark patterns ni urgencia falsa.

Propón una identidad visual propia inspirada en librerías, papel y reutilización, sin imitar a ninguna marca.

## 7. SEO y contenidos

Implementa:
- URLs limpias y permanentes.
- Títulos y metadescripciones editables.
- Canonical y Open Graph.
- Sitemap de categorías y libros disponibles.
- Schema.org para productos, ofertas, breadcrumbs y organización.
- Páginas de categorías útiles, no páginas vacías.
- Blog con guías sobre lectura, libros descatalogados y reutilización.
- Evitar contenido generado masivamente sin revisión humana.
- No publicar páginas duplicadas por filtros.

El tono de marca será cercano, honesto y sencillo. El contenido debe estar en español de España.

## 8. Operaciones

Crea procedimientos documentados para:
- Recibir lotes.
- Revisar estado.
- Limpiar y embalar.
- Fotografiar.
- Catalogar por ISBN.
- Fijar precio.
- Publicar.
- Reservar y preparar pedidos.
- Gestionar devoluciones.
- Retirar libros dañados.
- Controlar inventario.

Crea una matriz de precios basada en demanda, estado, rareza, edición, coste y rotación. Nunca presentes un precio como objetivamente correcto sin indicar que es una estimación.

## 9. Legal y confianza

Prepara páginas y checklist para revisión profesional en España:
- Aviso legal.
- Política de privacidad.
- Política de cookies.
- Condiciones de compra.
- Envíos y devoluciones.
- Formulario de desistimiento cuando corresponda.
- Facturación.
- Protección de datos.
- Consumo y comercio electrónico.
- Fiscalidad aplicable a libros usados.

No des asesoramiento legal definitivo. Señala qué debe confirmar una gestoría o abogado. No afirmes automáticamente el tipo de IVA: depende de la operación, del producto y del régimen aplicable.

## 10. Seguridad

- Validar y sanear toda entrada.
- Proteger sesiones y formularios.
- Aplicar autorización por roles.
- Verificar webhooks de pago.
- Evitar exposición de datos personales.
- Añadir rate limiting donde sea necesario.
- Registrar eventos administrativos sin almacenar secretos.
- Probar errores de stock, pagos repetidos y pedidos duplicados.
- Ejecutar auditoría de dependencias.

## 11. Agentes en `.claude/agents/`

Crea estos subagentes, cada uno con alcance limitado:

### `product-manager.md`
Define alcance, historias de usuario, criterios de aceptación, prioridades y métricas. No modifica código.

### `market-researcher.md`
Investiga competidores y patrones funcionales usando fuentes actuales. Entrega comparativas y oportunidades. No copia textos ni diseños. No modifica código.

### `architect.md`
Revisa arquitectura, modelo de datos, decisiones técnicas, escalabilidad, costes y migraciones. No implementa funcionalidades sin plan aprobado.

### `frontend.md`
Implementa componentes, páginas, responsive design, accesibilidad y estados de carga/error. Debe añadir tests cuando corresponda.

### `backend.md`
Implementa API, servicios, persistencia, autenticación, stock, pedidos, pagos y validaciones. Debe proteger datos y añadir tests.

### `catalog-ops.md`
Diseña importación CSV, normalización bibliográfica, estados de ejemplar, inventario, pricing y flujo de publicación. No inventa datos.

### `seo-content.md`
Crea arquitectura SEO, metadatos, schema, categorías y contenidos editoriales en español. Requiere revisión humana antes de publicar.

### `qa.md`
Ejecuta lint, tipos, tests, accesibilidad, responsive checks y pruebas de negocio. Devuelve errores reproducibles y severidad.

### `security-reviewer.md`
Audita permisos, secretos, pagos, webhooks, validaciones, dependencias y exposición de datos. No corrige sin autorización; entrega informe.

### `finance-ops.md`
Calcula margen por pedido, coste de adquisición, envío, embalaje, comisiones, devoluciones y punto de equilibrio. Trabaja con supuestos explícitos.

## 12. Formato obligatorio de cada tarea

Antes de ejecutar una tarea, responde con:
- Objetivo.
- Archivos que cambiarás.
- Supuestos.
- Riesgos.
- Criterios de aceptación.
- Cómo verificarás el resultado.

Después de ejecutarla, informa de:
- Cambios realizados.
- Tests ejecutados y resultado.
- Problemas pendientes.
- Documentación actualizada.
- Siguiente paso recomendado.

## 13. Proceso de desarrollo

1. Inicializa Git y crea una rama para cada funcionalidad.
2. Lee `CLAUDE.md` y los documentos de `docs/` antes de actuar.
3. Trabaja en modo plan para tareas complejas.
4. Implementa una pieza pequeña.
5. Ejecuta lint, chequeo de tipos y tests.
6. Haz revisión de seguridad y accesibilidad.
7. Actualiza la documentación.
8. Haz commit con un mensaje descriptivo.
9. No mezcles refactors con funcionalidades.
10. No borres código ni datos sin confirmación explícita.

## 14. Primer prompt para iniciar Claude Code

Lee este documento y actúa como Product Manager y Arquitecto. No escribas código todavía. Analiza el proyecto, crea un informe de viabilidad y propón:

1. Nombre provisional y posicionamiento.
2. Cliente objetivo inicial.
3. Modelo de adquisición de libros.
4. Modelo de ingresos.
5. Catálogo mínimo viable.
6. Arquitectura recomendada.
7. Costes iniciales y costes mensuales estimados.
8. Riesgos legales, operativos y tecnológicos.
9. Roadmap de 90 días.
10. Lista priorizada de decisiones que necesito tomar.

Guarda el resultado en `docs/01-diagnostico-inicial.md` y espera mi aprobación antes de generar la aplicación.

## 15. Segundo prompt: construir el MVP

Con el diagnóstico aprobado, crea un plan técnico detallado. Después implementa únicamente la Fase 1: base del proyecto, configuración, modelo de datos, migraciones, autenticación administrativa y catálogo de prueba. No implementes pagos todavía.

Cada cambio debe tener tests. Usa datos ficticios claramente marcados. No uses datos personales, secretos ni imágenes con copyright sin permiso. Detente al final de la fase y entrega el informe de verificación.

## 16. Métricas iniciales

Mide como mínimo:
- Visitas a ficha de producto.
- Búsquedas sin resultados.
- Tasa de añadir al carrito.
- Conversión.
- Ticket medio.
- Margen bruto por pedido.
- Coste de envío sobre ventas.
- Tiempo desde adquisición hasta publicación.
- Rotación por categoría.
- Porcentaje de devoluciones.
- Libros vendidos por canal.

## 17. Principios de decisión

- Primero validar la demanda; después automatizar.
- La calidad de los datos importa más que tener muchas referencias.
- No construir un marketplace antes de dominar inventario y logística propios.
- Automatizar tareas repetitivas, pero mantener revisión humana en estado, precio, legal y publicación.
- Preferir soluciones simples, migrables y con costes previsibles.
- Todo supuesto debe quedar escrito.
- El proyecto debe poder funcionar con un catálogo pequeño y crecer sin rehacerse.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
