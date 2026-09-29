/**
 * ============================================================================
 * MÁS QUE LIBROS (Segunda Vuelta Libros) · LECTOR Y CATALOGADOR DE CÓDIGO DE BARRAS
 * ============================================================================
 * Diseñado especialmente para escanear libros con pistola lectora USB / Bluetooth
 * o teclado, autocompletar metadatos (Google Books + Open Library), asignar SKU
 * correlativo y guardar la ficha al instante en Notion (Inventario).
 * ============================================================================
 */

require('dotenv').config();
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const INVENTARIO_DB_ID = process.env.NOTION_INVENTARIO_DB_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_BOOKS_API_KEY || '';

// Registro local de respaldo
const BACKUP_FILE = path.join(__dirname, 'scanned-books-log.json');

// Macro-géneros de la tienda Más que libros
const GENRES = [
  'Novela y Narrativa',
  'Suspense y Misterio',
  'Historia y Ensayo',
  'Juvenil e Infantil',
  'Desarrollo y Filosofía',
  'Clásicos',
  'Otros'
];

// Colores para consola
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  bgBlue: '\x1b[44m\x1b[37m'
};

// Petición a la API de Notion
async function notionRequest(endpoint, method = 'GET', body = null) {
  if (!NOTION_API_KEY || !INVENTARIO_DB_ID) {
    throw new Error('Faltan credenciales NOTION_API_KEY o NOTION_INVENTARIO_DB_ID en el archivo .env');
  }

  const res = await fetch(`https://api.notion.com/v1${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error en Notion API (${res.status}): ${errorText}`);
  }

  return res.json();
}

// Obtener el siguiente SKU correlativo disponible en Notion
async function getNextSku() {
  let hasMore = true;
  let startCursor = undefined;
  let maxNum = 0;

  while (hasMore) {
    const body = { page_size: 100 };
    if (startCursor) body.start_cursor = startCursor;
    const res = await notionRequest(`/databases/${INVENTARIO_DB_ID}/query`, 'POST', body);
    for (const p of res.results || []) {
      const sku = p.properties.SKU?.rich_text?.[0]?.plain_text || '';
      const m = sku.match(/SVL-(\d+)/);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > maxNum) maxNum = n;
      }
    }
    hasMore = res.has_more;
    startCursor = res.next_cursor;
  }

  return maxNum + 1;
}

// Comprobar si un ISBN ya existe en Notion
async function checkDuplicateIsbn(cleanIsbn) {
  try {
    const res = await notionRequest(`/databases/${INVENTARIO_DB_ID}/query`, 'POST', {
      filter: {
        property: 'ISBN',
        rich_text: {
          contains: cleanIsbn
        }
      }
    });

    if (res.results && res.results.length > 0) {
      const page = res.results[0];
      const sku = page.properties.SKU?.rich_text?.[0]?.plain_text || 'Sin SKU';
      const title = page.properties.Nombre?.title?.[0]?.plain_text || 'Sin título';
      const estado = page.properties['Estado publicación']?.select?.name || 'Desconocido';
      return { exists: true, sku, title, estado, id: page.id };
    }
  } catch (err) {
    // Si falla la búsqueda, no bloqueamos el escaneo
  }
  return { exists: false };
}

// Buscar metadatos en Google Books
async function fetchFromGoogleBooks(isbn) {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.items || data.items.length === 0) return null;

    const v = data.items[0].volumeInfo;
    let coverUrl = v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail || null;
    if (coverUrl && coverUrl.startsWith('http://')) {
      coverUrl = coverUrl.replace('http://', 'https://');
    }

    return {
      source: 'Google Books',
      title: v.title || null,
      author: v.authors ? v.authors.join(', ') : 'Desconocido',
      publisher: v.publisher || null,
      year: v.publishedDate ? parseInt(v.publishedDate.substring(0, 4), 10) : null,
      description: v.description ? v.description.replace(/<[^>]+>/g, '').trim() : null,
      categories: v.categories || [],
      coverUrl
    };
  } catch (err) {
    return null;
  }
}

