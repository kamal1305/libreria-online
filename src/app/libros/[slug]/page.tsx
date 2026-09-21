import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { demoBooks } from "@/lib/demo-data";

const conditionLabels: Record<string, string> = {
  LIKE_NEW: "Como nuevo",
  VERY_GOOD: "Muy buen estado",
  GOOD: "Buen estado",
  ACCEPTABLE: "Aceptable",
  DEFECTIVE: "Con defectos",
};

export default async function BookDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let book;
  let category: string | null = null;
  try {
    book = await db.book.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: { category: true },
    });
    category = book?.category?.name ?? null;
  } catch {
    book = demoBooks.find((item) => item.slug === slug) ?? null;
    category = book?.category ?? null;
  }
  if (!book) notFound();

  const price = Number(book.price).toFixed(2).replace(".", ",");
  const description =
    "description" in book ? book.description ?? null : null;

  return (
    <main
      className="min-h-screen bg-[var(--ivory)] text-[var(--text)]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Header */}
      <header
        className="mx-auto flex max-w-7xl items-center justify-between border-b px-5 py-5 lg:px-8"
        style={{ borderColor: "var(--line)", background: "var(--paper)" }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.1rem",
          }}
        >
          Segunda Vuelta{" "}
          <span style={{ color: "var(--rose-deep)" }}>Libros</span>
        </Link>
        <Link
          href="/#catalogo"
          style={{
            fontSize: ".8rem",
            color: "var(--rose-deep)",
            textDecoration: "underline",
          }}
        >
          Volver al catálogo
        </Link>
      </header>

      <article
        className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[.7fr_1.3fr] lg:py-24"
        style={{ background: "var(--paper)" }}
      >
        <div>
          <div
            className="book-detail-cover"
            style={{
              aspectRatio: "2 / 3",
              borderRadius: 22,
              overflow: "hidden",
              boxShadow: "var(--shadow-md)",
              backgroundColor: "var(--ivory)",
            }}
          >
            <Image
              src={book.imageUrl ?? "/images/libro-ejemplo.jpg"}
              alt={book.imageAlt ?? "Portada del libro"}
              width={600}
              height={900}
              unoptimized
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        <div>
          <p className="eyebrow">{category ? category.toUpperCase() : "LIBRO"}</p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
              lineHeight: 1.05,
              letterSpacing: "-.01em",
              margin: "0 0 12px",
              color: "var(--charcoal-soft)",
            }}
          >
            {book.title}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>
            {book.author}
          </p>
          <p
            style={{
              marginTop: 10,
              fontSize: ".72rem",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--mint-deep)",
            }}
          >
            {conditionLabels[book.condition] ?? "Estado pendiente"}
          </p>

          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              fontWeight: 600,
              margin: "24px 0 8px",
              color: "var(--rose-deep)",
            }}
          >
            {price} EUR
          </p>

          <div
            className="border-y py-8"
            style={{ borderColor: "var(--line)", marginTop: 20 }}
          >
            <h2
              style={{
                fontSize: ".66rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".14em",
                margin: "0 0 12px",
                color: "var(--rose-deep)",
              }}
            >
              Descripción
            </h2>
            <p
              style={{
                fontSize: "1.02rem",
                lineHeight: 1.7,
                margin: 0,
                color: "var(--charcoal-soft)",
              }}
            >
              {description ??
                "Título de nuestro catálogo de ocasión, seleccionado y revisado con honestidad."}
            </p>
          </div>

          {/* Compra en Amazon */}
          {book.amazonAffiliateUrl ? (
            <a
              className="used-book-button mt-8"
              href={book.amazonAffiliateUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              style={{ marginTop: 28 }}
            >
              Comprar en Amazon ↗ · {price} EUR
            </a>
          ) : (
            <span className="muted-button" style={{ marginTop: 28 }}>
              Ejemplar disponible solo en tienda
            </span>
          )}
          <p
            style={{
              fontSize: ".74rem",
              color: "var(--muted)",
              marginTop: 16,
            }}
          >
            Enlace de afiliado: la librería puede recibir una comisión sin coste
            adicional para ti.
          </p>
        </div>
      </article>
    </main>
  );
}
