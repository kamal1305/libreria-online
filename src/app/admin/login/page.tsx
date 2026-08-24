import { createAdminSession, verifyPassword } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const admin = await db.adminUser.findUnique({ where: { email } });
  if (!admin || !admin.active || !(await verifyPassword(password, admin.passwordHash))) redirect("/admin/login?error=1");
  await createAdminSession(admin.id);
  redirect("/admin");
}

export default function AdminLogin() {
  return <main style={{ padding: 40, maxWidth: 500, margin: "auto" }}><p>ACCESO DE ADMINISTRACIÓN</p><h1>Panel privado</h1><form action={login}><label htmlFor="email">Correo</label><input id="email" name="email" type="email" required /><label htmlFor="password">Contraseña</label><input id="password" name="password" type="password" required /><button type="submit">Entrar</button></form><p>Solo administración. Datos ficticios, sin pagos activos.</p></main>;
}
