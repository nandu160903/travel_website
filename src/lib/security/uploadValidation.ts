const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "video/mp4",
  "video/webm",
]);

export function sanitizeUploadFilename(name: string): string {
  const base = name.replace(/[/\\]/g, "").replace(/\.\./g, "").trim();
  const safe = base.replace(/[^\w.\-()+ ]/g, "_").slice(0, 120);
  return safe || "upload.bin";
}

export function validateUploadFile(file: File): string | null {
  if (!file || typeof file.size !== "number") {
    return "Invalid file.";
  }
  if (file.size <= 0) {
    return "Empty file.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return "File exceeds 8MB limit.";
  }
  const mime = (file.type || "").toLowerCase();
  if (!ALLOWED_MIME.has(mime)) {
    return "File type not allowed.";
  }
  return null;
}

export function buildStoragePath(file: File): string {
  const ext = sanitizeUploadFilename(file.name).split(".").pop() ?? "bin";
  return `uploads/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
}
