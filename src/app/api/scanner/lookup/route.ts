import { NextRequest, NextResponse } from "next/server";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const INVENTARIO_DB_ID = process.env.NOTION_INVENTARIO_DB_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_BOOKS_API_KEY || "";

// Notion request helper
async function queryNotion(endpoint: string, method = "GET", body: any = null) {
  const res = await fetch(`https://api.notion.com/v1${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Notion error (${res.status}): ${errorText}`);
  }

  return res.json();
}

// Obtener el siguiente SKU correlativo disponible en Notion
async function getNextSku() {
  let hasMore = true;
  let startCursor: string | undefined = undefined;
  let maxNum = 0;

  while (hasMore) {
    const body: any = { page_size: 100 };
    if (startCursor) body.start_cursor = startCursor;
    const res = await queryNotion(`/databases/${INVENTARIO_DB_ID}/query`, "POST", body);
    for (const p of res.results || []) {
      const sku = p.properties.SKU?.rich_text?.[0]?.plain_text || "";
      const m = sku.match(/SVL-(\d+)/);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > maxNum) maxNum = n;
      }
    }
    hasMore = res.has_more;
    startCursor = res.next_cursor;
  }

  const nextNum = maxNum + 1;
  return `SVL-${String(nextNum).padStart(4, "0")}`;
}

// Comprobar duplicado en Notion
async function checkDuplicate(cleanIsbn: string) {
  try {
    const res = await queryNotion(`/databases/${INVENTARIO_DB_ID}/query`, "POST", {
      filter: {
        property: "ISBN",
        rich_text: {
          contains: cleanIsbn,
        },
      },
    });

    if (res.results && res.results.length > 0) {
      const page = res.results[0];
      const sku = page.properties.SKU?.rich_text?.[0]?.plain_text || "Sin SKU";
      const title = page.properties.Nombre?.title?.[0]?.plain_text || "Sin título";
      const estado = page.properties["Estado publicación"]?.select?.name || "Desconocido";
      return { exists: true, sku, title, estado, id: page.id };
    }
  } catch (err) {
    // Si falla, no bloqueamos
  }
  return { exists: false };
}

// Detección de macro-géneros de la tienda
function detectGenre(title = "", categories: string[] = [], description = "") {
  const text = `${title} ${categories.join(" ")} ${description}`.toLowerCase();

  if (text.match(/thriller|policiac|crimen|asesinat|detective|misteri|suspens|terror|noir|sabotaj|intrig/)) {
    return "Suspense y Misterio";
  }
  if (text.match(/infantil|juvenil|cuento|niñ|adolescent|manga|cómic|comic|harry potter|roald dahl|aventura juvenil/)) {
    return "Juvenil e Infantil";
  }
  if (text.match(/historia|biograf|ensayo|guerra|polític|filosof|revoluci|imperio|felipe ii|siglo|monarqu/)) {
    return "Historia y Ensayo";
  }
  if (text.match(/autoayuda|espiritual|psicolog|meditaci|mente|bienestar|superaci|crecimiento personal|serenidad/)) {
    return "Desarrollo y Filosofía";
  }
  if (text.match(/clásic|clasic|quijote|cervantes|shakespeare|lorca|poesía|teatro clásico|mitolog/)) {
    return "Clásicos";
  }
  if (text.match(/cocina|recet|medicina|odontolog|técnic|tecnic|informátic|diccionari|idioma|viaje/)) {
    return "Otros";
  }

  return "Novela y Narrativa";
}

function calculateSuggestedPrice(title = "", genre = "") {
  const t = title.toLowerCase();
  const g = genre.toLowerCase();

  if (t.includes("anatomía") || t.includes("medicina") || t.includes("derecho") || g.includes("otros")) {
    return 11.5;
  }
  if (g.includes("historia") || t.includes("berlín") || t.includes("mundo sin fin") || t.includes("asedio")) {
    return 8.5;
  }
  if (g.includes("infantil") || g.includes("juvenil")) {
    return 5.0;
  }
  return 7.0;
}

export async function POST(req: NextRequest) {
  try {
    const { isbn } = await req.json();
    if (!isbn) {
      return NextResponse.json({ error: "ISBN no proporcionado" }, { status: 400 });
    }

    const cleanIsbn = isbn.replace(/[^0-9X]/gi, "").toUpperCase();
    if (cleanIsbn.length < 10 || cleanIsbn.length > 13) {
      return NextResponse.json(
        { error: `El código "${isbn}" no parece un ISBN válido (10 o 13 dígitos)` },
        { status: 400 }
      );
    }

    // 1. Verificar si ya existe en Notion
    const duplicate = await checkDuplicate(cleanIsbn);

    // 2. Siguiente SKU
    const nextSku = await getNextSku();

    // 3. Buscar en Google Books
    let bookData: any = null;
    try {
      const gRes = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}&key=${GOOGLE_API_KEY}`
      );
      if (gRes.ok) {
        const gJson = await gRes.json();
        if (gJson.items && gJson.items.length > 0) {
          const v = gJson.items[0].volumeInfo;
          let coverUrl = v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail || null;
          if (coverUrl && coverUrl.startsWith("http://")) {
            coverUrl = coverUrl.replace("http://", "https://");
          }
          bookData = {
            source: "Google Books",
            title: v.title || null,
            author: v.authors ? v.authors.join(", ") : "Desconocido",
            publisher: v.publisher || null,
            year: v.publishedDate ? parseInt(v.publishedDate.substring(0, 4), 10) : null,
            description: v.description ? v.description.replace(/<[^>]+>/g, "").trim() : null,
            categories: v.categories || [],
            coverUrl,
          };
        }
      }
    } catch (e) {
      // Ignorar y seguir a Open Library
    }

    // 4. Si no hay datos en Google Books, probar Open Library
    if (!bookData || !bookData.title) {
      try {
        const olRes = await fetch(`https://openlibrary.org/search.json?q=${cleanIsbn}`, {
          headers: { "User-Agent": "SegundaVueltaLibros/1.0 (masquelibrosjerez@gmail.com)" },
        });
        if (olRes.ok) {
          const olData = await olRes.json();
          if (olData.docs && olData.docs.length > 0) {
            const doc = olData.docs[0];
            const coverId = doc.cover_i;
            const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;

            bookData = {
              source: "Open Library",
              title: doc.title || null,
              author: doc.author_name ? doc.author_name.join(", ") : "Desconocido",
              publisher: doc.publisher ? doc.publisher[0] : null,
              year: doc.first_publish_year || null,
              description: null,
              categories: doc.subject ? doc.subject.slice(0, 5) : [],
              coverUrl,
            };
          }
        }
      } catch (e) {
        // Ignorar
      }
    }

    const title = bookData?.title || "";
    const author = bookData?.author || "";
    const year = bookData?.year || null;
    const description = bookData?.description || "";
    const coverUrl = bookData?.coverUrl || null;
    const genre = detectGenre(title, bookData?.categories || [], description);
    const suggestedPrice = calculateSuggestedPrice(title, genre);

    return NextResponse.json({
      ok: true,
      isbn: cleanIsbn,
      title,
      author,
      year,
      publisher: bookData?.publisher || null,
      description,
      coverUrl,
      genre,
      suggestedPrice,
      nextSku,
      duplicate,
      found: Boolean(title),
    });
  } catch (error: any) {
    console.error("Error en /api/scanner/lookup:", error);
    return NextResponse.json({ error: error.message || "Error al buscar libro" }, { status: 500 });
  }
}
