import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/server/auth";
import { ADMIN_COOKIE, SESSION_TTL_SECONDS } from "@/lib/auth/constants";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = body.email || "";
  const password = body.password || "";

  const session = await loginAdmin(email, password);
  if (!session) {
    return NextResponse.json({ error: "E-mail ou senha invalidos." }, { status: 401 });
  }

  const res = NextResponse.json({ email: session.user.email });
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: session.token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });

  return res;
}
