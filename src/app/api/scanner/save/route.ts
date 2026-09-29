import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const INVENTARIO_DB_ID = process.env.NOTION_INVENTARIO_DB_ID;

function formatIsbn(clean: string) {
  if (clean.length === 13) {
    return `${clean.slice(0, 3)}-${clean.slice(3, 5)}${clean.slice(5, 7)}${clean.slice(7, 12)}${clean.slice(12)}`;
  }
  return clean;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      isbn,
      sku,
      title,
      author,
      genre,
      price,
      condition,
      synopsis,
      coverUrl,
      year,
    } = body;

    if (!title || !sku) {
      return NextResponse.json(
        { error: "El título y el SKU son obligatorios" },
        { status: 400 }
      );
    }

    const cleanIsbn = (isbn || "").replace(/[^0-9X]/gi, "").toUpperCase();
    const formattedIsbn = formatIsbn(cleanIsbn);

    const properties: any = {
      Nombre: {
        title: [{ text: { content: String(title).substring(0, 100) } }],
      },
      SKU: {
        rich_text: [{ text: { content: String(sku) } }],
      },
      ISBN: {
        rich_text: [{ text: { content: formattedIsbn } }],
      },
      Autor: {
        rich_text: [
          { text: { content: String(author || "Desconocido").substring(0, 100) } },
        ],
      },
      Género: {
        select: { name: genre || "Novela y Narrativa" },
      },
      Precio: {
        number: Number(price || 7.0),
      },
      "Estado físico": {
        select: { name: condition || "Bueno" },
      },
      "Estado publicación": {
        select: { name: "Publicado" },
      },
      "Cantidad en Inventario": {
        number: 1,
      },
      Sinopsis: {
        rich_text: [
          {
            text: {
              content: String(
                synopsis ||
                  `${title} de ${author || "Desconocido"}. Ejemplar seleccionado disponible en Más que libros (Jerez).`
              ).substring(0, 1500),
            },
          },
        ],
      },
    };

    if (year && !isNaN(Number(year))) {
      properties["Año"] = { number: Number(year) };
    }

    if (coverUrl && String(coverUrl).startsWith("http")) {
      properties["Portada"] = { url: coverUrl };
    }

    // Petición a Notion
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: INVENTARIO_DB_ID },
        properties,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Error en Notion API (${res.status}): ${errText}`);
    }

    const notionData = await res.json();

    // Guardar en log local si es posible
    try {
      const backupPath = path.join(process.cwd(), "scripts", "scanned-books-log.json");
      let list = [];
      if (fs.existsSync(backupPath)) {
        list = JSON.parse(fs.readFileSync(backupPath, "utf8") || "[]");
      }
      list.push({
        sku,
        isbn: cleanIsbn,
        title,
        author,
        price,
        genre,
        condition,
        coverUrl,
        date: new Date().toISOString(),
      });
      fs.writeFileSync(backupPath, JSON.stringify(list, null, 2), "utf8");
    } catch (e) {
      // Ignorar en serverless
    }

    return NextResponse.json({
      ok: true,
      sku,
      title,
      pageId: notionData.id,
    });
  } catch (error: any) {
    console.error("Error en /api/scanner/save:", error);
    return NextResponse.json(
      { error: error.message || "Error al guardar el libro en Notion" },
      { status: 500 }
    );
  }
}
