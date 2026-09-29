"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Story } from "@/types";
import { storyCategories } from "@/lib/config";

interface StoryCardProps {
  story: Story;
  size?: "default" | "large";
}

export function StoryCard({ story, size = "default" }: StoryCardProps) {
  const categoryLabel =
    storyCategories.find((c) => c.slug === story.category)?.label ?? story.category;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35 }}
      data-cursor="read"
      className="group"
    >
      <Link href={`/stories/${story.slug}`} className="block">
        <div className="relative overflow-hidden mb-5 aspect-[4/5] md:aspect-[3/4]">
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
            sizes={size === "large" ? "50vw" : "33vw"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-tone-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="space-y-2 border-l-2 border-transparent group-hover:border-sunset pl-0 group-hover:pl-4 transition-all duration-500">
          <p className="travel-meta">
            {story.cityName ? `${story.cityName.toUpperCase()} · ` : ""}
            {story.destinationName.toUpperCase()}
          </p>

          <h3
            className={`font-display font-bold leading-[1.25] group-hover:text-forest dark:group-hover:text-gold transition-colors break-words ${
              size === "large" ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
            }`}
          >
            {story.title}
          </h3>

          <p className="text-muted text-sm line-clamp-2 leading-relaxed">{story.excerpt}</p>

          <div className="flex items-center justify-between pt-2">
            <span className="travel-meta">
              {formatDate(story.publishedAt)} · {story.readingTime} min · {categoryLabel}
            </span>
            <ArrowUpRight
              size={16}
              className="text-muted group-hover:text-sunset group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
