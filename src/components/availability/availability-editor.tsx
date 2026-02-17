"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { WeeklyGrid } from "./weekly-grid";
import { DateOverrides } from "./date-overrides";
import type { ScheduleWithRelations } from "@/types";
import type { Availability, DateOverride } from "@/generated/prisma/client";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AvailabilityEditorProps {
  initialSchedules: ScheduleWithRelations[];
  userTimezone: string;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

// ─── Timezone list helper ─────────────────────────────────────────────────────

const COMMON_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "America/Honolulu",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Africa/Cairo",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
  "Pacific/Auckland",
  "UTC",
];

// ─── SaveIndicator ────────────────────────────────────────────────────────────

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-sm text-gray-500">
        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Saving…
      </span>
    );
  }
  if (status === "saved") {
    return (
      <span className="flex items-center gap-1.5 text-sm text-green-600">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Saved
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-sm text-red-600">
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      Save failed
    </span>
  );
}

// ─── CreateScheduleDialog ─────────────────────────────────────────────────────

function CreateScheduleDialog({
  onConfirm,
  onCancel,
  defaultTimezone,
}: {
  onConfirm: (name: string, timezone: string) => Promise<void>;
  onCancel: () => void;
  defaultTimezone: string;
}) {
  const [name, setName] = useState("New Schedule");
  const [timezone, setTimezone] = useState(defaultTimezone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    try {
      await onConfirm(name.trim(), timezone);
    } catch {
      setError("Failed to create schedule");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-schedule-dialog-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 id="create-schedule-dialog-title" className="text-base font-semibold text-gray-900">
          Create New Schedule
        </h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="schedule-name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="schedule-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              maxLength={100}
              autoFocus
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>
          <div>
            <label htmlFor="schedule-timezone" className="block text-sm font-medium text-gray-700">
              Timezone
            </label>
            <select
              id="schedule-timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── DeleteScheduleDialog ─────────────────────────────────────────────────────

function DeleteScheduleDialog({
  scheduleName,
  onConfirm,
  onCancel,
  loading,
  error,
}: {
  scheduleName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  error?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-schedule-dialog-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 id="delete-schedule-dialog-title" className="text-base font-semibold text-gray-900">
          Delete &ldquo;{scheduleName}&rdquo;?
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          This will permanently delete this schedule and all its availability windows. This cannot be undone.
        </p>
        {error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Default Mon-Fri 9:00-17:00 availability for new schedules
const DEFAULT_AVAILABILITY = [1, 2, 3, 4, 5].map((day) => ({
  day,
  startTime: "09:00",
  endTime: "17:00",
}));

// ─── Main Component ──────────────────────────────────────────────────────────

export function AvailabilityEditor({ initialSchedules, userTimezone }: AvailabilityEditorProps) {
  const router = useRouter();
  const [schedules, setSchedules] = useState<ScheduleWithRelations[]>(initialSchedules);
  const [selectedId, setSelectedId] = useState<string>(
    initialSchedules.find((s) => s.isDefault)?.id ?? initialSchedules[0]?.id ?? ""
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const selectedSchedule = schedules.find((s) => s.id === selectedId) ?? schedules[0];

  // ─── Update selected schedule in local state ────────────────────────────────

  function updateScheduleInState(updated: ScheduleWithRelations) {
    setSchedules((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  }

  // ─── Save availability ────────────────────────────────────────────────────

  async function saveAvailability(availability: Array<Pick<Availability, "day" | "startTime" | "endTime">>) {
    if (!selectedSchedule) return;
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/schedules/${selectedSchedule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability }),
      });
      if (res.ok) {
        const data = await res.json();
        updateScheduleInState(data.data);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }

  // ─── Save name ───────────────────────────────────────────────────────────

  async function saveName(newName: string) {
    if (!selectedSchedule || newName.trim() === selectedSchedule.name) {
      setEditingName(false);
      return;
    }
    const trimmed = newName.trim();
    if (!trimmed) {
      setEditingName(false);
      return;
    }
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/schedules/${selectedSchedule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (res.ok) {
        const data = await res.json();
        updateScheduleInState(data.data);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
    setEditingName(false);
  }

  // ─── Save timezone ────────────────────────────────────────────────────────

  async function saveTimezone(timezone: string) {
    if (!selectedSchedule || timezone === selectedSchedule.timezone) return;
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/schedules/${selectedSchedule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone }),
      });
      if (res.ok) {
        const data = await res.json();
        updateScheduleInState(data.data);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }

  // ─── Save isDefault ───────────────────────────────────────────────────────

  async function saveIsDefault(isDefault: boolean) {
    if (!selectedSchedule) return;
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/schedules/${selectedSchedule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault }),
      });
      if (res.ok) {
        const data = await res.json();
        // Update all schedules — others may have had isDefault unset
        router.refresh();
        // Optimistically update local state
        setSchedules((prev) =>
          prev.map((s) => ({
            ...s,
            isDefault: s.id === selectedSchedule.id ? isDefault : isDefault ? false : s.isDefault,
          }))
        );
        updateScheduleInState(data.data);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }

  // ─── Create new schedule ──────────────────────────────────────────────────

  async function handleCreateSchedule(name: string, timezone: string) {
    const res = await fetch("/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        timezone,
        isDefault: false,
        availability: DEFAULT_AVAILABILITY,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const newSchedule: ScheduleWithRelations = data.data;
      setSchedules((prev) => [...prev, newSchedule]);
      setSelectedId(newSchedule.id);
      setShowCreateDialog(false);
    } else {
      throw new Error("Failed to create schedule");
    }
  }

  // ─── Delete schedule ──────────────────────────────────────────────────────

  async function handleDeleteSchedule() {
    if (!selectedSchedule) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/schedules/${selectedSchedule.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const remaining = schedules.filter((s) => s.id !== selectedSchedule.id);
        setSchedules(remaining);
        setSelectedId(remaining[0]?.id ?? "");
        setShowDeleteDialog(false);
        setDeleteError("");
      } else {
        const data = await res.json();
        setDeleteError(data.error ?? "Failed to delete schedule");
      }
    } catch {
      setDeleteError("Failed to delete schedule");
    } finally {
      setDeleteLoading(false);
    }
  }

  // ─── Date override callbacks ──────────────────────────────────────────────

  function handleOverrideAdded(override: DateOverride) {
    if (!selectedSchedule) return;
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === selectedSchedule.id
          ? { ...s, dateOverrides: [...s.dateOverrides, override].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) }
          : s
      )
    );
  }

  function handleOverrideDeleted(overrideId: string) {
    if (!selectedSchedule) return;
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === selectedSchedule.id
          ? { ...s, dateOverrides: s.dateOverrides.filter((o) => o.id !== overrideId) }
          : s
      )
    );
  }

  if (!selectedSchedule) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Availability</h2>
          <p className="mt-2 text-sm text-gray-600">
            Set your weekly schedule and manage your availability
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No schedules found. Create one to get started.</p>
          <button
            type="button"
            onClick={() => setShowCreateDialog(true)}
            className="mt-4 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Create Schedule
          </button>
        </div>
        {showCreateDialog && (
          <CreateScheduleDialog
            onConfirm={handleCreateSchedule}
            onCancel={() => setShowCreateDialog(false)}
            defaultTimezone={userTimezone}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Availability</h2>
          <p className="mt-1 text-sm text-gray-600">
            Set your weekly schedule and manage your availability
          </p>
        </div>
        <SaveIndicator status={saveStatus} />
      </div>

      {/* Schedule selector row */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedId}
          onChange={(e) => {
            if (e.target.value === "__create__") {
              setShowCreateDialog(true);
            } else {
              setSelectedId(e.target.value);
              setEditingName(false);
            }
          }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          aria-label="Select schedule"
        >
          {schedules.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}{s.isDefault ? " (Default)" : ""}
            </option>
          ))}
          <option value="__create__">+ Create New Schedule</option>
        </select>
      </div>

      {/* Schedule settings card */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Inline name editing */}
            <div className="flex items-center gap-2 min-w-0">
              {editingName ? (
                <input
                  ref={nameInputRef}
                  type="text"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onBlur={() => saveName(nameValue)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveName(nameValue);
                    if (e.key === "Escape") setEditingName(false);
                  }}
                  className="rounded-md border border-primary-300 px-2 py-1 text-sm font-medium text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  maxLength={100}
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setNameValue(selectedSchedule.name);
                    setEditingName(true);
                  }}
                  className="group flex items-center gap-1.5 rounded-md px-1 py-0.5 hover:bg-gray-100"
                  title="Click to rename"
                >
                  <span className="text-sm font-medium text-gray-900">{selectedSchedule.name}</span>
                  <svg
                    className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Timezone selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 shrink-0">Timezone:</label>
              <select
                value={selectedSchedule.timezone}
                onChange={(e) => saveTimezone(e.target.value)}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                aria-label="Schedule timezone"
              >
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
                {/* Include current timezone if not in list */}
                {!COMMON_TIMEZONES.includes(selectedSchedule.timezone) && (
                  <option value={selectedSchedule.timezone}>{selectedSchedule.timezone}</option>
                )}
              </select>
            </div>

            {/* Default toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                role="switch"
                aria-checked={selectedSchedule.isDefault}
                aria-label={selectedSchedule.isDefault ? "Remove as default schedule" : "Set as default schedule"}
                onClick={() => saveIsDefault(!selectedSchedule.isDefault)}
                disabled={selectedSchedule.isDefault}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-default",
                  selectedSchedule.isDefault ? "bg-primary-600" : "bg-gray-200"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                    selectedSchedule.isDefault ? "translate-x-4" : "translate-x-0.5"
                  )}
                />
              </button>
              <span className="text-sm text-gray-500">
                {selectedSchedule.isDefault ? "Default" : "Set as default"}
              </span>
            </div>
          </div>
        </div>

        {/* Weekly grid */}
        <div className="px-6 py-6">
          <WeeklyGrid
            availability={selectedSchedule.availability}
            onSave={saveAvailability}
          />
        </div>
      </div>

      {/* Date overrides */}
      <DateOverrides
        scheduleId={selectedSchedule.id}
        overrides={selectedSchedule.dateOverrides}
        onOverrideAdded={handleOverrideAdded}
        onOverrideDeleted={handleOverrideDeleted}
      />

      {/* Delete schedule */}
      <div className="rounded-lg border border-red-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Delete schedule</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {schedules.length <= 1
                ? "Cannot delete your only schedule"
                : selectedSchedule._count && selectedSchedule._count.eventTypes > 0
                ? `This schedule is used by ${selectedSchedule._count.eventTypes} event type${selectedSchedule._count.eventTypes !== 1 ? "s" : ""} and cannot be deleted`
                : "Permanently delete this schedule"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => { setDeleteError(""); setShowDeleteDialog(true); }}
            disabled={
              schedules.length <= 1 ||
              (selectedSchedule._count !== undefined && selectedSchedule._count.eventTypes > 0)
            }
            className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Dialogs */}
      {showCreateDialog && (
        <CreateScheduleDialog
          onConfirm={handleCreateSchedule}
          onCancel={() => setShowCreateDialog(false)}
          defaultTimezone={userTimezone}
        />
      )}
      {showDeleteDialog && (
        <DeleteScheduleDialog
          scheduleName={selectedSchedule.name}
          onConfirm={handleDeleteSchedule}
          onCancel={() => { setShowDeleteDialog(false); setDeleteError(""); }}
          loading={deleteLoading}
          error={deleteError}
        />
      )}
    </div>
  );
}
