# Requisitos de Fase 1

## Funcionales

- Una persona puede consultar el inicio y navegar un catalogo de libros ficticios.
- Puede buscar por texto en titulo, autor, ISBN o editorial cuando esos datos existan.
- Puede abrir una ficha con precio, estado, disponibilidad, descripcion y fotografia o justificacion.
- El sistema no muestra como comprables libros no publicados o sin stock.
- Una persona administradora puede iniciar sesion y cerrar sesion.
- El panel admin solo es accesible con una sesion valida y rol autorizado.
- La administracion puede consultar libros y distinguir borrador, revision, publicado y archivado.
- La regla de publicacion rechaza datos obligatorios ausentes o invalidos.
- Las acciones administrativas relevantes generan auditoria sin tokens ni contrasenas.

## No funcionales

- TypeScript estricto y validacion de entradas en limites de aplicacion.
- PostgreSQL con migraciones reproducibles y restricciones de integridad.
- Interfaz responsive, navegable por teclado y con contraste WCAG AA.
- Metadatos basicos de SEO para las paginas publicas; `/admin` no se indexa.
- Variables sensibles solo mediante entorno.
- Los datos del seed deben estar rotulados como demostracion.

## Fuera de Fase 1

Pagos, checkout real, calculo de envio, correo transaccional, importacion CSV completa, registro de clientes, marketplace, cupones operativos y pedidos reales.

## Criterios de aceptacion

- Base vacia mas migracion mas seed produce un entorno navegable.
- Repetir seed no duplica registros.
- Los tests cubren validacion de publicacion, stock, relaciones y autenticacion.
- Fallos de autenticacion no revelan si existe un correo.
- Ningun test necesita una API externa.