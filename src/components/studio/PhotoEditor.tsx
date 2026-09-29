"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { Photo } from "@/types";
import { studioInputClass, studioLabelClass } from "./form-styles";

interface PhotoEditorProps {
  initial?: Photo;
}

export function PhotoEditor({ initial }: PhotoEditorProps) {
  const router = useRouter();
  const [url, setUrl] = useState(initial?.url ?? "");
  const [caption, setCaption] = useState(initial?.caption ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [destinationSlug, setDestinationSlug] = useState(initial?.destinationSlug ?? "");
  const [takenAt, setTakenAt] = useState(initial?.takenAt ?? "");
  const [camera, setCamera] = useState(initial?.camera ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/studio/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initial?.id,
          url,
          caption,
          location,
          destinationSlug,
          takenAt,
          camera,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }
      router.push("/studio/photos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!initial || !confirm("Delete this photo?")) return;
    const res = await fetch(`/api/studio/photos?id=${encodeURIComponent(initial.id)}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/studio/photos");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className={studioLabelClass}>Image URL</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} className={studioInputClass} placeholder="https://..." required />
      </div>
      <div>
        <label className={studioLabelClass}>Caption</label>
        <input value={caption} onChange={(e) => setCaption(e.target.value)} className={studioInputClass} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={studioLabelClass}>Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className={studioInputClass} />
        </div>
        <div>
          <label className={studioLabelClass}>Destination Slug</label>
          <input value={destinationSlug} onChange={(e) => setDestinationSlug(e.target.value)} className={studioInputClass} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={studioLabelClass}>Date Taken</label>
          <input type="date" value={takenAt} onChange={(e) => setTakenAt(e.target.value)} className={studioInputClass} />
        </div>
        <div>
          <label className={studioLabelClass}>Camera</label>
          <input value={camera} onChange={(e) => setCamera(e.target.value)} className={studioInputClass} />
        </div>
      </div>
      {url && (
        <div className="relative aspect-[4/3] max-w-md overflow-hidden border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={caption || "Preview"} className="w-full h-full object-cover" />
        </div>
      )}
      {error && <p className="text-sm text-sunset">{error}</p>}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button onClick={save} disabled={saving || !url}>{saving ? "Saving..." : "Save Photo"}</Button>
        {initial && <Button variant="ghost" onClick={remove} className="text-sunset">Delete</Button>}
      </div>
    </div>
  );
}
