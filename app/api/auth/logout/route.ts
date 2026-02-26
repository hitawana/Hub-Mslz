import { NextRequest, NextResponse } from "next/server";
import { logoutAdmin } from "@/lib/server/auth";
import { ADMIN_COOKIE } from "@/lib/auth/constants";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  await logoutAdmin(token);

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return res;
}
