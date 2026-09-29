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
    <div className="relative border-l border-border ml-3 md:ml-6 pl-8 md:pl-12 space-y-12 md:space-y-16">
      {entries.map((entry, i) => (
        <motion.article
          key={entry.id}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="group relative"
        >
          <span className="absolute -left-[2.45rem] md:-left-[3.45rem] top-2 w-3 h-3 rounded-full bg-sunset border-2 border-background" />

          <div className="grid md:grid-cols-12 gap-6 items-center">
            <p className="md:col-span-2 font-display text-4xl md:text-5xl font-bold text-sand dark:text-muted-bg leading-[1.2]">
              {entry.year}
            </p>

            <Link
              href={`/destinations/${entry.destinationSlug}`}
              className="md:col-span-4 relative aspect-[4/3] overflow-hidden block"
              data-cursor="view"
            >
              <Image
                src={entry.coverImage}
                alt={`${entry.city}, ${entry.country}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="300px"
              />
            </Link>

            <div className="md:col-span-6">
              <p className="travel-meta travel-meta-accent">{entry.city}</p>
              <h3 className="font-display text-2xl md:text-3xl font-bold leading-[1.25] mt-1 group-hover:text-forest dark:group-hover:text-gold transition-colors">
                <Link href={`/destinations/${entry.destinationSlug}`}>{entry.country}</Link>
              </h3>
              <p className="text-muted mt-3 leading-relaxed max-w-md">{entry.description}</p>
              <div className="flex gap-4 mt-4 travel-meta">
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
