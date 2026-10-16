"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animation/Reveal";

const hotspots = [
  {
    id: "canopy",
    label: "Old-growth canopy",
    body: "Centuries of moss, filtered light, and quiet — the kind of forest that slows your pace naturally.",
    x: 58,
    y: 32,
  },
  {
    id: "stream",
    label: "Hidden stream",
    body: "A clear ribbon of water cutting through ferns — ideal for a mid-hike pause and refill.",
    x: 72,
    y: 55,
  },
  {
    id: "ridge",
    label: "Ridge overlook",
    body: "Break through the tree line for wide views and the first breath of alpine air.",
    x: 48,
    y: 68,
  },
];

export function ExploreNature() {
  const [active, setActive] = useState(hotspots[0].id);
  const activeSpot = hotspots.find((h) => h.id === active) ?? hotspots[0];

  return (
    <section className="py-20 md:py-28 px-6 md:px-10 bg-muted-bg">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-10 md:mb-14">
            <h2 className="font-serif-heading text-3xl md:text-4xl lg:text-[2.75rem] text-foreground">
              Explore The Nature With Us
            </h2>
            <div className="mx-auto mt-4 h-0.5 w-12 bg-olive" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative aspect-[16/9] md:aspect-[21/9] min-h-[320px] overflow-hidden rounded-sm">
            <Image
              src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=2000&q=85"
              alt="Dense forest"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/25" />

            <div
              className="absolute border-2 border-olive/90 pointer-events-none hidden md:block"
              style={{
                left: "42%",
                top: "18%",
                width: "38%",
                height: "62%",
              }}
            />

            <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 max-w-[240px] md:max-w-xs z-10">
              {hotspots.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setActive(spot.id)}
                  className={cn(
                    "text-left rounded-md px-4 py-3 backdrop-blur-md border transition-colors",
                    active === spot.id
                      ? "bg-black/55 border-olive/60 text-tone-light"
                      : "bg-black/35 border-tone-light/10 text-tone-light/70 hover:border-tone-light/25"
                  )}
                >
                  <p className="text-xs font-semibold">{spot.label}</p>
                  {active === spot.id && (
                    <p className="mt-1.5 text-[0.7rem] leading-relaxed text-tone-light/75">
                      {spot.body}
                    </p>
                  )}
                </button>
              ))}
            </div>

            {hotspots.map((spot) => (
              <button
                key={`dot-${spot.id}`}
                type="button"
                onClick={() => setActive(spot.id)}
                className="absolute z-10 group"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                aria-label={spot.label}
              >
                <span
                  className={cn(
                    "block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-tone-light shadow-lg transition-transform",
                    active === spot.id
                      ? "bg-olive scale-125"
                      : "bg-tone-light/90 group-hover:scale-110"
                  )}
                />
              </button>
            ))}

            <div className="md:hidden absolute bottom-4 left-4 right-4 rounded-md bg-black/60 backdrop-blur-md border border-border p-4">
              <p className="text-sm font-semibold text-tone-light">{activeSpot.label}</p>
              <p className="mt-1 text-xs text-tone-light/75 leading-relaxed">{activeSpot.body}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
