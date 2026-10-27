/** Public bucket for published site media (must exist in Supabase Storage). */
export function getPublicStorageBucket(): string {
  return (
    process.env.STUDIO_STORAGE_PUBLIC_BUCKET?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() ||
    "travel-public"
  );
}

/** Private bucket for draft / unpublished uploads. */
export function getPrivateStorageBucket(): string {
  return process.env.STUDIO_STORAGE_PRIVATE_BUCKET?.trim() || "travel-private";
}

/** Legacy single-bucket name used before travel-public / travel-private split. */
export function getLegacyMediaBucket(): string {
  return "media";
}

export function resolveUploadBucket(visibility: "public" | "private"): string {
  return visibility === "private" ? getPrivateStorageBucket() : getPublicStorageBucket();
}
