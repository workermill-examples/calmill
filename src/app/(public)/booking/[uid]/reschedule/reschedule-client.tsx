'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { format, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarPicker } from '@/components/booking/calendar-picker';
import { SlotList } from '@/components/booking/slot-list';
import { TimezoneSelect, detectTimezone } from '@/components/booking/timezone-select';
import type { AvailableSlot, EventTypeLocation } from '@/types';

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface ReschedulePageClientProps {
  uid: string;
  eventTypeId: string;
  eventTypeTitle: string;
  eventTypeColor: string | null;
  duration: number;
  locations: EventTypeLocation[] | null;
  weekStart: 0 | 1;
  originalFormattedTime: string;
  originalTimezone: string;
}

// ─── SLOT DATA ────────────────────────────────────────────────────────────────

interface SlotsData {
  byDate: Record<string, AvailableSlot[]>;
  availableDates: Set<string>;
}

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

  const byDate: Record<string, AvailableSlot[]> = {};
  for (const slot of slots) {
    const utcDate = new Date(slot.time);
    const localDateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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

// ─── ICON COMPONENTS ──────────────────────────────────────────────────────────

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
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
      className={cn('h-4 w-4', className)}
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
      className={cn('h-4 w-4', className)}
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
      className={cn('h-4 w-4', className)}
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

// ─── LOCATION DISPLAY ─────────────────────────────────────────────────────────

function LocationDisplay({ locations }: { locations: EventTypeLocation[] | null }) {
  if (!locations || locations.length === 0) return null;

  const loc = locations[0];
  if (!loc) return null;
  const Icon = loc.type === 'link' ? VideoIcon : loc.type === 'phone' ? PhoneIcon : MapPinIcon;

  const label =
    loc.type === 'link'
      ? 'Video call'
      : loc.type === 'phone'
        ? 'Phone call'
        : loc.value || 'In person';

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Icon className="shrink-0 text-gray-400" />
      <span>{label}</span>
    </div>
  );
}

// ─── CALENDAR LOADING SKELETON ────────────────────────────────────────────────

function CalendarLoadingSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Loading calendar" role="status">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-4 w-8 rounded bg-gray-200" />
        <div className="h-5 w-32 rounded bg-gray-200" />
        <div className="h-4 w-8 rounded bg-gray-200" />
      </div>
      <div className="mb-2 grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-gray-100" />
        ))}
      </div>
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

// ─── MAIN CLIENT COMPONENT ────────────────────────────────────────────────────

