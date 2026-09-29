"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { TimelineEntry } from "@/types";
import { Reveal } from "@/components/animation/Reveal";

interface TimelineProps {
  entries: TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  return (
    <div className="relative">
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

      <div className="space-y-16 md:space-y-24">
        {entries.map((entry, i) => (
          <Reveal key={entry.id} delay={i * 0.1}>
            <div
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <Link
                href={`/destinations/${entry.destinationSlug}`}
                className="group relative w-full md:w-1/2 aspect-[4/3] overflow-hidden"
                data-cursor="view"
              >
                <Image
                  src={entry.coverImage}
                  alt={`${entry.city}, ${entry.country}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors" />
              </Link>

              <div className="w-full md:w-1/2 text-center md:text-left">
                <p className="font-display text-6xl md:text-8xl text-sand dark:text-muted-bg leading-none">
                  {entry.year}
                </p>
                <h3 className="font-display text-3xl md:text-4xl mt-2 group-hover:text-ocean">
                  <Link href={`/destinations/${entry.destinationSlug}`}>
                    {entry.country}
                  </Link>
                </h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-ocean mt-1">
                  {entry.city}
                </p>
                <p className="text-muted mt-4 leading-relaxed max-w-sm mx-auto md:mx-0">
                  {entry.description}
                </p>
                <div className="flex gap-4 mt-4 justify-center md:justify-start text-[10px] uppercase tracking-widest text-muted">
                  <span>{entry.storyCount} stories</span>
                  <span>{entry.photoCount} photos</span>
                </div>
              </div>
            </div>

            {i < entries.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="flex justify-center my-8 md:my-12"
              >
                <span className="text-muted text-2xl">↓</span>
              </motion.div>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  );
}
