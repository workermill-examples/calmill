"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn, debounce } from "@/lib/utils";
import { GeneralTab } from "./general-tab";
import { AvailabilityTab } from "./availability-tab";
import { LimitsTab } from "./limits-tab";
import { BookingTab } from "./booking-tab";
import { RecurringTab } from "./recurring-tab";
import type { EventType, Schedule, Availability, DateOverride } from "@/generated/prisma/client";
import type { EventTypeLocation, CustomQuestion } from "@/types";

// ─── Types ──────────────────────────────────────────────────────────────────

export type EditorEventType = Omit<EventType, "locations" | "customQuestions" | "schedule"> & {
  locations: EventTypeLocation[] | null;
  customQuestions: CustomQuestion[] | null;
  schedule: (Schedule & {
    availability: Availability[];
    dateOverrides: DateOverride[];
  }) | null;
};

export type EventTypeFields = Partial<{
  title: string;
  slug: string;
  description: string | null;
  duration: number;
  locations: EventTypeLocation[];
  color: string | null;
  requiresConfirmation: boolean;
  minimumNotice: number;
  beforeBuffer: number;
  afterBuffer: number;
  slotInterval: number | null;
  maxBookingsPerDay: number | null;
  maxBookingsPerWeek: number | null;
  futureLimit: number;
  customQuestions: CustomQuestion[];
  successRedirectUrl: string | null;
  recurringEnabled: boolean;
  recurringFrequency: string | null;
  recurringMaxOccurrences: number | null;
  scheduleId: string | null;
  isActive: boolean;
}>;

interface EditorProps {
  eventType: EditorEventType;
  username: string;
  appUrl: string;
}

type TabId = "general" | "availability" | "limits" | "booking" | "recurring";

const TABS: { id: TabId; label: string }[] = [
  { id: "general", label: "General" },
  { id: "availability", label: "Availability" },
  { id: "limits", label: "Limits & Buffers" },
  { id: "booking", label: "Booking Form" },
  { id: "recurring", label: "Recurring" },
];

// ─── Delete Confirm Dialog ──────────────────────────────────────────────────

function DeleteConfirmDialog({
  title,
  onConfirm,
  onCancel,
  loading,
}: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-et-dialog-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 id="delete-et-dialog-title" className="text-base font-semibold text-gray-900">
          Delete &ldquo;{title}&rdquo;?
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          This will permanently delete this event type and cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-ring disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus-ring disabled:opacity-50"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Save Status ────────────────────────────────────────────────────────────

type SaveStatus = "idle" | "saving" | "saved" | "error";

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
      <span className="flex items-center gap-1.5 text-sm text-success">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Saved
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-sm text-danger">
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      Save failed
    </span>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function HeaderToggle({
  checked,
  onChange,
  loading,
}: {
  checked: boolean;
  onChange: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">{checked ? "Active" : "Inactive"}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={checked ? "Deactivate event type" : "Activate event type"}
        onClick={onChange}
        disabled={loading}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-ring disabled:opacity-50",
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
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function EventTypeEditor({ eventType, username, appUrl }: EditorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isActive, setIsActive] = useState(eventType.isActive);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [title, setTitle] = useState(eventType.title);

  const bookingUrl = `${appUrl}/${username}/${eventType.slug}`;

  // Save a partial update to the API
  const save = useCallback(async (fields: EventTypeFields) => {
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/event-types/${eventType.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
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
  }, [eventType.id]);

  // Debounced save — used by tab components for auto-save on blur
  const debouncedSave = useMemo(() => debounce(save, 500), [save]);

  async function handleToggle() {
    const previousValue = isActive;
    setToggleLoading(true);
    setIsActive(!previousValue);
    try {
      const res = await fetch(`/api/event-types/${eventType.id}/toggle`, {
        method: "PATCH",
      });
      if (!res.ok) {
        setIsActive(previousValue);
      }
    } catch {
      setIsActive(previousValue);
    } finally {
      setToggleLoading(false);
    }
  }

  async function handleDelete() {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/event-types/${eventType.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/event-types");
      } else {
        const data = await res.json();
        alert(data.error ?? "Failed to delete event type");
        setShowDeleteConfirm(false);
      }
    } catch {
      alert("Failed to delete event type");
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Back + title */}
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/event-types"
                className="shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus-ring transition-colors"
                aria-label="Back to event types"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
            </div>

            {/* Right side: status + actions */}
            <div className="flex items-center gap-3 shrink-0">
              <SaveIndicator status={saveStatus} />
              <HeaderToggle
                checked={isActive}
                onChange={handleToggle}
                loading={toggleLoading}
              />
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-ring transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Preview
              </a>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-danger focus-ring transition-colors"
                aria-label="Delete event type"
                title="Delete event type"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="mt-4 -mb-px flex gap-1" role="tablist" aria-label="Event type settings">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors focus-ring rounded-t-md",
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-700"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab panels */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div
          role="tabpanel"
          id="panel-general"
          aria-labelledby="tab-general"
          hidden={activeTab !== "general"}
        >
          {activeTab === "general" && (
            <GeneralTab
              eventType={eventType}
              username={username}
              onSave={debouncedSave}
              onTitleChange={setTitle}
            />
          )}
        </div>

        <div
          role="tabpanel"
          id="panel-availability"
          aria-labelledby="tab-availability"
          hidden={activeTab !== "availability"}
        >
          {activeTab === "availability" && (
            <AvailabilityTab
              eventType={eventType}
              onSave={debouncedSave}
            />
          )}
        </div>

        <div
          role="tabpanel"
          id="panel-limits"
          aria-labelledby="tab-limits"
          hidden={activeTab !== "limits"}
        >
          {activeTab === "limits" && (
            <LimitsTab
              eventType={eventType}
              onSave={debouncedSave}
            />
          )}
        </div>

        <div
          role="tabpanel"
          id="panel-booking"
          aria-labelledby="tab-booking"
          hidden={activeTab !== "booking"}
        >
          {activeTab === "booking" && (
            <BookingTab
              eventType={eventType}
              onSave={debouncedSave}
            />
          )}
        </div>

        <div
          role="tabpanel"
          id="panel-recurring"
          aria-labelledby="tab-recurring"
          hidden={activeTab !== "recurring"}
        >
          {activeTab === "recurring" && (
            <RecurringTab
              eventType={eventType}
              onSave={debouncedSave}
            />
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmDialog
          title={eventType.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
