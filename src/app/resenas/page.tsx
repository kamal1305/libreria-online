import Link from "next/link";
import { db } from "@/lib/db";
import { demoReviews, type PublicReview } from "@/lib/demo-data";

export const metadata = {
  title: "Reseñas | Segunda Vuelta Libros",
  description:
    "Lecturas comentadas por Segunda Vuelta Libros: reseñas con calma para encontrar tu próxima historia.",
};

export default async function ReviewsPage() {
  let reviews: PublicReview[] = demoReviews;
  try {
    reviews = (
      await db.review.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      })
    ).map((review) => ({
      id: review.id,
      slug: review.slug,
      title: review.title,
      author: review.author,
      synopsis: review.synopsis,
      content: review.content,
      rating: review.rating,
      coverUrl: review.coverUrl,
      coverAlt: review.coverAlt,
      amazonAffiliateUrl: review.amazonAffiliateUrl,
      instagramUrl: review.instagramUrl,
      publishedAt: review.publishedAt,
      status: review.status,
    }));
  } catch {
    reviews = demoReviews;
  }

  return (
    <main
      className="min-h-screen bg-[var(--ivory)] text-[var(--text)]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <header className="admin-page admin-header mx-auto flex max-w-7xl items-center justify-between border-b px-5 py-5 lg:px-8">
        <Link
          href="/"
          className="brand-lockup"
          style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}
        >
          Segunda Vuelta{" "}
          <span style={{ color: "var(--rose-deep)" }}> Libros</span>
        </Link>
        <Link
          href="/"
          style={{
            fontSize: ".8rem",
            color: "var(--rose-deep)",
            textDecoration: "underline",
          }}
        >
          Volver a la tienda
        </Link>
      </header>

      <section
        className="mx-auto max-w-7xl pb-24 pt-20 px-5 lg:px-8"
        style={{ background: "var(--cream)" }}
      >
        <p className="eyebrow">CLUB DE LECTURA</p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-.025em",
            maxWidth: 620,
            margin: "0 0 24px",
            color: "var(--charcoal-soft)",
          }}
        >
          Reseñas para volver a{" "}
          <span style={{ color: "var(--rose-deep)" }}>mirar un libro.</span>
        </h1>
        <p
          style={{
            margin: "0 0 48px",
            maxWidth: 480,
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "var(--text)",
          }}
        >
          Lecturas comentadas con calma, para encontrar tu próxima historia y
          conversar sobre ella.
        </p>

        <div className="review-grid">
          {reviews.map((review) => (
            <Link
              className="review-card"
              href={`/resenas/${review.slug}`}
              key={review.id}
            >
              <div
                className="review-cover"
                style={{
                  backgroundImage: `url(${review.coverUrl ?? ""})`,
                }}
                role="img"
                aria-label={review.coverAlt ?? "Portada de reseña"}
              />
              <div className="review-card-copy">
                <div className="stars">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
                <h2>{review.title}</h2>
                <p>{review.author}</p>
                <span>Leer reseña →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}