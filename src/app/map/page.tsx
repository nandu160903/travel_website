import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/animation/SectionHeading";
import { TravelMap } from "@/components/map/TravelMap";
import { getMapLocations } from "@/lib/data/queries";
import { getMapboxToken, seoPageTitle } from "@/lib/config";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: seoPageTitle("Map"),
  description: "Pins for every documented ride — regions, cities, and trip highlights across India.",
  path: "/map",
});

export default async function MapPage() {
  const locations = await getMapLocations();

  return (
    <PublicLayout>
      <section className="pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
        <SectionHeading
          label="Navigate"
          title="Travel Map"
          subtitle="Every pin is a memory. Click to explore."
        />
        <TravelMap
          locations={locations}
          height="min(75dvh, 780px)"
          mapboxToken={getMapboxToken()}
        />
      </section>
    </PublicLayout>
  );
}
