import Link from "next/link";
import { getStudioVideos } from "@/lib/data/studio-queries";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function StudioVideosPage() {
  const videos = await getStudioVideos();

  return (
    <div className="p-8 md:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Videos</h1>
        <Link href="/studio/videos/new">
          <Button size="sm">Add Video</Button>
        </Link>
      </div>
      <div className="space-y-3">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/studio/videos/${video.id}`}
            className="flex items-center gap-4 p-4 border border-border hover:border-ocean transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={video.thumbnail} alt="" className="w-24 h-14 object-cover" />
            <div className="flex-1">
              <p className="font-medium">{video.title}</p>
              <p className="text-xs text-muted">{video.location} · {video.duration}</p>
            </div>
            <Badge variant="muted">{video.status}</Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
