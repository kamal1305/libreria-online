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