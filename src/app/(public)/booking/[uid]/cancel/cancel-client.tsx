'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CancelPageClientProps {
  uid: string;
  eventTypeTitle: string;
  eventTypeColor: string | null;
  formattedDateTime: string;
  formattedDuration: string;
  attendeeTimezone: string;
  attendeeName: string;
  hostName: string | null;
  hostUsername: string | null;
  locationValue: string | null;
  locationType: string | null;
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
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

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

export default function CancelPageClient({
  uid,
  eventTypeTitle,
  eventTypeColor,
  formattedDateTime,
  formattedDuration,
  attendeeTimezone,
  attendeeName,
  hostName,
  hostUsername,
  locationValue,
  locationType,
}: CancelPageClientProps) {
  const [reason, setReason] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isCancelled, setIsCancelled] = React.useState(false);

  const handleCancel = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/bookings/${uid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel', reason: reason.trim() || undefined }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 409) {
          setError(data.error ?? 'This booking cannot be cancelled.');
        } else {
          setError('Something went wrong. Please try again.');
        }
        return;
      }

      setIsCancelled(true);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── SUCCESS STATE ──────────────────────────────────────────────────────────

  if (isCancelled) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Meeting Cancelled</h1>
          <p className="mt-2 text-gray-600">Your meeting has been successfully cancelled.</p>
          <p className="mt-1 text-sm text-gray-500">
            {attendeeName}, we hope to see you again soon.
          </p>
        </div>

        {hostUsername && (
          <div className="text-center">
            <a
              href={`/${hostUsername}`}
              className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              Book a new meeting with {hostName ?? hostUsername}
            </a>
          </div>
        )}
      </div>
    );
  }

  // ─── CANCEL FORM ────────────────────────────────────────────────────────────

  const LocationIcon =
    locationType === 'link' ? VideoIcon : locationType === 'phone' ? PhoneIcon : MapPinIcon;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Color bar */}
      {eventTypeColor && (
        <div
          className="h-1.5 rounded-full"
          style={{ backgroundColor: eventTypeColor }}
          aria-hidden="true"
        />
      )}

      {/* Back link */}
      <div>
        <Link
          href={`/booking/${uid}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to booking details
        </Link>
      </div>

      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cancel Meeting</h1>
        <p className="mt-1 text-sm text-gray-600">
          You are about to cancel this meeting. This action cannot be undone.
        </p>
      </div>

      {/* Booking summary card */}
      <div className="rounded-lg border border-gray-200 bg-white">
        {eventTypeColor && (
          <div
            className="h-1.5 rounded-t-lg"
            style={{ backgroundColor: eventTypeColor }}
            aria-hidden="true"
          />
        )}
        <div className="p-5 space-y-3">
          <h2 className="font-semibold text-gray-900">{eventTypeTitle}</h2>

          <div className="flex items-start gap-3 text-sm text-gray-700">
            <CalendarIcon className="h-4 w-4 flex-shrink-0 text-gray-400 mt-0.5" />
            <div>
              <p>{formattedDateTime}</p>
              <p className="text-xs text-gray-500">{attendeeTimezone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <ClockIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span>{formattedDuration}</span>
          </div>

          {locationValue && (
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <LocationIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <span className="break-all">{locationValue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <svg
          className="h-5 w-5 flex-shrink-0 text-yellow-500 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <p className="text-sm text-yellow-800">
          <strong>Are you sure you want to cancel this meeting?</strong>{' '}
          {hostName
            ? `${hostName} will be notified of the cancellation.`
            : 'The host will be notified of the cancellation.'}
        </p>
      </div>

      {/* Reason textarea */}
      <div>
        <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700 mb-1.5">
          Reason for cancellation <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <textarea
          id="cancel-reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Let the host know why you're cancelling..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              Cancelling...
            </>
          ) : (
            'Cancel Meeting'
          )}
        </button>

        <Link
          href={`/booking/${uid}`}
          className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}
