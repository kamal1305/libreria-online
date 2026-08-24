import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export default async function AdminReviewsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  const reviews = await db.review.findMany({ orderBy: { updatedAt: "desc" } });
  return <main className="min-h-screen bg-[#f5f0e7] px-5 py-10 text-[#20322d] lg:px-12"><div className="mx-auto max-w-5xl"><div className="flex items-center justify-between border-b border-[#d5cec2] pb-6"><div><p className="eyebrow">PANEL EDITORIAL</p><h1 className="text-4xl">Reseñas</h1></div><div className="flex gap-5 font-sans text-sm"><Link href="/admin">Catálogo</Link><Link className="rounded bg-[#20322d] px-4 py-3 text-[#f5f0e7]" href="/admin/resenas/nueva">Nueva reseña</Link></div></div><div className="mt-8 grid gap-3">{reviews.map((review) => <div className="flex items-center justify-between border-b border-[#d5cec2] py-5" key={review.id}><div><p className="font-sans text-xs uppercase tracking-widest text-[#b85c43]">{review.status === "PUBLISHED" ? "Publicada" : "Borrador"}</p><h2 className="mt-1 text-2xl">{review.title}</h2><p className="font-sans text-sm text-[#69746e]">{review.author} · {review.rating}/5</p></div><Link className="font-sans text-sm underline" href={`/admin/resenas/${review.id}/editar`}>Editar</Link></div>)}{!reviews.length && <p>No hay reseñas todavía.</p>}</div></div></main>;
}
