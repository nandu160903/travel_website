import Image from "next/image";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/animation/SectionHeading";
import { Reveal } from "@/components/animation/Reveal";
import { Timeline } from "@/components/sections/Timeline";
import { getSiteSettings, getTimeline } from "@/lib/data/queries";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "About — Horizon Journal",
  description: "The story behind the journeys. Who I am and what travel means to me.",
  path: "/about",
});

const sections = [
  {
    title: "Who I Am",
    content:
      "I'm a traveler who believes the best stories aren't found in guidebooks — they're discovered in alleyways, train stations, and conversations with strangers. This site is my digital passport, a living archive of everywhere the road has taken me. (Demo content — replace with your story.)",
  },
  {
    title: "My Relationship with Travel",
    content:
      "Travel isn't escape for me — it's engagement. Every journey is an invitation to see differently, to question assumptions, and to collect moments that reshape how I understand the world.",
  },
  {
    title: "What Travel Means to Me",
    content:
      "It means patience at a temple gate. It means getting lost on purpose. It means the photograph that almost wasn't taken, and the meal shared with someone whose language you don't speak.",
  },
  {
    title: "Places That Changed Me",
    content:
      "Kyoto taught me silence. Iceland taught me scale. Bali taught me slowness. India taught me color. Each place left something behind — a habit, a perspective, a way of seeing.",
  },
  {
    title: "Things I Always Carry",
    content:
      "A notebook. A camera. An open schedule. Comfortable shoes. And the willingness to change plans when something unexpected appears on the horizon.",
  },
  {
    title: "How I Document My Journeys",
    content:
      "Photographs for the visual memory. Notes for the details I'd otherwise forget. Stories for the meaning behind the moments. This website is where it all comes together.",
  },
];

export default async function AboutPage() {
  const [settings, timeline] = await Promise.all([
    getSiteSettings(),
    getTimeline(),
  ]);

  return (
    <PublicLayout>
      <section className="pt-32 pb-16 px-6 md:px-8 max-w-7xl mx-auto">
        <SectionHeading
          label="About the Traveler"
          title={"I Don't Collect\nSouvenirs.\nI Collect Stories."}
          subtitle={settings.bio}
        />

        <div className="grid md:grid-cols-2 gap-12 items-start mt-8">
          <Reveal>
            <div className="relative aspect-[3/4] max-w-md overflow-hidden">
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
              {sections.map((section) => (
                <div key={section.title}>
                  <h3 className="font-display text-2xl mb-3">{section.title}</h3>
                  <p className="text-muted leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 bg-muted-bg/40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeading label="Timeline" title="Places I've Been" />
          <Timeline entries={timeline.slice(0, 4)} />
        </div>
      </section>
    </PublicLayout>
  );
}
