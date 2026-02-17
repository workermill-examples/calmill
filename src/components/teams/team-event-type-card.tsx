"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TeamEventTypeCardData {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  duration: number;
  color?: string | null;
  isActive: boolean;
  schedulingType: "ROUND_ROBIN" | "COLLECTIVE" | null;
  _count?: { bookings: number };
}

export interface TeamEventTypeCardProps {
  eventType: TeamEventTypeCardData;
  teamSlug: string;
  appUrl: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} hr`;
  return `${hours} hr ${remaining} min`;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ClockIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

// ─── Scheduling Type Badge ─────────────────────────────────────────────────────

function SchedulingTypeBadge({ type }: { type: "ROUND_ROBIN" | "COLLECTIVE" | null }) {
  if (!type) return null;

  const config = {
    ROUND_ROBIN: {
      label: "Round Robin",
      className: "bg-blue-50 text-blue-700 border border-blue-200",
    },
    COLLECTIVE: {
      label: "Collective",
      className: "bg-purple-50 text-purple-700 border border-purple-200",
    },
  };

  const { label, className } = config[type];

  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", className)}>
      {label}
    </span>
  );
}

// ─── Delete Confirmation Dialog ───────────────────────────────────────────────

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
      aria-labelledby="delete-team-et-dialog-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 id="delete-team-et-dialog-title" className="text-base font-semibold text-gray-900">
          Delete &ldquo;{title}&rdquo;?
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          This will permanently delete this event type and all associated bookings. This action cannot be undone.
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

// ─── Main Component ───────────────────────────────────────────────────────────

export function TeamEventTypeCard({ eventType, teamSlug, appUrl }: TeamEventTypeCardProps) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const bookingUrl = `${appUrl}/team/${teamSlug}/${eventType.slug}`;
  const barColor = eventType.color ?? "#8b5cf6";
  const bookingCount = eventType._count?.bookings ?? 0;

  async function handleDelete() {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/teams/${teamSlug}/event-types/${eventType.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setShowDeleteConfirm(false);
        router.refresh();
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
    <>
      <div
        className={cn(
          "relative flex items-center gap-0 rounded-lg border border-gray-200 bg-white overflow-hidden",
          "transition-shadow hover:shadow-md",
          !eventType.isActive && "opacity-60"
        )}
      >
        {/* Left color bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: barColor }}
          aria-hidden="true"
        />

        {/* Card content */}
        <div className="flex flex-1 items-center gap-4 pl-5 pr-4 py-4">
          {/* Main info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 truncate">{eventType.title}</h3>
              <SchedulingTypeBadge type={eventType.schedulingType} />
              {!eventType.isActive && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  Inactive
                </span>
              )}
            </div>

            {/* Booking URL preview */}
            <p className="mt-0.5 text-xs text-gray-500 truncate">
              /team/{teamSlug}/{eventType.slug}
            </p>

            {/* Meta row */}
            <div className="mt-1.5 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 rounded px-1.5 py-0.5">
                <ClockIcon />
                {formatDuration(eventType.duration)}
              </span>
              <span className="text-xs text-gray-400">
                {bookingCount} booking{bookingCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Right side: actions */}
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Preview booking page"
              aria-label={`Preview ${eventType.title} booking page`}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus-ring transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <Link
              href={`/event-types/${eventType.id}`}
              title="Edit event type"
              aria-label={`Edit ${eventType.title}`}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus-ring transition-colors"
            >
              <EditIcon />
            </Link>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete event type"
              aria-label={`Delete ${eventType.title}`}
              className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-danger focus-ring transition-colors"
            >
              <TrashIcon />
            </button>
          </div>
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
    </>
  );
}
