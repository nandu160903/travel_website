import Link from "next/link";
import { getStories } from "@/lib/data/queries";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function StudioStoriesPage() {
  const stories = await getStories();

  return (
    <div className="p-8 md:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Stories</h1>
          <p className="text-muted text-sm mt-1">{stories.length} total</p>
        </div>
        <Link href="/studio/stories/new">
          <Button size="sm">New Story</Button>
        </Link>
      </div>

      <div className="space-y-2">
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex items-center justify-between p-4 border border-border hover:border-ocean transition-colors group"
          >
            <Link href={`/studio/stories/${story.slug}`} className="flex-1 min-w-0">
              <p className="font-medium group-hover:text-ocean transition-colors">{story.title}</p>
              <p className="text-xs text-muted mt-1">
                {story.destinationName} · {formatDate(story.publishedAt)}
              </p>
            </Link>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <Badge variant={story.status === "published" ? "accent" : "muted"}>
                {story.status}
              </Badge>
              <a
                href={`/stories/${story.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-widest text-muted hover:text-ocean"
              >
                Preview
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
