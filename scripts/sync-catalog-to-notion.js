require('dotenv').config();
const fs = require('fs');
const path = require('path');

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const INVENTARIO_DB_ID = process.env.NOTION_INVENTARIO_DB_ID;

if (!NOTION_API_KEY || !INVENTARIO_DB_ID) {
  console.error('Error: Faltan variables NOTION_API_KEY o NOTION_INVENTARIO_DB_ID en .env');
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchNotion(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`https://api.notion.com/v1${endpoint}`, options);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Notion API error (${res.status}): ${errorText}`);
  }
  return res.json();
}

async function archiveExistingBooks() {
  console.log('🧹 Paso 1: Consultando libros de prueba actuales en Notion...');
  const queryRes = await fetchNotion(`/databases/${INVENTARIO_DB_ID}/query`, 'POST', {});
  const existing = queryRes.results || [];
  console.log(`Encontrados ${existing.length} libros a archivar.`);

  for (const page of existing) {
    const title = page.properties['Nombre']?.title[0]?.plain_text || 'Sin título';
    const sku = page.properties['SKU']?.rich_text[0]?.plain_text || 'Sin SKU';
    console.log(`  🗑️ Archivando [${sku}] "${title}"...`);
    await fetchNotion(`/pages/${page.id}`, 'PATCH', { archived: true });
    await sleep(350);
  }
  console.log('✅ Base de datos de Notion limpia y preparada.\n');
}

async function importCatalogBooks() {
  console.log('📚 Paso 2: Leyendo los 99 libros del catálogo oficial...');
  const catalogPath = path.join(__dirname, '..', 'src', 'lib', 'catalog.ts');
  const fileContent = fs.readFileSync(catalogPath, 'utf8');
  const match = fileContent.match(/export const catalogBooks: CatalogBook\[\] = (\[[\s\S]*?\]);/);
  
  if (!match) {
    throw new Error('No se pudo encontrar el array catalogBooks en catalog.ts');
  }

  const books = JSON.parse(match[1]);
  console.log(`Cargados ${books.length} libros para insertar.\n`);

  let count = 0;
  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const index = i + 1;
    const sku = `SVL-${String(index).padStart(4, '0')}`;
    const mainGenre = b.genre ? b.genre.split('/')[0].trim() : 'Novela';

    const properties = {
      'Nombre': {
        title: [{ text: { content: b.title.substring(0, 100) } }]
      },
      'SKU': {
        rich_text: [{ text: { content: sku } }]
      },
      'ISBN': {
        rich_text: [{ text: { content: String(b.isbn || '') } }]
      },
      'Autor': {
        rich_text: [{ text: { content: (b.author || 'Autor desconocido').substring(0, 100) } }]
      },
      'Género': {
        select: { name: mainGenre }
      },
      'Precio': {
        number: Number(b.price || 5.0)
      },
      'Estado físico': {
        select: { name: 'Bueno' }
      },
      'Estado publicación': {
        select: { name: 'Publicado' }
      },
      'Cantidad en Inventario': {
        number: 1
      },
      'Sinopsis': {
        rich_text: [{ text: { content: `${b.title} de ${b.author}. Ejemplar seleccionado de ocasión disponible en Más que libros (Jerez).` } }]
      }
    };

    if (b.imageUrl && b.imageUrl.startsWith('http')) {
      properties['Portada'] = {
        url: b.imageUrl
      };
    }

    try {
      await fetchNotion('/pages', 'POST', {
        parent: { database_id: INVENTARIO_DB_ID },
        properties
      });
      count++;
      console.log(`[${index}/${books.length}] ✅ Insertado [${sku}] "${b.title}" - ${b.author} (${b.price} €)`);
    } catch (err) {
      console.error(`[${index}/${books.length}] ❌ Error insertando "${b.title}":`, err.message);
    }

    await sleep(350); // Respetar rate limits de Notion (3 req/s)
  }

  console.log(`\n🎉 ¡Proceso finalizado! Se han insertado con éxito ${count} libros en Notion.`);
}

async function main() {
  try {
    await archiveExistingBooks();
    await importCatalogBooks();
  } catch (err) {
    console.error('Error durante la sincronización:', err);
  }
}

main();
