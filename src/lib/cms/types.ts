import type {
  Destination,
  MapLocation,
  Photo,
  SiteSettings,
  Story,
  Trip,
  Video,
} from "@/types";

export interface CmsStore {
  siteSettings?: SiteSettings;
  destinations: Destination[];
  trips: Trip[];
  stories: Story[];
  photos: Photo[];
  videos: Video[];
  mapLocations: MapLocation[];
}
