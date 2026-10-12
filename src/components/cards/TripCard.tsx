"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { formatDate } from "@/lib/utils";
import type { Trip } from "@/types";

interface TripCardProps {
  trip: Trip;
  index?: number;
}

export function TripCard({ trip, index = 0 }: TripCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group border-b border-border pb-16 last:border-b-0"
      data-cursor="read"
    >
      <Link href={`/journeys#${trip.slug}`} className="grid md:grid-cols-12 gap-6 md:gap-10 items-start">
        <div className="md:col-span-5 relative aspect-[5/4] md:aspect-[4/5] overflow-hidden image-editorial">
          <Image
            src={trip.coverImage}
            alt={trip.title}
            fill
            className="object-cover editorial-img"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
        <div className="md:col-span-7 flex flex-col justify-center py-2 md:pl-4">
          <p className="travel-meta travel-meta-accent mb-3">
            Journey {String(index + 1).padStart(2, "0")} · {trip.country}
          </p>
          <h3 className="font-display text-3xl md:text-[2.75rem] leading-[0.95] uppercase tracking-tight group-hover:text-trail transition-colors duration-[var(--duration-micro)]">
            {trip.title}
          </h3>
          <p className="text-muted mt-4 leading-relaxed line-clamp-3 font-medium">{trip.description}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 font-coords normal-case tracking-normal">
            <span>
              {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
            </span>
            <span>{trip.storyCount} stories</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
