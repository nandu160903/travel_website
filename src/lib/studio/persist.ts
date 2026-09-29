import { randomUUID } from "crypto";
import type {
  Destination,
  MapLocation,
  Photo,
  PublishStatus,
  SiteSettings,
  Story,
  StoryCategory,
  Trip,
  Video,
} from "@/types";
import { updateCmsStore } from "@/lib/cms/store";
import { isSupabaseConfigured } from "@/lib/utils";

async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

export async function persistDestination(input: Partial<Destination> & { slug: string; name: string; country: string }) {
  const payload = {
    slug: input.slug,
    name: input.name,
    country: input.country,
    region: input.region ?? null,
    description: input.description ?? "",
    cover_image: input.coverImage ?? "",
    coordinates: input.coordinates ?? null,
    featured: input.featured ?? false,
    status: (input.status ?? "draft") as PublishStatus,
    seo_title: input.seoTitle ?? null,
    seo_description: input.seoDescription ?? null,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("destinations").upsert(payload, { onConflict: "slug" });
    if (error) throw new Error(error.message);
    return;
  }

  await updateCmsStore((store) => {
    const existing = store.destinations.find((d) => d.slug === input.slug);
    const next: Destination = {
      id: existing?.id ?? randomUUID(),
      slug: input.slug,
      name: input.name,
      country: input.country,
      region: input.region,
      description: input.description ?? "",
      coverImage: input.coverImage ?? "",
      coordinates: input.coordinates,
      featured: input.featured ?? false,
      storyCount: existing?.storyCount ?? 0,
      photoCount: existing?.photoCount ?? 0,
      status: (input.status ?? "draft") as PublishStatus,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
    };
    store.destinations = existing
      ? store.destinations.map((d) => (d.slug === input.slug ? next : d))
      : [...store.destinations, next];
    return store;
  });
}

export async function deleteDestination(slug: string) {
  if (isSupabaseConfigured()) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("destinations").delete().eq("slug", slug);
    if (error) throw new Error(error.message);
    return;
  }

  await updateCmsStore((store) => {
    store.destinations = store.destinations.filter((d) => d.slug !== slug);
    return store;
  });
}

export async function persistTrip(input: Partial<Trip> & { slug: string; title: string; country: string }) {
  const payload = {
    slug: input.slug,
    title: input.title,
    country: input.country,
    cities: input.cities ?? [],
    start_date: input.startDate ?? null,
    end_date: input.endDate ?? null,
    cover_image: input.coverImage ?? "",
    description: input.description ?? "",
    category: input.category ?? "",
    coordinates: input.coordinates ?? null,
    destination_id: input.destinationId ?? null,
    status: (input.status ?? "draft") as PublishStatus,
    featured: input.featured ?? false,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("trips").upsert(payload, { onConflict: "slug" });
    if (error) throw new Error(error.message);
    return;
  }

  await updateCmsStore((store) => {
    const existing = store.trips.find((t) => t.slug === input.slug);
    const next: Trip = {
      id: existing?.id ?? randomUUID(),
      slug: input.slug,
      title: input.title,
      country: input.country,
      cities: input.cities ?? [],
      startDate: input.startDate ?? "",
      endDate: input.endDate ?? "",
      coverImage: input.coverImage ?? "",
      description: input.description ?? "",
      category: input.category ?? "",
      coordinates: input.coordinates,
      status: (input.status ?? "draft") as PublishStatus,
      featured: input.featured ?? false,
      destinationId: input.destinationId,
      storyCount: existing?.storyCount ?? 0,
      photoCount: existing?.photoCount ?? 0,
    };
    store.trips = existing
      ? store.trips.map((t) => (t.slug === input.slug ? next : t))
      : [...store.trips, next];
    return store;
  });
}

export async function deleteTrip(slug: string) {
  if (isSupabaseConfigured()) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("trips").delete().eq("slug", slug);
    if (error) throw new Error(error.message);
    return;
  }

  await updateCmsStore((store) => {
    store.trips = store.trips.filter((t) => t.slug !== slug);
    return store;
  });
}

export async function persistStory(input: {
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  category?: StoryCategory;
  status?: PublishStatus;
  readingTime?: number;
  destinationId?: string;
  cityName?: string;
  featured?: boolean;
}) {
  const payload = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt ?? "",
    content: input.content ?? "",
    cover_image: input.coverImage ?? "",
    category: input.category ?? "personal",
    status: input.status ?? "draft",
    reading_time: input.readingTime ?? 5,
    destination_id: input.destinationId ?? null,
    city_name: input.cityName ?? null,
    featured: input.featured ?? false,
    published_at:
      input.status === "published" ? new Date().toISOString().split("T")[0] : null,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("stories").upsert(payload, { onConflict: "slug" });
    if (error) throw new Error(error.message);
    return;
  }

  await updateCmsStore((store) => {
    const existing = store.stories.find((s) => s.slug === input.slug);
    const dest = store.destinations.find((d) => d.id === input.destinationId);
    const next: Story = {
      id: existing?.id ?? randomUUID(),
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt ?? "",
      content: input.content ?? "",
      coverImage: input.coverImage ?? "",
      destinationId: input.destinationId ?? existing?.destinationId ?? "",
      destinationSlug: dest?.slug ?? existing?.destinationSlug ?? "",
      destinationName: dest?.name ?? existing?.destinationName ?? "",
      cityName: input.cityName ?? existing?.cityName,
      tripId: existing?.tripId,
      publishedAt:
        input.status === "published"
          ? new Date().toISOString().split("T")[0]
          : existing?.publishedAt ?? "",
      readingTime: input.readingTime ?? 5,
      category: input.category ?? "personal",
      tags: existing?.tags ?? [],
      featured: input.featured ?? false,
      status: input.status ?? "draft",
      gallery: existing?.gallery,
      videoUrl: existing?.videoUrl,
      location: existing?.location,
      seoTitle: existing?.seoTitle,
      seoDescription: existing?.seoDescription,
      ogImage: existing?.ogImage,
    };
    store.stories = existing
      ? store.stories.map((s) => (s.slug === input.slug ? next : s))
      : [...store.stories, next];
    return store;
  });
}

