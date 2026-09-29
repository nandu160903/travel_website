"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config";

export default function StudioSettingsPage() {
  const [settings, setSettings] = useState({
    siteTitle: siteConfig.title,
    siteDescription: siteConfig.description,
    bio: "A wanderer with a camera, documenting the world one horizon at a time.",
    email: siteConfig.contactEmail,
    instagram: "https://instagram.com/YOUR_USERNAME",
    facebook: "https://facebook.com/YOUR_USERNAME",
    heroImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=2400&q=85",
  });
  const [saving, setSaving] = useState(false);

  const inputClass =
    "w-full px-4 py-3 bg-muted-bg border border-border focus:outline-none focus:border-ocean transition-colors";

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/studio/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: "siteTitle", label: "Site Title" },
    { key: "siteDescription", label: "Site Description" },
    { key: "bio", label: "Bio", textarea: true },
    { key: "email", label: "Contact Email" },
    { key: "instagram", label: "Instagram URL" },
    { key: "facebook", label: "Facebook URL" },
    { key: "heroImage", label: "Hero Image URL" },
  ] as const;

  return (
    <div className="p-8 md:p-10 max-w-2xl">
      <h1 className="font-display text-3xl mb-8">Settings</h1>
      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="text-[10px] uppercase tracking-widest text-muted block mb-2">
              {field.label}
            </label>
            {"textarea" in field && field.textarea ? (
              <textarea
                value={settings[field.key]}
                onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                rows={3}
                className={inputClass}
              />
            ) : (
              <input
                value={settings[field.key]}
                onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                className={inputClass}
              />
            )}
          </div>
        ))}
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
