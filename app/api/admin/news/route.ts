import { NextRequest, NextResponse } from "next/server";
import { requireApiUser } from "@/lib/server/auth";
import { createNews, listAllNews, validateNewsPayload } from "@/lib/server/news";

export async function GET(req: NextRequest) {
  const user = await requireApiUser(req);
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const items = await listAllNews();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const user = await requireApiUser(req);
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = validateNewsPayload(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const created = await createNews(parsed.value);
  return NextResponse.json(created, { status: 201 });
}
