import { NextResponse } from "next/server";
import { getAllPlatforms } from "@/lib/server/tutorials";

export async function GET() {
  const items = await getAllPlatforms();
  return NextResponse.json(items);
}
