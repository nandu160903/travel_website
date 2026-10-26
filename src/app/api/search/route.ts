import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchContent } from "@/lib/data/queries";
import { getClientIp } from "@/lib/security/clientIp";
import { checkRateLimit } from "@/lib/security/rateLimit";

const querySchema = z.object({
  q: z.string().trim().min(1).max(200),
});

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`search:${ip}`, 60, 60_000);
  if (!rate.ok) {
    return NextResponse.json(
      { results: [], error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSec) } }
    );
  }

  const raw = request.nextUrl.searchParams.get("q") ?? "";
  const parsed = querySchema.safeParse({ q: raw });
  if (!parsed.success) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchContent(parsed.data.q);
  return NextResponse.json({ results });
}
