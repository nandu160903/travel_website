import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/utils";

async function verifyCreator() {
  if (!isSupabaseConfigured()) return false;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "creator" || profile?.role === "admin";
}

export async function POST(request: NextRequest) {
  if (!(await verifyCreator())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (isSupabaseConfigured()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { error } = await supabase.from("stories").upsert({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      cover_image: body.coverImage,
      category: body.category,
      status: body.status,
      reading_time: body.readingTime,
      published_at: body.status === "published" ? new Date().toISOString().split("T")[0] : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "slug" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
