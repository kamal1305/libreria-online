const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function calculateSuggestedPrice(title, author, genre) {
  const t = title.toLowerCase();
  const a = author.toLowerCase();
  const g = genre.toLowerCase();

  // 1. Libros especializados / técnicos / alto valor
  if (t.includes('anatomía dental') || g.includes('odontología') || g.includes('medicina')) {
    return 22.00;
  }
  if (t.includes('por qué fracasan los países')) {
    return 11.50;
  }
  if (t.includes('berlín: la caída') || a.includes('beevor')) {
    return 11.00;
  }
  if (t.includes('historia universal') || t.includes('felipe ii')) {
    return 9.50;
  }

  // 2. Grandes tomos / sagas / obras destacadas
  if (t.includes('un mundo sin fin') || a.includes('follett')) {
    return 8.50;
  }
  if (a.includes('pérez-reverte') || a.includes('perez-reverte')) {
    if (t.includes('el asedio')) return 7.90;
    return 7.50;
  }
  if (t.includes('el tiempo entre costuras') || a.includes('dueñas')) {
    return 7.50;
  }
  if (t.includes('latidos') || t.includes('fuego cruzado')) {
    return 7.50;
  }

  // 3. Biografías históricas y ensayos
  if (g.includes('biografía') || g.includes('ensayo') || t.includes('catalina la grande') || t.includes('maría antonieta') || t.includes('isabel la católica')) {
    return 7.50;
  }

  // 4. Bestsellers masivos de muchísima tirada
  if (a.includes('dan brown') || t.includes('código da vinci') || t.includes('ángeles y demonios') || t.includes('inferno')) {
    return 4.90;
  }
  if (t.includes('cincuenta sombras')) {
    return 4.50;
  }

  // 5. Clásicos universales / Biblioteca escolar / Bolsillo
  if (
    g.includes('clásico') ||
    a.includes('garcía márquez') || a.includes('delibes') ||
    a.includes('orwell') || a.includes('golding') ||
    a.includes('verne') || a.includes('swift') ||
    a.includes('dickens') || a.includes('conan doyle') ||
    a.includes('zorrilla') || a.includes('benedetti') ||
    a.includes('savater') || a.includes('robin sharma') ||
    a.includes('blasco ibáñez') || a.includes('turguénev')
  ) {
    return 5.50;
  }

  // 6. Literatura Juvenil / Infantil
  if (g.includes('juvenil') || g.includes('infantil')) {
    return 4.90;
  }

  // 7. Romántica / Erótica / Chick lit / Autoayuda ligera
  if (g.includes('romántica') || g.includes('erótica') || g.includes('autoayuda') || a.includes('corín tellado') || a.includes('marian keyes')) {
    return 5.50;
  }

  // 8. Novela histórica / Thriller / Misterio / Suspense / Policiaco
  if (g.includes('histórica') || g.includes('thriller') || g.includes('misterio') || g.includes('suspense') || g.includes('policiaco') || g.includes('espionaje')) {
    return 6.50;
  }

  // 9. Resto de narrativa general
  return 5.90;
}

