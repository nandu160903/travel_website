import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  index?: string;
}

export function SectionHeading({
  label,
  title,
  subtitle,
  className,
  align = "left",
  index,
}: SectionHeadingProps) {
  const titleParts = title.split("\n").filter(Boolean);

  return (
    <Reveal className={cn("mb-10 md:mb-14", align === "center" && "text-center", className)}>
      <div
        className={cn(
          "flex items-start gap-4 mb-4",
          align === "center" && "justify-center"
        )}
      >
        {index && (
          <span className="font-coords text-trail/80 shrink-0 pt-1">{index}</span>
        )}
        {label && (
          <p className="travel-meta travel-meta-accent">{label}</p>
        )}
      </div>
      <h2
        className={cn(
          "font-display font-bold flex flex-col gap-1 sm:gap-2",
          align === "center" ? "max-w-3xl mx-auto items-center" : "max-w-3xl"
        )}
      >
        {titleParts.map((part, i) => (
          <span
            key={i}
            className="block text-[clamp(1.75rem,4vw,3.5rem)] leading-[0.95] break-words uppercase tracking-tight"
          >
            {part}
          </span>
        ))}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-muted text-base md:text-lg leading-relaxed max-w-xl font-sans font-medium",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          "editorial-rule-gradient mt-8 max-w-[12rem]",
          align === "center" && "mx-auto"
        )}
      />
    </Reveal>
  );
}
