"use client";

import * as React from "react";
import { cn, formatDateInTimezone } from "@/lib/utils";
import type { AvailableSlot } from "@/types";

export interface SlotListProps {
  /** Available time slots to display */
  slots: AvailableSlot[];
  /** Currently selected slot, or null */
  selectedSlot: AvailableSlot | null;
  /** Callback when a slot button is clicked (highlights it) */
  onSelect: (slot: AvailableSlot) => void;
  /** Callback when the Confirm button is clicked for the selected slot */
  onConfirm?: (slot: AvailableSlot) => void;
  /** IANA timezone for display formatting */
  timezone: string;
  /** Whether slots are being loaded */
  isLoading?: boolean;
  /** Optional className for the outer container */
  className?: string;
}

/** Skeleton placeholder for a single slot button */
function SlotSkeleton() {
  return (
    <div
      className="h-10 w-full animate-pulse rounded-md bg-gray-100"
      aria-hidden="true"
    />
  );
}

/** Arrow right icon for the confirm button */
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

/**
 * SlotList — vertical list of available time slot buttons.
 *
 * Displays a scrollable list of clickable time slots for a selected date.
 * When a slot is clicked, it shows a "Confirm" button inline.
 * Shows a loading skeleton while slots are being fetched.
 * Shows an empty state message when no slots are available.
 *
 * Times are formatted in the attendee's timezone using date-fns.
 */
export function SlotList({
  slots,
  selectedSlot,
  onSelect,
  onConfirm,
  timezone,
  isLoading = false,
  className,
}: SlotListProps) {
  // Loading state: show skeleton placeholders
  if (isLoading) {
    return (
      <div
        className={cn("flex flex-col gap-2", className)}
        aria-label="Loading available times"
        aria-busy="true"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SlotSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state: no slots for this date
  if (slots.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-10 text-center",
          className
        )}
      >
        <p className="text-sm font-medium text-gray-500">
          No available times on this date
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Please select another date
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      role="listbox"
      aria-label="Available time slots"
    >
      {slots.map((slot) => {
        const isSelected =
          selectedSlot !== null && selectedSlot.time === slot.time;

        // Format the time in the attendee's timezone, e.g. "10:00 AM"
        const timeLabel = formatDateInTimezone(slot.time, timezone, "h:mm a");

        return (
          <div key={slot.time} className="flex gap-2">
            {/* Slot button */}
            <button
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelect(slot)}
              className={cn(
                "flex h-10 flex-1 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
                isSelected
                  ? "border-primary-600 bg-primary-600 text-white hover:bg-primary-700"
                  : "border-gray-300 bg-white text-gray-900 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700"
              )}
            >
              {timeLabel}
            </button>

            {/* Confirm button — appears when this slot is selected */}
            {isSelected && (
              <button
                type="button"
                onClick={() => (onConfirm ?? onSelect)(slot)}
                className={cn(
                  "flex h-10 shrink-0 items-center gap-1.5 rounded-md px-4 text-sm font-semibold",
                  "bg-primary-600 text-white transition-colors",
                  "hover:bg-primary-700",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                )}
                aria-label={`Confirm ${timeLabel}`}
              >
                Confirm
                <ArrowRightIcon />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