// Buscar metadatos en Open Library
async function fetchFromOpenLibrary(isbn) {
  try {
    // 1. Probar búsqueda abierta
    const searchUrl = `https://openlibrary.org/search.json?q=${isbn}`;
    const sRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'SegundaVueltaLibros/1.0 (masquelibrosjerez@gmail.com)' }
    });
    if (sRes.ok) {
      const sData = await sRes.json();
      if (sData.docs && sData.docs.length > 0) {
        const doc = sData.docs[0];
        const coverId = doc.cover_i;
        const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;

        return {
          source: 'Open Library',
          title: doc.title || null,
          author: doc.author_name ? doc.author_name.join(', ') : 'Desconocido',
          publisher: doc.publisher ? doc.publisher[0] : null,
          year: doc.first_publish_year || null,
          description: null,
          categories: doc.subject ? doc.subject.slice(0, 5) : [],
          coverUrl
        };
      }
    }

    // 2. Probar endpoint directo de ISBN
    const directUrl = `https://openlibrary.org/isbn/${isbn}.json`;
    const dRes = await fetch(directUrl, {
      headers: { 'User-Agent': 'SegundaVueltaLibros/1.0 (masquelibrosjerez@gmail.com)' }
    });
    if (dRes.ok) {
      const dData = await dRes.json();
      const coverId = dData.covers && dData.covers[0];
      const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;

      return {
        source: 'Open Library Direct',
        title: dData.title || null,
        author: 'Desconocido',
        publisher: dData.publishers ? dData.publishers[0] : null,
        year: dData.publish_date ? parseInt(dData.publish_date.match(/\d{4}/)?.[0] || '0', 10) : null,
        description: typeof dData.description === 'string' ? dData.description : dData.description?.value || null,
        categories: [],
        coverUrl
      };
    }
  } catch (err) {
    return null;
  }
  return null;
}

// Deducción inteligente de Macro-Género de la tienda
function detectGenre(title = '', categories = [], description = '') {
  const text = `${title} ${categories.join(' ')} ${description}`.toLowerCase();

  if (text.match(/thriller|policiac|crimen|asesinat|detective|misteri|suspens|terror|noir|sabotaj|intrig/)) {
    return 'Suspense y Misterio';
  }
  if (text.match(/infantil|juvenil|cuento|niñ|adolescent|manga|cómic|comic|harry potter|roald dahl|aventura juvenil/)) {
    return 'Juvenil e Infantil';
  }
  if (text.match(/historia|biograf|ensayo|guerra|polític|filosof|revoluci|imperio|felipe ii|siglo|monarqu/)) {
    return 'Historia y Ensayo';
  }
  if (text.match(/autoayuda|espiritual|psicolog|meditaci|mente|bienestar|superaci|crecimiento personal|serenidad/)) {
    return 'Desarrollo y Filosofía';
  }
  if (text.match(/clásic|clasic|quijote|cervantes|shakespeare|lorca|poesía|teatro clásico|mitolog/)) {
    return 'Clásicos';
  }
  if (text.match(/cocina|recet|medicina|odontolog|técnic|tecnic|informátic|diccionari|idioma|viaje/)) {
    return 'Otros';
  }

  return 'Novela y Narrativa';
}

// Precio sugerido en base al título y género
function calculateSuggestedPrice(title = '', genre = '') {
  const t = title.toLowerCase();
  const g = genre.toLowerCase();

  // Técnicos o muy especializados
  if (t.includes('anatomía') || t.includes('medicina') || t.includes('derecho') || g.includes('otros')) {
    return 11.50;
  }
  // Gran formato / Historia / Ensayos
  if (g.includes('historia') || t.includes('berlín') || t.includes('mundo sin fin') || t.includes('asedio')) {
    return 8.50;
  }
  // Infantil o bolsillo
  if (g.includes('infantil') || g.includes('juvenil')) {
    return 5.00;
  }
  // Estándar de ocasión para novelas y misterio
  return 7.00;
}

