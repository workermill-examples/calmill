"use client";

import { useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import type { DateOverride } from "@/generated/prisma/client";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DateOverridesProps {
  scheduleId: string;
  overrides: DateOverride[];
  onOverrideAdded: (override: DateOverride) => void;
  onOverrideDeleted: (overrideId: string) => void;
}

// ─── Time options in 15-min increments ───────────────────────────────────────

function generateTimeOptions(): string[] {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const h = String(hour).padStart(2, "0");
      const m = String(minute).padStart(2, "0");
      options.push(`${h}:${m}`);
    }
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions();

function formatTime(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h = parseInt(hStr ?? "0", 10);
  const m = mStr ?? "00";
  const period = h < 12 ? "AM" : "PM";
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayHour}:${m} ${period}`;
}

// Format a Date to YYYY-MM-DD in local time (for display)
function formatDateToYMD(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Get today as YYYY-MM-DD in local time
function getTodayYMD(): string {
  return formatDateToYMD(new Date());
}

// ─── Add Override Form ────────────────────────────────────────────────────────

function AddOverrideForm({
  scheduleId,
  onAdded,
  onCancel,
}: {
  scheduleId: string;
  onAdded: (override: DateOverride) => void;
  onCancel: () => void;
}) {
  const [date, setDate] = useState("");
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) {
      setError("Please select a date");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const body: Record<string, unknown> = { date, isUnavailable };
      if (!isUnavailable) {
        body.startTime = startTime;
        body.endTime = endTime;
      }

      const res = await fetch(`/api/schedules/${scheduleId}/overrides`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        onAdded(data.data);
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to add override");
      }
    } catch {
      setError("Failed to add override");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Add Date Override</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Date picker */}
        <div>
          <label htmlFor="override-date" className="block text-xs font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            id="override-date"
            type="date"
            value={date}
            min={getTodayYMD()}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          />
        </div>

        {/* Unavailable toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={isUnavailable}
            aria-label="Unavailable all day"
            onClick={() => setIsUnavailable((v) => !v)}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
              isUnavailable ? "bg-primary-600" : "bg-gray-200"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                isUnavailable ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </button>
          <span className="text-sm text-gray-700">Unavailable all day</span>
        </div>

        {/* Time range (only if not marking unavailable) */}
        {!isUnavailable && (
          <div className="flex items-center gap-2">
            <div>
              <label htmlFor="override-start" className="block text-xs font-medium text-gray-700 mb-1">
                Start
              </label>
              <select
                id="override-start"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{formatTime(t)}</option>
                ))}
              </select>
            </div>
            <span className="text-sm text-gray-500 pt-5">–</span>
            <div>
              <label htmlFor="override-end" className="block text-xs font-medium text-gray-700 mb-1">
                End
              </label>
              <select
                id="override-end"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{formatTime(t)}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? "Adding…" : "Add Override"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Override Row ─────────────────────────────────────────────────────────────

function OverrideRow({
  override,
  scheduleId,
  onDeleted,
}: {
  override: DateOverride;
  scheduleId: string;
  onDeleted: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/schedules/${scheduleId}/overrides/${override.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onDeleted(override.id);
      } else {
        alert("Failed to delete override");
      }
    } catch {
      alert("Failed to delete override");
    } finally {
      setDeleting(false);
    }
  }

  // Format the date for display — the API stores as a Date object (UTC midnight)
  // We display in local "month day, year" format
  const displayDate = formatDate(
    typeof override.date === "string" ? override.date : override.date.toISOString(),
    "MMM d, yyyy"
  );

  const displayTime = override.isUnavailable
    ? "Unavailable all day"
    : override.startTime && override.endTime
    ? `${formatTime(override.startTime)} – ${formatTime(override.endTime)}`
    : "Custom hours";

  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900">{displayDate}</p>
        <p className={cn("text-xs", override.isUnavailable ? "text-red-600" : "text-gray-500")}>
          {displayTime}
        </p>
      </div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="ml-4 shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
        aria-label={`Delete override for ${displayDate}`}
        title="Delete override"
      >
        {deleting ? (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DateOverrides({
  scheduleId,
  overrides,
  onOverrideAdded,
  onOverrideDeleted,
}: DateOverridesProps) {
  const [showForm, setShowForm] = useState(false);

  function handleAdded(override: DateOverride) {
    onOverrideAdded(override);
    setShowForm(false);
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Date Overrides</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Override your schedule for specific dates
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Date Override
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-4">
          <AddOverrideForm
            scheduleId={scheduleId}
            onAdded={handleAdded}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {overrides.length === 0 && !showForm ? (
        <div className="rounded-md border border-dashed border-gray-200 px-4 py-8 text-center">
          <p className="text-sm text-gray-500">No date overrides set.</p>
          <p className="mt-1 text-xs text-gray-400">
            Add overrides to block time or set custom hours on specific dates.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {overrides.map((override) => (
            <OverrideRow
              key={override.id}
              override={override}
              scheduleId={scheduleId}
              onDeleted={onOverrideDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
