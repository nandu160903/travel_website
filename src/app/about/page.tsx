import Image from "next/image";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Reveal } from "@/components/animation/Reveal";
import { Timeline } from "@/components/sections/Timeline";
import { getSiteSettings, getTimeline, getAboutPage } from "@/lib/data/queries";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "About — Summit Journal",
  description: "The story behind the journeys. Who I am and what travel means to me.",
  path: "/about",
});

export default async function AboutPage() {
  const [settings, timeline, about] = await Promise.all([
    getSiteSettings(),
    getTimeline(),
    getAboutPage(),
  ]);

  const headlineLines = about.headline.split("\n");

  return (
    <PublicLayout>
      <section className="pt-32 pb-16 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-12">
          <p className="font-coords text-olive mb-4">About me</p>
          <h1 className="font-serif-heading text-4xl md:text-5xl lg:text-[3.25rem] leading-tight">
            {headlineLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-5 text-muted leading-relaxed">{about.subtitle || settings.bio}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start mt-8">
          <Reveal>
            <div className="relative aspect-[3/4] max-w-md overflow-hidden rounded-sm">
              <Image
                src={settings.profilePhoto}
                alt="Profile"
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="space-y-12">
              {about.sections.map((section) => (
                <div key={section.title}>
                  <h3 className="font-display text-xl md:text-2xl mb-3 uppercase tracking-tight leading-tight">
                    {section.title}
                  </h3>
                  <p className="text-muted leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 bg-muted-bg border-y border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <h2 className="font-serif-heading text-3xl mb-10 text-center">Places I&apos;ve Been</h2>
          <Timeline entries={timeline.slice(0, 4)} />
        </div>
      </section>
    </PublicLayout>
  );
}
