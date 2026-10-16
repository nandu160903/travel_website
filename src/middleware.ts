import { type NextRequest, NextResponse } from "next/server";
import { getSSRSession } from "supertokens-node/nextjs";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/utils";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/studio/admin-session";
import { ensureSuperTokensInit } from "@/lib/supertokens/backend";
import {
  isAdminConfigured,
  isSuperTokensEnabled,
  resolveIsAdmin,
} from "@/lib/supertokens/admin";

function isProtectedStudioPath(pathname: string) {
  return pathname.startsWith("/studio") && !pathname.startsWith("/studio/login");
}

function isProtectedApiPath(pathname: string) {
  return (
    pathname.startsWith("/api/studio/") &&
    pathname !== "/api/studio/auth"
  );
}

async function superTokensAdminAllowed(request: NextRequest): Promise<boolean> {
  if (!isSuperTokensEnabled() || !isAdminConfigured()) {
    return false;
  }

  ensureSuperTokensInit();

  const { accessTokenPayload, hasToken } = await getSSRSession(
    request.cookies.getAll()
  );

  if (!hasToken || !accessTokenPayload) {
    return false;
  }

  const payload = accessTokenPayload as { isAdmin?: boolean; sub?: string };
  if (payload.isAdmin === true) {
    return true;
  }

  const userId = typeof payload.sub === "string" ? payload.sub : undefined;
  if (!userId) {
    return false;
  }

  return resolveIsAdmin(userId);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/vault") {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/studio";
    url.searchParams.set(
      "redirectTo",
      request.nextUrl.searchParams.get("redirect") ?? "/studio"
    );
    return NextResponse.redirect(url);
  }

  if (isSuperTokensEnabled() && (isProtectedStudioPath(pathname) || isProtectedApiPath(pathname))) {
    ensureSuperTokensInit();

    const allowed = await superTokensAdminAllowed(request);
    if (!allowed) {
      if (isProtectedApiPath(pathname)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = "/auth/studio";
      url.searchParams.set("redirectTo", pathname);
      if (isAdminConfigured() && (await getSSRSession(request.cookies.getAll())).hasToken) {
        url.searchParams.set("error", "not_admin");
      }
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isSupabaseConfigured()) {
    if (isProtectedApiPath(pathname)) {
      const { createServerClient } = await import("@supabase/ssr");
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll() {},
          },
        }
      );
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile?.role !== "creator" && profile?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    return updateSession(request);
  }

  const adminToken = request.cookies.get(ADMIN_COOKIE)?.value;
  const isAuthed = await verifyAdminToken(adminToken);

  if (isProtectedApiPath(pathname) && !isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isProtectedStudioPath(pathname) && !isAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/studio";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*", "/vault", "/api/studio/:path*"],
};
