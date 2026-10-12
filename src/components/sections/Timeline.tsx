"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { TimelineEntry } from "@/types";

interface TimelineProps {
  entries: TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  return (
    <div className="relative border-l border-trail/30 ml-3 md:ml-6 pl-8 md:pl-12 space-y-12 md:space-y-20">
      {entries.map((entry, i) => (
        <motion.article
          key={entry.id}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.45 }}
          className="group relative"
        >
          <span className="absolute -left-[2.55rem] md:-left-[3.55rem] top-2 w-2.5 h-2.5 bg-trail border border-background rotate-45" />

          <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-center">
            <p className="md:col-span-2 font-display text-4xl md:text-5xl font-bold text-sand/80 leading-[0.9] tracking-tight">
              {entry.year}
            </p>

            <Link
              href={`/destinations/${entry.destinationSlug}`}
              className="md:col-span-4 relative aspect-[4/3] overflow-hidden image-editorial block"
              data-cursor="view"
            >
              <Image
                src={entry.coverImage}
                alt={`${entry.city}, ${entry.country}`}
                fill
                className="object-cover editorial-img"
                sizes="300px"
              />
            </Link>

            <div className="md:col-span-6">
              <p className="travel-meta travel-meta-accent">{entry.city}</p>
              <h3 className="font-display text-2xl md:text-3xl font-bold leading-[0.95] mt-2 uppercase tracking-tight group-hover:text-trail transition-colors duration-[var(--duration-micro)]">
                <Link href={`/destinations/${entry.destinationSlug}`}>{entry.country}</Link>
              </h3>
              <p className="text-muted mt-3 leading-relaxed max-w-md font-medium">{entry.description}</p>
              <div className="flex gap-6 mt-4 font-coords normal-case tracking-normal">
                <span>{entry.storyCount} stories</span>
                <span>{entry.photoCount} photos</span>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
