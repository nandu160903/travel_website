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
      whileHover={{ y: -3 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      data-cursor="view"
      className={cn("group relative overflow-hidden", sizeClasses[size], className)}
    >
      <Link href={`/destinations/${destination.slug}`} className="block absolute inset-0">
        <Image
          src={destination.coverImage}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
          sizes={size === "large" ? "70vw" : "40vw"}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-tone-dark/75 via-tone-dark/15 to-transparent" />

        <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-between">
          <p className="travel-meta text-tone-light/55 self-start">
            {destination.region ?? destination.country}
          </p>

          <div>
            <div className="flex items-end justify-between gap-4">
              <h3
                className={cn(
                  "font-display font-bold text-tone-light leading-[1.2] transition-transform duration-500 group-hover:translate-x-1 break-words",
                  size === "large" ? "text-3xl md:text-5xl" : size === "medium" ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                )}
              >
                {destination.name}
              </h3>
              <ArrowUpRight
                size={20}
                className="text-tone-light/60 shrink-0 transition-all duration-300 group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
            <p className="text-tone-light/60 text-sm mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {destination.storyCount} stories · {destination.photoCount} photos
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
