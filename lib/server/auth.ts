import { randomBytes } from "crypto";
import type { NextRequest } from "next/server";
import { readDb, mutateDb, type AdminUser } from "@/lib/server/db";
import { verifyPassword } from "@/lib/server/password";
import { ADMIN_COOKIE, SESSION_TTL_SECONDS } from "@/lib/auth/constants";

function nowIso() {
  return new Date().toISOString();
}

function expirationIso() {
  return new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
}

function isExpired(iso: string) {
  return new Date(iso).getTime() <= Date.now();
}

export async function loginAdmin(emailRaw: string, password: string): Promise<{ user: AdminUser; token: string } | null> {
  const email = emailRaw.trim().toLowerCase();
  const db = await readDb();

  const user = db.users.find((u) => u.email === email);
  if (!user) return null;

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return null;

  const token = randomBytes(32).toString("base64url");

  await mutateDb((curr) => ({
    ...curr,
    sessions: [
      ...curr.sessions.filter((s) => !isExpired(s.expires_at) && s.user_id !== user.id),
      {
        token,
        user_id: user.id,
        created_at: nowIso(),
        expires_at: expirationIso()
      }
    ]
  }));

  return { user, token };
}

export async function logoutAdmin(token: string | undefined): Promise<void> {
  if (!token) return;

  await mutateDb((curr) => ({
    ...curr,
    sessions: curr.sessions.filter((s) => s.token !== token && !isExpired(s.expires_at))
  }));
}

export async function getUserBySessionToken(token: string | undefined): Promise<AdminUser | null> {
  if (!token) return null;

  const db = await readDb();
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return null;

  if (isExpired(session.expires_at)) {
    await logoutAdmin(token);
    return null;
  }

  const user = db.users.find((u) => u.id === session.user_id);
  if (!user) return null;

  return user;
}

export async function requireApiUser(req: NextRequest): Promise<AdminUser | null> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  return getUserBySessionToken(token);
}

export function sanitizeUser(user: AdminUser) {
  return { id: user.id, email: user.email };
}
