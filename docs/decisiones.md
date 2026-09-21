# Decisiones tecnicas de Fase 1

## D-001 Monolito modular

Se elige Next.js con App Router para mantener catalogo, administracion y API en un despliegue sencillo. Microservicios y frontend desacoplado se posponen hasta que el volumen lo justifique.

## D-002 PostgreSQL y Prisma

PostgreSQL es la base objetivo por integridad referencial, busqueda y crecimiento. Prisma gestiona el esquema y las migraciones. El proveedor de hosting queda abierto.

## D-003 Ejemplar fisico como unidad

`Book` representa un ejemplar, por lo que su stock suele ser uno. La obra bibliografica y posibles duplicados se pueden separar en una fase posterior sin romper pedidos.

## D-004 Publicacion explicita

Guardar un libro no lo publica. La publicacion exige titulo, autor, precio positivo, estado, stock y fotografia o justificacion documentada de ausencia. La edicion no verificada permanece pendiente.

## D-005 Autenticacion admin propia y limitada

Fase 1 usa usuarios administradores con hash de contrasena y sesiones server-side. No hay registro publico, OAuth ni recuperacion de contrasena. No se almacenan tarjetas ni secretos en Git.

## D-006 Seed ficticio e idempotente

El seed contiene solo libros y categorias de demostracion, marcados mediante un campo de entorno o texto visible. Se puede ejecutar varias veces sin duplicados.

## D-007 Pagos fuera de alcance

No se crean integraciones de proveedor de pago ni checkout real en Fase 1. Las entidades comerciales se incorporaran junto con reservas, webhooks idempotentes y calculo de envio en la fase siguiente.

## D-008 Calidad antes de despliegue

La salida minima requiere lint, tipos, tests y build. La integracion de base de datos se ejecuta contra PostgreSQL local; los tests de dominio no dependen de servicios externos.

## D-009 Rediseno visual andalusi (v0.2)

Se sustituye la estetica comercial previa (negro y azul, orientada a e-commerce generico) por una identidad propia inspirada en la libreria Al-Andalus de Granada: madera, celosias geometricas y lamparas calidas, reinterpretada en clave digital moderna.

- **Paleta:** arena (`#F0E8D8`), terracota suave (`#C4724E`), maderas (`#6B4C3B`) y toques minerales oscuros (`#2C2421`), con acento dorado (`#C9A96E`) y verde salvia para ofertas.
- **Tipografia:** DM Serif Display para titulos editoriales, Inter para cuerpo, Playfair Display como acento. Se cargan con `next/font` (self-hosted, sin request externa).
- **Motivo decorativo:** patron geometrico de celosia andalusi inline en SVG, aplicado en hero y seccion de esencia.
- **Secciones nuevas en el storefront:** rincón de cafe Nespresso de cortesia y helados infantiles (`#cafe`), y "Nuestra Esencia / Proyecto Jerez" (`#nosotros`) con detalladores de valor (origen, seleccion, estado verificado, consumo consciente).
- **Cabecera:** barra superior sticky con blur, buscador, cesta con contador y barra de navegacion en madera oscura con enlaces a secciones.
- **Accesibilidad:** se mantienen `aria-label`, foco visible, `prefers-reduced-motion` y contraste suficiente. La funcionalidad de catalogo, filtros y carrito no cambia.
- **Verificacion:** typecheck, eslint y `next build` en verde; el route `/` se prerenderiza de forma estatica.

## D-010 Rediseno pastel luminoso (v0.3)

Se sustituye el esquema arena/marron andalusi de la v0.2 por un sistema pastel luminoso inspirado en el patron de confiteria tipo mollyscupcakes.com: base crema/marfil, rosa pastel y detalles verde menta/agua. Se estudia el referente solo por sus patrones generales (familia cromatica, redondeo suave, tipografia friendly); el diseno, la paleta exacta y el logotipo son originales, conforme a la regla del proyecto de no copiar marcas ni disenos ajenos.

