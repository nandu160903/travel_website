"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { SiteSettings } from "@/types";
import { studioInputClass, studioLabelClass } from "./form-styles";

interface SettingsFormProps {
  initial: SiteSettings;
}

export function SettingsForm({ initial }: SettingsFormProps) {
  const instagram = initial.socialLinks.find((l) => l.platform === "instagram")?.url ?? "";
  const facebook = initial.socialLinks.find((l) => l.platform === "facebook")?.url ?? "";

  const [settings, setSettings] = useState({
    siteTitle: initial.siteTitle,
    siteDescription: initial.siteDescription,
    bio: initial.bio,
    email: initial.email,
    profilePhoto: initial.profilePhoto,
    instagram,
    facebook,
    heroImage: initial.heroImage,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/studio/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setMessage(res.ok ? "Settings saved." : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: "siteTitle", label: "Site Title" },
    { key: "siteDescription", label: "Site Description" },
    { key: "bio", label: "Bio", textarea: true },
    { key: "email", label: "Contact Email" },
    { key: "profilePhoto", label: "Profile Photo URL" },
    { key: "instagram", label: "Instagram URL" },
    { key: "facebook", label: "Facebook URL" },
    { key: "heroImage", label: "Hero Image URL" },
  ] as const;

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div key={field.key}>
          <label className={studioLabelClass}>{field.label}</label>
          {"textarea" in field && field.textarea ? (
            <textarea
              value={settings[field.key]}
              onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
              rows={3}
              className={studioInputClass}
            />
          ) : (
            <input
              value={settings[field.key]}
              onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
              className={studioInputClass}
            />
          )}
        </div>
      ))}
      {message && <p className="text-sm text-muted">{message}</p>}
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}
