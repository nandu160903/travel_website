import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";
import { Button } from "@/components/ui/Button";

const gallery = {
  tall: {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=85",
    alt: "Himalayan valley from the saddle",
  },
  top: [
    {
      src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=85",
      alt: "Hill road through pine forest",
    },
    {
      src: "https://images.unsplash.com/photo-1476231682828-58390fbb257b?w=600&q=85",
      alt: "Switchbacks on a mountain highway",
    },
  ],
  wide: {
    src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=85",
    alt: "Monsoon waterfall beside the road",
  },
};

export function JournalSpotlight() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-10 bg-background">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 h-[420px] md:h-[480px]">
            <div className="relative col-span-1 row-span-2 overflow-hidden rounded-sm">
              <Image
                src={gallery.tall.src}
                alt={gallery.tall.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </div>
            {gallery.top.map((item) => (
              <div key={item.src} className="relative overflow-hidden rounded-sm">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 25vw, 20vw"
                />
              </div>
            ))}
            <div className="relative col-span-2 overflow-hidden rounded-sm">
              <Image
                src={gallery.wide.src}
                alt={gallery.wide.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="lg:pl-4">
            <h2 className="font-serif-heading text-3xl md:text-4xl lg:text-[2.65rem] text-foreground leading-tight">
              Notes from the road, kept here
            </h2>
            <p className="mt-6 text-muted text-sm md:text-base leading-relaxed">
              This site is my riding logbook — fuel stops, pass days, monsoon detours, and the
              photos I didn&apos;t want buried in a camera roll.
            </p>
            <p className="mt-4 text-muted text-sm md:text-base leading-relaxed">
              Some entries are full trip reports; others are quick notes from the roadside. All of
              it is honest mileage, shared for anyone planning a similar route.
            </p>
            <Link href="/journeys" className="inline-block mt-8">
              <Button variant="primary" className="adventure-pill px-8">
                Read my journeys
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
