import { formatDateInTimezone } from '@/lib/utils';
import type { BookingStatus } from '@/generated/prisma/client';

interface TimelineEvent {
  label: string;
  timestamp: Date | string | null;
  status: 'done' | 'current' | 'pending';
}

interface StatusTimelineProps {
  status: BookingStatus;
  createdAt: Date | string;
  cancelledAt?: Date | string | null;
  attendeeTimezone: string;
}

function formatTimestamp(ts: Date | string, timezone: string): string {
  return formatDateInTimezone(ts, timezone, "MMM d, yyyy 'at' h:mm a zzz");
}

export function StatusTimeline({
  status,
  createdAt,
  cancelledAt,
  attendeeTimezone,
}: StatusTimelineProps) {
  const events: TimelineEvent[] = [
    {
      label: 'Booking received',
      timestamp: createdAt,
      status: 'done',
    },
  ];

  if (status === 'ACCEPTED') {
    events.push({
      label: 'Booking confirmed',
      // No acceptedAt in the schema — omit timestamp to avoid misleading display
      timestamp: null,
      status: 'done',
    });
  } else if (status === 'PENDING') {
    events.push({
      label: 'Awaiting confirmation',
      timestamp: null,
      status: 'current',
    });
  } else if (status === 'REJECTED') {
    events.push({
      label: 'Booking rejected',
      timestamp: cancelledAt ?? null,
      status: 'done',
    });
  } else if (status === 'CANCELLED') {
    events.push({
      label: 'Booking cancelled',
      timestamp: cancelledAt ?? null,
      status: 'done',
    });
  } else if (status === 'RESCHEDULED') {
    events.push({
      label: 'Booking rescheduled',
      timestamp: cancelledAt ?? null,
      status: 'done',
    });
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8" role="list">
        {events.map((event, idx) => {
          const isLast = idx === events.length - 1;
          return (
            <li key={idx}>
              <div className="relative pb-8">
                {/* Connecting line */}
                {!isLast && (
                  <span
                    className="absolute left-3.5 top-7 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}

                <div className="relative flex items-start gap-3">
                  {/* Dot */}
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ring-4 ring-white ${
                      event.status === 'done'
                        ? 'bg-primary-500'
                        : event.status === 'current'
                          ? 'bg-yellow-400'
                          : 'bg-gray-200'
                    }`}
                    aria-hidden="true"
                  >
                    {event.status === 'done' ? (
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : event.status === 'current' ? (
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : null}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pt-1">
                    <p className="text-sm font-medium text-gray-900">{event.label}</p>
                    {event.timestamp && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {formatTimestamp(event.timestamp, attendeeTimezone)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
