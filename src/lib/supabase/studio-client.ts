import { createClient, createServiceClient } from "@/lib/supabase/server";

export function isServiceRoleConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

/**
 * Server-only Supabase client for Studio CMS operations.
 * Prefer service role (SuperTokens / local admin paths have no Supabase session).
 * Falls back to an authenticated creator session when service role is unset.
 */
export async function createStudioSupabaseClient() {
  if (isServiceRoleConfigured()) {
    return createServiceClient();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "Studio database access requires SUPABASE_SERVICE_ROLE_KEY (server-only) or Supabase creator login."
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "creator" && profile?.role !== "admin") {
    throw new Error("Insufficient Supabase role for Studio writes.");
  }

  return supabase;
}
