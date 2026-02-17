"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { EditorEventType, EventTypeFields } from "./editor";
import type { Availability, DateOverride } from "@/generated/prisma/client";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ScheduleOption {
  id: string;
  name: string;
  timezone: string;
  isDefault: boolean;
  availability: Availability[];
  dateOverrides: DateOverride[];
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ─── Props ───────────────────────────────────────────────────────────────────

interface AvailabilityTabProps {
  eventType: EditorEventType;
  onSave: (fields: EventTypeFields) => void;
}

// ─── Weekly Preview Grid ─────────────────────────────────────────────────────

function WeeklyPreviewGrid({ availability }: { availability: Availability[] }) {
  const byDay = new Map<number, Availability[]>();
  for (const slot of availability) {
    if (!byDay.has(slot.day)) byDay.set(slot.day, []);
    byDay.get(slot.day)!.push(slot);
  }

  return (
    <div className="space-y-1">
      {[1, 2, 3, 4, 5, 6, 0].map((day) => {
        const slots = byDay.get(day) ?? [];
        const hasSlots = slots.length > 0;
        return (
          <div key={day} className="flex items-center gap-3 py-1">
            <span className={cn("w-24 text-sm", hasSlots ? "text-gray-700 font-medium" : "text-gray-400")}>
              {DAY_NAMES[day] ?? ""}
            </span>
            {hasSlots ? (
              <div className="flex flex-wrap gap-2">
                {slots.map((slot, i) => (
                  <span key={i} className="inline-flex items-center rounded bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                    {slot.startTime} – {slot.endTime}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-400">Unavailable</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function AvailabilityTab({ eventType, onSave }: AvailabilityTabProps) {
  const [schedules, setSchedules] = useState<ScheduleOption[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    eventType.scheduleId ?? null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchedules() {
      try {
        const res = await fetch("/api/schedules");
        if (res.ok) {
          const data = await res.json();
          setSchedules(data.data ?? []);
        } else {
          setError("Failed to load schedules");
        }
      } catch {
        setError("Failed to load schedules");
      } finally {
        setLoading(false);
      }
    }
    fetchSchedules();
  }, []);

  const selectedSchedule = schedules.find((s) => s.id === selectedScheduleId);

  function handleScheduleChange(scheduleId: string) {
    setSelectedScheduleId(scheduleId);
    onSave({ scheduleId });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading schedules…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-danger">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Schedule selector */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Schedule</h2>

        {schedules.length === 0 ? (
          <div className="text-sm text-gray-500">
            No schedules found.{" "}
            <a href="/availability" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
              Create a schedule
            </a>{" "}
            first.
          </div>
        ) : (
          <div>
            <label htmlFor="et-schedule" className="block text-sm font-medium text-gray-700 mb-1.5">
              Which schedule governs availability for this event type?
            </label>
            <select
              id="et-schedule"
              value={selectedScheduleId ?? ""}
              onChange={(e) => handleScheduleChange(e.target.value)}
              className="flex h-10 w-full max-w-sm rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            >
              <option value="">— No schedule —</option>
              {schedules.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}{s.isDefault ? " (default)" : ""}
                </option>
              ))}
            </select>

            <div className="mt-2">
              <a
                href="/availability"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary-600 hover:underline"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Edit Schedule
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Schedule preview */}
      {selectedSchedule && (
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Weekly Availability Preview
            </h2>
            <span className="text-xs text-gray-500">{selectedSchedule.timezone}</span>
          </div>
          <p className="text-xs text-gray-500">
            This is a read-only preview of the selected schedule. To edit, open the{" "}
            <a href="/availability" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
              Availability page
            </a>
            .
          </p>
          <WeeklyPreviewGrid availability={selectedSchedule.availability} />
        </section>
      )}

      {/* Date overrides */}
      {selectedSchedule && selectedSchedule.dateOverrides.length > 0 && (
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Date-Specific Overrides
          </h2>
          <p className="text-xs text-gray-500">
            These overrides are part of the selected schedule. To edit them, go to the{" "}
            <a href="/availability" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
              Availability page
            </a>
            .
          </p>
          <div className="divide-y divide-gray-100">
            {selectedSchedule.dateOverrides.map((override) => {
              const dateStr = new Date(override.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return (
                <div key={override.id} className="flex items-center gap-4 py-2">
                  <span className="w-32 text-sm font-medium text-gray-700">{dateStr}</span>
                  {override.isUnavailable ? (
                    <span className="inline-flex items-center rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-danger">
                      Unavailable all day
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                      {override.startTime} – {override.endTime}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
