import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/animation/SectionHeading";
import { VideoCard } from "@/components/cards/VideoCard";
import { VideoPlayer } from "@/components/videos/VideoPlayer";
import { getVideos } from "@/lib/data/queries";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Videos — Horizon Journal",
  description: "Travel videos and cinematic journey films.",
  path: "/videos",
});

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <PublicLayout>
      <section className="pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
        <SectionHeading
          label="Cinema"
          title="Video Stories"
          subtitle="Moving images from the road — demo embeds."
        />

        {videos.length > 0 && videos[0].embedUrl && (
          <div className="mb-16" id={videos[0].id}>
            <VideoPlayer
              embedUrl={videos[0].embedUrl}
              title={videos[0].title}
              thumbnail={videos[0].thumbnail}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {videos.map((video) => (
            <div key={video.id} id={video.id}>
              <VideoCard video={video} />
            </div>
          ))}
        </div>

        {videos.length === 0 && (
          <p className="text-center text-muted py-20">No videos yet.</p>
        )}
      </section>
    </PublicLayout>
  );
}
