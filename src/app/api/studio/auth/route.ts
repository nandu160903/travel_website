import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/utils";
import {
  ADMIN_COOKIE,
  createAdminToken,
  isLocalAdminEnabled,
  verifyAdminToken,
} from "@/lib/studio/admin-session";

export async function POST(request: NextRequest) {
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

  const { password } = await request.json();
  if (password !== process.env.ADMIN_PASSWORD) {
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

export async function DELETE() {
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
