"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { storyCategories } from "@/lib/config";
import { cn } from "@/lib/utils";

interface StoriesFilterProps {
  activeCategory?: string;
}

export function StoriesFilter({ activeCategory }: StoriesFilterProps) {
  const filters = [{ slug: undefined, label: "All" }, ...storyCategories];

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {filters.map((cat) => {
        const isActive =
          (!activeCategory && !cat.slug) || activeCategory === cat.slug;
        const href = cat.slug ? `/stories?category=${cat.slug}` : "/stories";

        return (
          <Link key={cat.label} href={href} className="relative">
            {isActive && (
              <motion.div
                layoutId="story-filter"
                className="absolute inset-0 bg-ocean"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={cn(
                "relative block px-4 py-2 text-[10px] uppercase tracking-widest transition-colors",
                isActive ? "text-white" : "text-muted hover:text-foreground border border-border"
              )}
            >
              {cat.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
