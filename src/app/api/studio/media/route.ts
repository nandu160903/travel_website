import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/utils";

async function verifyCreator() {
  if (!isSupabaseConfigured()) return true;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return Boolean(user);
}

export async function POST(request: NextRequest) {
  if (!(await verifyCreator())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];
  const uploaded = [];

  for (const file of files) {
    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const path = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("media")
        .upload(path, file);

      if (!error && data) {
        const { data: urlData } = supabase.storage.from("media").getPublicUrl(data.path);
        uploaded.push({
          id: data.path,
          url: urlData.publicUrl,
          filename: file.name,
          uploadedAt: new Date().toISOString().split("T")[0],
        });
      }
    } else {
      // Demo mode: create object URL placeholder
      uploaded.push({
        id: `demo-${Date.now()}`,
        url: URL.createObjectURL(file),
        filename: file.name,
        uploadedAt: new Date().toISOString().split("T")[0],
      });
    }
  }

  return NextResponse.json({ uploaded });
}
