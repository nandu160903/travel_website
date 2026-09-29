import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/utils";

async function verifyCreator() {
  if (!isSupabaseConfigured()) return true; // Allow in demo mode
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return Boolean(user);
}

export async function PUT(request: NextRequest) {
  if (!(await verifyCreator())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (isSupabaseConfigured()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    await supabase.from("site_settings").upsert({
      site_title: body.siteTitle,
      site_description: body.siteDescription,
      bio: body.bio,
      email: body.email,
      hero_image: body.heroImage,
      social_links: [
        { platform: "instagram", url: body.instagram },
        { platform: "facebook", url: body.facebook },
      ],
      updated_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ success: true });
}
