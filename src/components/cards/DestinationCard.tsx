"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Destination } from "@/types";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
  destination: Destination;
  size?: "small" | "medium" | "large";
  className?: string;
}

export function DestinationCard({
  destination,
  size = "medium",
  className,
}: DestinationCardProps) {
  const sizeClasses = {
    small: "min-h-[240px]",
    medium: "min-h-[320px]",
    large: "min-h-[400px] md:min-h-[480px]",
  };

  return (
    <motion.article
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      data-cursor="view"
      className={cn("group relative overflow-hidden image-editorial", sizeClasses[size], className)}
    >
      <Link href={`/destinations/${destination.slug}`} className="block absolute inset-0">
        <Image
          src={destination.coverImage}
          alt={destination.name}
          fill
          className="object-cover editorial-img"
          sizes={size === "large" ? "70vw" : "40vw"}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-tone-dark/80 via-tone-dark/10 to-transparent" />

        <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-between">
          <p className="travel-meta text-tone-light/50 self-start">
            {destination.region ?? destination.country}
          </p>

          <div>
            <div className="flex items-end justify-between gap-4">
              <h3
                className={cn(
                  "font-display font-bold text-tone-light leading-[0.95] transition-transform duration-[var(--duration-standard)] group-hover:translate-x-1 break-words uppercase tracking-tight",
                  size === "large"
                    ? "text-2xl md:text-4xl lg:text-5xl"
                    : size === "medium"
                      ? "text-xl md:text-2xl lg:text-3xl"
                      : "text-lg md:text-xl"
                )}
              >
                {destination.name}
              </h3>
              <ArrowUpRight
                size={18}
                strokeWidth={1.5}
                className="text-tone-light/50 shrink-0 transition-all duration-[var(--duration-micro)] group-hover:text-trail group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
            <p className="font-coords text-tone-light/45 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-standard)]">
              {destination.storyCount} stories · {destination.photoCount} photos
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
