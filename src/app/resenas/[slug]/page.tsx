import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { demoReviews } from "@/lib/demo-data";

export default async function ReviewDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let review;
  try {
    review = await db.review.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: { book: true },
    });
  } catch {
    review = demoReviews.find((item) => item.slug === slug) ?? null;
  }
  if (!review) notFound();
  const hasUsedCopy = Boolean(
    review.book &&
      review.book.stock > 0 &&
      review.book.status === "PUBLISHED"
  );

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
          className="flex items-center gap-3"
          style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, textDecoration: "none" }}
        >
          <img src="/logo.jpg" alt="Logo Más que libros" style={{ width: 36, height: 36, borderRadius: "50%" }} />
          <span>Más que libros <span style={{ color: "var(--rose-deep)", fontSize: ".85rem", fontWeight: 400 }}>· Páginas y café</span></span>
        </Link>
        <Link
          href="/resenas"
          style={{
            fontSize: ".8rem",
            color: "var(--rose-deep)",
            textDecoration: "underline",
          }}
        >
          Todas las reseñas
        </Link>
      </header>

      <article
        className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[.7fr_1.3fr] lg:py-24"
        style={{ background: "var(--paper)" }}
      >
        <div>
          <div
            className="review-cover"
            style={{
              backgroundImage: `url(${review.coverUrl ?? ""})`,
              aspectRatio: "3 / 4",
              borderRadius: 22,
              boxShadow: "var(--shadow-md)",
              backgroundColor: "var(--ivory)",
            }}
            role="img"
            aria-label={review.coverAlt ?? "Portada de reseña"}
          />
          <p
            style={{
              marginTop: 20,
              fontSize: ".72rem",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "var(--rose-deep)",
            }}
          >
            {review.publishedAt?.toLocaleDateString("es-ES", {
              dateStyle: "long",
            })}
          </p>
        </div>

        <div>
          <p className="eyebrow">RESEÑA EDITORIAL</p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              lineHeight: 1.05,
              letterSpacing: "-.01em",
              margin: "0 0 12px",
              color: "var(--charcoal-soft)",
            }}
          >
            {review.title}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>
            Por {review.author}
          </p>
          <div className="stars mt-6 text-xl">
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </div>

          <div
            className="mt-12 border-y py-8"
            style={{ borderColor: "var(--line)" }}
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
              Sinopsis
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.7,
                margin: 0,
                color: "var(--charcoal-soft)",
              }}
            >
              {review.synopsis}
            </p>
          </div>

          <div className="review-content-area mt-10">{review.content}</div>

          {/* Buy actions */}
          <div className="review-actions mt-12">
            {hasUsedCopy ? (
              <Link className="used-book-button" href="/">
                Comprar nuestro ejemplar usado ·{" "}
                {Number(review.book?.price).toFixed(2).replace(".", ",")} EUR
              </Link>
            ) : (
              <span className="muted-button">Ejemplar usado no disponible</span>
            )}
            {review.amazonAffiliateUrl && (
              <a
                className="amazon-button"
                href={review.amazonAffiliateUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Comprar nuevo en Amazon ↗
              </a>
            )}
          </div>
          <p
            style={{
              fontSize: ".74rem",
              color: "var(--muted)",
              marginTop: 20,
            }}
          >
            Los enlaces a Amazon pueden generar una comisión para la librería,
            sin coste adicional para ti.
          </p>
          {review.instagramUrl && (
            <a
              className="instagram-button mt-8"
              href={review.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                marginTop: 28,
                color: "var(--rose-deep)",
                border: "1px solid var(--line)",
                backgroundColor: "var(--ivory)",
              }}
            >
              Ver post o reel en Instagram ↗
            </a>
          )}

          <div
            className="mt-10 flex gap-5 border-t pt-6"
            style={{ borderColor: "var(--line)", fontSize: ".86rem" }}
          >
            <span style={{ color: "var(--muted)" }}>Compartir:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                review.title
              )}&url=${encodeURIComponent(
                `http://localhost:3000/resenas/${review.slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--rose-deep)" }}
            >
              X
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                `http://localhost:3000/resenas/${review.slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--rose-deep)" }}
            >
              Facebook
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}