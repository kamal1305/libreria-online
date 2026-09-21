import Link from "next/link";
import { createAdminSession, verifyPassword } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const admin = await db.adminUser.findUnique({ where: { email } });
  if (
    !admin ||
    !admin.active ||
    !(await verifyPassword(password, admin.passwordHash))
  ) {
    redirect("/admin/login?error=1");
  }
  await createAdminSession(admin.id);
  redirect("/admin");
}

export default function AdminLogin() {
  return (
    <div className="login-page">
      <div className="login-card">
        <p className="eyebrow">ACCESO DE ADMINISTRACIÓN</p>
        <h1>Panel privado</h1>
        <form action={login}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="admin@segundavuelta.es"
          />
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            required
          />
          <button type="submit">Entrar</button>
        </form>
        <p
          style={{
            marginTop: "16px",
            fontSize: ".76rem",
            color: "var(--muted)",
            textAlign: "center",
          }}
        >
          Solo administración. Datos ficticios, sin pagos activos.
        </p>
        <Link
          href="/"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "12px",
            fontSize: ".78rem",
            color: "var(--rose-deep)",
          }}
        >
          ← Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
