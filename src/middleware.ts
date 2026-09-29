import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/utils";

export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    const isStudioRoute =
      request.nextUrl.pathname.startsWith("/studio") &&
      !request.nextUrl.pathname.startsWith("/studio/login");
    if (isStudioRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/vault";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/studio/:path*",
    "/vault",
    "/api/studio/:path*",
  ],
};
