"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mountain } from "lucide-react";
import { Reveal } from "@/components/animation/Reveal";
import type { Destination } from "@/types";

interface WondersOfNatureProps {
  destinations: Destination[];
}

export function WondersOfNature({ destinations }: WondersOfNatureProps) {
  const cards = destinations.slice(0, 4);

  return (
    <section className="py-20 md:py-28 px-6 md:px-10 bg-background">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
            <div className="text-center md:text-left max-w-xl mx-auto md:mx-0">
              <h2 className="font-serif-heading text-3xl md:text-4xl lg:text-[2.75rem] text-foreground">
                The Wonders Of Nature
              </h2>
              <p className="mt-4 text-muted text-sm md:text-base leading-relaxed">
                We seek to provide the authentic content for traveler around the world.
              </p>
            </div>
            <Link
              href="/destinations"
              className="hidden md:flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-olive text-ink hover:bg-olive-dim transition-colors self-end"
              aria-label="View all destinations"
            >
              <ArrowRight size={20} strokeWidth={2} />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {cards.map((dest, i) => (
            <Reveal key={dest.id} delay={i * 0.08}>
              <Link
                href={`/destinations/${dest.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-sm"
              >
                <Image
                  src={dest.coverImage}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 adventure-card-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <div className="flex items-center gap-2 text-olive mb-2">
                    <Mountain size={14} strokeWidth={1.75} />
                    <span className="font-coords text-[0.6rem] text-tone-light/70">
                      {dest.region}
                    </span>
                  </div>
                  <h3 className="font-serif-heading text-xl text-tone-light">{dest.name}</h3>
                  <p className="mt-2 text-xs text-tone-light/65 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/destinations"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-olive text-ink"
            aria-label="View all destinations"
          >
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
