import { type NextRequest, NextResponse } from "next/server";
import { getSSRSession } from "supertokens-node/nextjs";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/utils";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/studio/admin-session";
import {
  getStudioPaths,
  internalPathToPublic,
  isBlockedLegacyPath,
  resolveInternalPathname,
} from "@/lib/studio/paths";
import { ensureSuperTokensInit } from "@/lib/supertokens/backend";
import {
  isAdminConfigured,
  isSuperTokensEnabled,
  resolveIsAdmin,
} from "@/lib/supertokens/admin";

function notFound() {
  return new NextResponse(null, { status: 404 });
}

function isProtectedStudioPath(pathname: string) {
  return pathname.startsWith("/studio") && !pathname.startsWith("/studio/login");
}

function isProtectedApiPath(pathname: string) {
  return pathname.startsWith("/api/studio/") && pathname !== "/api/studio/auth";
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

function rewriteInternal(request: NextRequest, internalPath: string) {
  const url = request.nextUrl.clone();
  url.pathname = internalPath;
  return NextResponse.rewrite(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const paths = getStudioPaths();

  if (isBlockedLegacyPath(pathname)) {
    return notFound();
  }

  if (pathname === "/sitemap.xml" && paths.sitemapPublic !== "/sitemap.xml") {
    return notFound();
  }

  if (pathname === paths.sitemapPublic) {
    return rewriteInternal(request, "/sitemap.xml");
  }

  const internalPath = resolveInternalPathname(pathname);
  const effectivePath = internalPath ?? pathname;
  const isAuthPage = effectivePath === "/auth/studio";

  const touchesStudio =
    internalPath !== null ||
    isProtectedStudioPath(effectivePath) ||
    isProtectedApiPath(effectivePath);

  if (!touchesStudio) {
    return NextResponse.next();
  }

  if (isSuperTokensEnabled() && !isAuthPage && (isProtectedStudioPath(effectivePath) || isProtectedApiPath(effectivePath))) {
    ensureSuperTokensInit();

    const allowed = await superTokensAdminAllowed(request);
    if (!allowed) {
      if (isProtectedApiPath(effectivePath)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = paths.studioAuth;
      url.searchParams.set("redirectTo", internalPathToPublic(effectivePath));
      if (isAdminConfigured() && (await getSSRSession(request.cookies.getAll())).hasToken) {
        url.searchParams.set("error", "not_admin");
      }
      return NextResponse.redirect(url);
    }

    if (internalPath && internalPath !== pathname) {
      return rewriteInternal(request, internalPath);
    }
    return NextResponse.next();
  }

  if (isSupabaseConfigured()) {
    if (isProtectedApiPath(effectivePath)) {
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

    if (!isAuthPage && isProtectedStudioPath(effectivePath)) {
      const sessionResponse = await updateSession(request);
      if (sessionResponse.status >= 300 && sessionResponse.status < 400) {
        return sessionResponse;
      }
    }

    if (internalPath && internalPath !== pathname) {
      return rewriteInternal(request, internalPath);
    }

    return NextResponse.next();
  }

  const adminToken = request.cookies.get(ADMIN_COOKIE)?.value;
  const isAuthed = await verifyAdminToken(adminToken);

  if (isProtectedApiPath(effectivePath) && !isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isProtectedStudioPath(effectivePath) && !isAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = paths.studioAuth;
    url.searchParams.set("redirectTo", internalPathToPublic(effectivePath));
    return NextResponse.redirect(url);
  }

  if (internalPath && internalPath !== pathname) {
    return rewriteInternal(request, internalPath);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sitemap.xml",
    "/studio/:path*",
    "/auth/studio",
    "/auth/studio/:path*",
    "/vault",
    "/vault/:path*",
    "/api/studio/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
