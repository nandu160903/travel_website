import { getVideos } from "@/lib/data/queries";
import { Button } from "@/components/ui/Button";

export default async function StudioVideosPage() {
  const videos = await getVideos();

  return (
    <div className="p-8 md:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Videos</h1>
        <Button size="sm">Add Video</Button>
      </div>
      <div className="space-y-3">
        {videos.map((video) => (
          <div key={video.id} className="flex items-center gap-4 p-4 border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={video.thumbnail} alt="" className="w-24 h-14 object-cover" />
            <div>
              <p className="font-medium">{video.title}</p>
              <p className="text-xs text-muted">{video.location} · {video.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
