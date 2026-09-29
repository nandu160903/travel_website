import { NextRequest, NextResponse } from "next/server";
import type { SiteSettings, SocialLink } from "@/types";
import { requireStudioAccess, jsonError } from "@/lib/studio/api";
import { persistSiteSettings } from "@/lib/studio/persist";

export async function PUT(request: NextRequest) {
  const denied = await requireStudioAccess(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const socialLinks: SocialLink[] = [];
    if (body.instagram) socialLinks.push({ platform: "instagram", url: body.instagram });
    if (body.facebook) socialLinks.push({ platform: "facebook", url: body.facebook });
    if (body.youtube) socialLinks.push({ platform: "youtube", url: body.youtube });

    const settings: SiteSettings = {
      siteTitle: body.siteTitle,
      siteDescription: body.siteDescription,
      bio: body.bio,
      profilePhoto: body.profilePhoto ?? "",
      heroImage: body.heroImage,
      heroVideo: body.heroVideo,
      email: body.email,
      socialLinks: body.socialLinks ?? socialLinks,
      seoDefaults: body.seoDefaults ?? {
        title: body.siteTitle,
        description: body.siteDescription,
        ogImage: body.heroImage,
      },
      featuredDestinationIds: body.featuredDestinationIds ?? [],
    };

    await persistSiteSettings(settings);
    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Save failed");
  }
}
