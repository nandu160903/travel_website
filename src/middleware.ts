import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/utils";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/studio/admin-session";

function isProtectedStudioPath(pathname: string) {
  return pathname.startsWith("/studio") && !pathname.startsWith("/studio/login");
}

function isProtectedApiPath(pathname: string) {
  return (
    pathname.startsWith("/api/studio/") &&
    pathname !== "/api/studio/auth"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
    url.pathname = "/vault";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*", "/vault", "/api/studio/:path*"],
};
