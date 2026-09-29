import Image from "next/image";
import { notFound } from "next/navigation";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { StoryCard } from "@/components/cards/StoryCard";
import { Badge } from "@/components/ui/Badge";
import { getDestination, getCity, getStories } from "@/lib/data/queries";
import { formatCoordinates } from "@/lib/utils";
import { createMetadata } from "@/lib/seo/metadata";

interface CityPageProps {
  params: Promise<{ slug: string; citySlug: string }>;
}

export async function generateMetadata({ params }: CityPageProps) {
  const { slug, citySlug } = await params;
  const city = await getCity(slug, citySlug);
  const dest = await getDestination(slug);
  if (!city || !dest) return {};

  return createMetadata({
    title: `${city.name}, ${dest.name} — Horizon Journal`,
    description: city.description,
    path: `/destinations/${slug}/${citySlug}`,
    image: city.coverImage,
  });
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug, citySlug } = await params;
  const [destination, city] = await Promise.all([
    getDestination(slug),
    getCity(slug, citySlug),
  ]);

  if (!destination || !city) notFound();

  const allStories = await getStories();
  const stories = allStories.filter(
    (s) => s.destinationSlug === slug && s.cityName?.toLowerCase() === city.name.toLowerCase()
  );

  return (
    <PublicLayout>
      <div className="relative h-[45vh] overflow-hidden">
        <Image src={city.coverImage} alt={city.name} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Badge variant="accent">{destination.name.toUpperCase()}</Badge>
          <h1 className="font-display text-5xl md:text-7xl mt-4">{city.name}</h1>
          {city.coordinates && (
            <p className="text-[10px] uppercase tracking-widest text-muted mt-3">
              {formatCoordinates(city.coordinates.lat, city.coordinates.lng)}
            </p>
          )}
        </div>
      </div>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-muted leading-relaxed text-lg">{city.description}</p>
      </section>

      {stories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-16">
          <h2 className="font-display text-3xl mb-10">Stories from {city.name}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
