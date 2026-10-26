import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/utils";
import { getClientIp } from "@/lib/security/clientIp";
import { checkRateLimit } from "@/lib/security/rateLimit";

const bodySchema = z.object({
  email: z.string().trim().email().max(320),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`newsletter:${ip}`, 5, 60 * 60_000);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSec) } }
    );
  }

  let payload: z.infer<typeof bodySchema>;
  try {
    payload = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const email = payload.email.toLowerCase();

  if (isSupabaseConfigured()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (error && error.code !== "23505") {
      return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
