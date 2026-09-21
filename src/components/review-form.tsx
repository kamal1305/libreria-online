import Link from "next/link";

export function ReviewForm({
  action,
  heading,
  initial = {},
  books = [],
}: {
  action: (formData: FormData) => Promise<void>;
  heading: string;
  initial?: Record<string, unknown>;
  books?: { id: string; title: string }[];
}) {
  return (
    <main className="admin-page px-5 py-10 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">PANEL EDITORIAL</p>
        <h1 className="mb-10 text-5xl">{heading}</h1>

        <form action={action} className="review-form grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label>
              Título
              <input
                name="title"
                required
                defaultValue={initial.title?.toString()}
              />
            </label>
            <label>
              Slug
              <input
                name="slug"
                required
                pattern="[a-z0-9-]+"
                defaultValue={initial.slug?.toString()}
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label>
              Autoría de la reseña
              <input
                name="author"
                required
                defaultValue={initial.author?.toString()}
              />
            </label>
            <label>
              Libro relacionado
              <select
                name="bookId"
                defaultValue={initial.bookId?.toString() ?? ""}
              >
                <option value="">Sin vincular</option>
                {books.map((book) => (
                  <option value={book.id} key={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Sinopsis
            <textarea
              name="synopsis"
              required
              rows={4}
              defaultValue={initial.synopsis?.toString()}
            />
          </label>

          <label>
            Análisis y opinión
            <textarea
              name="content"
              required
              rows={12}
              defaultValue={initial.content?.toString()}
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label>
              Valoración (1-5)
              <input
                name="rating"
                type="number"
                min={1}
                max={5}
                required
                defaultValue={initial.rating?.toString() ?? "4"}
              />
            </label>
            <label>
              Estado
              <select
                name="status"
                defaultValue={initial.status?.toString() ?? "DRAFT"}
              >
                <option value="DRAFT">Borrador</option>
                <option value="PUBLISHED">Publicada</option>
              </select>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label>
              URL de portada
              <input
                name="coverUrl"
                type="url"
                defaultValue={initial.coverUrl?.toString() ?? ""}
              />
            </label>
            <label>
              Texto alternativo de portada
              <input
                name="coverAlt"
                defaultValue={initial.coverAlt?.toString() ?? ""}
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label>
              Enlace afiliado Amazon
              <input
                name="amazonAffiliateUrl"
                type="url"
                placeholder="https://www.amazon.es/..."
                defaultValue={initial.amazonAffiliateUrl?.toString() ?? ""}
              />
            </label>
            <label>
              Post o reel de Instagram
              <input
                name="instagramUrl"
                type="url"
                placeholder="https://www.instagram.com/p/..."
                defaultValue={initial.instagramUrl?.toString() ?? ""}
              />
            </label>
          </div>

          <div className="mt-4 flex gap-4">
            <button type="submit">Guardar reseña</button>
            <Link
              href="/admin/resenas"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0 16px",
                fontSize: ".84rem",
                color: "var(--charcoal-soft)",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}