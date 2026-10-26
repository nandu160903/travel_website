"use client";

import { cn } from "@/lib/utils";
import { NORMAD_IVORY, NORMAD_LIME } from "./normad-colors";
import { NormadSymbol, type NormadSymbolVariant } from "./NormadSymbol";

export type NormadLogoVariant =
  | "horizontal"
  | "header"
  | "symbol"
  | "monochrome"
  | "favicon";

export interface NormadLogoProps {
  variant?: NormadLogoVariant;
  className?: string;
  /** Route draw animation on the emblem (header / horizontal only) */
  animateRoute?: boolean;
}

function Wordmark({
  showTagline,
  monochrome,
}: {
  showTagline: boolean;
  monochrome?: boolean;
}) {
  const ink = monochrome ? "currentColor" : NORMAD_IVORY;
  const accent = monochrome ? "currentColor" : NORMAD_LIME;

  return (
    <span className="flex min-w-0 flex-col justify-center leading-none">
      <span
        className="font-[family-name:var(--font-space-grotesk)] text-[1.02rem] font-bold uppercase tracking-[0.08em] sm:text-[1.12rem]"
        style={{ color: ink }}
      >
        Normad
      </span>
      {showTagline ? (
        <span
          className="mt-1 font-[family-name:var(--font-space-grotesk)] text-[0.48rem] font-medium uppercase tracking-[0.42em] sm:text-[0.52rem]"
          style={{ color: accent }}
        >
          On two wheels
        </span>
      ) : null}
    </span>
  );
}

export function NormadLogo({
  variant = "header",
  className,
  animateRoute = false,
}: NormadLogoProps) {
  const symbolVariant: NormadSymbolVariant =
    variant === "monochrome"
      ? "monochrome"
      : variant === "favicon"
        ? "favicon"
        : "default";

  if (variant === "symbol" || variant === "favicon") {
    return (
      <NormadSymbol
        variant={symbolVariant}
        size={variant === "favicon" ? 32 : 40}
        animateRoute={animateRoute}
        className={className}
      />
    );
  }

  if (variant === "monochrome") {
    return (
      <span className={cn("inline-flex items-center gap-2.5 text-foreground", className)}>
        <NormadSymbol size={38} variant="monochrome" />
        <Wordmark showTagline={false} monochrome />
      </span>
    );
  }

  if (variant === "horizontal") {
    return (
      <span className={cn("inline-flex items-center gap-3 sm:gap-3.5", className)}>
        <NormadSymbol size={52} variant="default" animateRoute={animateRoute} />
        <Wordmark showTagline />
      </span>
    );
  }

  /* header — symbol-only on very small screens; wordmark without tagline */
  return (
    <span className={cn("inline-flex items-center gap-2 sm:gap-2.5", className)}>
      <NormadSymbol size={36} variant="default" animateRoute={animateRoute} />
      <span className="hidden min-[420px]:flex">
        <Wordmark showTagline={false} />
      </span>
    </span>
  );
}
