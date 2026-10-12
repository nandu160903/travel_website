"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "glass";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] hover:bg-[var(--btn-primary-hover)] border border-[var(--btn-primary-bg)] hover:border-[var(--btn-primary-hover)]",
  secondary:
    "bg-trail text-paper hover:bg-trail/90 border border-trail",
  ghost:
    "bg-transparent text-foreground hover:bg-muted-bg border border-transparent",
  outline:
    "bg-transparent text-foreground border border-border hover:border-trail hover:text-trail",
  glass:
    "bg-card/90 text-foreground border border-border hover:bg-surface-elevated",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs tracking-wide",
  md: "px-6 py-3 text-sm tracking-wide",
  lg: "px-8 py-3.5 text-sm tracking-wide",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-[background-color,border-color,color,transform] duration-[var(--duration-micro)] ease-[var(--ease-out-editorial)] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-trail",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
);

Button.displayName = "Button";
