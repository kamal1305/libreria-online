import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export default async function AdminReviewsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  const reviews = await db.review.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return (
    <main className="admin-page px-5 py-10 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="admin-header flex items-center justify-between px-5 py-6 lg:px-8">
          <div>
            <p className="eyebrow">PANEL EDITORIAL</p>
            <h1 className="text-4xl">Reseñas</h1>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: ".85rem" }}>
            <Link
              href="/admin"
              style={{
                display: "inline-flex",
                alignItems: "center",
                color: "var(--charcoal-soft)",
              }}
            >
              Catálogo
            </Link>
            <Link href="/admin/resenas/nueva" className="offer-button">
              Nueva reseña
            </Link>
          </div>
        </div>

        <div
          className="admin-content"
          style={{
            marginTop: 32,
            padding: "8px 28px",
            border: "1px solid var(--line-soft)",
            borderRadius: 18,
            background: "white",
          }}
        >
          {reviews.map((review) => (
            <div
              className="flex items-center justify-between border-b py-5"
              style={{ borderColor: "var(--line-soft)" }}
              key={review.id}
            >
              <div>
                <p
                  className="eyebrow"
                  style={{ marginBottom: 4, fontSize: ".6rem" }}
                >
                  {review.status === "PUBLISHED" ? "PUBLICADA" : "BORRADOR"}
                </p>
                <h2 className="text-2xl">{review.title}</h2>
                <p style={{ fontSize: ".84rem", color: "var(--muted)" }}>
                  {review.author} · {review.rating}/5
                </p>
              </div>
              <Link
                className="text-sm underline"
                style={{ color: "var(--rose-deep)" }}
                href={`/admin/resenas/${review.id}/editar`}
              >
                Editar
              </Link>
            </div>
          ))}
          {!reviews.length && (
            <p style={{ padding: "40px 0", color: "var(--muted)" }}>
              No hay reseñas todavía.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}