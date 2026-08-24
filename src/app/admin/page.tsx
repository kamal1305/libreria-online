import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return <main style={{ padding: 40 }}><p>PANEL DE DEMOSTRACIÓN</p><h1>Catálogo</h1><p>Sesión activa para {admin.email}.</p><p><a href="/admin/resenas">Gestionar reseñas editoriales</a></p></main>;
}
