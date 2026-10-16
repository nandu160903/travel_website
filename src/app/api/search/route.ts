import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchContent } from "@/lib/data/queries";

const querySchema = z.object({
  q: z.string().trim().min(1).max(200),
});

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("q") ?? "";
  const parsed = querySchema.safeParse({ q: raw });
  if (!parsed.success) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchContent(parsed.data.q);
  return NextResponse.json({ results });
}
