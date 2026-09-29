import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/utils";
import { ADMIN_COOKIE, isLocalAdminEnabled, verifyAdminToken } from "./admin-session";

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
