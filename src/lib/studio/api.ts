import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyStudioAccess } from "./auth";

export async function requireStudioAccess(request: NextRequest) {
  const allowed = await verifyStudioAccess(request);
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function jsonError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}
