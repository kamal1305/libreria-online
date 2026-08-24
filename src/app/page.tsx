import { db } from "@/lib/db";
import { Storefront } from "@/components/storefront";
import { demoBooks, demoReviews, type PublicBook, type PublicReview } from "@/lib/demo-data";

export default async function Home() {
  let books: PublicBook[] = demoBooks;
  let reviews: PublicReview[] = demoReviews;
  try {
    books = (await db.book.findMany({ where: { status: "PUBLISHED", stock: { gt: 0 } }, orderBy: { createdAt: "desc" }, take: 8, include: { category: true } })).map((book) => ({ id: book.id, slug: book.slug, title: book.title, author: book.author, price: Number(book.price), condition: book.condition, imageUrl: book.imageUrl, imageAlt: book.imageAlt, category: book.category?.name ?? "Sin género", stock: book.stock, status: book.status }));
    reviews = (await db.review.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 3 })).map((review) => ({ id: review.id, slug: review.slug, title: review.title, author: review.author, synopsis: review.synopsis, content: review.content, rating: review.rating, coverUrl: review.coverUrl, coverAlt: review.coverAlt, amazonAffiliateUrl: review.amazonAffiliateUrl, instagramUrl: review.instagramUrl, publishedAt: review.publishedAt, status: review.status, book: null }));
  } catch {
    books = demoBooks;
    reviews = demoReviews;
  }
  return <Storefront books={books} reviews={reviews} />;
}
