import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/animation/SectionHeading";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { getDestinations } from "@/lib/data/queries";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Destinations — Horizon Journal",
  description: "Explore every destination documented on this journey.",
  path: "/destinations",
});

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  const featured = destinations.filter((d) => d.featured);
  const rest = destinations.filter((d) => !d.featured);

  return (
    <PublicLayout>
      <section className="pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
        <SectionHeading
          label="Atlas"
          title="Destinations"
          subtitle="Every country, every city — a visual explorer of places visited."
        />

        {featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-8">
            {featured[0] && (
              <div className="md:col-span-7">
                <DestinationCard destination={featured[0]} size="large" />
              </div>
            )}
            <div className="md:col-span-5 grid gap-4 md:gap-6">
              {featured.slice(1).map((d) => (
                <DestinationCard key={d.id} destination={d} size="medium" />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {rest.map((d, i) => (
            <DestinationCard
              key={d.id}
              destination={d}
              size={i % 3 === 0 ? "medium" : "small"}
            />
          ))}
        </div>

        {destinations.length === 0 && (
          <p className="text-center text-muted py-20">No destinations yet.</p>
        )}
      </section>
    </PublicLayout>
  );
}
