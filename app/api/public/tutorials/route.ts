import { NextResponse } from "next/server";
import { getPublicTutorials } from "@/lib/server/tutorials";

export async function GET() {
  const items = await getPublicTutorials();
  return NextResponse.json(items);
}
