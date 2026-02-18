"use client";

import { useState, useMemo } from "react";
import { cn, generateSlug } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { EditorEventType, EventTypeFields } from "./editor";
import type { EventTypeLocation } from "@/types";

// ─── Constants ──────────────────────────────────────────────────────────────

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120] as const;

const PRESET_COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
];

const LOCATION_TYPES = [
  { value: "link", label: "Video Link" },
  { value: "inPerson", label: "In Person" },
  { value: "phone", label: "Phone Call" },
] as const;

// ─── Props ───────────────────────────────────────────────────────────────────

interface GeneralTabProps {
  eventType: EditorEventType;
  username: string;
  onSave: (fields: EventTypeFields) => void;
  onTitleChange: (title: string) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function GeneralTab({ eventType, username, onSave, onTitleChange }: GeneralTabProps) {
  const [title, setTitle] = useState(eventType.title);
  const [slug, setSlug] = useState(eventType.slug);
  const [description, setDescription] = useState(eventType.description ?? "");
  const [duration, setDuration] = useState(eventType.duration);
  const [locations, setLocations] = useState<EventTypeLocation[]>(
    eventType.locations ?? []
  );
  const [color, setColor] = useState(eventType.color ?? "#3b82f6");
  const [customHex, setCustomHex] = useState(
    (PRESET_COLORS as readonly string[]).includes(eventType.color ?? "#3b82f6") ? "" : (eventType.color ?? "")
  );

  // Derive slug from title when not manually edited
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const derivedSlug = useMemo(
    () => (slugManuallyEdited || !title ? slug : generateSlug(title)),
    [title, slug, slugManuallyEdited]
  );

  function handleTitleBlur() {
    if (!title.trim()) return;
    onTitleChange(title.trim());
    onSave({ title: title.trim(), ...(slugManuallyEdited ? {} : { slug: derivedSlug }) });
  }

  function handleSlugBlur() {
    if (derivedSlug) onSave({ slug: derivedSlug });
  }

  function handleDescriptionBlur() {
    onSave({ description: description || null });
  }

  function handleDurationBlur() {
    if (duration >= 5 && duration <= 720) {
      onSave({ duration });
    }
  }

  function handleLocationsChange(newLocations: EventTypeLocation[]) {
    setLocations(newLocations);
    onSave({ locations: newLocations });
  }

  function handleColorSelect(hex: string) {
    setColor(hex);
    setCustomHex("");
    onSave({ color: hex });
  }

  function handleCustomHexBlur() {
    const hex = customHex.startsWith("#") ? customHex : `#${customHex}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      setColor(hex);
      onSave({ color: hex });
    }
  }

  function addLocation() {
    const newLoc: EventTypeLocation = { type: "link", value: "" };
    handleLocationsChange([...locations, newLoc]);
  }

  function removeLocation(index: number) {
    handleLocationsChange(locations.filter((_, i) => i !== index));
  }

  function updateLocationField(
    index: number,
    field: keyof EventTypeLocation,
    value: string
  ) {
    const updated = locations.map((loc, i) =>
      i === index ? { ...loc, [field]: value } : loc
    );
    setLocations(updated);
  }

  function saveLocations() {
    onSave({ locations });
  }

  const descCharsLeft = 500 - description.length;

  return (
    <div className="space-y-8">
      {/* Title */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Basic Info</h2>

        <Input
          label="Title"
          id="et-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          required
          maxLength={255}
          placeholder="e.g. 30 Minute Meeting"
        />

        {/* Slug */}
        <div>
          <label htmlFor="et-slug" className="block text-sm font-medium text-gray-700 mb-1.5">
            URL Slug
          </label>
          <div className="flex items-center">
            <span className="inline-flex h-10 items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 whitespace-nowrap">
              /{username}/
            </span>
            <input
              id="et-slug"
              type="text"
              value={derivedSlug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugManuallyEdited(true);
              }}
              onBlur={handleSlugBlur}
              placeholder="30-min-meeting"
              className="flex-1 h-10 rounded-r-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Public booking URL: /{username}/{derivedSlug}
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="et-description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            id="et-description"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
            onBlur={handleDescriptionBlur}
            rows={3}
            placeholder="Describe your event type…"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
          />
          <p className={cn("mt-1 text-xs", descCharsLeft < 50 ? "text-warning" : "text-gray-400")}>
            {descCharsLeft} characters remaining
          </p>
        </div>
      </section>

      {/* Duration */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Duration</h2>

        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {DURATION_OPTIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setDuration(d);
                  onSave({ duration: d });
                }}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-ring",
                  duration === d
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                )}
              >
                {d} min
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={5}
              max={720}
              value={duration}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) setDuration(val);
              }}
              onBlur={handleDurationBlur}
              className="w-24 h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              aria-label="Custom duration in minutes"
            />
            <span className="text-sm text-gray-500">minutes</span>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Locations</h2>
          <Button type="button" variant="outline" size="sm" onClick={addLocation}>
            + Add Location
          </Button>
        </div>

        {locations.length === 0 && (
          <p className="text-sm text-gray-400">No locations configured. Add one above.</p>
        )}

        <div className="space-y-3">
          {locations.map((loc, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <select
                  value={loc.type}
                  onChange={(e) => updateLocationField(index, "type", e.target.value)}
                  onBlur={saveLocations}
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  aria-label="Location type"
                >
                  {LOCATION_TYPES.map((lt) => (
                    <option key={lt.value} value={lt.value}>
                      {lt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={loc.value}
                  onChange={(e) => updateLocationField(index, "value", e.target.value)}
                  onBlur={saveLocations}
                  placeholder={
                    loc.type === "link"
                      ? "https://meet.example.com/..."
                      : loc.type === "inPerson"
                      ? "123 Main St, City"
                      : "+1 (555) 000-0000"
                  }
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => removeLocation(index)}
                aria-label="Remove location"
                className="mt-1.5 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-danger focus-ring transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Color */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Color</h2>
        <div className="flex items-center gap-3 flex-wrap">
          {PRESET_COLORS.map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => handleColorSelect(hex)}
              aria-label={`Select color ${hex}`}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-all focus-ring",
                color === hex ? "border-gray-900 scale-110" : "border-transparent hover:scale-105"
              )}
              style={{ backgroundColor: hex }}
            />
          ))}
          {/* Custom hex input */}
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-full border border-gray-200 shrink-0"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <input
              type="text"
              value={customHex}
              onChange={(e) => setCustomHex(e.target.value)}
              onBlur={handleCustomHexBlur}
              placeholder="#ffffff"
              maxLength={7}
              className="w-24 h-8 rounded-md border border-gray-300 bg-white px-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              aria-label="Custom hex color"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
