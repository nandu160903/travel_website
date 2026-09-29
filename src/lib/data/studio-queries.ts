import type {
  DashboardStats,
  Destination,
  MapLocation,
  Photo,
  SiteSettings,
  Story,
  StoryCategory,
  Trip,
  Video,
} from "@/types";
import { readCmsStore, cmsStoreHasContent } from "@/lib/cms/store";
import { isSupabaseConfigured } from "@/lib/utils";
import {
  mapDestination,
  mapMapLocation,
  mapPhoto,
  mapStory,
  mapTrip,
  mapVideo,
} from "./mappers";
import {
  demoDashboardStats,
  demoDestinations,
  demoMapLocations,
  demoPhotos,
  demoSettings,
  demoStories,
  demoTrips,
  demoVideos,
} from "./demo";

async function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

async function getLocalStore() {
  const store = await readCmsStore();
  return store && cmsStoreHasContent(store) ? store : null;
}

export async function getStudioSiteSettings(): Promise<SiteSettings> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("site_settings").select("*").single();
    if (data) {
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
  }

  const store = await getLocalStore();
  return store?.siteSettings ?? demoSettings;
}

export async function getStudioDestinations(): Promise<Destination[]> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("destinations").select("*").order("name");
    if (data?.length) return data.map(mapDestination);
  }

  const store = await getLocalStore();
  if (store) return store.destinations;
  return demoDestinations;
}

export async function getStudioDestination(slug: string): Promise<Destination | null> {
  const destinations = await getStudioDestinations();
  return destinations.find((d) => d.slug === slug) ?? null;
}

export async function getStudioTrips(): Promise<Trip[]> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("trips").select("*").order("start_date", { ascending: false });
    if (data?.length) return data.map(mapTrip);
  }

  const store = await getLocalStore();
  if (store) return store.trips;
  return demoTrips;
}

export async function getStudioTrip(slug: string): Promise<Trip | null> {
  const trips = await getStudioTrips();
  return trips.find((t) => t.slug === slug) ?? null;
}

export async function getStudioStories(category?: StoryCategory): Promise<Story[]> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    let query = supabase
      .from("stories")
      .select("*, destinations(name, slug)")
      .order("updated_at", { ascending: false });
    if (category) query = query.eq("category", category);
    const { data } = await query;
    if (data?.length) return data.map(mapStory);
  }

  const store = await getLocalStore();
  const stories = store ? store.stories : demoStories;
  return category ? stories.filter((s) => s.category === category) : stories;
}

export async function getStudioStory(slug: string): Promise<Story | null> {
  const stories = await getStudioStories();
  return stories.find((s) => s.slug === slug) ?? null;
}

export async function getStudioPhotos(): Promise<Photo[]> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("photos").select("*").order("created_at", { ascending: false });
    if (data?.length) return data.map(mapPhoto);
  }

  const store = await getLocalStore();
  if (store) return store.photos;
  return demoPhotos;
}

export async function getStudioPhoto(id: string): Promise<Photo | null> {
  const photos = await getStudioPhotos();
  return photos.find((p) => p.id === id) ?? null;
}

export async function getStudioVideos(): Promise<Video[]> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
    if (data?.length) return data.map(mapVideo);
  }

  const store = await getLocalStore();
  if (store) return store.videos;
  return demoVideos;
}

export async function getStudioVideo(id: string): Promise<Video | null> {
  const videos = await getStudioVideos();
  return videos.find((v) => v.id === id) ?? null;
}

export async function getStudioMapLocations(): Promise<MapLocation[]> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("map_locations").select("*");
    if (data?.length) return data.map(mapMapLocation);
  }

  const store = await getLocalStore();
  if (store) return store.mapLocations;
  return demoMapLocations;
}

export async function getStudioDashboardStats(): Promise<DashboardStats> {
  const [trips, destinations, stories, photos] = await Promise.all([
    getStudioTrips(),
    getStudioDestinations(),
    getStudioStories(),
    getStudioPhotos(),
  ]);

  if (!trips.length && !destinations.length && !stories.length && !photos.length) {
    return demoDashboardStats;
  }

  return {
    totalTrips: trips.length,
    totalDestinations: destinations.length,
    totalStories: stories.length,
    totalPhotos: photos.length,
    publishedPosts: stories.filter((s) => s.status === "published").length,
    draftPosts: stories.filter((s) => s.status === "draft").length,
  };
}
