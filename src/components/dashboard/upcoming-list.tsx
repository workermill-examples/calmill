import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { EventTypeLocation } from '@/types';

interface UpcomingBooking {
  uid: string;
  title: string;
  startTime: string | Date;
  endTime: string | Date;
  attendeeName: string;
  attendeeEmail: string;
  location: string | null;
  eventType: {
    id: string;
    title: string;
    duration: number;
    locations: EventTypeLocation[] | null;
    color: string | null;
  } | null;
}

interface UpcomingListProps {
  bookings: UpcomingBooking[];
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-3.5 w-3.5', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-3.5 w-3.5', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function getVideoLink(booking: UpcomingBooking): string | null {
  const locations = booking.eventType?.locations;
  if (!locations) return null;
  const videoLocation = locations.find((l) => l.type === 'link');
  return videoLocation?.value ?? null;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function UpcomingList({ bookings }: UpcomingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
          <svg
            className="h-5 w-5 text-primary-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="mt-3 text-sm font-medium text-gray-900">No upcoming bookings</p>
        <p className="mt-1 text-xs text-gray-500">Your confirmed bookings will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <ul className="divide-y divide-gray-100" role="list">
        {bookings.map((booking) => {
          const color = booking.eventType?.color ?? '#3b82f6';
          const videoLink = getVideoLink(booking);
          const duration = booking.eventType?.duration;

          return (
            <li key={booking.uid} className="relative flex items-center gap-0 overflow-hidden">
              {/* Left color bar */}
              <div
                className="absolute left-0 top-0 h-full w-1 shrink-0"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <div className="flex flex-1 items-start gap-4 pl-5 pr-4 py-4 sm:items-center">
                {/* Date/time column */}
                <div className="w-28 shrink-0 text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(booking.startTime, 'MMM d')}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(booking.startTime, 'p')}</p>
                </div>

                {/* Divider */}
                <div className="hidden h-8 w-px shrink-0 bg-gray-200 sm:block" aria-hidden="true" />

                {/* Main info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {booking.eventType?.title ?? booking.title}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <UserIcon />
                      {booking.attendeeName}
                    </span>
                    {duration !== undefined && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <ClockIcon />
                        {formatDuration(duration)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  {videoLink && (
                    <a
                      href={videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 focus-ring transition-colors"
                    >
                      <VideoIcon />
                      Join
                    </a>
                  )}
                  <Link
                    href={`/bookings/${booking.uid}`}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus-ring transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
