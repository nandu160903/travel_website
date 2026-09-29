import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.toLowerCase().trim() });

      if (error && error.code !== "23505") {
        return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
