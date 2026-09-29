import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  label,
  title,
  subtitle,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <Reveal className={cn("mb-12 md:mb-16", align === "center" && "text-center", className)}>
      {label && (
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-4">{label}</p>
      )}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight whitespace-pre-line">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-muted text-lg max-w-xl leading-relaxed">{subtitle}</p>
      )}
    </Reveal>
  );
}
