import type {
  City,
  DashboardStats,
  Destination,
  MapLocation,
  Photo,
  SearchResult,
  SiteSettings,
  Story,
  StoryCategory,
  TimelineEntry,
  Trip,
  Video,
} from "@/types";
import { isSupabaseConfigured } from "@/lib/utils";
import {
  demoCities,
  demoDashboardStats,
  demoDestinations,
  demoMapLocations,
  demoPhotos,
  demoSettings,
  demoStories,
  demoTimeline,
  demoTrips,
  demoVideos,
} from "./demo";

async function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await getSupabaseClient();
  if (!supabase) return demoSettings;

  const { data } = await supabase.from("site_settings").select("*").single();
  if (!data) return demoSettings;

  return {
    siteTitle: data.site_title,
    siteDescription: data.site_description,
    bio: data.bio,
    profilePhoto: data.profile_photo,
    heroImage: data.hero_image,
    heroVideo: data.hero_video,
    email: data.email,
    socialLinks: data.social_links ?? [],
    seoDefaults: data.seo_defaults ?? demoSettings.seoDefaults,
    featuredDestinationIds: data.featured_destination_ids ?? [],
  };
}

export async function getDestinations(): Promise<Destination[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) return demoDestinations.filter((d) => d.status === "published");

  const { data } = await supabase
    .from("destinations")
    .select("*")
    .eq("status", "published")
    .order("name");

  if (!data?.length) return demoDestinations.filter((d) => d.status === "published");

  return data.map(mapDestination);
}

export async function getDestination(slug: string): Promise<Destination | null> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return demoDestinations.find((d) => d.slug === slug && d.status === "published") ?? null;
  }

  const { data } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return data ? mapDestination(data) : null;
}

export async function getCities(destinationSlug?: string): Promise<City[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return destinationSlug
      ? demoCities.filter((c) => c.destinationSlug === destinationSlug)
      : demoCities;
  }

  let query = supabase.from("cities").select("*, destinations!inner(slug)");
  if (destinationSlug) {
    query = query.eq("destinations.slug", destinationSlug);
  }
  const { data } = await query;
  if (!data?.length) {
    return destinationSlug
      ? demoCities.filter((c) => c.destinationSlug === destinationSlug)
      : demoCities;
  }
  return data.map(mapCity);
}

export async function getCity(
  destinationSlug: string,
  citySlug: string
): Promise<City | null> {
  const cities = await getCities(destinationSlug);
  return cities.find((c) => c.slug === citySlug) ?? null;
}

export async function getTrips(): Promise<Trip[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) return demoTrips.filter((t) => t.status === "published");

  const { data } = await supabase
    .from("trips")
    .select("*")
    .eq("status", "published")
    .order("start_date", { ascending: false });

  if (!data?.length) return demoTrips.filter((t) => t.status === "published");
  return data.map(mapTrip);
}

export async function getTrip(slug: string): Promise<Trip | null> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return demoTrips.find((t) => t.slug === slug && t.status === "published") ?? null;
  }

  const { data } = await supabase
    .from("trips")
    .select("*")
    .eq("slug", slug)
    .single();

  return data ? mapTrip(data) : null;
}

export async function getStories(category?: StoryCategory): Promise<Story[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    const stories = demoStories.filter((s) => s.status === "published");
    return category ? stories.filter((s) => s.category === category) : stories;
  }

  let query = supabase
    .from("stories")
    .select("*, destinations(name, slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data } = await query;
  if (!data?.length) {
    const stories = demoStories.filter((s) => s.status === "published");
    return category ? stories.filter((s) => s.category === category) : stories;
  }
  return data.map(mapStory);
}

export async function getStory(slug: string): Promise<Story | null> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return demoStories.find((s) => s.slug === slug && s.status === "published") ?? null;
  }

  const { data } = await supabase
    .from("stories")
    .select("*, destinations(name, slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return data ? mapStory(data) : null;
}

export async function getFeaturedStories(limit = 3): Promise<Story[]> {
  const stories = await getStories();
  return stories.filter((s) => s.featured).slice(0, limit);
}

export async function getRelatedStories(story: Story, limit = 3): Promise<Story[]> {
  const stories = await getStories();
  return stories
    .filter(
      (s) =>
        s.id !== story.id &&
        (s.destinationSlug === story.destinationSlug || s.category === story.category)
    )
    .slice(0, limit);
}

export async function getPhotos(): Promise<Photo[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) return demoPhotos;

  const { data } = await supabase.from("photos").select("*").order("taken_at", { ascending: false });
  if (!data?.length) return demoPhotos;
  return data.map(mapPhoto);
}

export async function getVideos(): Promise<Video[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) return demoVideos.filter((v) => v.status === "published");

  const { data } = await supabase
    .from("videos")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (!data?.length) return demoVideos.filter((v) => v.status === "published");
  return data.map(mapVideo);
}

