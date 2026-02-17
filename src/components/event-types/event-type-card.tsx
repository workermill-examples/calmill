"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { EventTypeLocation } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EventTypeCardData {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  duration: number;
  locations?: EventTypeLocation[] | null;
  color?: string | null;
  isActive: boolean;
  _count?: { bookings: number };
}

export interface EventTypeCardProps {
  eventType: EventTypeCardData;
  username: string;
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

function VideoIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.72v6.56a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
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

function DuplicateIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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

// ─── Location display ─────────────────────────────────────────────────────────

function LocationBadge({ locations }: { locations: EventTypeLocation[] }) {
  const primary = locations[0];
  if (!primary) return null;

  const iconMap = {
    link: <VideoIcon />,
    inPerson: <LocationPinIcon />,
    phone: <PhoneIcon />,
  };
  const labelMap = {
    link: "Video call",
    inPerson: "In-person",
    phone: "Phone call",
  };

  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
      {iconMap[primary.type]}
      {labelMap[primary.type]}
    </span>
  );
}

// ─── Toggle Switch ─────────────────────────────────────────────────────────────

function ToggleSwitch({
  checked,
  onChange,
  loading,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  loading: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onChange();
      }}
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
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus the cancel button when the dialog opens
  useEffect(() => {
    const t = setTimeout(() => cancelRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onCancel();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [loading, onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 id="delete-dialog-title" className="text-base font-semibold text-gray-900">
          Delete &ldquo;{title}&rdquo;?
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          This will permanently delete this event type. This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            ref={cancelRef}
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

export function EventTypeCard({ eventType, username, appUrl }: EventTypeCardProps) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(eventType.isActive);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const bookingUrl = `${appUrl}/${username}/${eventType.slug}`;
  const barColor = eventType.color ?? "#3b82f6";
  const locations = eventType.locations;
  const bookingCount = eventType._count?.bookings ?? 0;

  async function handleToggle() {
    const previousValue = isActive;
    setToggleLoading(true);
    setIsActive(!previousValue); // optimistic update
    try {
      const res = await fetch(`/api/event-types/${eventType.id}/toggle`, {
        method: "PATCH",
      });
      if (!res.ok) {
        setIsActive(previousValue); // revert to captured snapshot
      }
    } catch {
      setIsActive(previousValue); // revert to captured snapshot
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

  async function handleDuplicate() {
    try {
      const res = await fetch("/api/event-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${eventType.title} (copy)`,
          duration: eventType.duration,
          ...(eventType.description && { description: eventType.description }),
          ...(eventType.color && { color: eventType.color }),
          ...(locations && { locations }),
        }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Failed to duplicate event type");
      }
    } catch {
      alert("Failed to duplicate event type");
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(bookingUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <div
        className={cn(
          "relative flex items-center gap-0 rounded-lg border border-gray-200 bg-white overflow-hidden",
          "transition-shadow hover:shadow-md",
          !isActive && "opacity-60"
        )}
      >
        {/* Left color bar — 4px wide */}
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
              {!isActive && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  Inactive
                </span>
              )}
            </div>

            {/* Slug preview URL */}
            <p className="mt-0.5 text-xs text-gray-500 truncate">
              /{username}/{eventType.slug}
            </p>

            {/* Meta row: duration + location */}
            <div className="mt-1.5 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 rounded px-1.5 py-0.5">
                <ClockIcon />
                {formatDuration(eventType.duration)}
              </span>
              {locations && locations.length > 0 && (
                <LocationBadge locations={locations} />
              )}
              <span className="text-xs text-gray-400">
                {bookingCount} booking{bookingCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Right side: toggle + actions */}
          <div className="flex items-center gap-3 shrink-0">
            <ToggleSwitch
              checked={isActive}
              onChange={handleToggle}
              loading={toggleLoading}
              label={`${isActive ? "Deactivate" : "Activate"} ${eventType.title}`}
            />

            {/* Quick actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopyLink}
                title="Copy booking link"
                aria-label="Copy booking link"
                className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus-ring transition-colors"
              >
                {copied ? (
                  <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <CopyIcon />
                )}
              </button>

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
                onClick={handleDuplicate}
                title="Duplicate event type"
                aria-label={`Duplicate ${eventType.title}`}
                className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus-ring transition-colors"
              >
                <DuplicateIcon />
              </button>

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
