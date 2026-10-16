import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireStudioAccess, jsonError } from "@/lib/studio/api";
import { persistAboutPage } from "@/lib/studio/persist";

const aboutSchema = z.object({
  headline: z.string().min(1),
  subtitle: z.string(),
  sections: z.array(
    z.object({
      title: z.string().min(1),
      content: z.string().min(1),
    })
  ),
});

export async function PUT(request: NextRequest) {
  const denied = await requireStudioAccess(request);
  if (denied) return denied;

  try {
    const body = aboutSchema.parse(await request.json());
    await persistAboutPage(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("Invalid about page payload.", 400);
    }
    return jsonError("Failed to save about page.");
  }
}
