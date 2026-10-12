"use client";

import Link from "next/link";
import { AnimatedCounter } from "@/components/animation/AnimatedCounter";
import { Reveal } from "@/components/animation/Reveal";

const stats = [
  { value: 6, label: "Countries" },
  { value: 18, label: "Cities" },
  { value: 126, label: "Days On Road" },
  { value: 8430, suffix: "+", label: "KM Travelled" },
  { value: 10, label: "Photos Published" },
  { value: 6, label: "Stories" },
];

const stamps = [
  { slug: "japan", name: "Japan", code: "JP" },
  { slug: "iceland", name: "Iceland", code: "IS" },
  { slug: "india", name: "India", code: "IN" },
  { slug: "bali", name: "Bali", code: "ID" },
  { slug: "singapore", name: "Singapore", code: "SG" },
  { slug: "italy", name: "Italy", code: "IT" },
];

export function TravelStats() {
  return (
    <section className="py-16 md:py-24 section-band">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <Reveal>
          <p className="travel-meta travel-meta-accent mb-3">Personal Passport</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-12 uppercase tracking-tight leading-[0.95]">
            Travel Archive
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-10 mb-16">
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>

        <Reveal>
          <p className="travel-meta mb-6">My Travel Passport</p>
          <div className="flex flex-wrap gap-4">
            {stamps.map((stamp) => (
              <Link
                key={stamp.slug}
                href={`/destinations/${stamp.slug}`}
                className="passport-stamp group w-[5.5rem] h-[5.5rem] md:w-24 md:h-24 flex flex-col items-center justify-center"
              >
                <span className="travel-meta text-trail">{stamp.code}</span>
                <span className="text-[11px] font-semibold text-foreground mt-1 group-hover:text-trail transition-colors duration-[var(--duration-micro)]">
                  {stamp.name}
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
