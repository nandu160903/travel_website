"use client";

import { studioApiPath, studioPagePath } from "@/lib/studio/paths";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { AboutPageContent } from "@/types";
import { studioInputClass, studioLabelClass } from "./form-styles";

interface AboutPageEditorProps {
  initial: AboutPageContent;
}

export function AboutPageEditor({ initial }: AboutPageEditorProps) {
  const [content, setContent] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const updateSection = (index: number, field: "title" | "content", value: string) => {
    setContent((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(studioApiPath("/about"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      setMessage(res.ok ? "About page saved." : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <label className={studioLabelClass}>Headline (use line breaks)</label>
        <textarea
          value={content.headline}
          onChange={(e) => setContent({ ...content, headline: e.target.value })}
          rows={3}
          className={studioInputClass}
        />
      </div>
      <div>
        <label className={studioLabelClass}>Subtitle</label>
        <textarea
          value={content.subtitle}
          onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
          rows={2}
          className={studioInputClass}
        />
      </div>

      <div className="space-y-6">
        <p className="travel-meta">Sections</p>
        {content.sections.map((section, index) => (
          <div key={index} className="border border-border p-4 space-y-3 rounded-sm">
            <div>
              <label className={studioLabelClass}>Title</label>
              <input
                value={section.title}
                onChange={(e) => updateSection(index, "title", e.target.value)}
                className={studioInputClass}
              />
            </div>
            <div>
              <label className={studioLabelClass}>Content</label>
              <textarea
                value={section.content}
                onChange={(e) => updateSection(index, "content", e.target.value)}
                rows={4}
                className={studioInputClass}
              />
            </div>
          </div>
        ))}
      </div>

      {message && <p className="text-sm text-muted">{message}</p>}
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save About Page"}
      </Button>
    </div>
  );
}
