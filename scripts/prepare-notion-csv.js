const fs = require('fs');
const path = require('path');

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

const inputPath = path.join(__dirname, '..', 'Inventario Libros en Venta con ISBN - Untitled.csv');
const raw = fs.readFileSync(inputPath, 'utf8');
const lines = raw.trim().split('\n');

const outRows = [
  ['Título', 'Autor', 'Género', 'ISBN', 'Portada', 'Estado físico', 'Estado publicación', 'Precio']
];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const parts = parseCSVLine(line);
  const title = parts[0] || '';
  const author = parts[1] || '';
  const genre = parts[2] || '';
  const rawIsbn = parts[3] || '';
  const cleanIsbn = rawIsbn.replace(/[^0-9X]/gi, '');
  const coverUrl = cleanIsbn ? `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg` : '';
  
  outRows.push([
    `"${title.replace(/"/g, '""')}"`,
    `"${author.replace(/"/g, '""')}"`,
    `"${genre.replace(/"/g, '""')}"`,
    `"${rawIsbn.replace(/"/g, '""')}"`,
    coverUrl,
    'Muy bueno',
    'Listo para publicar',
    '6.50'
  ]);
}

const outputPath = path.join(__dirname, '..', 'Notion_Import_Inventario_99_Libros.csv');
const csvOutput = outRows.map((r) => r.join(',')).join('\n');
fs.writeFileSync(outputPath, csvOutput, 'utf8');

console.log(`✅ Creado con éxito: ${outputPath}`);
console.log(`📚 Total libros procesados: ${outRows.length - 1}`);
