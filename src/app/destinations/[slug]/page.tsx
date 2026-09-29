import Image from "next/image";
import { notFound } from "next/navigation";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/animation/SectionHeading";
import { StoryCard } from "@/components/cards/StoryCard";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { Badge } from "@/components/ui/Badge";
import {
  getDestination,
  getCities,
  getStories,
  getDestinations,
} from "@/lib/data/queries";
import { formatCoordinates } from "@/lib/utils";
import { createMetadata, destinationJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata";

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DestinationPageProps) {
  const { slug } = await params;
  const dest = await getDestination(slug);
  if (!dest) return {};

  return createMetadata({
    title: dest.seoTitle ?? `${dest.name} — Horizon Journal`,
    description: dest.seoDescription ?? dest.description,
    path: `/destinations/${dest.slug}`,
    image: dest.coverImage,
  });
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = await getDestination(slug);
  if (!destination) notFound();

  const [cities, allStories, allDestinations] = await Promise.all([
    getCities(slug),
    getStories(),
    getDestinations(),
  ]);

  const stories = allStories.filter((s) => s.destinationSlug === slug);
  const related = allDestinations.filter((d) => d.slug !== slug).slice(0, 3);

  const jsonLd = [
    destinationJsonLd(destination),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Destinations", url: "/destinations" },
      { name: destination.name, url: `/destinations/${destination.slug}` },
    ]),
  ];

  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative h-[50vh] md:h-[65vh] overflow-hidden">
        <Image
          src={destination.coverImage}
          alt={destination.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-charcoal/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 max-w-7xl mx-auto">
          <Badge variant="accent">{destination.region ?? destination.country}</Badge>
          <h1 className="font-display text-5xl md:text-8xl text-white mt-4 leading-none">
            {destination.name}
          </h1>
          {destination.coordinates && (
            <p className="text-white/60 text-[10px] uppercase tracking-widest mt-4">
              {formatCoordinates(destination.coordinates.lat, destination.coordinates.lng)}
            </p>
          )}
        </div>
      </div>

      <section className="max-w-3xl mx-auto px-6 md:px-8 py-16">
        <p className="text-lg text-muted leading-relaxed">{destination.description}</p>
        <div className="flex gap-6 mt-6 text-[10px] uppercase tracking-widest text-muted">
          <span>{destination.storyCount} stories</span>
          <span>{destination.photoCount} photos</span>
        </div>
      </section>

      {cities.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-16">
          <SectionHeading label="Cities" title="Explore" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {cities.map((city, i) => (
              <DestinationCard
                key={city.id}
                destination={{
                  ...destination,
                  id: city.id,
                  slug: `${destination.slug}/${city.slug}`,
                  name: city.name,
                  coverImage: city.coverImage,
                  description: city.description,
                  storyCount: city.storyCount,
                  photoCount: city.photoCount,
                }}
                size={i === 0 ? "medium" : "small"}
              />
            ))}
          </div>
        </section>
      )}

      {stories.length > 0 && (
        <section className="bg-sand/30 dark:bg-muted-bg/20 py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <SectionHeading label="Stories" title={`From ${destination.name}`} />
            <div className="grid md:grid-cols-3 gap-8">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-24">
          <SectionHeading label="More" title="Other Destinations" />
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((d) => (
              <DestinationCard key={d.id} destination={d} size="medium" />
            ))}
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
