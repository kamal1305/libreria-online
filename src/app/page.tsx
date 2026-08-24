import { db } from "@/lib/db";
import { Storefront } from "@/components/storefront";

export default async function Home() {
  const books = await db.book.findMany({ where: { status: "PUBLISHED", stock: { gt: 0 } }, orderBy: { createdAt: "desc" }, take: 8, include: { category: true } });
  const reviews = await db.review.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 3 });
  return <Storefront books={books.map((book) => ({ id: book.id, title: book.title, author: book.author, price: Number(book.price), condition: book.condition, imageUrl: book.imageUrl, imageAlt: book.imageAlt, category: book.category?.name ?? "Sin género" }))} reviews={reviews.map((review) => ({ slug: review.slug, title: review.title, author: review.author, rating: review.rating, coverUrl: review.coverUrl, coverAlt: review.coverAlt, synopsis: review.synopsis }))} />;
}
