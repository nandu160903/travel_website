import Link from "next/link";
import Image from "next/image";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Hero } from "@/components/sections/Hero";
import { SectionHeading } from "@/components/animation/SectionHeading";
import { Reveal } from "@/components/animation/Reveal";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { StoryCard } from "@/components/cards/StoryCard";
import { Timeline } from "@/components/sections/Timeline";
import { TravelMap } from "@/components/map/TravelMap";
import { SocialIcons } from "@/components/layout/SocialIcons";
import { Button } from "@/components/ui/Button";
import {
  getSiteSettings,
  getDestinations,
  getFeaturedStories,
  getTimeline,
  getPhotos,
  getMapLocations,
  getTrips,
} from "@/lib/data/queries";
import { getSocialLinks } from "@/lib/config";
import { PhotoCard } from "@/components/cards/PhotoCard";

export default async function HomePage() {
  const [settings, destinations, stories, timeline, photos, mapLocations, trips] =
    await Promise.all([
      getSiteSettings(),
      getDestinations(),
      getFeaturedStories(3),
      getTimeline(),
      getPhotos(),
      getMapLocations(),
      getTrips(),
    ]);

  const socialLinks =
    settings.socialLinks.length > 0 ? settings.socialLinks : getSocialLinks();
  const featured = destinations.filter((d) => d.featured);
  const currentTrip = trips[0];

  return (
    <PublicLayout transparentHeader>
      <Hero heroImage={settings.heroImage} />

      {/* Current Journey */}
      {currentTrip && (
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32">
          <SectionHeading
            label="Now Traveling"
            title="Current Journey"
            subtitle="Where the road leads right now — demo content."
          />
          <Reveal>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={currentTrip.coverImage}
                  alt={currentTrip.title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-ocean mb-3">
                  {currentTrip.country} · {currentTrip.cities.join(", ")}
                </p>
                <h3 className="font-display text-4xl md:text-5xl">{currentTrip.title}</h3>
                <p className="text-muted mt-4 leading-relaxed">{currentTrip.description}</p>
                <Link href="/journeys" className="inline-block mt-6">
                  <Button variant="outline">Follow This Journey</Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32">
        <SectionHeading
          label="Explore"
          title="Featured\nDestinations"
          subtitle="Places that left a mark — replace with your own."
        />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {featured[0] && (
            <div className="md:col-span-8">
              <DestinationCard destination={featured[0]} size="large" />
            </div>
          )}
          <div className="md:col-span-4 grid gap-4 md:gap-6">
            {featured.slice(1, 3).map((d) => (
              <DestinationCard key={d.id} destination={d} size="medium" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {destinations
            .filter((d) => !d.featured)
            .slice(0, 4)
            .map((d) => (
              <DestinationCard key={d.id} destination={d} size="small" />
            ))}
        </div>
      </section>

      {/* Latest Stories */}
      <section className="bg-sand/50 dark:bg-muted-bg/30 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeading label="Read" title="Latest Stories" />
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {stories.map((story, i) => (
              <StoryCard key={story.id} story={story} size={i === 0 ? "large" : "default"} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/stories">
              <Button variant="outline">All Stories</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32">
        <SectionHeading
          label="Chronicle"
          title="My Journey"
          subtitle="Every destination, every year — a living archive."
        />
        <Timeline entries={timeline} />
      </section>

      {/* Photo Story */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeading label="Gallery" title="Photo Stories" align="center" />
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 px-4 md:px-8">
          {photos.slice(0, 6).map((photo, i) => (
            <div key={photo.id} className="break-inside-avoid mb-4">
              <PhotoCard photo={photo} index={i} />
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/photos">
            <Button variant="outline">View Gallery</Button>
          </Link>
        </div>
      </section>

      {/* Map Teaser */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32">
        <SectionHeading
          label="Navigate"
          title="The World\nI've Seen"
          subtitle="An interactive map of every place documented."
        />
        <Reveal>
          <TravelMap locations={mapLocations} height="50vh" />
        </Reveal>
        <div className="text-center mt-8">
          <Link href="/map">
            <Button variant="primary">Open Full Map</Button>
          </Link>
        </div>
      </section>

      {/* Quote */}
      <section className="py-32 text-center px-6">
        <Reveal>
          <blockquote className="font-display text-3xl md:text-5xl leading-tight max-w-3xl mx-auto text-muted">
            &ldquo;These are my journeys. These are the places I&apos;ve seen. Come experience the world through my eyes.&rdquo;
          </blockquote>
        </Reveal>
      </section>

      {/* Social */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 text-center border-t border-border">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-6">Follow Along</p>
        <SocialIcons links={socialLinks} className="justify-center" size="md" />
      </section>

      {/* Final CTA */}
      <section className="bg-ocean text-white py-24 md:py-32 text-center px-6">
        <h2 className="font-display text-4xl md:text-6xl mb-6">Start Exploring</h2>
        <p className="text-white/70 max-w-md mx-auto mb-8">
          Dive into destinations, stories, and photographs from journeys around the world.
        </p>
        <Link href="/destinations">
          <Button variant="secondary">Browse Destinations</Button>
        </Link>
      </section>
    </PublicLayout>
  );
}
