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
  const titleParts = title.split("\n").filter(Boolean);

  return (
    <Reveal className={cn("mb-10 md:mb-14", align === "center" && "text-center", className)}>
      {label && <p className="travel-meta travel-meta-accent mb-4">{label}</p>}
      <h2
        className={cn(
          "font-display font-bold flex flex-col gap-2 sm:gap-3",
          align === "center" ? "max-w-3xl mx-auto items-center" : "max-w-2xl"
        )}
      >
        {titleParts.map((part, i) => (
          <span
            key={i}
            className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.25] break-words"
          >
            {part}
          </span>
        ))}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-muted text-base md:text-lg leading-relaxed max-w-xl font-sans",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
      <div className={cn("editorial-rule mt-8 max-w-xs", align === "center" && "mx-auto")} />
    </Reveal>
  );
}
