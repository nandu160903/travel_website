import type {
  City,
  Destination,
  Photo,
  Story,
  Trip,
  Video,
} from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDestination(row: any): Destination {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    country: row.country,
    region: row.region,
    description: row.description,
    coverImage: row.cover_image ?? row.coverImage,
    coordinates: row.coordinates,
    featured: row.featured ?? false,
    storyCount: row.story_count ?? row.storyCount ?? 0,
    photoCount: row.photo_count ?? row.photoCount ?? 0,
    status: row.status,
    seoTitle: row.seo_title ?? row.seoTitle,
    seoDescription: row.seo_description ?? row.seoDescription,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapCity(row: any): City {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    destinationId: row.destination_id ?? row.destinationId,
    destinationSlug: row.destinations?.slug ?? row.destination_slug ?? row.destinationSlug,
    description: row.description,
    coverImage: row.cover_image ?? row.coverImage,
    coordinates: row.coordinates,
    storyCount: row.story_count ?? row.storyCount ?? 0,
    photoCount: row.photo_count ?? row.photoCount ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapTrip(row: any): Trip {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    country: row.country,
    cities: row.cities ?? [],
    startDate: row.start_date ?? row.startDate,
    endDate: row.end_date ?? row.endDate,
    coverImage: row.cover_image ?? row.coverImage,
    description: row.description,
    category: row.category ?? "",
    coordinates: row.coordinates,
    status: row.status,
    featured: row.featured ?? false,
    destinationId: row.destination_id ?? row.destinationId,
    storyCount: row.story_count ?? row.storyCount ?? 0,
    photoCount: row.photo_count ?? row.photoCount ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapStory(row: any): Story {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content ?? "",
    coverImage: row.cover_image ?? row.coverImage,
    destinationId: row.destination_id ?? row.destinationId ?? "",
    destinationSlug: row.destinations?.slug ?? row.destination_slug ?? row.destinationSlug ?? "",
    destinationName: row.destinations?.name ?? row.destination_name ?? row.destinationName ?? "",
    cityName: row.city_name ?? row.cityName,
    tripId: row.trip_id ?? row.tripId,
    publishedAt: row.published_at ?? row.publishedAt ?? "",
    readingTime: row.reading_time ?? row.readingTime ?? 5,
    category: row.category,
    tags: row.tags ?? [],
    featured: row.featured ?? false,
    status: row.status,
    gallery: row.gallery,
    videoUrl: row.video_url ?? row.videoUrl,
    location: row.location,
    seoTitle: row.seo_title ?? row.seoTitle,
    seoDescription: row.seo_description ?? row.seoDescription,
    ogImage: row.og_image ?? row.ogImage,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapPhoto(row: any): Photo {
  return {
    id: row.id,
    url: row.url,
    thumbnailUrl: row.thumbnail_url ?? row.thumbnailUrl,
    caption: row.caption,
    location: row.location,
    destinationSlug: row.destination_slug ?? row.destinationSlug,
    takenAt: row.taken_at ?? row.takenAt,
    camera: row.camera,
    width: row.width,
    height: row.height,
    storyId: row.story_id ?? row.storyId,
    tripId: row.trip_id ?? row.tripId,
    tags: row.tags,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapVideo(row: any): Video {
  return {
    id: row.id,
    title: row.title,
    thumbnail: row.thumbnail,
    url: row.url,
    embedUrl: row.embed_url ?? row.embedUrl,
    duration: row.duration,
    location: row.location,
    destinationSlug: row.destination_slug ?? row.destinationSlug,
    publishedAt: row.published_at ?? row.publishedAt,
    status: row.status,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapMapLocation(row: any) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    coordinates: row.coordinates,
    coverImage: row.cover_image ?? row.coverImage,
    description: row.description ?? "",
    visitDate: row.visit_date ?? row.visitDate,
    destinationSlug: row.destination_slug ?? row.destinationSlug,
    storySlug: row.story_slug ?? row.storySlug,
    tripSlug: row.trip_slug ?? row.tripSlug,
  };
}
