import crypto from "node:crypto";
import argon2 from "argon2";
import { cookies } from "next/headers";
import { db } from "./db";

const SESSION_COOKIE = "sv_admin_session";
const SESSION_DAYS = 7;

function hashToken(token: string) { return crypto.createHash("sha256").update(token).digest("hex"); }
export async function verifyPassword(password: string, passwordHash: string) { return argon2.verify(passwordHash, password); }
export async function createAdminSession(adminUserId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  await db.adminSession.create({ data: { tokenHash: hashToken(token), adminUserId, expiresAt: new Date(Date.now() + SESSION_DAYS * 86400000) } });
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_DAYS * 86400 });
}
export async function getCurrentAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.adminSession.findUnique({ where: { tokenHash: hashToken(token) }, include: { adminUser: true } });
  if (!session || session.expiresAt < new Date() || !session.adminUser.active) return null;
  return session.adminUser;
}
export async function endAdminSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) await db.adminSession.deleteMany({ where: { tokenHash: hashToken(token) } });
  (await cookies()).delete(SESSION_COOKIE);
}
