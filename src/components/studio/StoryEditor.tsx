"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "./RichTextEditor";
import { Button } from "@/components/ui/Button";
import { slugify, estimateReadingTime } from "@/lib/utils";
import { storyCategories } from "@/lib/config";
import type { Story } from "@/types";

interface StoryEditorProps {
  initialStory?: Story;
}

export function StoryEditor({ initialStory }: StoryEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialStory?.title ?? "");
  const [slug, setSlug] = useState(initialStory?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialStory?.excerpt ?? "");
  const [content, setContent] = useState(initialStory?.content ?? "");
  const [coverImage, setCoverImage] = useState(initialStory?.coverImage ?? "");
  const [category, setCategory] = useState(initialStory?.category ?? "personal");
  const [status, setStatus] = useState(initialStory?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!initialStory) setSlug(slugify(value));
  };

  const handleAutoSave = useCallback((html: string) => {
    setSavedAt(new Date().toLocaleTimeString());
    // In production: save to Supabase
    void html;
  }, []);

  const handleSave = async (newStatus: "draft" | "published") => {
    setSaving(true);
    setStatus(newStatus);
    try {
      const res = await fetch("/api/studio/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          coverImage,
          category,
          status: newStatus,
          readingTime: estimateReadingTime(content),
        }),
      });
      if (res.ok) {
        setSavedAt(new Date().toLocaleTimeString());
        if (!initialStory) router.push("/studio/stories");
      }
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-muted-bg border border-border text-foreground focus:outline-none focus:border-ocean transition-colors";

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-muted block mb-2">Title</label>
          <input value={title} onChange={(e) => handleTitleChange(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-muted block mb-2">Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-widest text-muted block mb-2">Excerpt</label>
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className={inputClass} />
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-widest text-muted block mb-2">Cover Image URL</label>
        <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className={inputClass} placeholder="https://..." />
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-widest text-muted block mb-2">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value as Story["category"])} className={inputClass}>
          {storyCategories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-widest text-muted block mb-2">Content</label>
        <RichTextEditor content={content} onChange={setContent} onAutoSave={handleAutoSave} />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-xs text-muted">
          {savedAt ? `Last saved at ${savedAt}` : "Autosave every 30s"}
          {status && ` · ${status}`}
        </div>
        <div className="flex gap-3">
          {slug && (
            <a href={`/stories/${slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm">Preview</Button>
            </a>
          )}
          <Button variant="outline" size="sm" onClick={() => handleSave("draft")} disabled={saving}>
            Save Draft
          </Button>
          <Button size="sm" onClick={() => handleSave("published")} disabled={saving}>
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
