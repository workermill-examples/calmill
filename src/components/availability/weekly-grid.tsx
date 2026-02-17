"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Availability } from "@/generated/prisma/client";
import { TIME_OPTIONS, formatTime } from "./time-utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type TimeWindow = {
  id: string;        // stable key for React reconciliation
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
};

let _windowId = 0;
function nextWindowId(): string {
  return `w${++_windowId}`;
}

type DayState = {
  enabled: boolean;
  windows: TimeWindow[];
};

interface WeeklyGridProps {
  availability: Availability[];
  onSave: (availability: Array<Pick<Availability, "day" | "startTime" | "endTime">>) => Promise<void>;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function DayToggle({
  checked,
  onChange,
  dayName,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  dayName: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={`${dayName} ${checked ? "available" : "unavailable"}`}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
        checked ? "bg-primary-600" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-4" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

// ─── Time Range Row ───────────────────────────────────────────────────────────

function TimeRangeRow({
  window: win,
  index,
  canRemove,
  onChangeStart,
  onChangeEnd,
  onRemove,
}: {
  window: TimeWindow;
  index: number;
  canRemove: boolean;
  onChangeStart: (v: string) => void;
  onChangeEnd: (v: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={win.startTime}
        onChange={(e) => onChangeStart(e.target.value)}
        className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        aria-label={`Start time for window ${index + 1}`}
      >
        {TIME_OPTIONS.map((t) => (
          <option key={t} value={t}>{formatTime(t)}</option>
        ))}
      </select>
      <span className="text-sm text-gray-500">–</span>
      <select
        value={win.endTime}
        onChange={(e) => onChangeEnd(e.target.value)}
        className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        aria-label={`End time for window ${index + 1}`}
      >
        {TIME_OPTIONS.map((t) => (
          <option key={t} value={t}>{formatTime(t)}</option>
        ))}
      </select>
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded p-0.5 text-gray-400 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label={`Remove time window ${index + 1}`}
          title="Remove this time window"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Helper: build initial state from availability ────────────────────────────

function buildDayState(availability: Availability[]): Record<number, DayState> {
  const state: Record<number, DayState> = {};
  for (let day = 0; day < 7; day++) {
    const windows = availability
      .filter((a) => a.day === day)
      .map((a) => ({ id: nextWindowId(), startTime: a.startTime, endTime: a.endTime }));
    state[day] = {
      enabled: windows.length > 0,
      windows: windows.length > 0 ? windows : [{ id: nextWindowId(), startTime: "09:00", endTime: "17:00" }],
    };
  }
  return state;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function WeeklyGrid({ availability, onSave }: WeeklyGridProps) {
  const [dayState, setDayState] = useState<Record<number, DayState>>(() =>
    buildDayState(availability)
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);

  // Rebuild when availability prop changes (e.g. schedule switched)
  const [lastAvailability, setLastAvailability] = useState(availability);
  if (availability !== lastAvailability) {
    setLastAvailability(availability);
    setDayState(buildDayState(availability));
  }

  const updateDay = useCallback((day: number, update: Partial<DayState>) => {
    setDayState((prev) => ({
      ...prev,
      [day]: { ...prev[day]!, ...update },
    }));
  }, []);

  function handleToggle(day: number, enabled: boolean) {
    updateDay(day, { enabled });
  }

  function handleAddWindow(day: number) {
    const current = dayState[day]!;
    updateDay(day, {
      windows: [...current.windows, { id: nextWindowId(), startTime: "09:00", endTime: "17:00" }],
    });
  }

  function handleRemoveWindow(day: number, windowId: string) {
    const current = dayState[day]!;
    const newWindows = current.windows.filter((w) => w.id !== windowId);
    updateDay(day, {
      windows: newWindows.length > 0 ? newWindows : [{ id: nextWindowId(), startTime: "09:00", endTime: "17:00" }],
    });
  }

  function handleChangeStart(day: number, windowId: string, value: string) {
    const current = dayState[day]!;
    const newWindows = current.windows.map((w) =>
      w.id === windowId ? { ...w, startTime: value } : w
    );
    updateDay(day, { windows: newWindows });
  }

  function handleChangeEnd(day: number, windowId: string, value: string) {
    const current = dayState[day]!;
    const newWindows = current.windows.map((w) =>
      w.id === windowId ? { ...w, endTime: value } : w
    );
    updateDay(day, { windows: newWindows });
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(false);

    const availability: Array<Pick<Availability, "day" | "startTime" | "endTime">> = [];
    for (let day = 0; day < 7; day++) {
      const ds = dayState[day]!;
      if (ds.enabled) {
        for (const w of ds.windows) {
          availability.push({ day, startTime: w.startTime, endTime: w.endTime });
        }
      }
    }

    try {
      await onSave(availability);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Weekly hours</h3>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
          {error && (
            <span className="text-xs text-red-600">Save failed</span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="space-y-1" role="group" aria-label="Weekly availability">
        {Array.from({ length: 7 }, (_, day) => {
          const ds = dayState[day]!;
          return (
            <div
              key={day}
              className={cn(
                "flex items-start gap-4 rounded-md px-3 py-3 transition-colors",
                ds.enabled ? "bg-white" : "bg-gray-50"
              )}
            >
              {/* Day name + toggle */}
              <div className="flex w-32 shrink-0 items-center gap-3 pt-0.5">
                <DayToggle
                  checked={ds.enabled}
                  onChange={(v) => handleToggle(day, v)}
                  dayName={DAY_NAMES[day]!}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    ds.enabled ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  {DAY_NAMES[day]}
                </span>
              </div>

              {/* Time windows or unavailable label */}
              {ds.enabled ? (
                <div className="flex flex-col gap-2">
                  {ds.windows.map((win, index) => (
                    <TimeRangeRow
                      key={win.id}
                      window={win}
                      index={index}
                      canRemove={ds.windows.length > 1}
                      onChangeStart={(v) => handleChangeStart(day, win.id, v)}
                      onChangeEnd={(v) => handleChangeEnd(day, win.id, v)}
                      onRemove={() => handleRemoveWindow(day, win.id)}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddWindow(day)}
                    className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                    aria-label={`Add another time window for ${DAY_NAMES[day]!}`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add hours
                  </button>
                </div>
              ) : (
                <span className="pt-0.5 text-sm text-gray-400">Unavailable</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
