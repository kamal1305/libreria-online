// Generador del catalogo: lee scripts/catalog-raw.json (extraido del .docx)
// y produce src/lib/catalog.ts con genero, precio y enlace de afiliado.
const fs = require("fs");
const path = require("path");
const raw = JSON.parse(fs.readFileSync(path.join(__dirname, "catalog-raw.json"), "utf8").replace(/^﻿/, ""));

const TAG = "libreriajerez-21";
const DEFAULT_PRICE = 9.5;

// Genero por titulo (clave exacta tal y como aparece en el .docx)
const GENRES = {
  "El retiro": "Novela negra",
  "El recluso": "Novela negra",
  "El extraño verano de Tom Harvey": "Novela negra",
  "Mutagénesis convergente": "Ciencia ficción",
  "La herencia": "Novela negra",
  "Las tres vidas de Sofonisba (Kindle)": "Novela histórica",
  "El rebaño": "Novela negra",
  "Una casa en Brenthouse Road": "Novela negra",
  "Alas de sangre (Empíreo 1)": "Fantasía",
  "Alas de hierro (Empíreo 2)": "Fantasía",
  "El gran timo de las hadas (Kindle)": "Novela",
  "Oliver Twist (Kindle)": "Clásicos",
  "Un animal salvaje": "Novela negra",
  "Horrorstör": "Terror",
  "El infierno": "Novela negra",
  "Todo lo que nunca fuimos (Kindle)": "Romance",
  "Acércate": "Romance",
  "Siete sobres": "Novela",
  "La mujer de arriba": "Novela negra",
  "Los muertos sí hablan": "Novela negra",
  "Hermanas": "Novela negra",
  "La mala costumbre": "Novela",
  "El juez y el pescador (Tablet)": "Novela",
  "El cuco de cristal": "Novela negra",
  "El nido del cuco": "Novela negra",
  "Los jazmines de la muerte": "Novela negra",
  "Una fiesta a medianoche": "Novela negra",
  "Asesinato en el Orient Express": "Novela negra",
  "El asombroso viaje de Pomponio Flato": "Humor",
  "La camarera": "Novela",
  "La sombra de la Gioconda": "Novela histórica",
  "Las abandonadas": "Novela negra",
  "En algún lugar del mar más azul": "Fantasía",
  "Mi querida Lucía": "Novela",
  "La casa de muñecas": "Novela negra",
  "El hombre frente al espejo": "Novela negra",
  "El ascensor": "Novela negra",
  "Los niños de la casa del lago": "Novela negra",
  "El intermediario": "Novela negra",
  "Oficio de tinieblas": "Novela negra",
  "Nunca mientas": "Novela negra",
  "La profecía de las 6 puertas": "Novela histórica",
  "Lady Mayfair": "Romance",
  "El dragón negro": "Novela negra",
  "El vals de las flores": "Novela",
  "El alumno": "Novela negra",
  "La chica de la limpieza": "Novela negra",
  "Las tribulaciones de Wilt": "Humor",
  "Wilt": "Humor",
  "Cuando la tormenta pase": "Novela negra",
  "Expediente Doppelgänger": "Novela negra",
  "La maestra": "Novela negra",
  "Bienvenidos a la librería Hyunam-dong": "Novela",
  "Cómo vender una casa encantada": "Terror",
  "Esnob": "Novela",
  "El otro lado": "Novela",
  "Billy Summers": "Novela negra",
  "Aunque llueva en primavera": "Romance",
  "Los secretos de Heap House": "Juvenil",
  "A un lado de la carretera": "Novela negra",
  "Tinta y fuego": "Novela negra",
  "El refugio de Sandrine": "Novela negra",
  "El libro de las puertas": "Fantasía",
  "La cara norte del corazón": "Novela negra",
  "Figuras ocultas": "Terror",
  "La chica de al lado": "Terror",
  "La hora azul": "Novela negra",
  "El brillo de las luciérnagas": "Novela",
  "Bajo tierra seca": "Novela negra",
  "Nada de esto es verdad": "Novela negra",
  "La delicadeza": "Novela",
  "No mientas": "Novela negra",
  "Ángela (Kindle)": "Novela negra",
  "Joyride": "Terror",
  "La dama de la Cartuja (Kindle)": "Novela histórica",
  "El exorcismo de mi mejor amiga": "Terror",
  "HEX": "Terror",
  "Amnesia (Kindle)": "Novela histórica",
  "Cuando te encontré": "Novela",
  "¿Jugamos?": "Novela negra",
  "El adversario": "No ficción",
  "La paz encontrada": "No ficción",
  "La cala": "Novela negra",
  "Guía del club de lectura para matar vampiros": "Terror",
  "Una buena pieza": "Novela negra",
  "Brujería para chicas descarriadas": "Terror",
  "Los ojos son la mejor parte": "Terror",
  "Los peligros de fumar en la cama": "Terror",
  "Animal": "Novela",
  "El sanador de caballos": "Novela histórica",
  "La metamorfosis infinita": "Novela negra",
  "Los incomprendidos": "No ficción",
  "La última princesa": "Novela histórica",
  "La casa al final de la calle": "Novela negra",
  "La perra": "Novela",
  "Panza de burro": "Novela",
  "Demonios familiares": "Clásicos",
  "Butcher & Blackbird": "Romance",
  "No, mamá, no": "Novela",
  "VON": "Novela",
  "Cumbres borrascosas": "Clásicos",
  "Yo no sé de otras cosas": "Novela",
  "Mil soles espléndidos": "Novela",
  "Cuando no queden más estrellas que contar": "Romance",
  "Noches blancas": "Clásicos",
  "Alas de ónix (Empíreo 3)": "Fantasía",
  "Vienen cuando hace frío": "Terror",
  "El Lazarillo de torpes": "Humor",
  "La casa de las amapolas": "Novela",
  "Tres enigmas para la Organización": "Humor",
  "Casada a la fuerza": "Romance",
  "La canguro": "Novela negra",
  "Del color de la leche": "Novela",
  "La casa torcida": "Novela negra",
  "La casa entre los pinos": "Novela negra",
  "El viejo y el mar": "Clásicos",
  "Lo que habita en los sueños": "Novela negra",
  "La mala hija": "Novela negra",
  "El corazón de las tinieblas": "Clásicos",
  "Cuando el viento hable": "Novela negra",
  "Las cosas que perdimos en el fuego": "Terror",
  "El curioso incidente del perro a medianoche": "Juvenil",
  "Las gratitudes": "Novela",
  "Navidades trágicas": "Novela negra",
  "El sueño de coincidir contigo": "Romance",
  "Mis días en la librería Morisaki": "Novela",
  "El canto de los grillos": "Novela negra",
  "El verano en que mi madre tuvo los ojos verdes": "Novela",
  "La promesa": "Novela negra",
  "El último juego": "Novela negra",
};

