import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { StoryContent } from "@/components/stories/StoryContent";
import { ShareButtons } from "@/components/stories/ShareButtons";
import { StoryCard } from "@/components/cards/StoryCard";
import { Badge } from "@/components/ui/Badge";
import {
  getStory,
  getRelatedStories,
  getSiteSettings,
} from "@/lib/data/queries";
import { formatDate, formatCoordinates, absoluteUrl } from "@/lib/utils";
import { createMetadata, storyJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata";
import { getSocialLinks } from "@/lib/config";

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return {};

  return createMetadata({
    title: story.seoTitle ?? `${story.title} — Horizon Journal`,
    description: story.seoDescription ?? story.excerpt,
    path: `/stories/${story.slug}`,
    image: story.ogImage ?? story.coverImage,
    type: "article",
    publishedTime: story.publishedAt,
  });
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();

  const [related, settings] = await Promise.all([
    getRelatedStories(story),
    getSiteSettings(),
  ]);

  const socialLinks =
    settings.socialLinks.length > 0 ? settings.socialLinks : getSocialLinks();
  const shareUrl = absoluteUrl(`/stories/${story.slug}`);

  const jsonLd = [
    storyJsonLd(story),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Stories", url: "/stories" },
      { name: story.title, url: `/stories/${story.slug}` },
    ]),
  ];

  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <div className="relative h-[60vh] md:h-[75vh] overflow-hidden">
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-tone-dark/20 to-transparent" />
        </div>

        <header className="max-w-4xl mx-auto px-6 md:px-8 -mt-20 relative z-10">
          <Badge variant="accent">
            {story.cityName ? `${story.cityName.toUpperCase()} · ` : ""}
            {story.destinationName.toUpperCase()} · {formatDate(story.publishedAt).toUpperCase()}
          </Badge>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] mt-6 tracking-tight">
            {story.title.split(" ").slice(0, Math.ceil(story.title.split(" ").length / 2)).join(" ")}
            <br />
            {story.title.split(" ").slice(Math.ceil(story.title.split(" ").length / 2)).join(" ")}
          </h1>
          <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-muted">
            <span>{story.readingTime} min read</span>
            {story.location && (
              <span className="text-[10px] uppercase tracking-widest">
                {formatCoordinates(story.location.lat, story.location.lng)}
              </span>
            )}
          </div>
          <div className="mt-6 pb-8 border-b border-border">
            <ShareButtons url={shareUrl} title={story.title} socialLinks={socialLinks} />
          </div>
        </header>

        <StoryContent html={story.content} />

        {story.gallery && story.gallery.length > 0 && (
          <section className="max-w-5xl mx-auto px-6 md:px-8 py-12">
            <div className="grid md:grid-cols-2 gap-4">
              {story.gallery.map((img, i) => (
                <div key={i} className={`relative overflow-hidden ${i === 0 ? "md:col-span-2 aspect-[21/9]" : "aspect-[4/3]"}`}>
                  <Image src={img} alt="" fill className="object-cover" sizes="50vw" />
                </div>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 md:px-8 py-24 border-t border-border">
            <h2 className="font-display text-3xl mb-10">Related Stories</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          </section>
        )}
      </article>
    </PublicLayout>
  );
}
