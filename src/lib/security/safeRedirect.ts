/**
 * Allow only same-site relative paths (blocks open redirects).
 */
export function safeRedirectPath(
  value: string | null | undefined,
  fallback = "/"
): string {
  if (!value) {
    return fallback;
  }
  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }
  if (trimmed.includes("\\") || trimmed.includes("\0")) {
    return fallback;
  }
  try {
    const url = new URL(trimmed, "http://localhost");
    if (url.hostname !== "localhost") {
      return fallback;
    }
    const path = url.pathname + url.search + url.hash;
    if (!path.startsWith("/")) {
      return fallback;
    }
    return path;
  } catch {
    return fallback;
  }
}
