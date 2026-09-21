import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { demoBooks } from "@/lib/demo-data";
import { BookDetailActions } from "@/components/BookDetailActions";

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
      className="min-h-screen bg-[var(--paper)] text-[var(--text)]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Header bar */}
      <header
        className="mx-auto flex max-w-7xl items-center justify-between border-b px-5 py-4 lg:px-8"
        style={{ borderColor: "var(--line)", background: "var(--paper)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Más que libros, volver al inicio"
        >
          <Image
            src="/logo.jpg"
            alt="Más que libros"
            width={42}
            height={42}
            className="brand-logo-img"
          />
          <span className="brand-text">
            <span className="brand-title" style={{ fontSize: "1.08rem" }}>
              Más que <span className="brand-title-accent">libros</span>
            </span>
            <span className="brand-tagline" style={{ fontSize: ".64rem" }}>
              Páginas y café · Libros de ocasión
            </span>
          </span>
        </Link>
        <Link
          href="/#catalogo"
          className="text-xs text-[var(--rose-deep)] hover:underline font-semibold flex items-center gap-1"
        >
          ← Volver al catálogo completo
        </Link>
      </header>

      {/* Main book article */}
      <article
        className="mx-auto grid max-w-6xl gap-12 px-5 py-12 lg:grid-cols-[.75fr_1.25fr] lg:py-20"
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
              position: "relative",
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
          <p className="eyebrow">{category ? category.toUpperCase() : "LIBRO DE OCASIÓN"}</p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              lineHeight: 1.1,
              letterSpacing: "-.01em",
              margin: "0 0 10px",
              color: "var(--charcoal-soft)",
            }}
          >
            {book.title}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: ".95rem", margin: "0 0 14px" }}>
            Autor: <strong className="text-[var(--charcoal-soft)]">{book.author}</strong>
          </p>
          <p
            style={{
              fontSize: ".75rem",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--sage-deep)",
              fontWeight: 700,
            }}
          >
            Estado: {conditionLabels[book.condition] ?? "Como nuevo"}
          </p>

          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 700,
              margin: "20px 0 6px",
              color: "var(--rose-deep)",
            }}
          >
            {price} €
          </p>

          <div
            className="border-y py-6"
            style={{ borderColor: "var(--line)", marginTop: 18 }}
          >
            <h2
              style={{
                fontSize: ".66rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".14em",
                margin: "0 0 10px",
                color: "var(--sage)",
              }}
            >
              Sinopsis &amp; Descripción
            </h2>
            <p
              style={{
                fontSize: ".96rem",
                lineHeight: 1.7,
                margin: 0,
                color: "var(--charcoal-soft)",
              }}
            >
              {description ??
                "Título de nuestro catálogo de ocasión, revisado en mano y seleccionado con mimo desde Jerez de la Frontera."}
            </p>
          </div>

          {/* Acciones de compra: Añadir a cesta + Pedir por WhatsApp + Amazon fallback */}
          <BookDetailActions
            book={{
              id: String(book.id),
              slug: book.slug,
              title: book.title,
              author: book.author,
              price: Number(book.price),
              imageUrl: book.imageUrl,
              condition: book.condition,
              amazonAffiliateUrl: book.amazonAffiliateUrl,
            }}
          />
        </div>
      </article>
    </main>
  );
}
