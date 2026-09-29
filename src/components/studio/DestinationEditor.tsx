"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils";
import type { Destination, PublishStatus } from "@/types";
import { studioInputClass, studioLabelClass } from "./form-styles";

interface DestinationEditorProps {
  initial?: Destination;
}

export function DestinationEditor({ initial }: DestinationEditorProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [country, setCountry] = useState(initial?.country ?? "");
  const [region, setRegion] = useState(initial?.region ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [status, setStatus] = useState<PublishStatus>(initial?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (value: string) => {
    setName(value);
    if (!initial) setSlug(slugify(value));
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/studio/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name,
          country,
          region,
          description,
          coverImage,
          featured,
          status,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }
      router.push("/studio/destinations");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!initial || !confirm("Delete this destination?")) return;
    const res = await fetch(`/api/studio/destinations?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/studio/destinations");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={studioLabelClass}>Name</label>
          <input value={name} onChange={(e) => handleNameChange(e.target.value)} className={studioInputClass} />
        </div>
        <div>
          <label className={studioLabelClass}>Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} className={studioInputClass} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={studioLabelClass}>Country</label>
          <input value={country} onChange={(e) => setCountry(e.target.value)} className={studioInputClass} />
        </div>
        <div>
          <label className={studioLabelClass}>Region</label>
          <input value={region} onChange={(e) => setRegion(e.target.value)} className={studioInputClass} />
        </div>
      </div>
      <div>
        <label className={studioLabelClass}>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={studioInputClass} />
      </div>
      <div>
        <label className={studioLabelClass}>Cover Image URL</label>
        <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className={studioInputClass} placeholder="https://..." />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={studioLabelClass}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as PublishStatus)} className={studioInputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted pt-8">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured on homepage
        </label>
      </div>
      {error && <p className="text-sm text-sunset">{error}</p>}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Destination"}</Button>
        {initial && (
          <Button variant="ghost" onClick={remove} className="text-sunset">
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
