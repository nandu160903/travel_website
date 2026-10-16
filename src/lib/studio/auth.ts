import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/utils";
import { ADMIN_COOKIE, isLocalAdminEnabled, verifyAdminToken } from "./admin-session";
import { isAdminConfigured, isSuperTokensEnabled } from "@/lib/supertokens/admin";
import { verifySuperTokensAdmin } from "@/lib/supertokens/session";

async function verifySupabaseCreator(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "creator" || profile?.role === "admin";
}

async function verifyLocalAdminToken(token: string | undefined): Promise<boolean> {
  return isLocalAdminEnabled() && (await verifyAdminToken(token));
}

export async function verifyStudioAccess(request?: NextRequest): Promise<boolean> {
  if (isSuperTokensEnabled() && isAdminConfigured()) {
    if (!request) {
      const { headers } = await import("next/headers");
      const h = await headers();
      const cookieHeader = h.get("cookie") ?? "";
      const fakeRequest = {
        cookies: {
          getAll: () =>
            cookieHeader.split(";").map((part) => {
              const [name, ...rest] = part.trim().split("=");
              return { name, value: rest.join("=") };
            }),
        },
        headers: h,
        method: "GET",
        url: "http://localhost",
      } as unknown as NextRequest;
      return verifySuperTokensAdmin(fakeRequest);
    }
    return verifySuperTokensAdmin(request);
  }

  if (isSupabaseConfigured()) {
    return verifySupabaseCreator();
  }

  const token = request
    ? request.cookies.get(ADMIN_COOKIE)?.value
    : (await cookies()).get(ADMIN_COOKIE)?.value;

  return await verifyLocalAdminToken(token);
}

export async function isStudioAuthenticated(request?: NextRequest): Promise<boolean> {
  return verifyStudioAccess(request);
}
