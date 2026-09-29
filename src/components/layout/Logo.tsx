"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  siteTitle?: string;
  className?: string;
  onSecretActivate?: () => void;
}

export function Logo({ siteTitle = "Horizon", className, onSecretActivate }: LogoProps) {
  const clickTimestamps = useRef<number[]>([]);

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

  return (
    <Link
      href="/"
      onClick={handleClick}
      className={cn(
        "font-display text-xl md:text-2xl tracking-tight text-foreground hover:opacity-80 transition-opacity select-none",
        className
      )}
    >
      {siteTitle}
    </Link>
  );
}
