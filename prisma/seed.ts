import { PrismaClient, BookCondition, PublicationStatus } from "@prisma/client";
import argon2 from "argon2";
const prisma = new PrismaClient();
async function main() {
  const category = await prisma.category.upsert({ where: { slug: "narrativa" }, update: {}, create: { name: "Narrativa", slug: "narrativa" } });
  const books = [
    { slug: "la-luz-de-las-horas", title: "La luz de las horas", author: "Clara Valdes", price: 8.5, condition: BookCondition.VERY_GOOD, imageUrl: "https://placehold.co/600x900/e7dfcf/22302b?text=Libro+demo+01", imageAlt: "Portada ficticia de La luz de las horas" },
    { slug: "atlas-de-las-pequenas-cosas", title: "Atlas de las pequenas cosas", author: "Mateo Rios", price: 6.25, condition: BookCondition.GOOD, imageUrl: "https://placehold.co/600x900/d8e2dc/22302b?text=Libro+demo+02", imageAlt: "Portada ficticia de Atlas de las pequenas cosas" },
  ];
  for (const book of books) await prisma.book.upsert({ where: { slug: book.slug }, update: {}, create: { ...book, categoryId: category.id, status: PublicationStatus.PUBLISHED, stock: 1, demoData: true, language: "es", format: "PAPERBACK", description: "Ficha ficticia para validar el catalogo.", acquisitionCost: 2.5 } });
  await prisma.review.upsert({ where: { slug: "la-luz-de-las-horas-resena" }, update: { instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==" }, create: { slug: "la-luz-de-las-horas-resena", title: "La luz de las horas", author: "Clara Valdes", synopsis: "Una novela ficticia sobre memoria, tiempo y los lugares que elegimos conservar.", content: "Esta reseña de demostración explora cómo una historia puede volver a nosotros con cada lectura. La voz narrativa encuentra belleza en lo cotidiano y deja espacio para que cada persona lectora complete el viaje.", rating: 4, coverUrl: "https://placehold.co/600x900/e7dfcf/22302b?text=Resena+demo", coverAlt: "Portada ficticia de La luz de las horas", amazonAffiliateUrl: "https://www.amazon.es/", instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==", status: PublicationStatus.PUBLISHED, publishedAt: new Date(), bookId: (await prisma.book.findUniqueOrThrow({ where: { slug: "la-luz-de-las-horas" } })).id } });
  const adminPassword = process.env.DEMO_ADMIN_PASSWORD;
  if (adminPassword) {
    await prisma.adminUser.upsert({ where: { email: "admin@segunda-vuelta.local" }, update: { passwordHash: await argon2.hash(adminPassword) }, create: { email: "admin@segunda-vuelta.local", passwordHash: await argon2.hash(adminPassword), role: "ADMIN" } });
  }
}
main().finally(() => prisma.$disconnect());