// Precio por titulo (override); el resto usa DEFAULT_PRICE
const PRICES = {
  "Alas de sangre (Empíreo 1)": 12.9,
  "Alas de hierro (Empíreo 2)": 12.9,
  "Alas de ónix (Empíreo 3)": 12.9,
  "El infierno": 11.5,
  "El cuco de cristal": 11.5,
  "Mil soles espléndidos": 12.5,
  "Billy Summers": 11.5,
  "Butcher & Blackbird": 11.5,
  "Esnob": 10.5,
  "La mala costumbre": 10.5,
  "Bienvenidos a la librería Hyunam-dong": 10.5,
  "Mis días en la librería Morisaki": 10.5,
  "El sanador de caballos": 11.5,
  "Oliver Twist (Kindle)": 8.5,
  "Cumbres borrascosas": 8.5,
  "El viejo y el mar": 8.5,
  "Noches blancas": 8.5,
  "El corazón de las tinieblas": 8.5,
};

function slugify(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Caso especial: sin ASIN fiable -> busqueda de Amazon
const isSpecial = (title, isbn) =>
  /kindle|tablet/i.test(title) ||
  /[^0-9-]/.test(isbn) || // ISBN malformado (letras/espacios)
  isbn.replace(/-/g, "").startsWith("979") ||
  isbn.replace(/-/g, "").length !== 13;

const asinFromCover = (url) => {
  const m = url && url.match(/images\/P\/([A-Z0-9]{10})\.01/);
  return m ? m[1] : null;
};

const seen = new Map();
const books = raw.map((r) => {
  const title = r.title.trim();
  const author = r.author.trim();
  const isbn = String(r.isbn).trim();
  const special = isSpecial(title, isbn);
  const asin = special ? null : asinFromCover(r.cover);
  const amazonUrl =
    special || !asin
      ? `https://www.amazon.es/s?k=${encodeURIComponent(title)}&tag=${TAG}`
      : `https://www.amazon.es/dp/${asin}?tag=${TAG}`;
  let slug = slugify(title);
  if (seen.has(slug)) { slug = `${slug}-${seen.get(slug) + 1}`; }
  seen.set(slug, (seen.get(slug) || 0));
  return {
    slug,
    title,
    author,
    isbn,
    price: PRICES[title] ?? DEFAULT_PRICE,
    genre: GENRES[title] ?? "Novela",
    imageUrl: r.cover,
    imageAlt: `Portada de ${title}, de ${author}`,
    amazonUrl,
    special,
  };
});

// ---- Resumen para el informe ----
const genreCounts = {};
books.forEach((b) => (genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1));
const specialBooks = books.filter((b) => b.special).map((b) => b.title);
console.log("TOTAL:", books.length);
console.log("GENRES:", JSON.stringify(genreCounts, null, 0));
console.log("SPECIAL (busqueda Amazon):", specialBooks.length, "->", specialBooks.join(" | "));
console.log("Sin ASIN en portada (no especial):", books.filter((b) => !b.special && !/\/dp\//.test(b.amazonUrl)).map((b) => b.title).join(" | ") || "(ninguno)");

// ---- Escribir src/lib/catalog.ts ----
const lines = [];
lines.push("// Catalogo real generado desde el documento del cliente (Listado de libros.docx).");
lines.push("// Fuente unica de datos: titulo, autor, ISBN, portada, genero y enlace de afiliado.");
lines.push("export type CatalogBook = {");
lines.push("  slug: string;");
lines.push("  title: string;");
lines.push("  author: string;");
lines.push("  isbn: string;");
lines.push("  price: number;");
lines.push("  genre: string;");
lines.push("  imageUrl: string;");
lines.push("  imageAlt: string;");
lines.push("  amazonUrl: string;");
lines.push("};");
lines.push("");
lines.push("export const catalogBooks: CatalogBook[] = [");
for (const b of books) {
  lines.push(`  { slug: ${JSON.stringify(b.slug)}, title: ${JSON.stringify(b.title)}, author: ${JSON.stringify(b.author)}, isbn: ${JSON.stringify(b.isbn)}, price: ${b.price}, genre: ${JSON.stringify(b.genre)}, imageUrl: ${JSON.stringify(b.imageUrl)}, imageAlt: ${JSON.stringify(b.imageAlt)}, amazonUrl: ${JSON.stringify(b.amazonUrl)} },`);
}
lines.push("];");
lines.push("");
fs.writeFileSync(path.join(__dirname, "..", "src", "lib", "catalog.ts"), lines.join("\n"), "utf8");
console.log("WROTE src/lib/catalog.ts");
