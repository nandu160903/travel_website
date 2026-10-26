import { NextRequest, NextResponse } from "next/server";
import { withSession } from "supertokens-node/nextjs";
import { ensureSuperTokensInit } from "@/lib/supertokens/backend";
import {
  getConfiguredAdminUserId,
  isSuperTokensEnabled,
  resolveIsAdmin,
} from "@/lib/supertokens/admin";

ensureSuperTokensInit();

export async function GET(request: NextRequest) {
  if (!isSuperTokensEnabled()) {
    return NextResponse.json({ enabled: false, authenticated: false });
  }

  return withSession(
    request,
    async (_err, session) => {
      if (!session) {
        return NextResponse.json({ authenticated: false, isAdmin: false });
      }

      const userId = session.getUserId();
      const payload = session.getAccessTokenPayload() as { isAdmin?: boolean };
      const isAdmin = payload.isAdmin === true || resolveIsAdmin(userId);

      const body: Record<string, unknown> = {
        authenticated: true,
        userId,
        isAdmin,
      };
      if (isAdmin) {
        body.configuredAdminUserId = getConfiguredAdminUserId() ?? null;
      }
      return NextResponse.json(body);
    },
    { sessionRequired: false }
  );
}
