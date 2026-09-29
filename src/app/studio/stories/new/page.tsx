import { StoryEditor } from "@/components/studio/StoryEditor";

export default function NewStoryPage() {
  return (
    <div className="p-8 md:p-10 max-w-4xl">
      <h1 className="font-display text-3xl mb-8">New Story</h1>
      <StoryEditor />
    </div>
  );
}
