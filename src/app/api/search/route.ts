import { NextRequest, NextResponse } from "next/server";
import { searchContent } from "@/lib/data/queries";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const results = await searchContent(q);
  return NextResponse.json({ results });
}
