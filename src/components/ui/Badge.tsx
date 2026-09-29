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
        "inline-block travel-meta px-2 py-1",
        variant === "default" && "text-muted border border-border",
        variant === "accent" && "text-sunset border border-sunset/30",
        variant === "muted" && "text-muted bg-muted-bg",
        className
      )}
    >
      {children}
    </span>
  );
}
