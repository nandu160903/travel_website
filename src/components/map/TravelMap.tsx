"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import type { MapLocation } from "@/types";
import { siteConfig } from "@/lib/config";
import { isValidCoordinates } from "@/lib/data/map-locations";
import { cn } from "@/lib/utils";

type MapFilter = "all" | "country" | "city" | "trip" | "story";

const PLACES_SOURCE = "normad-places";
const PLACES_LAYER = "normad-places-circles";

interface TravelMapProps {
  locations: MapLocation[];
  className?: string;
  interactive?: boolean;
  height?: string;
  mapboxToken?: string;
}

function locationsToGeoJson(locations: MapLocation[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: locations.map((loc) => ({
      type: "Feature",
      id: loc.id,
      geometry: {
        type: "Point",
        coordinates: [loc.coordinates.lng, loc.coordinates.lat],
      },
      properties: {
        id: loc.id,
        name: loc.name,
        type: loc.type,
      },
    })),
  };
}

export function TravelMap({
  locations,
  className,
  interactive = true,
  height = "min(70dvh, 720px)",
  mapboxToken: mapboxTokenProp,
}: TravelMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const locationsByIdRef = useRef<Map<string, MapLocation>>(new Map());
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const [filter, setFilter] = useState<MapFilter>("all");
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapStyle = "mapbox://styles/mapbox/dark-v11";

  const mapboxToken = (mapboxTokenProp ?? siteConfig.mapboxToken ?? "").trim();

  const validLocations = useMemo(
    () => locations.filter((l) => isValidCoordinates(l.coordinates)),
    [locations]
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? validLocations
        : validLocations.filter((l) => l.type === filter),
    [filter, validLocations]
  );

  useEffect(() => {
    locationsByIdRef.current = new Map(filtered.map((loc) => [loc.id, loc]));
  }, [filtered]);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    let cancelled = false;
    setMapError(null);
    mapboxgl.accessToken = mapboxToken;

    const coarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [78, 22],
      zoom: 2.2,
      interactive,
      cooperativeGestures: coarsePointer,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const onPlaceClick = (event: mapboxgl.MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      const id = feature?.properties?.id as string | undefined;
      if (!id) return;
      const loc = locationsByIdRef.current.get(id);
      if (!loc) return;
      setSelected(loc);
      map.flyTo({
        center: [loc.coordinates.lng, loc.coordinates.lat],
        zoom: Math.max(map.getZoom(), 5),
        duration: 1200,
      });
    };

    const markReady = () => {
      if (cancelled) return;
      map.resize();
      setMapReady(true);
    };

    map.on("load", () => {
      if (cancelled) return;

      map.addSource(PLACES_SOURCE, {
        type: "geojson",
        data: locationsToGeoJson([]),
      });

      map.addLayer({
        id: PLACES_LAYER,
        type: "circle",
        source: PLACES_SOURCE,
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            1,
            5,
            5,
            10,
            10,
            14,
          ],
          "circle-color": "#B2D157",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#F4F0E7",
          "circle-opacity": 0.95,
        },
      });

      map.on("click", PLACES_LAYER, onPlaceClick);
      map.on("mouseenter", PLACES_LAYER, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", PLACES_LAYER, () => {
        map.getCanvas().style.cursor = "";
      });

      markReady();
    });

    map.on("idle", markReady);

    map.on("error", (event) => {
      const message =
        event.error?.message ??
        "Map failed to load. Check your Mapbox token and URL restrictions.";
      setMapError(message);
      setMapReady(false);
    });

    mapRef.current = map;

    return () => {
      cancelled = true;
      map.off("click", PLACES_LAYER, onPlaceClick);
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [interactive, mapStyle, mapboxToken]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const source = map.getSource(PLACES_SOURCE) as mapboxgl.GeoJSONSource | undefined;
    if (!source) return;

    source.setData(locationsToGeoJson(filtered));

    if (filtered.length === 0) {
      return;
    }

    if (filtered.length === 1) {
      const loc = filtered[0];
      map.jumpTo({
        center: [loc.coordinates.lng, loc.coordinates.lat],
        zoom: 4.5,
      });
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();
    filtered.forEach((loc) => {
      bounds.extend([loc.coordinates.lng, loc.coordinates.lat]);
    });

    try {
      map.fitBounds(bounds, { padding: 80, maxZoom: 5.5, duration: 0 });
    } catch {
      /* ignore invalid bounds */
    }
  }, [filtered, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const resize = () => map.resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    const t = window.setTimeout(resize, 200);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
    };
  }, [mapReady]);

  const filters: { key: MapFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "country", label: "Countries" },
    { key: "city", label: "Cities" },
    { key: "trip", label: "Trips" },
    { key: "story", label: "Stories" },
  ];

  if (!mapboxToken) {
    return (
      <div
        className={cn("relative bg-muted-bg flex items-center justify-center border border-border", className)}
        style={{ height }}
      >
        <div className="text-center p-8">
          <p className="font-display text-2xl mb-2">Map Preview</p>
          <p className="text-muted text-sm max-w-md">
            Add <code className="text-ocean">NEXT_PUBLIC_MAPBOX_TOKEN</code> to{" "}
            <code className="text-ocean">.env</code>, then restart the dev server.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
            {filtered.slice(0, 6).map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setSelected(loc)}
                className="text-left p-3 border border-border bg-card hover:border-ocean transition-colors"
              >
                <p className="text-xs uppercase tracking-widest text-muted">{loc.type}</p>
                <p className="font-medium text-sm mt-1">{loc.name}</p>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selected && (
            <MapPopup location={selected} onClose={() => setSelected(null)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={cn("relative border border-border", className)} data-cursor="explore">
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "min-h-11 px-3 py-2 text-[10px] uppercase tracking-widest transition-colors",
              filter === f.key
                ? "bg-trail text-paper"
                : "bg-card/95 text-muted hover:text-foreground border border-border"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {validLocations.length === 0 && (
        <div className="absolute top-16 left-4 right-4 z-10 rounded-lg border border-border bg-card/95 px-4 py-3 text-sm text-muted">
          No map pins yet. In Studio, add latitude/longitude on destinations or journeys, or add
          pins under <span className="text-foreground">Studio → Map</span>.
        </div>
      )}

      {validLocations.length > 0 && (
        <div className="absolute top-16 right-4 z-10 rounded-lg border border-border bg-card/90 px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted">
          {filtered.length} place{filtered.length === 1 ? "" : "s"}
        </div>
      )}

      <div ref={mapContainer} style={{ height }} className="w-full min-h-[280px]" />

      {mapError && (
        <div className="absolute inset-0 z-[5] flex items-center justify-center bg-tone-dark/90 p-6 text-center">
          <div className="max-w-md">
            <p className="font-display text-lg text-paper mb-2">Map unavailable</p>
            <p className="text-sm text-paper/70">{mapError}</p>
            <p className="text-xs text-paper/50 mt-4">
              In Mapbox, allow this site URL under token URL restrictions (e.g.{" "}
              <code className="text-trail">http://localhost:3000</code>).
            </p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <MapPopup location={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function MapPopup({
  location,
  onClose,
}: {
  location: MapLocation;
  onClose: () => void;
}) {
  const href = location.destinationSlug
    ? `/destinations/${location.destinationSlug}`
    : location.storySlug
      ? `/stories/${location.storySlug}`
      : location.tripSlug
        ? `/journeys/${location.tripSlug}`
        : "#";

  const cover =
    location.coverImage?.trim() ||
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 z-20 bg-card border border-border shadow-2xl overflow-hidden"
    >
      <div className="relative h-40">
        <Image
          src={cover}
          alt={location.name}
          fill
          className="object-cover"
          sizes="320px"
        />
        <button
          type="button"
          onClick={onClose}
          className="touch-target absolute top-2 right-2 inline-flex min-h-11 min-w-11 items-center justify-center bg-tone-dark/60 text-tone-light text-sm"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="p-5">
        <p className="text-[10px] uppercase tracking-widest text-muted">{location.type}</p>
        <h3 className="font-display text-2xl mt-1">{location.name}</h3>
        {location.visitDate && (
          <p className="text-xs text-muted mt-1">{location.visitDate}</p>
        )}
        <p className="text-sm text-muted mt-3 line-clamp-2">{location.description}</p>
        {href !== "#" && (
          <Link
            href={href}
            className="inline-block mt-4 travel-meta text-trail hover:text-terrain transition-colors"
          >
            Explore →
          </Link>
        )}
      </div>
    </motion.div>
  );
}
