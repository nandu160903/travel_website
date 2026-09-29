"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { PublishStatus, Video } from "@/types";
import { studioInputClass, studioLabelClass } from "./form-styles";

interface VideoEditorProps {
  initial?: Video;
}

export function VideoEditor({ initial }: VideoEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [embedUrl, setEmbedUrl] = useState(initial?.embedUrl ?? "");
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [destinationSlug, setDestinationSlug] = useState(initial?.destinationSlug ?? "");
  const [status, setStatus] = useState<PublishStatus>(initial?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/studio/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initial?.id,
          title,
          url,
          embedUrl,
          thumbnail,
          duration,
          location,
          destinationSlug,
          status,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }
      router.push("/studio/videos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!initial || !confirm("Delete this video?")) return;
    const res = await fetch(`/api/studio/videos?id=${encodeURIComponent(initial.id)}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/studio/videos");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className={studioLabelClass}>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={studioInputClass} />
      </div>
      <div>
        <label className={studioLabelClass}>Video URL</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} className={studioInputClass} />
      </div>
      <div>
        <label className={studioLabelClass}>Embed URL (YouTube/Vimeo)</label>
        <input value={embedUrl} onChange={(e) => setEmbedUrl(e.target.value)} className={studioInputClass} />
      </div>
      <div>
        <label className={studioLabelClass}>Thumbnail URL</label>
        <input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className={studioInputClass} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={studioLabelClass}>Duration</label>
          <input value={duration} onChange={(e) => setDuration(e.target.value)} className={studioInputClass} placeholder="4:32" />
        </div>
        <div>
          <label className={studioLabelClass}>Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className={studioInputClass} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={studioLabelClass}>Destination Slug</label>
          <input value={destinationSlug} onChange={(e) => setDestinationSlug(e.target.value)} className={studioInputClass} />
        </div>
        <div>
          <label className={studioLabelClass}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as PublishStatus)} className={studioInputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-sunset">{error}</p>}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button onClick={save} disabled={saving || !title || !url}>{saving ? "Saving..." : "Save Video"}</Button>
        {initial && <Button variant="ghost" onClick={remove} className="text-sunset">Delete</Button>}
      </div>
    </div>
  );
}
