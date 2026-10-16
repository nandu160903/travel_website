import type { NextRequest } from "next/server";
import { withSession } from "supertokens-node/nextjs";
import { NextResponse } from "next/server";
import { ensureSuperTokensInit } from "./backend";
import { isAdminConfigured, isSuperTokensEnabled, resolveIsAdmin } from "./admin";

export type AdminSession = {
  userId: string;
  isAdmin: boolean;
};

export async function getAdminSession(
  request: NextRequest
): Promise<AdminSession | null> {
  if (!isSuperTokensEnabled()) {
    return null;
  }

  ensureSuperTokensInit();
  let adminSession: AdminSession | null = null;

  await withSession(
    request,
    async (_err, session) => {
      if (session) {
        const userId = session.getUserId();
        const payload = session.getAccessTokenPayload() as { isAdmin?: boolean };
        let isAdmin = payload.isAdmin === true;

        if (!isAdmin && isAdminConfigured()) {
          isAdmin = resolveIsAdmin(userId);
        }

        if (isAdmin) {
          adminSession = { userId, isAdmin: true };
        }
      }
      return NextResponse.json({ ok: true });
    },
    { sessionRequired: false }
  );

  return adminSession;
}

export async function verifySuperTokensAdmin(request: NextRequest): Promise<boolean> {
  if (!isSuperTokensEnabled() || !isAdminConfigured()) {
    return false;
  }
  const session = await getAdminSession(request);
  return session?.isAdmin === true;
}
