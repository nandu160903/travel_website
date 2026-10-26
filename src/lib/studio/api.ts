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
  const body =
    status >= 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : message;
  return NextResponse.json({ error: body }, { status });
}
