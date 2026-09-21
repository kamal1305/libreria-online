import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <main className="admin-page px-5 py-10 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">PANEL DE DEMOSTRACIÓN</p>
        <h1 className="mb-6 text-4xl">Catálogo y gestión</h1>
        <div
          className="admin-content"
          style={{
            padding: "28px 26px",
            border: "1px solid var(--line-soft)",
            borderRadius: 18,
            background: "white",
          }}
        >
          <p style={{ fontSize: ".9rem", color: "var(--charcoal-soft)" }}>
            Sesión activa para{" "}
            <strong style={{ color: "var(--rose-deep)" }}>
              {admin.email}
            </strong>
            .
          </p>
          <p style={{ fontSize: ".82rem", color: "var(--muted)" }}>
            Esta fase cubre la gestión del catálogo y las reseñas. Los pagos
            y pedidos se añadirán en una fase posterior.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 20,
              flexWrap: "wrap",
            }}
          >
            <Link href="/admin/resenas" className="offer-button">
              Gestionar reseñas editoriales
            </Link>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: ".78rem",
                fontWeight: 700,
                color: "var(--rose-deep)",
                padding: "13px 22px",
              }}
            >
              Ver la tienda →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}