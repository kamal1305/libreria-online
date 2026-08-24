import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { ReviewForm } from "@/components/review-form";

async function createReview(formData: FormData) {
  "use server";
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const status = formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  await db.review.create({ data: { title, slug, author: String(formData.get("author") ?? "").trim(), synopsis: String(formData.get("synopsis") ?? "").trim(), content: String(formData.get("content") ?? "").trim(), rating: Number(formData.get("rating") ?? 0), coverUrl: String(formData.get("coverUrl") ?? "").trim() || null, coverAlt: String(formData.get("coverAlt") ?? "").trim() || null, amazonAffiliateUrl: String(formData.get("amazonAffiliateUrl") ?? "").trim() || null, instagramUrl: String(formData.get("instagramUrl") ?? "").trim() || null, bookId: String(formData.get("bookId") ?? "").trim() || null, status, publishedAt: status === "PUBLISHED" ? new Date() : null } });
  redirect("/admin/resenas");
}

export default async function NewReviewPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  const books = await db.book.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } });
  return <ReviewForm action={createReview} heading="Nueva reseña" books={books} />;
}

