import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/utils";
import { getClientIp } from "@/lib/security/clientIp";
import { checkRateLimit } from "@/lib/security/rateLimit";
import {
  ADMIN_COOKIE,
  createAdminToken,
  isLocalAdminEnabled,
  verifyAdminToken,
} from "@/lib/studio/admin-session";

const bodySchema = z.object({
  password: z.string().min(1).max(256),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`studio-auth:${ip}`, 10, 15 * 60_000);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSec) } }
    );
  }

  if (isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Use Supabase sign-in when configured." },
      { status: 400 }
    );
  }

  if (!isLocalAdminEnabled()) {
    return NextResponse.json(
      { error: "Set ADMIN_PASSWORD in your environment to enable local admin access." },
      { status: 503 }
    );
  }

  let payload: z.infer<typeof bodySchema>;
  try {
    payload = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  const valid =
    adminPassword.length > 0 &&
    payload.password.length === adminPassword.length &&
    timingSafeEqualString(payload.password, adminPassword);

  if (!valid) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, await createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function DELETE(request: NextRequest) {
  const denied = !(await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value));
  if (denied) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  return NextResponse.json({ authenticated: await verifyAdminToken(token) });
}
