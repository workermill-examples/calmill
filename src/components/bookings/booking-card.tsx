'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatDateInTimezone } from '@/lib/utils';
import type { EventTypeLocation } from '@/types';
import type { BookingStatus } from '@/generated/prisma/client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookingCardData {
  uid: string;
  title: string;
  startTime: Date | string;
  endTime: Date | string;
  status: BookingStatus;
  attendeeName: string;
  attendeeEmail: string;
  attendeeTimezone: string;
  location?: string | null;
  cancellationReason?: string | null;
  recurringEventId?: string | null;
  eventType: {
    id: string;
    title: string;
    duration: number;
    locations?: EventTypeLocation[] | null;
    color?: string | null;
  };
}

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800',
  },
  ACCEPTED: {
    label: 'Confirmed',
    className: 'bg-green-100 text-green-800',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-700',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-700',
  },
  RESCHEDULED: {
    label: 'Rescheduled',
    className: 'bg-blue-100 text-blue-800',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} hr`;
  return `${hours} hr ${remaining} min`;
}

function formatBookingDateTime(
  startTime: Date | string,
  endTime: Date | string,
  timezone: string
): { date: string; time: string } {
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
  const end = typeof endTime === 'string' ? new Date(endTime) : endTime;

  // Format date: "Mon, Jan 20, 2026"
  const date = formatDateInTimezone(start, timezone, 'EEE, MMM d, yyyy');
  // Format time range: "2:00 PM – 2:30 PM"
  const startTimeStr = formatDateInTimezone(start, timezone, 'h:mm a');
  const endTimeStr = formatDateInTimezone(end, timezone, 'h:mm a');
  const time = `${startTimeStr} – ${endTimeStr}`;

  return { date, time };
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="h-4 w-4"
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

// ─── Reason Dialog ────────────────────────────────────────────────────────────

function ReasonDialog({
  action,
  isRecurring,
  onConfirm,
  onCancel,
  loading,
}: {
  action: 'reject' | 'cancel';
  isRecurring?: boolean;
  onConfirm: (reason: string, cancelFuture?: boolean) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState('');
  const [cancelFuture, setCancelFuture] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = setTimeout(() => textareaRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !loading) onCancel();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [loading, onCancel]);

  const isReject = action === 'reject';
  const title = isReject ? 'Reject booking?' : 'Cancel booking?';
  const description = isReject
    ? 'Provide an optional reason for rejecting this booking.'
    : 'Provide an optional reason for cancelling this booking.';
  const confirmLabel = isReject ? 'Reject' : 'Cancel Booking';
  const confirmLoadingLabel = isReject ? 'Rejecting…' : 'Cancelling…';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reason-dialog-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 id="reason-dialog-title" className="text-base font-semibold text-gray-900">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
        <textarea
          ref={textareaRef}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          rows={3}
          maxLength={500}
          className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
        />
        {/* Recurring cancel options */}
        {!isReject && isRecurring && (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-medium text-amber-800 mb-2">This is a recurring booking</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cancel-scope"
                  checked={!cancelFuture}
                  onChange={() => setCancelFuture(false)}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-amber-900">Cancel this occurrence only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cancel-scope"
                  checked={cancelFuture}
                  onChange={() => setCancelFuture(true)}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-amber-900">
                  Cancel this and all future occurrences
                </span>
              </label>
            </div>
          </div>
        )}
        <div className="mt-5 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-ring disabled:opacity-50"
          >
            Go back
          </button>
          <button
            type="button"
            onClick={() => onConfirm(reason, cancelFuture)}
            disabled={loading}
            className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus-ring disabled:opacity-50"
          >
            {loading ? confirmLoadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export interface BookingCardProps {
  booking: BookingCardData;
  onStatusChange?: (uid: string, newStatus: BookingStatus) => void;
}

export function BookingCard({ booking, onStatusChange }: BookingCardProps) {
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showReasonDialog, setShowReasonDialog] = useState<'reject' | 'cancel' | null>(null);
  const [currentStatus, setCurrentStatus] = useState(booking.status);

  const barColor = booking.eventType.color ?? '#3b82f6';
  const statusConfig = STATUS_CONFIG[currentStatus];

  // Use host's perspective: show times in their timezone (attendeeTimezone is the attendee's tz)
  // For display in the dashboard, we show the host's local time using the browser's timezone
  // which is a reasonable default since we don't have the host tz client-side easily.
  // We use the attendee's timezone as a fallback for consistent display.
  const displayTimezone = booking.attendeeTimezone;
  const { date, time } = formatBookingDateTime(booking.startTime, booking.endTime, displayTimezone);

  async function performAction(
    action: 'accept' | 'reject' | 'cancel',
    reason?: string,
    cancelFuture?: boolean
  ) {
    setActionLoading(action);
    try {
      const url =
        action === 'cancel' && cancelFuture
          ? `/api/bookings/${booking.uid}?cancelFuture=true`
          : `/api/bookings/${booking.uid}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...(reason ? { reason } : {}) }),
      });

      if (res.ok) {
        const data = await res.json();
        const newStatus = data.data?.status as BookingStatus | undefined;
        if (newStatus) {
          setCurrentStatus(newStatus);
          onStatusChange?.(booking.uid, newStatus);
        }
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? `Failed to ${action} booking`);
      }
    } catch {
      alert(`Failed to ${action} booking`);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleAccept() {
    await performAction('accept');
  }

  async function handleRejectConfirm(reason: string) {
    setShowReasonDialog(null);
    await performAction('reject', reason);
  }

  async function handleCancelConfirm(reason: string, cancelFuture?: boolean) {
    setShowReasonDialog(null);
    await performAction('cancel', reason, cancelFuture);
  }

  return (
    <>
      <div
        className={cn(
          'relative flex items-start gap-0 rounded-lg border border-gray-200 bg-white overflow-hidden',
          'transition-shadow hover:shadow-md',
          (currentStatus === 'CANCELLED' ||
            currentStatus === 'REJECTED' ||
            currentStatus === 'RESCHEDULED') &&
            'opacity-70'
        )}
      >
        {/* Left color bar — 4px wide */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: barColor }}
          aria-hidden="true"
        />

        {/* Card content */}
        <div className="flex flex-1 flex-col gap-3 pl-5 pr-4 py-4 sm:flex-row sm:items-center">
          {/* Main info */}
          <div className="min-w-0 flex-1">
            {/* Top row: event type title + status badge + recurring badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 truncate">{booking.eventType.title}</h3>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  statusConfig.className
                )}
              >
                {statusConfig.label}
              </span>
              {booking.recurringEventId && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Recurring
                </span>
              )}
            </div>

            {/* Attendee info */}
            <div className="mt-1 flex items-center gap-1 text-sm text-gray-700">
              <UserIcon />
              <span className="font-medium">{booking.attendeeName}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500 text-xs">{booking.attendeeEmail}</span>
            </div>

            {/* Date + time */}
            <div className="mt-1.5 flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <CalendarIcon />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <ClockIcon />
                <span>{time}</span>
                <span className="text-gray-400">
                  ({formatDuration(booking.eventType.duration)})
                </span>
              </div>
            </div>

            {/* Cancellation reason */}
            {booking.cancellationReason && (
              <p className="mt-1.5 text-xs text-gray-500 italic">
                Reason: {booking.cancellationReason}
              </p>
            )}
          </div>

          {/* Right side: quick actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View details link */}
            <Link
              href={`/bookings/${booking.uid}`}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus-ring transition-colors"
            >
              Details
            </Link>

            {/* Status-based actions */}
            {currentStatus === 'PENDING' && (
              <>
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={actionLoading !== null}
                  className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 focus-ring disabled:opacity-50 transition-colors"
                >
                  {actionLoading === 'accept' ? 'Accepting…' : 'Accept'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReasonDialog('reject')}
                  disabled={actionLoading !== null}
                  className="rounded-md bg-danger px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 focus-ring disabled:opacity-50 transition-colors"
                >
                  Reject
                </button>
              </>
            )}

            {currentStatus === 'ACCEPTED' && (
              <button
                type="button"
                onClick={() => setShowReasonDialog('cancel')}
                disabled={actionLoading !== null}
                className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 focus-ring disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reason dialogs */}
      {showReasonDialog === 'reject' && (
        <ReasonDialog
          action="reject"
          onConfirm={handleRejectConfirm}
          onCancel={() => setShowReasonDialog(null)}
          loading={actionLoading === 'reject'}
        />
      )}
      {showReasonDialog === 'cancel' && (
        <ReasonDialog
          action="cancel"
          isRecurring={!!booking.recurringEventId}
          onConfirm={handleCancelConfirm}
          onCancel={() => setShowReasonDialog(null)}
          loading={actionLoading === 'cancel'}
        />
      )}
    </>
  );
}