// Guardar en log local JSON
function saveToLocalLog(book) {
  try {
    let list = [];
    if (fs.existsSync(BACKUP_FILE)) {
      list = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8') || '[]');
    }
    list.push(book);
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    // Silencioso
  }
}

// Función auxiliar para preguntar por teclado
function ask(rl, questionText) {
  return new Promise((resolve) => {
    rl.question(questionText, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Formatear ISBN limpio a formato estándar con guiones para estética
function formatIsbn(clean) {
  if (clean.length === 13) {
    return `${clean.slice(0, 3)}-${clean.slice(3, 5)}${clean.slice(5, 7)}${clean.slice(7, 12)}${clean.slice(12)}`;
  }
  return clean;
}

// Función principal
async function startScanner() {
  console.clear();
  console.log(`\n${c.bgBlue}                                                                      ${c.reset}`);
  console.log(`${c.bgBlue}   📚  MÁS QUE LIBROS (Segunda Vuelta Libros - Jerez)                 ${c.reset}`);
  console.log(`${c.bgBlue}   ⚡  SISTEMA RÁPIDO DE ESCANEO DE INVENTARIO CON PISTOLA USB/BT      ${c.reset}`);
  console.log(`${c.bgBlue}                                                                      ${c.reset}\n`);

  console.log(`${c.dim}Conectando con la base de datos de Notion...${c.reset}`);

  let currentSkuNum;
  try {
    currentSkuNum = await getNextSku();
    console.log(`${c.green}✅ Conexión con Notion establecida con éxito.${c.reset}`);
    console.log(`📌 Siguiente SKU listo para asignar: ${c.bold}${c.cyan}SVL-${String(currentSkuNum).padStart(4, '0')}${c.reset}\n`);
  } catch (err) {
    console.error(`\n${c.red}❌ Error conectando con Notion:${c.reset} ${err.message}`);
    console.log(`${c.yellow}Comprueba el archivo .env con NOTION_API_KEY y NOTION_INVENTARIO_DB_ID.${c.reset}\n`);
    process.exit(1);
  }

  console.log(`${c.bold}Instrucciones de uso:${c.reset}`);
  console.log(` 1. Apunta con la pistola al código de barras del libro (ISBN).`);
  console.log(` 2. La pistola enviará el número y pulsará Enter automáticamente.`);
  console.log(` 3. Revisa los datos, pulsa Enter para aceptar el precio sugerido y ¡listo!`);
  console.log(` ${c.dim}(Para salir en cualquier momento escribe 'salir' o pulsa Ctrl+C)${c.reset}\n`);
  console.log('='.repeat(70));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let keepScanning = true;

  while (keepScanning) {
    const rawInput = await ask(rl, `\n${c.bold}📖 Escanea el código de barras (o escribe el ISBN): ${c.reset}`);

    if (!rawInput) continue;
    if (rawInput.toLowerCase() === 'salir' || rawInput.toLowerCase() === 'exit') {
      console.log(`\n${c.cyan}👋 ¡Sesión de escaneo finalizada! Gracias por tu trabajo.${c.reset}\n`);
      break;
    }

    // Limpiar ISBN (quitar guiones, espacios, letras sobrantes)
    const cleanIsbn = rawInput.replace(/[^0-9X]/gi, '').toUpperCase();

    if (cleanIsbn.length < 10 || cleanIsbn.length > 13) {
      console.log(`${c.yellow}⚠️  El código leído ("${rawInput}") no parece un ISBN válido (debe tener 10 o 13 dígitos). Inténtalo de nuevo.${c.reset}`);
      continue;
    }

    console.log(`${c.dim}🔍 Verificando duplicados y buscando metadatos en la red para ISBN ${cleanIsbn}...${c.reset}`);

    // 1. Comprobar si ya existe en Notion
    const dupCheck = await checkDuplicateIsbn(cleanIsbn);
    if (dupCheck.exists) {
      console.log(`\n${c.yellow}⚠️  ¡ATENCIÓN! Este libro ya está en el inventario:${c.reset}`);
      console.log(`   • SKU: ${c.bold}${dupCheck.sku}${c.reset} | Título: "${dupCheck.title}" | Estado: ${dupCheck.estado}`);
      const addAnother = await ask(rl, `${c.bold}¿Deseas añadir otro ejemplar adicional con un nuevo SKU? (s/N): ${c.reset}`);
      if (addAnother.toLowerCase() !== 's' && addAnother.toLowerCase() !== 'si' && addAnother.toLowerCase() !== 'sí') {
        console.log(`${c.dim}⏭️  Operación cancelada. Pasando al siguiente libro.${c.reset}`);
        continue;
      }
    }

    // 2. Buscar metadatos (Google Books primero, Open Library después)
    let book = await fetchFromGoogleBooks(cleanIsbn);
    if (!book) {
      book = await fetchFromOpenLibrary(cleanIsbn);
    }

    let title = book?.title || '';
    let author = book?.author || '';
    let year = book?.year || null;
    let description = book?.description || '';
    let coverUrl = book?.coverUrl || null;
    let detectedGenre = detectGenre(title, book?.categories || [], description);

    // Si no se encontró en la red, permitir introducir a mano
    if (!title) {
      console.log(`\n${c.magenta}❓ No se encontraron metadatos automáticos en la red para el ISBN ${cleanIsbn}.${c.reset}`);
      const enterManual = await ask(rl, `${c.bold}¿Deseas introducir el Título y Autor manualmente? (S/n): ${c.reset}`);
      if (enterManual.toLowerCase() === 'n') {
        console.log(`${c.dim}⏭️  Saltando libro.${c.reset}`);
        continue;
      }
      title = await ask(rl, `  📝 Título del libro: `);
      if (!title) {
        console.log(`${c.red}El título es obligatorio. Operación cancelada.${c.reset}`);
        continue;
      }
      author = await ask(rl, `  ✍️  Autor (Enter para 'Desconocido'): `) || 'Desconocido';
      detectedGenre = detectGenre(title);
    }

    // Mostrar ficha localizada
    const nextSku = `SVL-${String(currentSkuNum).padStart(4, '0')}`;
    const suggestedPrice = calculateSuggestedPrice(title, detectedGenre);

    console.log(`\n${c.green}📘 Libro detectado:${c.reset}`);
    console.log(`   • ${c.bold}Título:${c.reset}  ${title}`);
    console.log(`   • ${c.bold}Autor:${c.reset}   ${author}`);
    if (year) console.log(`   • ${c.bold}Año:${c.reset}     ${year}`);
    console.log(`   • ${c.bold}SKU:${c.reset}     ${c.cyan}${nextSku}${c.reset}`);
    console.log(`   • ${c.bold}Género sugerido:${c.reset} ${detectedGenre}`);
    if (coverUrl) console.log(`   • ${c.bold}Portada:${c.reset} [Imagen encontrada]`);

    // 3. Confirmar o cambiar género
    console.log(`\n${c.dim}Macro-géneros disponibles: [1] Novela y Narrativa | [2] Suspense y Misterio | [3] Historia y Ensayo | [4] Juvenil e Infantil | [5] Desarrollo y Filosofía | [6] Clásicos | [7] Otros${c.reset}`);
    const genreInput = await ask(rl, `📂 Género [Enter para aceptar "${detectedGenre}"]: `);
    let chosenGenre = detectedGenre;
    if (genreInput) {
      const idx = parseInt(genreInput, 10);
      if (idx >= 1 && idx <= 7) {
        chosenGenre = GENRES[idx - 1];
      } else if (GENRES.includes(genreInput)) {
        chosenGenre = genreInput;
      }
    }

    // 4. Confirmar precio
    const priceInput = await ask(rl, `💰 Precio de venta en euros [Enter para ${suggestedPrice.toFixed(2)} €]: `);
    let chosenPrice = suggestedPrice;
    if (priceInput) {
      const parsedPrice = parseFloat(priceInput.replace(',', '.'));
      if (!isNaN(parsedPrice) && parsedPrice > 0) {
        chosenPrice = parsedPrice;
      }
    }

    // 5. Estado físico de conservación
    console.log(`✨ Estado de conservación: [1] Bueno (por defecto) | [2] Muy bueno | [3] Como nuevo | [4] Aceptable`);
    const condInput = await ask(rl, `Elige estado [Enter = Bueno]: `);
    let chosenCondition = 'Bueno';
    if (condInput === '2') chosenCondition = 'Muy bueno';
    else if (condInput === '3') chosenCondition = 'Como nuevo';
    else if (condInput === '4') chosenCondition = 'Aceptable';

    // 6. Insertar en Notion
    console.log(`\n${c.dim}⏳ Guardando ficha en Notion (${nextSku})...${c.reset}`);

    const properties = {
      'Nombre': {
        title: [{ text: { content: title.substring(0, 100) } }]
      },
      'SKU': {
        rich_text: [{ text: { content: nextSku } }]
      },
      'ISBN': {
        rich_text: [{ text: { content: formatIsbn(cleanIsbn) } }]
      },
      'Autor': {
        rich_text: [{ text: { content: author.substring(0, 100) } }]
      },
      'Género': {
        select: { name: chosenGenre }
      },
      'Precio': {
        number: Number(chosenPrice)
      },
      'Estado físico': {
        select: { name: chosenCondition }
      },
      'Estado publicación': {
        select: { name: 'Publicado' }
      },
      'Cantidad en Inventario': {
        number: 1
      },
      'Sinopsis': {
        rich_text: [{ text: { content: (description || `${title} de ${author}. Ejemplar seleccionado disponible en Más que libros (Jerez).`).substring(0, 1500) } }]
      }
    };

    if (year) {
      properties['Año'] = { number: Number(year) };
    }

    if (coverUrl) {
      properties['Portada'] = { url: coverUrl };
    }

    try {
      await notionRequest('/pages', 'POST', {
        parent: { database_id: INVENTARIO_DB_ID },
        properties
      });

      // Pitido de confirmación audible para el operador de la pistola
      process.stdout.write('\x07');

      console.log(`\n${c.green}╔════════════════════════════════════════════════════════════════════╗${c.reset}`);
      console.log(`${c.green}║  ✅  ¡LIBRO GUARDADO CON ÉXITO EN NOTION!                          ║${c.reset}`);
      console.log(`${c.green}╠════════════════════════════════════════════════════════════════════╣${c.reset}`);
      console.log(`║  SKU:     ${c.bold}${nextSku}${c.reset.padEnd(58)}║`);
      console.log(`║  Título:  ${title.substring(0, 50).padEnd(55)}║`);
      console.log(`║  Autor:   ${author.substring(0, 50).padEnd(55)}║`);
      console.log(`║  Precio:  ${(chosenPrice.toFixed(2) + ' €').padEnd(55)}║`);
      console.log(`║  Género:  ${chosenGenre.padEnd(55)}║`);
      console.log(`║  Estado:  ${(chosenCondition + ' (Publicado)').padEnd(55)}║`);
      console.log(`${c.green}╚════════════════════════════════════════════════════════════════════╝${c.reset}`);

      // Guardar también en log local de seguridad
      saveToLocalLog({
        sku: nextSku,
        isbn: cleanIsbn,
        title,
        author,
        price: chosenPrice,
        genre: chosenGenre,
        condition: chosenCondition,
        coverUrl,
        date: new Date().toISOString()
      });

      // Incrementar SKU para el siguiente libro
      currentSkuNum++;

    } catch (saveErr) {
      console.error(`\n${c.red}❌ Error al guardar en Notion:${c.reset} ${saveErr.message}`);
    }

    console.log(`\n${c.dim}${'─'.repeat(70)}${c.reset}`);
  }

  rl.close();
}

startScanner().catch((err) => {
  console.error('\nError inesperado:', err);
  process.exit(1);
});
