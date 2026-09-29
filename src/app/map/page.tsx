import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/animation/SectionHeading";
import { TravelMap } from "@/components/map/TravelMap";
import { getMapLocations } from "@/lib/data/queries";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Map — Horizon Journal",
  description: "Interactive map of all documented travel destinations and journeys.",
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
        <TravelMap locations={locations} height="75vh" />
      </section>
    </PublicLayout>
  );
}