async function main() {
  const inputPath = path.join(__dirname, '..', 'Inventario Libros en Venta con ISBN - Untitled.csv');
  const raw = fs.readFileSync(inputPath, 'utf8');
  const lines = raw.trim().split('\n');

  const books = [];
  const slugCounts = new Map();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = parseCSVLine(line);
    const title = parts[0] || 'Sin título';
    const author = parts[1] || 'Autor desconocido';
    const genre = parts[2] || 'Varios';
    const rawIsbn = parts[3] || '';
    const cleanIsbn = rawIsbn.replace(/[^0-9X]/gi, '');
    const price = calculateSuggestedPrice(title, author, genre);

    let baseSlug = slugify(title);
    if (!baseSlug) baseSlug = `libro-${i}`;
    let slug = baseSlug;
    if (slugCounts.has(baseSlug)) {
      const count = slugCounts.get(baseSlug) + 1;
      slugCounts.set(baseSlug, count);
      slug = `${baseSlug}-${count}`;
    } else {
      slugCounts.set(baseSlug, 1);
    }

    const coverUrl = cleanIsbn ? `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg` : '/placeholder-book.svg';
    const amazonUrl = `https://www.amazon.es/s?k=${encodeURIComponent(title + ' ' + author)}&tag=libreriajerez-21`;

    books.push({
      title,
      author,
      genre,
      isbn: rawIsbn,
      cleanIsbn,
      price,
      slug,
      coverUrl,
      amazonUrl
    });
  }

  console.log(`📚 Procesados ${books.length} libros del inventario real.`);

  // 1. Escribir CSV para Notion
  const notionRows = [
    ['Título', 'Autor', 'Género', 'ISBN', 'Portada', 'Estado físico', 'Estado publicación', 'Precio']
  ];
  for (const b of books) {
    notionRows.push([
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.author.replace(/"/g, '""')}"`,
      `"${b.genre.replace(/"/g, '""')}"`,
      `"${b.isbn.replace(/"/g, '""')}"`,
      b.coverUrl,
      'Muy bueno',
      'Listo para publicar',
      b.price.toFixed(2)
    ]);
  }
  const notionCsvPath = path.join(__dirname, '..', 'Notion_Import_Inventario_99_Libros.csv');
  fs.writeFileSync(notionCsvPath, notionRows.map(r => r.join(',')).join('\n'), 'utf8');
  console.log(`✅ Notion CSV actualizado con precios valorados: ${notionCsvPath}`);

  // 2. Escribir src/lib/catalog.ts
  const catalogTsContent = `// Catálogo oficial de libros a la venta (99 libros reales con ISBN valorados)
// Generado automáticamente a partir de 'Inventario Libros en Venta con ISBN - Untitled.csv'

export type CatalogBook = {
  slug: string;
  title: string;
  author: string;
  isbn: string;
  price: number;
  genre: string;
  imageUrl: string;
  imageAlt: string;
  amazonUrl: string;
};

export const catalogBooks: CatalogBook[] = ${JSON.stringify(
    books.map(b => ({
      slug: b.slug,
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      price: b.price,
      genre: b.genre,
      imageUrl: b.coverUrl,
      imageAlt: `Portada de ${b.title}, de ${b.author}`,
      amazonUrl: b.amazonUrl
    })),
    null,
    2
  )};
`;
  const catalogPath = path.join(__dirname, '..', 'src', 'lib', 'catalog.ts');
  fs.writeFileSync(catalogPath, catalogTsContent, 'utf8');
  console.log(`✅ src/lib/catalog.ts actualizado con los 99 libros.`);

  // 3. Insertar en base de datos dev.db con Prisma
  const prisma = new PrismaClient();
  try {
    console.log('🔄 Sincronizando con SQLite dev.db...');
    
    // Limpiar libros previos de prueba
    await prisma.cartItem.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.bookTag.deleteMany({});
    await prisma.book.deleteMany({});

    // Crear o recuperar categorías
    const categoryMap = new Map();
    for (const b of books) {
      const catName = b.genre.split('/')[0].trim();
      const catSlug = slugify(catName) || 'general';
      if (!categoryMap.has(catSlug)) {
        let cat = await prisma.category.findUnique({ where: { slug: catSlug } });
        if (!cat) {
          cat = await prisma.category.create({
            data: { name: catName, slug: catSlug }
          });
        }
        categoryMap.set(catSlug, cat.id);
      }
    }

    // Insertar los 99 libros
    for (const b of books) {
      const catName = b.genre.split('/')[0].trim();
      const catSlug = slugify(catName) || 'general';
      const categoryId = categoryMap.get(catSlug) || null;

      await prisma.book.create({
        data: {
          title: b.title,
          author: b.author,
          isbn: b.isbn || null,
          slug: b.slug,
          price: b.price,
          condition: 'VERY_GOOD',
          imageUrl: b.coverUrl,
          imageAlt: `Portada de ${b.title}, de ${b.author}`,
          amazonAffiliateUrl: b.amazonUrl,
          stock: 1,
          status: 'PUBLISHED',
          categoryId: categoryId,
          language: 'es',
          format: 'Tapa blanda / Bolsillo'
        }
      });
    }

    const totalInserted = await prisma.book.count();
    console.log(`🎉 ¡Éxito! Total libros activos en base de datos: ${totalInserted}`);
  } catch (err) {
    console.error('Error insertando en Prisma dev.db:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
