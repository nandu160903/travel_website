import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { requireStudioAccess, jsonError } from "@/lib/studio/api";

export async function POST(request: NextRequest) {
  const denied = await requireStudioAccess(request);
  if (denied) return denied;

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];
  const uploaded = [];

  for (const file of files) {
    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const path = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from("media").upload(path, file);

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
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mime = file.type || "image/jpeg";
      uploaded.push({
        id: `local-${Date.now()}-${file.name}`,
        url: `data:${mime};base64,${base64}`,
        filename: file.name,
        uploadedAt: new Date().toISOString().split("T")[0],
      });
    }
  }

  if (!uploaded.length) {
    return jsonError("Upload failed", 500);
  }

  return NextResponse.json({ uploaded });
}
