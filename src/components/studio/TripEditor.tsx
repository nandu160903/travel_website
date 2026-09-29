"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils";
import type { PublishStatus, Trip } from "@/types";
import { studioInputClass, studioLabelClass } from "./form-styles";

interface TripEditorProps {
  initial?: Trip;
}

export function TripEditor({ initial }: TripEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [country, setCountry] = useState(initial?.country ?? "");
  const [cities, setCities] = useState((initial?.cities ?? []).join(", "));
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [endDate, setEndDate] = useState(initial?.endDate ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [status, setStatus] = useState<PublishStatus>(initial?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!initial) setSlug(slugify(value));
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/studio/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title,
          country,
          cities: cities.split(",").map((c) => c.trim()).filter(Boolean),
          startDate,
          endDate,
          coverImage,
          description,
          category,
          featured,
          status,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }
      router.push("/studio/trips");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!initial || !confirm("Delete this trip?")) return;
    const res = await fetch(`/api/studio/trips?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/studio/trips");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={studioLabelClass}>Title</label>
          <input value={title} onChange={(e) => handleTitleChange(e.target.value)} className={studioInputClass} />
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
          <label className={studioLabelClass}>Cities (comma-separated)</label>
          <input value={cities} onChange={(e) => setCities(e.target.value)} className={studioInputClass} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={studioLabelClass}>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={studioInputClass} />
        </div>
        <div>
          <label className={studioLabelClass}>End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={studioInputClass} />
        </div>
      </div>
      <div>
        <label className={studioLabelClass}>Cover Image URL</label>
        <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className={studioInputClass} />
      </div>
      <div>
        <label className={studioLabelClass}>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={studioInputClass} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={studioLabelClass}>Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} className={studioInputClass} />
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
      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Featured journey
      </label>
      {error && <p className="text-sm text-sunset">{error}</p>}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Trip"}</Button>
        {initial && <Button variant="ghost" onClick={remove} className="text-sunset">Delete</Button>}
      </div>
    </div>
  );
}
