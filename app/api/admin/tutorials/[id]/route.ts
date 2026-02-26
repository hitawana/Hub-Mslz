import { NextRequest, NextResponse } from "next/server";
import { requireApiUser } from "@/lib/server/auth";
import { deleteTutorial, getTutorialById, updateTutorial, validateTutorialPayload } from "@/lib/server/tutorials";

function parseId(raw: string): string | null {
  const id = String(raw || "").trim();
  if (!id) return null;
  return id;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser(req);
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const { id } = await params;
  const tutorialId = parseId(id);
  if (!tutorialId) return NextResponse.json({ error: "Id invalido." }, { status: 400 });

  const item = await getTutorialById(tutorialId);
  if (!item) return NextResponse.json({ error: "Tutorial nao encontrado." }, { status: 404 });

  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser(req);
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const { id } = await params;
  const tutorialId = parseId(id);
  if (!tutorialId) return NextResponse.json({ error: "Id invalido." }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const parsed = await validateTutorialPayload(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const updated = await updateTutorial(tutorialId, parsed.value);
  if (!updated) return NextResponse.json({ error: "Tutorial nao encontrado." }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser(req);
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const { id } = await params;
  const tutorialId = parseId(id);
  if (!tutorialId) return NextResponse.json({ error: "Id invalido." }, { status: 400 });

  const ok = await deleteTutorial(tutorialId);
  if (!ok) return NextResponse.json({ error: "Tutorial nao encontrado." }, { status: 404 });

  return NextResponse.json({ ok: true });
}
