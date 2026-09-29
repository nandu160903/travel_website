import { NextRequest, NextResponse } from "next/server";
import { requireStudioAccess, jsonError } from "@/lib/studio/api";
import { deleteVideo, persistVideo } from "@/lib/studio/persist";

export async function POST(request: NextRequest) {
  const denied = await requireStudioAccess(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const id = await persistVideo(body);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Save failed");
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireStudioAccess(request);
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return jsonError("Missing id", 400);

  try {
    await deleteVideo(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Delete failed");
  }
}