export async function deleteStory(slug: string) {
  if (isSupabaseConfigured()) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("stories").delete().eq("slug", slug);
    if (error) throw new Error(error.message);
    return;
  }

  await updateCmsStore((store) => {
    store.stories = store.stories.filter((s) => s.slug !== slug);
    return store;
  });
}

export async function persistPhoto(input: Partial<Photo> & { url: string }) {
  const id = input.id ?? randomUUID();

  if (isSupabaseConfigured()) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("photos").upsert({
      id,
      url: input.url,
      thumbnail_url: input.thumbnailUrl ?? null,
      caption: input.caption ?? null,
      location: input.location ?? null,
      destination_slug: input.destinationSlug ?? null,
      taken_at: input.takenAt ?? null,
      camera: input.camera ?? null,
    });
    if (error) throw new Error(error.message);
    return id;
  }

  await updateCmsStore((store) => {
    const existing = store.photos.find((p) => p.id === id);
    const next: Photo = {
      id,
      url: input.url,
      thumbnailUrl: input.thumbnailUrl,
      caption: input.caption,
      location: input.location,
      destinationSlug: input.destinationSlug,
      takenAt: input.takenAt,
      camera: input.camera,
      width: input.width,
      height: input.height,
      storyId: input.storyId,
      tripId: input.tripId,
      tags: input.tags,
    };
    store.photos = existing
      ? store.photos.map((p) => (p.id === id ? next : p))
      : [next, ...store.photos];
    return store;
  });

  return id;
}

export async function deletePhoto(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("photos").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }

  await updateCmsStore((store) => {
    store.photos = store.photos.filter((p) => p.id !== id);
    return store;
  });
}

export async function persistVideo(input: Partial<Video> & { title: string; url: string }) {
  const id = input.id ?? randomUUID();

  if (isSupabaseConfigured()) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("videos").upsert({
      id,
      title: input.title,
      thumbnail: input.thumbnail ?? "",
      url: input.url,
      embed_url: input.embedUrl ?? null,
      duration: input.duration ?? null,
      location: input.location ?? null,
      destination_slug: input.destinationSlug ?? null,
      published_at: input.publishedAt ?? null,
      status: input.status ?? "draft",
    });
    if (error) throw new Error(error.message);
    return id;
  }

  await updateCmsStore((store) => {
    const existing = store.videos.find((v) => v.id === id);
    const next: Video = {
      id,
      title: input.title,
      thumbnail: input.thumbnail ?? "",
      url: input.url,
      embedUrl: input.embedUrl,
      duration: input.duration,
      location: input.location,
      destinationSlug: input.destinationSlug,
      publishedAt: input.publishedAt,
      status: input.status ?? "draft",
    };
    store.videos = existing
      ? store.videos.map((v) => (v.id === id ? next : v))
      : [next, ...store.videos];
    return store;
  });

  return id;
}

export async function deleteVideo(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }

  await updateCmsStore((store) => {
    store.videos = store.videos.filter((v) => v.id !== id);
    return store;
  });
}

export async function persistMapLocation(input: Partial<MapLocation> & { name: string; type: MapLocation["type"]; coordinates: MapLocation["coordinates"] }) {
  const id = input.id ?? randomUUID();

  if (isSupabaseConfigured()) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("map_locations").upsert({
      id,
      name: input.name,
      type: input.type,
      coordinates: input.coordinates,
      cover_image: input.coverImage ?? "",
      description: input.description ?? "",
      visit_date: input.visitDate ?? null,
    });
    if (error) throw new Error(error.message);
    return id;
  }

  await updateCmsStore((store) => {
    const existing = store.mapLocations.find((l) => l.id === id);
    const next: MapLocation = {
      id,
      name: input.name,
      type: input.type,
      coordinates: input.coordinates,
      coverImage: input.coverImage ?? "",
      description: input.description ?? "",
      visitDate: input.visitDate,
      destinationSlug: input.destinationSlug,
      storySlug: input.storySlug,
      tripSlug: input.tripSlug,
    };
    store.mapLocations = existing
      ? store.mapLocations.map((l) => (l.id === id ? next : l))
      : [...store.mapLocations, next];
    return store;
  });

  return id;
}

export async function deleteMapLocation(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("map_locations").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }

  await updateCmsStore((store) => {
    store.mapLocations = store.mapLocations.filter((l) => l.id !== id);
    return store;
  });
}

export async function persistSiteSettings(settings: SiteSettings) {
  if (isSupabaseConfigured()) {
    const supabase = await getSupabase();
    const { error } = await supabase.from("site_settings").upsert({
      site_title: settings.siteTitle,
      site_description: settings.siteDescription,
      bio: settings.bio,
      profile_photo: settings.profilePhoto,
      hero_image: settings.heroImage,
      hero_video: settings.heroVideo,
      email: settings.email,
      social_links: settings.socialLinks,
      seo_defaults: settings.seoDefaults,
      featured_destination_ids: settings.featuredDestinationIds,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    return;
  }

  await updateCmsStore((store) => {
    store.siteSettings = settings;
    return store;
  });
}