export default function ReschedulePageClient({
  uid,
  eventTypeId,
  eventTypeTitle,
  eventTypeColor,
  duration,
  locations,
  weekStart,
  originalFormattedTime,
  originalTimezone,
}: ReschedulePageClientProps) {
  const router = useRouter();

  const [timezone, setTimezone] = React.useState<string>(() => detectTimezone());
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = React.useState<AvailableSlot | null>(null);
  const [reason, setReason] = React.useState('');
  const [slotsData, setSlotsData] = React.useState<SlotsData>({
    byDate: {},
    availableDates: new Set(),
  });
  const [isSlotsLoading, setIsSlotsLoading] = React.useState(true);
  const [slotsError, setSlotsError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // ── Fetch range: 3 months from today ──────────────────────────────────────
  const fetchRange = React.useMemo(() => {
    const base = startOfMonth(new Date());
    const start = format(base, 'yyyy-MM-dd');
    const end = format(endOfMonth(addMonths(base, 2)), 'yyyy-MM-dd');
    return { start, end };
  }, []);

  // ── Fetch slots ────────────────────────────────────────────────────────────
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
          setSlotsError('Failed to load available times. Please try again.');
          setIsSlotsLoading(false);
        });
    },
    [eventTypeId, fetchRange.start, fetchRange.end]
  );

  React.useEffect(() => {
    doFetch(timezone);
  }, [timezone, doFetch]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleTimezoneChange = (tz: string) => {
    setTimezone(tz);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleReschedule = async (slot: AvailableSlot) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/bookings/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: slot.time,
          reason: reason.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 409) {
          setSubmitError(
            data.error ?? 'That time slot is no longer available. Please select another.'
          );
        } else {
          setSubmitError('Something went wrong. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      const newUid = data?.data?.uid as string | undefined;
      if (newUid) {
        router.push(`/booking/${newUid}`);
      } else {
        router.push(`/booking/${uid}`);
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────

  const slotsForSelectedDate: AvailableSlot[] = selectedDate
    ? (slotsData.byDate[selectedDate] ?? [])
    : [];

  const selectedDateLabel = selectedDate
    ? new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: timezone,
      }).format(new Date(selectedDate + 'T12:00:00'))
    : null;

  const headerColor = eventTypeColor ?? '#3b82f6';

  const formattedDuration =
    duration >= 60 ? `${duration / 60} hr${duration > 60 ? 's' : ''}` : `${duration} min`;

  // ── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-5xl">
      {/* Color bar */}
      <div
        className="mb-6 h-1.5 rounded-full"
        style={{ backgroundColor: headerColor }}
        aria-hidden="true"
      />

      {/* Back link + header */}
      <div className="mb-6">
        <a
          href={`/booking/${uid}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeftIcon />
          Back to booking details
        </a>

        <div className="mt-3 space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Reschedule your meeting</h1>

          {/* Original time — crossed out */}
          <div className="flex items-start gap-2 text-sm">
            <span className="text-gray-500">Original time:</span>
            <span
              className="line-through text-gray-400"
              aria-label={`Original time: ${originalFormattedTime}`}
            >
              {originalFormattedTime}
            </span>
            <span className="text-xs text-gray-400">({originalTimezone})</span>
          </div>

          {/* Event metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{eventTypeTitle}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ClockIcon className="text-gray-400" />
              <span>{formattedDuration}</span>
            </div>
            <LocationDisplay locations={locations} />
          </div>
        </div>
      </div>

      {/* Two-panel layout: calendar left, slots right */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: Calendar */}
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

        {/* Right: Timezone + Slots + Reason + Submit */}
        <div className="space-y-4">
          <TimezoneSelect value={timezone} onChange={handleTimezoneChange} />

          {selectedDate ? (
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
              {selectedDateLabel && (
                <h2 className="text-sm font-semibold text-gray-900">{selectedDateLabel}</h2>
              )}

              {slotsError ? (
                <div className="py-4 text-center">
                  <p className="text-sm text-red-600">{slotsError}</p>
                  <button
                    type="button"
                    onClick={() => doFetch(timezone)}
                    className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <SlotList
                  slots={slotsForSelectedDate}
                  selectedSlot={selectedSlot}
                  onSelect={setSelectedSlot}
                  timezone={timezone}
                  isLoading={isSlotsLoading}
                />
              )}

              {/* Reason + Reschedule button — shown once a slot is selected */}
              {selectedSlot && !slotsError && (
                <div className="space-y-3 border-t border-gray-100 pt-3">
                  <div>
                    <label
                      htmlFor="reschedule-reason"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Reason for rescheduling{' '}
                      <span className="font-normal text-gray-500">(optional)</span>
                    </label>
                    <textarea
                      id="reschedule-reason"
                      rows={2}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Let the host know why you need to reschedule..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {submitError && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3">
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleReschedule(selectedSlot)}
                    disabled={isSubmitting}
                    className={cn(
                      'flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5',
                      'bg-blue-600 text-sm font-semibold text-white shadow-sm',
                      'hover:bg-blue-700 transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Rescheduling...
                      </>
                    ) : (
                      'Confirm Reschedule'
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
              <p className="text-sm text-gray-500">
                {isSlotsLoading
                  ? 'Loading available times...'
                  : 'Select a new date to see available times'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
