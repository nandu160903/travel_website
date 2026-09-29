import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "muted";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block text-[10px] uppercase tracking-[0.2em] font-medium px-3 py-1",
        variant === "default" && "text-muted border border-border",
        variant === "accent" && "text-ocean border border-ocean/30 bg-ocean/5",
        variant === "muted" && "text-muted bg-muted-bg",
        className
      )}
    >
      {children}
    </span>
  );
}
