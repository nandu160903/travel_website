import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { requireStudioAccess, jsonError } from "@/lib/studio/api";
import {
  buildStoragePath,
  sanitizeUploadFilename,
  validateUploadFile,
} from "@/lib/security/uploadValidation";
import { getLegacyMediaBucket, resolveUploadBucket } from "@/lib/supabase/storage";

const MAX_FILES_PER_REQUEST = 10;
const SIGNED_URL_TTL_SEC = 60 * 60;

async function uploadToBucket(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/studio-client").createStudioSupabaseClient>>,
  bucket: string,
  path: string,
  file: File
) {
  return supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
}

export async function POST(request: NextRequest) {
  const denied = await requireStudioAccess(request);
  if (denied) return denied;

  const formData = await request.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  const visibility =
    formData.get("visibility") === "private" ? ("private" as const) : ("public" as const);

  if (!files.length) {
    return jsonError("No files provided.", 400);
  }
  if (files.length > MAX_FILES_PER_REQUEST) {
    return jsonError("Too many files in one request.", 400);
  }

  const uploaded: {
    id: string;
    url: string;
    filename: string;
    uploadedAt: string;
    bucket?: string;
    storagePath?: string;
    visibility?: string;
  }[] = [];

  for (const file of files) {
    const validationError = validateUploadFile(file);
    if (validationError) {
      return jsonError(validationError, 400);
    }

    const filename = sanitizeUploadFilename(file.name);

    if (isSupabaseConfigured()) {
      const { createStudioSupabaseClient } = await import("@/lib/supabase/studio-client");
      let supabase;
      try {
        supabase = await createStudioSupabaseClient();
      } catch (e) {
        return jsonError(
          e instanceof Error ? e.message : "Studio storage is not configured.",
          503
        );
      }

      const path = buildStoragePath(file);
      const primaryBucket = resolveUploadBucket(visibility);
      const bucketsToTry =
        visibility === "public"
          ? [...new Set([primaryBucket, getLegacyMediaBucket()])]
          : [primaryBucket];

      let stored: { path: string; bucket: string } | null = null;
      let lastError: string | null = null;

      for (const bucket of bucketsToTry) {
        const { data, error } = await uploadToBucket(supabase, bucket, path, file);
        if (!error && data) {
          stored = { path: data.path, bucket };
          break;
        }
        lastError = error?.message ?? "Upload failed";
      }

      if (!stored) {
        return jsonError(lastError ?? "Upload failed", 500);
      }

      let url = "";
      if (visibility === "private") {
        const { data: signed, error: signError } = await supabase.storage
          .from(stored.bucket)
          .createSignedUrl(stored.path, SIGNED_URL_TTL_SEC);
        if (signError || !signed?.signedUrl) {
          await supabase.storage.from(stored.bucket).remove([stored.path]);
          return jsonError("Could not create signed URL for private upload.", 500);
        }
        url = signed.signedUrl;
      } else {
        const { data: urlData } = supabase.storage
          .from(stored.bucket)
          .getPublicUrl(stored.path);
        url = urlData.publicUrl;
      }

      uploaded.push({
        id: stored.path,
        url,
        filename,
        uploadedAt: new Date().toISOString().split("T")[0],
        bucket: stored.bucket,
        storagePath: stored.path,
        visibility,
      });
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
