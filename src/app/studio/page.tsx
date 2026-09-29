import Link from "next/link";
import { StatCard } from "@/components/studio/StatCard";
import {
  getStudioDashboardStats,
  getStudioPhotos,
  getStudioStories,
} from "@/lib/data/studio-queries";
import { formatDate } from "@/lib/utils";

export default async function StudioDashboard() {
  const [stats, stories, photos] = await Promise.all([
    getStudioDashboardStats(),
    getStudioStories(),
    getStudioPhotos(),
  ]);

  const drafts = stories.filter((s) => s.status === "draft");
  const recent = stories.slice(0, 5);

  return (
    <div className="p-8 md:p-10 max-w-6xl">
      <h1 className="font-display text-3xl mb-2">Dashboard</h1>
      <p className="text-muted text-sm mb-10">Manage destinations, journeys, stories, photos, and more.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        <StatCard label="Trips" value={stats.totalTrips} />
        <StatCard label="Destinations" value={stats.totalDestinations} />
        <StatCard label="Stories" value={stats.totalStories} />
        <StatCard label="Photos" value={stats.totalPhotos} />
        <StatCard label="Published" value={stats.publishedPosts} />
        <StatCard label="Drafts" value={stats.draftPosts} sub="Awaiting publish" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">Recent Stories</h2>
            <Link href="/studio/stories" className="text-xs uppercase tracking-widest text-ocean hover:text-gold">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recent.map((story) => (
              <Link
                key={story.id}
                href={`/studio/stories/${story.slug}`}
                className="block p-4 border border-border hover:border-ocean transition-colors"
              >
                <p className="font-medium">{story.title}</p>
                <p className="text-xs text-muted mt-1">
                  {story.publishedAt ? formatDate(story.publishedAt) : "Draft"} · {story.status}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">Drafts</h2>
            <Link href="/studio/stories/new" className="text-xs uppercase tracking-widest text-ocean hover:text-gold">
              New Story
            </Link>
          </div>
          {drafts.length > 0 ? (
            <div className="space-y-3">
              {drafts.map((story) => (
                <Link
                  key={story.id}
                  href={`/studio/stories/${story.slug}`}
                  className="block p-4 border border-border hover:border-ocean transition-colors"
                >
                  <p className="font-medium">{story.title}</p>
                  <p className="text-xs text-muted mt-1">Draft</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm p-4 border border-border">No drafts — all caught up.</p>
          )}

          <h2 className="font-display text-xl mt-8 mb-4">Latest Photos</h2>
          <div className="grid grid-cols-4 gap-2">
            {photos.slice(0, 4).map((photo) => (
              <Link key={photo.id} href={`/studio/photos/${photo.id}`} className="aspect-square bg-muted-bg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="" className="w-full h-full object-cover" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
