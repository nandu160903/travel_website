export const ADMIN_COOKIE = "horizon-admin-session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "change-me-in-production"
  );
}

async function hmacHex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminToken(): Promise<string> {
  const exp = String(Date.now() + SESSION_MS);
  const sig = await hmacHex(exp, getSessionSecret());
  return `${exp}.${sig}`;
}

export async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Date.now() > Number(exp)) return false;

  const expected = await hmacHex(exp, getSessionSecret());
  if (expected.length !== sig.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return mismatch === 0;
}

export function isLocalAdminEnabled(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}
