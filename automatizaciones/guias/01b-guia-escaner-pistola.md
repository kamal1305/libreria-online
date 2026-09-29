# 📚 Guía de Uso: Escáner de Inventario con Pistola para Más que libros

Diseñado para catalogar pilas de libros físicos en segundos conectando directamente con Notion.

---

## 🚀 Cómo empezar a escanear (3 opciones fáciles)

### Opción 1: Acceso directo en el Escritorio (La más fácil para tu mujer)
1. Ve al **Escritorio de Windows**.
2. Haz doble clic en el icono **`Escanear Libros - Mas que Libros`**.
3. ¡Listo! Se abrirá la consola en verde lista para escanear.

### Opción 2: Archivo en la carpeta del proyecto
* Haz doble clic sobre [`Escanear_Libros.bat`](file:///c:/Users/kamea/libreria-online/Escanear_Libros.bat) en la carpeta principal.

### Opción 3: Desde la terminal
* Ejecuta: `npm run escanear` (o `node scripts/scanner.js`).

---

## ⚡ Flujo de trabajo con la pistola escáner

```
1. Apuntar con la pistola al código de barras del libro (ISBN en la contraportada).
2. La pistola lee el código y pulsa Enter automáticamente.
3. El sistema busca en Google Books y Open Library:
   → Título, Autor, Año, Editorial, Portada, Sinopsis y Género.
4. Muestra la ficha y propone:
   - Género sugerido (1 a 7). Pulsa [Enter] para aceptar.
   - Precio de venta sugerido (ej: 7.00 €). Pulsa [Enter] para aceptar o escribe otro.
   - Estado de conservación. Pulsa [Enter] para 'Bueno'.
5. Suena un pitido y la ficha queda guardada en Notion con su SKU automático (SVL-0100...).
6. Listo para el siguiente libro.
```

---

## 🛡️ Protecciones automáticas incluidas
* **Detección de duplicados:** Si escanea un libro que ya está en Notion, el sistema avisa con una alerta amarilla mostrando el título y SKU existente y pregunta si desea dar de alta otro ejemplar o saltarlo.
* **Copia de seguridad local:** Cada libro escaneado se guarda en Notion y también en el archivo local [`scripts/scanned-books-log.json`](file:///c:/Users/kamea/libreria-online/scripts/scanned-books-log.json).
* **Entrada manual opcional:** Si un libro muy antiguo o raro no tuviera ficha en la red, permite teclear título y autor al instante sin interrumpir la sesión.
