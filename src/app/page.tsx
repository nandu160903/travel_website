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
import { FieldNotes } from "@/components/sections/FieldNotes";
import { TravelStats } from "@/components/sections/TravelStats";
import { SocialIcons } from "@/components/layout/SocialIcons";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/animation/AnimatedCounter";
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
import { formatDate } from "@/lib/utils";
import { getMapboxToken } from "@/lib/config";

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
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28">
          <SectionHeading
            index="01"
            label="Current Journey"
            title={currentTrip.cities[0] ?? currentTrip.title}
            subtitle={`${currentTrip.country} · ${formatDate(currentTrip.startDate, "MMMM yyyy")} — demo notebook entry.`}
          />
          <Reveal>
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
              <div className="md:col-span-7 relative aspect-[4/3] md:aspect-auto md:min-h-[420px] overflow-hidden image-editorial">
                <Image
                  src={currentTrip.coverImage}
                  alt={currentTrip.title}
                  fill
                  className="object-cover editorial-img"
                  sizes="60vw"
                />
              </div>
              <div className="md:col-span-5 space-y-8 min-w-0 md:pt-4">
                <div>
                  <p className="travel-meta mb-3">Journey 019 · {currentTrip.country}</p>
                  <h3 className="font-display text-2xl md:text-4xl font-bold leading-[0.95] break-words uppercase tracking-tight">
                    {currentTrip.title}
                  </h3>
                  <p className="text-muted mt-4 leading-relaxed font-sans">{currentTrip.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-6 py-6 border-y border-border">
                  <AnimatedCounter value={4} label="Days" />
                  <AnimatedCounter value={1240} suffix="+" label="KM Travelled" />
                  <AnimatedCounter value={6} label="Stops" />
                  <AnimatedCounter value={currentTrip.storyCount} label="Stories" />
                </div>
                <Link href="/journeys">
                  <Button variant="outline">Follow This Journey →</Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* World Map */}
      <section className="section-band-dark py-16 md:py-24 px-6 md:px-8" data-cursor="explore">
        <div className="max-w-7xl mx-auto">
        <SectionHeading
          index="02"
          label="Navigate"
          title={"The World\nI've Seen"}
          subtitle="An explorer's map of every place documented."
        />
        <Reveal>
          <TravelMap locations={mapLocations} height="55vh" mapboxToken={getMapboxToken()} />
        </Reveal>
        <div className="mt-10">
          <Link href="/map" className="btn-link-arrow text-paper/80 hover:text-trail">
            Open full map
            <span aria-hidden>→</span>
          </Link>
        </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <SectionHeading
          index="03"
          label="Explore"
          title={"Featured\nDestinations"}
          subtitle="Places that left a mark — replace with your own."
        />
        <div className="bento-grid">
          {featured[0] && (
            <div className="col-span-12 md:col-span-8 md:row-span-2">
              <DestinationCard destination={featured[0]} size="large" className="h-full min-h-[360px]" />
            </div>
          )}
          {featured.slice(1, 3).map((d) => (
            <div key={d.id} className="col-span-12 md:col-span-4">
              <DestinationCard destination={d} size="medium" className="h-full" />
            </div>
          ))}
          {destinations
            .filter((d) => !d.featured)
            .slice(0, 4)
            .map((d) => (
              <div key={d.id} className="col-span-6 md:col-span-3">
                <DestinationCard destination={d} size="small" className="h-full min-h-[220px]" />
              </div>
            ))}
        </div>
      </section>

      {/* Latest Stories */}
      <section className="py-16 md:py-24 section-band">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeading index="04" label="Stories" title="Recent Journals" />
          <div className="grid md:grid-cols-12 gap-8 md:gap-10">
            {stories[0] && (
              <div className="md:col-span-7">
                <StoryCard story={stories[0]} size="large" />
              </div>
            )}
            <div className="md:col-span-5 grid gap-8">
              {stories.slice(1).map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/stories">
              <Button variant="outline">All Stories</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <SectionHeading
          index="05"
          label="Chronicle"
          title="Travel Timeline"
          subtitle="Flipping through the diary — year by year."
        />
        <Timeline entries={timeline} />
      </section>

      {/* Photo Journal */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeading index="06" label="Gallery" title="Photo Journal" align="center" />
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 px-6 md:px-8" data-cursor="drag">
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

      <FieldNotes />
      <TravelStats />

      {/* Final statement */}
      <section className="py-24 md:py-32 px-6 text-center max-w-4xl mx-auto border-t border-border">
        <Reveal>
          <p className="travel-meta travel-meta-accent mb-6">Final Note</p>
          <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[0.95] max-w-3xl mx-auto uppercase tracking-tight">
            I have been there. I experienced it. Here is what it looked like. Here is what it felt like.
          </blockquote>
          <p className="text-muted mt-6 text-lg">Come explore the journey.</p>
        </Reveal>
      </section>

      {/* Social */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-12 text-center border-t border-border">
        <p className="travel-meta mb-5">Follow Along</p>
        <SocialIcons links={socialLinks} className="justify-center" size="md" />
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border bg-surface py-20 md:py-28 text-center px-6 texture-topo">
        <div className="relative max-w-2xl mx-auto">
          <p className="travel-meta travel-meta-accent mb-4">Next waypoint</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground uppercase tracking-tight leading-[0.95]">
            Start Exploring
          </h2>
          <p className="text-muted max-w-md mx-auto mb-8">
            Dive into destinations, stories, and photographs from journeys around the world.
          </p>
          <Link href="/destinations">
            <Button variant="primary">Browse Destinations</Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
