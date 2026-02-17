"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format, startOfMonth, endOfMonth, addMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarPicker } from "@/components/booking/calendar-picker";
import { SlotList } from "@/components/booking/slot-list";
import { TimezoneSelect, detectTimezone } from "@/components/booking/timezone-select";
import { BookingForm } from "@/components/booking/booking-form";
import type { AvailableSlot, EventTypeLocation, CustomQuestion } from "@/types";

// ─── PROPS ───────────────────────────────────────────────────

export interface BookingPageClientProps {
  /** CUID of the event type */
  eventTypeId: string;
  /** Display title */
  eventTypeTitle: string;
  /** Duration in minutes */
  duration: number;
  /** Hex color for the event type header bar */
  color: string | null;
  /** Username of the host */
  username: string;
  /** Locations for the event type */
  locations: EventTypeLocation[] | null;
  /** Custom questions for the booking form */
  customQuestions: CustomQuestion[];
  /** Day week starts: 0 = Sunday, 1 = Monday */
  weekStart?: 0 | 1;
  /** Optional pre-selected date from query param (YYYY-MM-DD) */
  initialDate?: string | null;
}

// ─── BOOKING FLOW STATE ──────────────────────────────────────

type BookingView = "calendar" | "form";

// ─── ICONS ───────────────────────────────────────────────────

function ChevronLeftIcon({ className }: { className?: string }) {
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
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
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
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function VideoIcon({ className }: { className?: string }) {
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
        d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
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
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
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
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"
      />
    </svg>
  );
}

// ─── LOCATION DISPLAY ─────────────────────────────────────────

function LocationDisplay({ locations }: { locations: EventTypeLocation[] | null }) {
  if (!locations || locations.length === 0) return null;

  const loc = locations[0];
  if (!loc) return null;
  const Icon =
    loc.type === "link"
      ? VideoIcon
      : loc.type === "phone"
      ? PhoneIcon
      : MapPinIcon;

  const label =
    loc.type === "link"
      ? "Video call"
      : loc.type === "phone"
      ? "Phone call"
      : loc.value || "In person";

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Icon className="shrink-0 text-gray-400" />
      <span>{label}</span>
    </div>
  );
}

// ─── SLOT FETCHING ────────────────────────────────────────────

interface SlotsData {
  /** All slots indexed by local date key "YYYY-MM-DD" */
  byDate: Record<string, AvailableSlot[]>;
  /** Set of dates that have at least one slot */
  availableDates: Set<string>;
}

/**
 * Fetches slots for a date range and groups them by local date key.
 * We fetch a 3-month window so the calendar shows availability even when
 * the user navigates months without triggering an explicit refetch event.
 */
async function fetchSlots(
  eventTypeId: string,
  startDate: string,
  endDate: string,
  timezone: string
): Promise<SlotsData> {
  const url =
    `/api/slots` +
    `?eventTypeId=${encodeURIComponent(eventTypeId)}` +
    `&startDate=${startDate}` +
    `&endDate=${endDate}` +
    `&timezone=${encodeURIComponent(timezone)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Slots fetch failed: ${res.status}`);
  }

  const json = await res.json();
  const slots: AvailableSlot[] = json?.data ?? [];

  // Group by the local date in the attendee's timezone using en-CA locale (YYYY-MM-DD)
  const byDate: Record<string, AvailableSlot[]> = {};
  for (const slot of slots) {
    const utcDate = new Date(slot.time);
    const localDateStr = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(utcDate);

    const existing = byDate[localDateStr];
    if (!existing) {
      byDate[localDateStr] = [slot];
    } else {
      existing.push(slot);
    }
  }

  return { byDate, availableDates: new Set(Object.keys(byDate)) };
}

// ─── MAIN CLIENT COMPONENT ───────────────────────────────────

/**
 * BookingPageClient — manages the 2-state booking flow:
 *
 *   State 1 (calendar): Date/time selection with CalendarPicker + SlotList
 *   State 2 (form):     BookingForm with attendee details
 *
 * After successful booking creation, redirects to /booking/[uid].
 *
 * Since CalendarPicker manages its own month-navigation state internally
 * (per DEC-001), we pre-fetch a 3-month window on mount and again whenever
 * the timezone changes, so CalendarPicker always has the right availableDates.
 */
