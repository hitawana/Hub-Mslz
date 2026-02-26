import { NextRequest, NextResponse } from "next/server";
import { requireApiUser } from "@/lib/server/auth";
import { deleteNews, getNewsById, updateNews, validateNewsPayload } from "@/lib/server/news";

function parseId(raw: string): number | null {
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser(req);
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ error: "Id invalido." }, { status: 400 });

  const item = await getNewsById(numericId);
  if (!item) return NextResponse.json({ error: "Noticia nao encontrada." }, { status: 404 });

  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser(req);
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ error: "Id invalido." }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const parsed = validateNewsPayload(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const updated = await updateNews(numericId, parsed.value);
  if (!updated) return NextResponse.json({ error: "Noticia nao encontrada." }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser(req);
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ error: "Id invalido." }, { status: 400 });

  const ok = await deleteNews(numericId);
  if (!ok) return NextResponse.json({ error: "Noticia nao encontrada." }, { status: 404 });

  return NextResponse.json({ ok: true });
}
