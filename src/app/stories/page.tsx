import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/animation/SectionHeading";
import { StoryCard } from "@/components/cards/StoryCard";
import { StoriesFilter } from "@/components/stories/StoriesFilter";
import { getStories } from "@/lib/data/queries";
import { createMetadata } from "@/lib/seo/metadata";
import type { StoryCategory } from "@/types";

export const metadata = createMetadata({
  title: "Stories — Horizon Journal",
  description: "Travel stories from journeys around the world.",
  path: "/stories",
});

interface StoriesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const { category } = await searchParams;
  const stories = await getStories(category as StoryCategory | undefined);

  return (
    <PublicLayout>
      <section className="pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
        <SectionHeading
          label="Journal"
          title="Travel Stories"
          subtitle="Narratives from the road — demo content, ready to replace."
        />
        <StoriesFilter activeCategory={category} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-12">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
        {stories.length === 0 && (
          <p className="text-center text-muted py-20">
            No stories in this category yet.
          </p>
        )}
      </section>
    </PublicLayout>
  );
}
