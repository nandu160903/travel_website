import { NextRequest, NextResponse } from "next/server";
import { requireStudioAccess, jsonError } from "@/lib/studio/api";
import { deleteTrip, persistTrip } from "@/lib/studio/persist";

export async function POST(request: NextRequest) {
  const denied = await requireStudioAccess(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    await persistTrip(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Save failed");
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireStudioAccess(request);
  if (denied) return denied;

  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) return jsonError("Missing slug", 400);

  try {
    await deleteTrip(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Delete failed");
  }
}
