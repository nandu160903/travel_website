import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { requireStudioAccess, jsonError } from "@/lib/studio/api";
import {
  buildStoragePath,
  sanitizeUploadFilename,
  validateUploadFile,
} from "@/lib/security/uploadValidation";

const MAX_FILES_PER_REQUEST = 10;

export async function POST(request: NextRequest) {
  const denied = await requireStudioAccess(request);
  if (denied) return denied;

  const formData = await request.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (!files.length) {
    return jsonError("No files provided.", 400);
  }
  if (files.length > MAX_FILES_PER_REQUEST) {
    return jsonError("Too many files in one request.", 400);
  }

  const uploaded = [];

  for (const file of files) {
    const validationError = validateUploadFile(file);
    if (validationError) {
      return jsonError(validationError, 400);
    }

    const filename = sanitizeUploadFilename(file.name);

    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const path = buildStoragePath(file);
      const { data, error } = await supabase.storage
        .from("media")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (!error && data) {
        const { data: urlData } = supabase.storage.from("media").getPublicUrl(data.path);
        uploaded.push({
          id: data.path,
          url: urlData.publicUrl,
          filename,
          uploadedAt: new Date().toISOString().split("T")[0],
        });
      }
    } else {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      uploaded.push({
        id: `local-${Date.now()}-${filename}`,
        url: `data:${file.type};base64,${base64}`,
        filename,
        uploadedAt: new Date().toISOString().split("T")[0],
      });
    }
  }

  if (!uploaded.length) {
    return jsonError("Upload failed", 500);
  }

  return NextResponse.json({ uploaded });
}
