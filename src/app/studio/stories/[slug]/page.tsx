import { notFound } from "next/navigation";
import { StoryEditor } from "@/components/studio/StoryEditor";
import { getStudioStory } from "@/lib/data/studio-queries";

interface EditStoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditStoryPage({ params }: EditStoryPageProps) {
  const { slug } = await params;
  const story = await getStudioStory(slug);
  if (!story) notFound();

  return (
    <div className="p-8 md:p-10 max-w-4xl">
      <h1 className="font-display text-3xl mb-8">Edit Story</h1>
      <StoryEditor initialStory={story} />
    </div>
  );
}
