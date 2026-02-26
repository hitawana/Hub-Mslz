import { NextRequest, NextResponse } from "next/server";
import { requireApiUser } from "@/lib/server/auth";
import { createPlatform, validatePlatformName } from "@/lib/server/tutorials";

export async function POST(req: NextRequest) {
  const user = await requireApiUser(req);
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { name?: string };
  const parsed = validatePlatformName(body.name);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    const created = await createPlatform(parsed.value);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha ao criar plataforma.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
