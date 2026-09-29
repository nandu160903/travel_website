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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group"
      data-cursor="read"
    >
      <Link href={`/journeys#${trip.slug}`} className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        <div className="relative w-full md:w-72 aspect-[4/3] overflow-hidden shrink-0">
          <Image
            src={trip.coverImage}
            alt={trip.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="300px"
          />
        </div>
        <div className="flex-1 py-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
            Journey {String(index + 1).padStart(2, "0")} · {trip.country}
          </p>
          <h3 className="font-display text-3xl md:text-4xl group-hover:text-ocean transition-colors">
            {trip.title}
          </h3>
          <p className="text-muted mt-3 leading-relaxed line-clamp-2">{trip.description}</p>
          <div className="flex gap-4 mt-4 text-[10px] uppercase tracking-widest text-muted">
            <span>{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
            <span>{trip.storyCount} stories</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
