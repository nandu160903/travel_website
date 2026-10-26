import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getStudioPaths, internalPathToPublic, resolveInternalPathname } from "@/lib/studio/paths";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const internal =
    resolveInternalPathname(request.nextUrl.pathname) ?? request.nextUrl.pathname;

  const isStudioRoute =
    internal.startsWith("/studio") && !internal.startsWith("/studio/login");

  if (isStudioRoute && !user) {
    const url = request.nextUrl.clone();
    const paths = getStudioPaths();
    url.pathname = paths.studioAuth;
    url.searchParams.set("redirectTo", internalPathToPublic(internal));
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
