import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/animation/SectionHeading";
import { TripCard } from "@/components/cards/TripCard";
import { Timeline } from "@/components/sections/Timeline";
import { getTrips, getTimeline } from "@/lib/data/queries";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Journeys — Horizon Journal",
  description: "Chronological travel journeys and trips documented.",
  path: "/journeys",
});

export default async function JourneysPage() {
  const [trips, timeline] = await Promise.all([getTrips(), getTimeline()]);

  return (
    <PublicLayout>
      <section className="pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
        <SectionHeading
          label="Chronicle"
          title="My Journeys"
          subtitle="Every trip, every route — documented in order."
        />

        <div className="space-y-16 mb-24">
          {trips.map((trip, i) => (
            <div key={trip.id} id={trip.slug}>
              <TripCard trip={trip} index={i} />
            </div>
          ))}
        </div>

        {trips.length === 0 && (
          <p className="text-center text-muted py-20">No journeys documented yet.</p>
        )}

        <SectionHeading label="Timeline" title="By Year" />
        <Timeline entries={timeline} />
      </section>
    </PublicLayout>
  );
}