export function BookingPageClient({
  eventTypeId,
  eventTypeTitle,
  duration,
  color,
  username,
  locations,
  customQuestions,
  weekStart = 0,
  initialDate,
}: BookingPageClientProps) {
  const router = useRouter();

  // ── Timezone state ─────────────────────────────────────────
  const [timezone, setTimezone] = React.useState<string>(() => detectTimezone());

  // ── Date selection ──────────────────────────────────────────
  const [selectedDate, setSelectedDate] = React.useState<string | null>(
    initialDate ?? null
  );

  // ── Slot state ──────────────────────────────────────────────
  const [slotsData, setSlotsData] = React.useState<SlotsData>({
    byDate: {},
    availableDates: new Set(),
  });
  const [isSlotsLoading, setIsSlotsLoading] = React.useState(true);
  const [slotsError, setSlotsError] = React.useState<string | null>(null);

  // ── Selected slot ───────────────────────────────────────────
  const [selectedSlot, setSelectedSlot] = React.useState<AvailableSlot | null>(null);

  // ── View state ──────────────────────────────────────────────
  const [view, setView] = React.useState<BookingView>("calendar");

  // ── Date range for pre-fetch (3 months from today / initialDate month) ───
  const fetchRange = React.useMemo(() => {
    const base = initialDate
      ? startOfMonth(new Date(initialDate + "T00:00:00"))
      : startOfMonth(new Date());
    const start = format(base, "yyyy-MM-dd");
    const end = format(endOfMonth(addMonths(base, 2)), "yyyy-MM-dd");
    return { start, end };
  }, [initialDate]);

  // ── Fetch slots when timezone changes (or on first mount) ───
  const doFetch = React.useCallback(
    (tz: string) => {
      setIsSlotsLoading(true);
      setSlotsError(null);
      setSelectedSlot(null);

      fetchSlots(eventTypeId, fetchRange.start, fetchRange.end, tz)
        .then((data) => {
          setSlotsData(data);
          setIsSlotsLoading(false);
        })
        .catch(() => {
          setSlotsError("Failed to load available times. Please try again.");
          setIsSlotsLoading(false);
        });
    },
    [eventTypeId, fetchRange.start, fetchRange.end]
  );

  React.useEffect(() => {
    doFetch(timezone);
  }, [timezone, doFetch]);

  // ── Handlers ────────────────────────────────────────────────

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleTimezoneChange = (tz: string) => {
    setTimezone(tz);
    setSelectedDate(null);
    setSelectedSlot(null);
    // doFetch will be called by the useEffect dependency on timezone
  };

  const handleSlotConfirm = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setView("form");
  };

  const handleFormBack = () => {
    setView("calendar");
    setSelectedSlot(null);
  };

  const handleBookingSuccess = (booking: Record<string, unknown>) => {
    const uid = booking.uid as string;
    if (uid) {
      router.push(`/booking/${uid}`);
    }
  };

  // ── Derived values ──────────────────────────────────────────

  const slotsForSelectedDate: AvailableSlot[] =
    selectedDate ? (slotsData.byDate[selectedDate] ?? []) : [];

  const headerColor = color ?? "#3b82f6";

  const selectedDateLabel = selectedDate
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: timezone,
      }).format(new Date(selectedDate + "T12:00:00"))
    : null;

  // ─── FORM VIEW (State 2) ────────────────────────────────────

  if (view === "form" && selectedSlot) {
    return (
      <div className="mx-auto max-w-lg">
        {/* Color bar */}
        <div
          className="mb-6 h-1.5 rounded-full"
          style={{ backgroundColor: headerColor }}
          aria-hidden="true"
        />

        {/* Back to profile */}
        <div className="mb-4">
          <a
            href={`/${username}`}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeftIcon />
            Back to profile
          </a>
        </div>

        {/* Event info summary */}
        <div className="mb-6 space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">{eventTypeTitle}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="text-gray-400" />
            <span>{duration} min</span>
          </div>
          <LocationDisplay locations={locations} />
        </div>

        <BookingForm
          eventTypeId={eventTypeId}
          eventTypeTitle={eventTypeTitle}
          duration={duration}
          selectedSlot={selectedSlot}
          timezone={timezone}
          customQuestions={customQuestions}
          onSuccess={handleBookingSuccess}
          onBack={handleFormBack}
        />
      </div>
    );
  }

  // ─── CALENDAR VIEW (State 1) ────────────────────────────────

  return (
    <div className="mx-auto max-w-5xl">
      {/* Color bar */}
      <div
        className="mb-6 h-1.5 rounded-full"
        style={{ backgroundColor: headerColor }}
        aria-hidden="true"
      />

      {/* Back link + event info */}
      <div className="mb-6">
        <a
          href={`/${username}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeftIcon />
          Back to profile
        </a>
        <div className="mt-3 space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">{eventTypeTitle}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <ClockIcon className="text-gray-400" />
              <span>{duration} min</span>
            </div>
            <LocationDisplay locations={locations} />
          </div>
        </div>
      </div>

      {/* Two-panel layout: calendar left, slots right */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left panel: Calendar */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
          {isSlotsLoading ? (
            <CalendarLoadingSkeleton />
          ) : (
            <CalendarPicker
              availableDates={slotsData.availableDates}
              selectedDate={selectedDate}
              onSelect={handleDateSelect}
              weekStart={weekStart}
            />
          )}
        </div>

        {/* Right panel: Timezone + slots */}
        <div className="space-y-4">
          <TimezoneSelect value={timezone} onChange={handleTimezoneChange} />

          {selectedDate ? (
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              {selectedDateLabel && (
                <h2 className="mb-4 text-sm font-semibold text-gray-900">
                  {selectedDateLabel}
                </h2>
              )}

              {slotsError ? (
                <div className="py-4 text-center">
                  <p className="text-sm text-red-600">{slotsError}</p>
                  <button
                    type="button"
                    onClick={() => doFetch(timezone)}
                    className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <SlotList
                  slots={slotsForSelectedDate}
                  selectedSlot={selectedSlot}
                  onSelect={setSelectedSlot}
                  onConfirm={handleSlotConfirm}
                  timezone={timezone}
                  isLoading={isSlotsLoading}
                />
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
              <p className="text-sm text-gray-500">
                {isSlotsLoading
                  ? "Loading available times..."
                  : "Select a date to see available times"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── LOADING SKELETON FOR CALENDAR ───────────────────────────

function CalendarLoadingSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Loading calendar" role="status">
      {/* Month header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="h-4 w-8 rounded bg-gray-200" />
        <div className="h-5 w-32 rounded bg-gray-200" />
        <div className="h-4 w-8 rounded bg-gray-200" />
      </div>
      {/* Day-of-week headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-gray-100" />
        ))}
      </div>
      {/* Day cells — 5 rows */}
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} className="mb-1 grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, col) => (
            <div key={col} className="h-9 rounded-full bg-gray-100" />
          ))}
        </div>
      ))}
      <span className="sr-only">Loading calendar...</span>
    </div>
  );
}
