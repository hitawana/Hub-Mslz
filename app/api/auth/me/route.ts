import { NextRequest, NextResponse } from "next/server";
import { requireApiUser, sanitizeUser } from "@/lib/server/auth";

export async function GET(req: NextRequest) {
  const user = await requireApiUser(req);
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  return NextResponse.json(sanitizeUser(user));
}
