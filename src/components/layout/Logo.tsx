"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { BrandWordmark } from "./BrandWordmark";

interface LogoProps {
  siteTitle?: string;
  className?: string;
  onSecretActivate?: () => void;
  light?: boolean;
  monogram?: boolean;
  wordmark?: boolean;
}

function parseBrandTitle(siteTitle: string) {
  const match = siteTitle.match(/^(.+?)\s+on\s+(.+)$/i);
  if (match) {
    return { name: match[1].trim(), tagline: `on ${match[2].trim()}` };
  }
  return { name: siteTitle.trim(), tagline: null };
}

export function Logo({
  siteTitle = "Horizon",
  className,
  onSecretActivate,
  light,
  monogram = false,
  wordmark = false,
}: LogoProps) {
  const clickTimestamps = useRef<number[]>([]);
  const { name, tagline } = parseBrandTitle(siteTitle);
  const letter = siteTitle.trim().charAt(0).toUpperCase() || "N";

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!onSecretActivate) return;

      const now = Date.now();
      clickTimestamps.current = clickTimestamps.current.filter((t) => now - t < 2000);
      clickTimestamps.current.push(now);

      if (clickTimestamps.current.length >= 5) {
        e.preventDefault();
        clickTimestamps.current = [];
        onSecretActivate();
      }
    },
    [onSecretActivate]
  );

  const colorPrimary = light ? "text-tone-light" : "text-foreground";

  return (
    <Link
      href="/"
      onClick={handleClick}
      className={cn(
        "group select-none transition-opacity duration-[var(--duration-micro)] shrink-0 max-w-[min(100%,13.5rem)] sm:max-w-[15rem] hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive",
        className
      )}
      aria-label={siteTitle}
    >
      {wordmark && tagline ? (
        <BrandWordmark name={name} tagline={tagline} light={light} />
      ) : monogram ? (
        <span
          className={cn(
            "font-display text-xl md:text-2xl font-bold italic tracking-tight",
            colorPrimary
          )}
        >
          {letter}
        </span>
      ) : (
        <span
          className={cn(
            "font-display text-lg md:text-xl font-bold tracking-tight uppercase",
            colorPrimary
          )}
        >
          {siteTitle}
        </span>
      )}
    </Link>
  );
}
