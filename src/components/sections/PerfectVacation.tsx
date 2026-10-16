import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";
import { Button } from "@/components/ui/Button";

const gallery = {
  tall: {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=85",
    alt: "Mountain valley",
  },
  top: [
    {
      src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=85",
      alt: "Forest path",
    },
    {
      src: "https://images.unsplash.com/photo-1476231682828-58390fbb257b?w=600&q=85",
      alt: "Winding road",
    },
  ],
  wide: {
    src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=85",
    alt: "Waterfall cave",
  },
};

export function PerfectVacation() {
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
              Here&apos;s makes a vacation perfect for you!
            </h2>
            <p className="mt-6 text-muted text-sm md:text-base leading-relaxed">
              Whether you are planning a family trek, a pet-friendly lakeside retreat, or a
              remote mountain cabin, we match you with routes and stays that fit how you travel.
            </p>
            <p className="mt-4 text-muted text-sm md:text-base leading-relaxed">
              Every itinerary is built from real field notes — seasons, trail conditions, and
              local guides included — so your time outdoors feels effortless and unforgettable.
            </p>
            <Link href="/journeys" className="inline-block mt-8">
              <Button variant="primary" className="adventure-pill px-8">
                My Journeys
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
