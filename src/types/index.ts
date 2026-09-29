export type PublishStatus = "draft" | "published" | "archived";

export type StoryCategory =
  | "adventures"
  | "city"
  | "food"
  | "culture"
  | "nature"
  | "road-trips"
  | "personal";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  region?: string;
  description: string;
  coverImage: string;
  coordinates?: Coordinates;
  featured: boolean;
  storyCount: number;
  photoCount: number;
  status: PublishStatus;
  seoTitle?: string;
  seoDescription?: string;
}

export interface City {
  id: string;
  slug: string;
  name: string;
  destinationId: string;
  destinationSlug: string;
  description: string;
  coverImage: string;
  coordinates?: Coordinates;
  storyCount: number;
  photoCount: number;
}

export interface Trip {
  id: string;
  slug: string;
  title: string;
  country: string;
  cities: string[];
  startDate: string;
  endDate: string;
  coverImage: string;
  description: string;
  category: string;
  coordinates?: Coordinates;
  status: PublishStatus;
  featured: boolean;
  destinationId?: string;
  storyCount: number;
  photoCount: number;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  destinationId: string;
  destinationSlug: string;
  destinationName: string;
  cityName?: string;
  tripId?: string;
  publishedAt: string;
  readingTime: number;
  category: StoryCategory;
  tags: string[];
  featured: boolean;
  status: PublishStatus;
  gallery?: string[];
  videoUrl?: string;
  location?: Coordinates;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  location?: string;
  destinationSlug?: string;
  takenAt?: string;
  camera?: string;
  width?: number;
  height?: number;
  storyId?: string;
  tripId?: string;
  tags?: string[];
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  embedUrl?: string;
  duration?: string;
  location?: string;
  destinationSlug?: string;
  publishedAt?: string;
  status: PublishStatus;
}

export interface MapLocation {
  id: string;
  name: string;
  type: "country" | "city" | "trip" | "story";
  coordinates: Coordinates;
  coverImage: string;
  description: string;
  visitDate?: string;
  destinationSlug?: string;
  storySlug?: string;
  tripSlug?: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
}

export interface SocialLink {
  platform: "instagram" | "facebook" | "youtube" | "x" | "threads" | "tiktok";
  url: string;
}

export interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  bio: string;
  profilePhoto: string;
  heroImage: string;
  heroVideo?: string;
  email: string;
  socialLinks: SocialLink[];
  seoDefaults: {
    title: string;
    description: string;
    ogImage: string;
  };
  featuredDestinationIds: string[];
}

export interface TimelineEntry {
  id: string;
  year: number;
  month?: number;
  country: string;
  city: string;
  description: string;
  coverImage: string;
  destinationSlug: string;
  storyCount: number;
  photoCount: number;
}

export interface SearchResult {
  id: string;
  type: "story" | "destination" | "trip" | "tag";
  title: string;
  subtitle?: string;
  url: string;
  image?: string;
}

export interface DashboardStats {
  totalTrips: number;
  totalDestinations: number;
  totalStories: number;
  totalPhotos: number;
  publishedPosts: number;
  draftPosts: number;
}
