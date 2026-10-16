import { Headphones, ShieldCheck, Compass } from "lucide-react";
import { Reveal } from "@/components/animation/Reveal";

const features = [
  {
    icon: ShieldCheck,
    title: "Tried and Trusted",
    body: "We have helped more than 20 million travelers find their perfect outdoor experience across every continent.",
  },
  {
    icon: Headphones,
    title: "Reliable Support",
    body: "Real people on phone, email, and chat — before, during, and after your trip, whenever you need us.",
  },
  {
    icon: Compass,
    title: "One-stop Travel Partner",
    body: "From route planning and stays to guides and gear — we cover the full journey so you can focus on the trail.",
  },
];

export function ChoosingUs() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-10 bg-muted-bg border-y border-border">
      <div className="max-w-7xl mx-auto text-center">
        <Reveal>
          <h2 className="font-serif-heading text-3xl md:text-4xl lg:text-[2.75rem] text-foreground">
            Reason For Choosing Us
          </h2>
        </Reveal>

        <div className="mt-14 md:mt-16 grid md:grid-cols-3 gap-10 md:gap-8">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center px-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-olive text-ink mb-6">
                  <feature.icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">
                  {feature.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
