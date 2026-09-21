import { PrismaClient, BookCondition, PublicationStatus } from "@prisma/client";
import argon2 from "argon2";
import { catalogBooks } from "../src/lib/catalog";
const prisma = new PrismaClient();

// Mapa genero -> slug de categoria
const categorySlug: Record<string, string> = {
  Narrativa: "narrativa",
  "Novela Histórica": "novela-historica",
  Infantil: "infantil",
  "Joyas Literarias": "joyas-literarias",
  Poesía: "poesia",
  Pensamiento: "pensamiento",
  "Novela negra": "novela-negra",
  Terror: "terror",
  Romance: "romance",
  Fantasía: "fantasia",
  "Ciencia ficción": "ciencia-ficcion",
  Clásicos: "clasicos",
  Juvenil: "juvenil",
  "No ficción": "no-ficcion",
  Humor: "humor",
  Novela: "novela",
};

const slugifyCat = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function main() {
  // ── Categorias: las base + todos los generos del catalogo ──────
  const baseCategories = [
    { name: "Narrativa", slug: "narrativa" },
    { name: "Novela Histórica", slug: "novela-historica" },
    { name: "Infantil", slug: "infantil" },
    { name: "Joyas Literarias", slug: "joyas-literarias" },
    { name: "Poesía", slug: "poesia" },
    { name: "Pensamiento", slug: "pensamiento" },
  ];
  const genreNames = [
    ...new Set([...baseCategories.map((c) => c.name), ...catalogBooks.map((b) => b.genre)]),
  ];
  const categoryIds: Record<string, string> = {};
  for (const name of genreNames) {
    const slug = categorySlug[name] ?? slugifyCat(name);
    const row = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    categoryIds[name] = row.id;
  }

  // ── Ejemplares de demostracion (carrito usado) ─────────────────
  const demoBooks = [
    {
      slug: "la-luz-de-las-horas",
      title: "La luz de las horas",
      author: "Clara Valdes",
      price: 8.5,
      condition: BookCondition.VERY_GOOD,
      imageUrl: "https://placehold.co/600x900/e7dfcf/22302b?text=Libro+demo+01",
      imageAlt: "Portada ficticia de La luz de las horas",
      categorySlug: "narrativa",
      amazonAffiliateUrl: null,
    },
    {
      slug: "atlas-de-las-pequenas-cosas",
      title: "Atlas de las pequenas cosas",
      author: "Mateo Rios",
      price: 6.25,
      condition: BookCondition.GOOD,
      imageUrl: "https://placehold.co/600x900/d8e2dc/22302b?text=Libro+demo+02",
      imageAlt: "Portada ficticia de Atlas de las pequenas cosas",
      categorySlug: "narrativa",
      amazonAffiliateUrl: null,
    },
  ];
  for (const b of demoBooks) {
    const data = {
      title: b.title,
      author: b.author,
      price: b.price,
      condition: b.condition,
      imageUrl: b.imageUrl,
      imageAlt: b.imageAlt,
      categoryId: categoryIds["Narrativa"],
      status: PublicationStatus.PUBLISHED,
      stock: 1,
      demoData: true,
      language: "es",
      format: "PAPERBACK",
      description: "Ficha ficticia para validar el catalogo.",
      acquisitionCost: 2.5,
      amazonAffiliateUrl: null,
    };
    await prisma.book.upsert({
      where: { slug: b.slug },
      update: data,
      create: { slug: b.slug, ...data },
    });
  }

  // ── Catalogo real (130 libros con afiliado Amazon) ─────────────
  for (const b of catalogBooks) {
    const data = {
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      price: b.price,
      condition: BookCondition.LIKE_NEW,
      imageUrl: b.imageUrl,
      imageAlt: b.imageAlt,
      categoryId: categoryIds[b.genre],
      status: PublicationStatus.PUBLISHED,
      stock: 1,
      demoData: false,
      language: "es",
      format: "PAPERBACK",
      description: "Titulo de catalogo con compra enlazada a Amazon.",
      acquisitionCost: null,
      amazonAffiliateUrl: b.amazonUrl,
    };
    await prisma.book.upsert({
      where: { slug: b.slug },
      update: data,
      create: { slug: b.slug, ...data },
    });
  }

  // ── Resena de demostracion ─────────────────────────────────────
  await prisma.review.upsert({
    where: { slug: "la-luz-de-las-horas-resena" },
    update: {
      instagramUrl:
        "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    },
    create: {
      slug: "la-luz-de-las-horas-resena",
      title: "La luz de las horas",
      author: "Clara Valdes",
      synopsis:
        "Una novela ficticia sobre memoria, tiempo y los lugares que elegimos conservar.",
      content:
        "Esta reseña de demostración explora cómo una historia puede volver a nosotros con cada lectura. La voz narrativa encuentra belleza en lo cotidiano y deja espacio para que cada persona lectora complete el viaje.",
      rating: 4,
      coverUrl: "https://placehold.co/600x900/e7dfcf/22302b?text=Resena+demo",
      coverAlt: "Portada ficticia de La luz de las horas",
      amazonAffiliateUrl: "https://www.amazon.es/",
      instagramUrl:
        "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
      status: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      bookId: (
        await prisma.book.findUniqueOrThrow({
          where: { slug: "la-luz-de-las-horas" },
        })
      ).id,
    },
  });

  const adminPassword = process.env.DEMO_ADMIN_PASSWORD;
  if (adminPassword) {
    await prisma.adminUser.upsert({
      where: { email: "admin@segunda-vuelta.local" },
      update: { passwordHash: await argon2.hash(adminPassword) },
      create: {
        email: "admin@segunda-vuelta.local",
        passwordHash: await argon2.hash(adminPassword),
        role: "ADMIN",
      },
    });
  }
}
main().finally(() => prisma.$disconnect());
