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

    // ── Reseñas destacadas de Bookstagram ─────────────────────────────────
  const realReviews = [
    {
      slug: "alas-de-sangre-resena",
      bookSlug: "alas-de-sangre-empireo-1",
      title: "Alas de sangre",
      author: "Rebecca Yarros",
      synopsis: "Fantasía & Romance · #1 Más leída",
      content: "¡Me obsesionó por completo! Hacía tiempo que una fantasía no me enganchaba tanto. Tensión, dragones y romance enemies-to-lovers que quema las páginas. De esas historias que te dejan con resaca literaria durante semanas.",
      rating: 5,
      coverUrl: "/covers/alas-de-sangre-empireo-1.svg",
      coverAlt: "Portada de Alas de sangre",
      instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    },
    {
      slug: "el-ultimo-juego-resena",
      bookSlug: "el-ultimo-juego",
      title: "El último juego",
      author: "J. D. Barker",
      synopsis: "Thriller psicológico · Giros brutales",
      content: "De esos thrillers que te vuelan la cabeza. Un juego psicológico macabro transmitido en directo donde nada es lo que parece. Cada capítulo te deja sin respiración y el final te desencaja la mandíbula. ¡Imposible parar de leer!",
      rating: 5,
      coverUrl: "/covers/el-ultimo-juego.svg",
      coverAlt: "Portada de El último juego",
      instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    },
    {
      slug: "el-verano-en-que-mi-madre-tuvo-los-ojos-verdes-resena",
      bookSlug: "el-verano-en-que-mi-madre-tuvo-los-ojos-verdes",
      title: "El verano en que mi madre tuvo los ojos verdes",
      author: "Tatiana Țîbuleac",
      synopsis: "Narrativa conmovedora · Pura emoción",
      content: "Una de las lecturas más profundas, dolorosas y hermosas que he tenido entre manos. Una prosa poética cruda que te eriza la piel. Habla del perdón, del rencor y de la fragilidad humana como pocas veces he leído.",
      rating: 5,
      coverUrl: "/covers/el-verano-en-que-mi-madre-tuvo-los-ojos-verdes.svg",
      coverAlt: "Portada de El verano en que mi madre tuvo los ojos verdes",
      instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    },
    {
      slug: "mis-dias-en-la-libreria-morisaki-resena",
      bookSlug: "mis-dias-en-la-libreria-morisaki",
      title: "Mis días en la librería Morisaki",
      author: "Satoshi Yagisawa",
      synopsis: "Ficción cozy · Refugio entre libros",
      content: "Un bálsamo para el corazón. Una librería de lance en el barrio tokiota de Jinbōchō, café caliente y el refugio que todos necesitamos alguna vez. Te hace desear pasar las tardes perdiéndote entre estanterías de libros con historia.",
      rating: 5,
      coverUrl: "/covers/mis-dias-en-la-libreria-morisaki.svg",
      coverAlt: "Portada de Mis días en la librería Morisaki",
      instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    },
    {
      slug: "el-retiro-resena",
      bookSlug: "el-retiro",
      title: "El retiro",
      author: "Mark Edwards",
      synopsis: "Suspense rural · Clima absorbente",
      content: "Un refugio para escritores en mitad de un bosque apartado, desapariciones misteriosas y un suspense que se va cerrando poco a poco. Me atrapó tanto que lo devoré en un solo fin de semana de manta y lluvia.",
      rating: 5,
      coverUrl: "/covers/el-retiro.svg",
      coverAlt: "Portada de El retiro",
      instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    },
    {
      slug: "cumbres-borrascosas-resena",
      bookSlug: "cumbres-borrascosas",
      title: "Cumbres borrascosas",
      author: "Emily Brontë",
      synopsis: "Clásico gótico · Romance tormentoso",
      content: "Una fuerza de la naturaleza convertida en novela. Pasión indomable, venganza, niebla y la atmósfera salvaje de los páramos ingleses. Es una de las joyas de mi estantería y una relectura obligatoria cada otoño.",
      rating: 5,
      coverUrl: "/covers/cumbres-borrascosas.svg",
      coverAlt: "Portada de Cumbres borrascosas",
      instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    },
  ];

  for (const r of realReviews) {
    const book = await prisma.book.findUnique({ where: { slug: r.bookSlug } });
    await prisma.review.upsert({
      where: { slug: r.slug },
      update: {
        title: r.title,
        author: r.author,
        synopsis: r.synopsis,
        content: r.content,
        rating: r.rating,
        coverUrl: r.coverUrl,
        coverAlt: r.coverAlt,
        instagramUrl: r.instagramUrl,
        bookId: book ? book.id : null,
      },
      create: {
        slug: r.slug,
        title: r.title,
        author: r.author,
        synopsis: r.synopsis,
        content: r.content,
        rating: r.rating,
        coverUrl: r.coverUrl,
        coverAlt: r.coverAlt,
        instagramUrl: r.instagramUrl,
        status: PublicationStatus.PUBLISHED,
        publishedAt: new Date(),
        bookId: book ? book.id : null,
      },
    });
  }

  // Eliminar la demo vieja si existe
  await prisma.review.deleteMany({ where: { slug: "la-luz-de-las-horas-resena" } });

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
