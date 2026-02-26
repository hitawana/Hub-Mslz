import { NextRequest, NextResponse } from "next/server";
import { getPublicNewsPage } from "@/lib/server/news";

function parsePositiveInt(raw: string | null, fallback: number): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.floor(n);
}

export async function GET(req: NextRequest) {
  const page = parsePositiveInt(req.nextUrl.searchParams.get("page"), 1);
  const pageSize = parsePositiveInt(req.nextUrl.searchParams.get("page_size"), 3);

  const result = await getPublicNewsPage(page, Math.min(pageSize, 12));

  return NextResponse.json(result);
}