export async function getTimeline(): Promise<TimelineEntry[]> {
  return demoTimeline;
}

export async function getMapLocations(): Promise<MapLocation[]> {
  return demoMapLocations;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await getSupabaseClient();
  if (!supabase) return demoDashboardStats;

  const [trips, destinations, stories, photos] = await Promise.all([
    supabase.from("trips").select("id", { count: "exact", head: true }),
    supabase.from("destinations").select("id", { count: "exact", head: true }),
    supabase.from("stories").select("id, status"),
    supabase.from("photos").select("id", { count: "exact", head: true }),
  ]);

  const allStories = stories.data ?? [];
  return {
    totalTrips: trips.count ?? 0,
    totalDestinations: destinations.count ?? 0,
    totalStories: allStories.length,
    totalPhotos: photos.count ?? 0,
    publishedPosts: allStories.filter((s) => s.status === "published").length,
    draftPosts: allStories.filter((s) => s.status === "draft").length,
  };
}

export async function searchContent(query: string): Promise<SearchResult[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const [stories, destinations, trips] = await Promise.all([
    getStories(),
    getDestinations(),
    getTrips(),
  ]);

  const results: SearchResult[] = [];

  for (const story of stories) {
    if (
      story.title.toLowerCase().includes(q) ||
      story.excerpt.toLowerCase().includes(q) ||
      story.tags.some((t) => t.includes(q))
    ) {
      results.push({
        id: story.id,
        type: "story",
        title: story.title,
        subtitle: `${story.cityName ?? story.destinationName}`,
        url: `/stories/${story.slug}`,
        image: story.coverImage,
      });
    }
  }

  for (const dest of destinations) {
    if (dest.name.toLowerCase().includes(q) || dest.country.toLowerCase().includes(q)) {
      results.push({
        id: dest.id,
        type: "destination",
        title: dest.name,
        subtitle: dest.country,
        url: `/destinations/${dest.slug}`,
        image: dest.coverImage,
      });
    }
  }

  for (const trip of trips) {
    if (trip.title.toLowerCase().includes(q) || trip.country.toLowerCase().includes(q)) {
      results.push({
        id: trip.id,
        type: "trip",
        title: trip.title,
        subtitle: trip.country,
        url: `/journeys#${trip.slug}`,
        image: trip.coverImage,
      });
    }
  }

  return results.slice(0, 12);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDestination(row: any): Destination {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    country: row.country,
    region: row.region,
    description: row.description,
    coverImage: row.cover_image,
    coordinates: row.coordinates,
    featured: row.featured,
    storyCount: row.story_count ?? 0,
    photoCount: row.photo_count ?? 0,
    status: row.status,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCity(row: any): City {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    destinationId: row.destination_id,
    destinationSlug: row.destinations?.slug ?? row.destination_slug,
    description: row.description,
    coverImage: row.cover_image,
    coordinates: row.coordinates,
    storyCount: row.story_count ?? 0,
    photoCount: row.photo_count ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTrip(row: any): Trip {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    country: row.country,
    cities: row.cities ?? [],
    startDate: row.start_date,
    endDate: row.end_date,
    coverImage: row.cover_image,
    description: row.description,
    category: row.category,
    coordinates: row.coordinates,
    status: row.status,
    featured: row.featured,
    destinationId: row.destination_id,
    storyCount: row.story_count ?? 0,
    photoCount: row.photo_count ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapStory(row: any): Story {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    destinationId: row.destination_id,
    destinationSlug: row.destinations?.slug ?? row.destination_slug,
    destinationName: row.destinations?.name ?? row.destination_name,
    cityName: row.city_name,
    tripId: row.trip_id,
    publishedAt: row.published_at,
    readingTime: row.reading_time,
    category: row.category,
    tags: row.tags ?? [],
    featured: row.featured,
    status: row.status,
    gallery: row.gallery,
    videoUrl: row.video_url,
    location: row.location,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    ogImage: row.og_image,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPhoto(row: any): Photo {
  return {
    id: row.id,
    url: row.url,
    thumbnailUrl: row.thumbnail_url,
    caption: row.caption,
    location: row.location,
    destinationSlug: row.destination_slug,
    takenAt: row.taken_at,
    camera: row.camera,
    width: row.width,
    height: row.height,
    storyId: row.story_id,
    tripId: row.trip_id,
    tags: row.tags,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapVideo(row: any): Video {
  return {
    id: row.id,
    title: row.title,
    thumbnail: row.thumbnail,
    url: row.url,
    embedUrl: row.embed_url,
    duration: row.duration,
    location: row.location,
    destinationSlug: row.destination_slug,
    publishedAt: row.published_at,
    status: row.status,
  };
}
