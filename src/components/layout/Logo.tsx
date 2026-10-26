"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { NormadLogo } from "@/components/brand/NormadLogo";

interface LogoProps {
  siteTitle?: string;
  className?: string;
  onSecretActivate?: () => void;
  light?: boolean;
  monogram?: boolean;
  wordmark?: boolean;
}

export function Logo({
  siteTitle = "Normad on two wheels",
  className,
  onSecretActivate,
  light: _light,
  monogram = false,
  wordmark: _wordmark = false,
}: LogoProps) {
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
        "group select-none transition-opacity duration-[var(--duration-micro)] shrink-0 max-w-[min(100%,11rem)] min-[420px]:max-w-[14rem] hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive",
        className
      )}
      aria-label={siteTitle}
    >
      {monogram ? (
        <NormadLogo variant="symbol" animateRoute={false} />
      ) : (
        <NormadLogo variant="header" animateRoute />
      )}
    </Link>
  );
}
