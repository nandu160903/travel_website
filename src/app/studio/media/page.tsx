"use client";

import { useState, useCallback } from "react";
import { Upload, Search, Trash2 } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  width?: number;
  height?: number;
  uploadedAt: string;
}

const demoMedia: MediaItem[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80", filename: "kyoto-bamboo.jpg", width: 1200, height: 1600, uploadedAt: "2025-10-05" },
  { id: "2", url: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=400&q=80", filename: "iceland-aurora.jpg", width: 1600, height: 1200, uploadedAt: "2025-03-15" },
];

export default function StudioMediaPage() {
  const [media, setMedia] = useState(demoMedia);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const filtered = media.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));

      const res = await fetch("/api/studio/media", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setMedia((prev) => [...data.uploaded, ...prev]);
      }
    } finally {
      setUploading(false);
    }
  }, []);

  return (
    <div className="p-8 md:p-10 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Media Library</h1>
          <p className="text-muted text-sm mt-1">{media.length} files</p>
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase font-medium bg-ocean text-white hover:bg-teal cursor-pointer transition-colors">
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
          <Upload size={14} />
          {uploading ? "Uploading..." : "Upload"}
        </label>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media..."
          className="w-full pl-10 pr-4 py-3 bg-muted-bg border border-border focus:outline-none focus:border-ocean"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="group border border-border overflow-hidden">
            <div className="aspect-square relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
              <button
                className="absolute top-2 right-2 p-1.5 bg-charcoal/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="p-2">
              <p className="text-xs truncate">{item.filename}</p>
              <p className="text-[10px] text-muted">
                {item.width}×{item.height} · {item.uploadedAt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