- **Paleta:** base marfil/crema (`--paper #FCFAF5`, `--ivory #FBF4EC`, `--cream #FFFFFF`), acento rosa pastel (`--rose #EBB2AA`, `--rose-deep #D98088`), verde menta/agua (`--mint #9CCFBE`, `--mint-deep #6FAF9C`, `--water #B9E4DA`), mantequilla (`--butter #E6CC92`) y tinta gris carbon suave (`--ink #504B42`, `--charcoal-soft #5A544B`). Sombras tintadas en rosa (`rgba(217,128,136,...)`).
- **Tipografia:** Fraunces (serif editorial) para titulares y Nunito Sans para cuerpo, cargadas con `next/font`. Se eliminan DM Serif Display/Inter/Playfair.
- **Motivo decorativo:** patron de puntos suaves pastel (`soft-dots`) en hero y seccion de esencia, sustituyendo la celosia andalusi.
- **Logotipo:** nuevo isotipo horizontal original en SVG inline (paginas abiertas en verde agua/rosa, marcapaginas corazon rosa) con tipografia gris carbon y lema "Libros de ocasión · Café & Helado".
- **Superficies:** esquinas muy redondeadas (22-28px), botones tipo pill, contenedores en crema/marfil con bordes suaves `--line`/`--line-soft`. Todas las variables del esquema anterior (`--sand`, `--terracotta`, `--mineral`, `--wood`, `--gold-pale`, `--charcoal`, `--muted-light`, etc.) se eliminan o remapean.
- **Alcance:** globals.css, layout, Header, storefront, OffersBanner, Footer y las paginas de reseñas y admin. Catalogo, filtros y carrito conservan su funcionalidad.
- **Verificacion:** typecheck, eslint (solo warnings previos), vitest 5/5 y `next build` en verde; smoke test HTTP 200 en `/` con lema, seccion cafe y seccion helado presentes.

## D-011 Catalogo real con compra por afiliado (v0.4)

Se sustituye el catalogo de demostracion visible por el listado real del cliente (130 libros, desde `Listado de libros.docx` del propietario). La compra se enlaza a Amazon con el tag de afiliado `libreriajerez-21` facilitado por el propietario; no se implementa checkout propio.

- **Fuente de datos:** `src/lib/catalog.ts`, generado por `scripts/generate-catalog.js` desde `scripts/catalog-raw.json` (extraido del .docx). Es la unica fuente de verdad, consumida por `prisma/seed.ts` y por el fallback `src/lib/demo-data.ts`.
- **Precio:** 9,50 EUR por defecto; overrides coherentes (8,50-12,90) para ediciones extensas o clasicos. Estimacion revisable, no precio objetivo.
- **Genero:** inferido por titulo en el generador y revisado (11 generos: Novela negra 55, Novela 25, Terror 13, Romance 8, Novela historica 7, Clasicos 6, Humor 5, Fantasia 5, No ficcion 3, Juvenil 2, Ciencia ficcion 1). `CategoryIconNav` crea pestana por genero detectada en los datos, sin listas fijas.
- **Enlace de afiliado:** `/dp/<ASIN>?tag=...` (ASIN real extraido de la URL de portada de Amazon) para 119 libros. Busqueda `https://www.amazon.es/s?k=<titulo o ISBN>&tag=...` para 11 casos sin ASIN fiable (ediciones Kindle/Tablet, ISBN-13 con prefijo 979 o malformado, y el titulo #104). Atributos de seguridad `target="_blank"`, `rel="noopener noreferrer nofollow"` y leyenda de afiliacion.
- **Datos bibliograficos:** los campos bibliograficos provienen del documento del propietario; descripcion generica pendiente de redaccion editorial y revision humana antes de publicar la ficha definitiva.
- **Estado por ejemplar:** todos como "como nuevo" (LIKE_NEW) en el seed; el propietario debe revisar el estado real de cada ejemplar antes del alta definitiva.
- **Verificacion:** typecheck, eslint (solo warnings previos), vitest 5/5, `npm run db:seed` idempotente, `next build` en verde y smoke test HTTP 200: home con 140 enlaces a fichas y pestanas de genero, ficha `/libros/el-retiro` con boton y enlace `/dp/841930472X?tag=libreriajerez-21`, ficha Kindle con enlace de busqueda, slug con deduplicacion (`wilt` vs `las-tribulaciones-de-wilt`).