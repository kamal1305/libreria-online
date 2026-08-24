# Plan tecnico de Fase 1

## Objetivo

Entregar una base ejecutable para Segunda Vuelta Libros: catalogo publico de demostracion, persistencia relacional, autenticacion administrativa y pruebas locales. No se implementan pagos, checkout real, correo transaccional ni marketplace.

## Arquitectura

- Next.js App Router con TypeScript y Server Components por defecto.
- Tailwind CSS para una interfaz editorial, accesible y responsive.
- Prisma ORM con PostgreSQL como base objetivo.
- Docker Compose para PostgreSQL local cuando Docker este disponible.
- Vitest para reglas de dominio y tests de integracion de persistencia.
- Sesiones administrativas server-side con cookie httpOnly y tokens almacenados con hash.

## Entregables

1. Scaffold de Next.js, scripts de calidad y variables de entorno de ejemplo.
2. Esquema Prisma, migracion inicial y seed idempotente con datos ficticios.
3. Catalogo publico: inicio, listado, busqueda basica y ficha de libro.
4. Acceso administrativo y panel protegido para consultar catalogo.
5. Servicios de dominio para validar publicacion, stock y auditoria.
6. Tests unitarios e integracion de base de datos.
7. Documentacion de decisiones, requisitos, modelo de negocio y verificacion.

## Modelo de datos de Fase 1

Se implementan `Book`, `Category`, `Tag`, `BookImage`, `Supplier`, `AcquisitionBatch`, `AdminUser`, `AdminSession` y `AuditLog`. Se dejan preparadas las relaciones de `Customer`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Payment`, `Shipment` y `Coupon` para la siguiente fase cuando el flujo de compra este aprobado.

Cada `Book` representa un ejemplar fisico. No se inventan ISBN, ediciones o fotografias: el seed usa registros identificados como demostracion.

## Secuencia de trabajo

1. Inicializar y validar el scaffold.
2. Instalar Prisma, Zod, Vitest y hashing Argon2.
3. Crear esquema, migracion y seed.
4. Implementar reglas de libro y autenticacion.
5. Implementar catalogo y panel minimo.
6. Ejecutar lint, typecheck, tests y build.
7. Documentar resultados y pendientes.

## Criterios de salida

- `npm run lint`, `npm run typecheck`, `npm test` y `npm run build` pasan.
- La migracion se aplica desde una base vacia.
- El seed se puede repetir sin duplicar datos.
- Un libro incompleto no puede publicarse.
- El catalogo publico excluye borradores y stock cero.
- `/admin` requiere sesion administrativa.
- No existen credenciales reales, datos personales reales ni datos de tarjeta.

## Riesgos controlados

- PostgreSQL local no disponible: los tests de dominio siguen siendo ejecutables y se documenta la dependencia para integracion.
- Autenticacion inicial: se limita a administradores y seed local; antes de produccion requiere rate limiting, MFA o politica equivalente y revision de seguridad.
- Datos de demostracion: se rotulan en la interfaz y no se conectan a pagos ni a pedidos reales.