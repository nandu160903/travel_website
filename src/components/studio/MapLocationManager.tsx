"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { MapLocation } from "@/types";
import { studioInputClass, studioLabelClass } from "./form-styles";

interface MapLocationManagerProps {
  locations: MapLocation[];
}

export function MapLocationManager({ locations: initial }: MapLocationManagerProps) {
  const router = useRouter();
  const [locations, setLocations] = useState(initial);
  const [editing, setEditing] = useState<MapLocation | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<MapLocation["type"]>("city");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setEditing(null);
    setName("");
    setType("city");
    setLat("");
    setLng("");
    setCoverImage("");
    setDescription("");
  };

  const loadEdit = (loc: MapLocation) => {
    setEditing(loc);
    setName(loc.name);
    setType(loc.type);
    setLat(String(loc.coordinates.lat));
    setLng(String(loc.coordinates.lng));
    setCoverImage(loc.coverImage);
    setDescription(loc.description);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/studio/map-locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing?.id,
          name,
          type,
          coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
          coverImage,
          description,
        }),
      });
      if (res.ok) {
        resetForm();
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this map pin?")) return;
    await fetch(`/api/studio/map-locations?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setLocations((prev) => prev.filter((l) => l.id !== id));
    router.refresh();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h2 className="font-display text-xl">{editing ? "Edit Pin" : "Add Map Pin"}</h2>
        <div>
          <label className={studioLabelClass}>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={studioInputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={studioLabelClass}>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as MapLocation["type"])} className={studioInputClass}>
              <option value="country">Country</option>
              <option value="city">City</option>
              <option value="trip">Trip</option>
              <option value="story">Story</option>
            </select>
          </div>
          <div>
            <label className={studioLabelClass}>Cover Image URL</label>
            <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className={studioInputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={studioLabelClass}>Latitude</label>
            <input value={lat} onChange={(e) => setLat(e.target.value)} className={studioInputClass} />
          </div>
          <div>
            <label className={studioLabelClass}>Longitude</label>
            <input value={lng} onChange={(e) => setLng(e.target.value)} className={studioInputClass} />
          </div>
        </div>
        <div>
          <label className={studioLabelClass}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={studioInputClass} />
        </div>
        <div className="flex gap-3">
          <Button onClick={save} disabled={saving || !name || !lat || !lng}>
            {saving ? "Saving..." : editing ? "Update Pin" : "Add Pin"}
          </Button>
          {editing && (
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl mb-4">Pins ({locations.length})</h2>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {locations.map((loc) => (
            <div key={loc.id} className="flex items-start justify-between p-4 border border-border gap-4">
              <div>
                <p className="font-medium">{loc.name}</p>
                <p className="text-xs text-muted mt-1">
                  {loc.type} · {loc.coordinates.lat.toFixed(2)}, {loc.coordinates.lng.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => loadEdit(loc)} className="text-xs text-ocean hover:text-gold">
                  Edit
                </button>
                <button onClick={() => remove(loc.id)} className="text-xs text-sunset">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
