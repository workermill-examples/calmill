import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDateInTimezone, getInitials } from '@/lib/utils';
import { BookingActions } from '@/components/bookings/booking-actions';
import { StatusTimeline } from '@/components/bookings/status-timeline';
import type { EventTypeLocation } from '@/types';

interface BookingDetailPageProps {
  params: Promise<{ uid: string }>;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  ACCEPTED: { label: 'Confirmed', className: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
  REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
  RESCHEDULED: { label: 'Rescheduled', className: 'bg-blue-100 text-blue-800' },
} as const;

// ─── Icon Components ──────────────────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg
      className="h-5 w-5 flex-shrink-0 text-gray-400"
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

function ClockIcon() {
  return (
    <svg
      className="h-5 w-5 flex-shrink-0 text-gray-400"
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

function UserIcon() {
  return (
    <svg
      className="h-5 w-5 flex-shrink-0 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      className="h-5 w-5 flex-shrink-0 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      className="h-5 w-5 flex-shrink-0 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      className="h-5 w-5 flex-shrink-0 text-gray-400"
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

function MapPinIcon() {
  return (
    <svg
      className="h-5 w-5 flex-shrink-0 text-gray-400"
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

function PhoneIcon() {
  return (
    <svg
      className="h-5 w-5 flex-shrink-0 text-gray-400"
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} hr`;
  return `${hours} hr ${remaining} min`;
}

function getLocationDisplay(
  location: string | null,
  locations: EventTypeLocation[] | null
): { display: string | null; type: 'inPerson' | 'link' | 'phone' | null } {
  const value =
    location ?? (locations && locations.length > 0 ? locations[0]?.value : null) ?? null;
  const type = locations && locations.length > 0 ? (locations[0]?.type ?? null) : null;
  return { display: value || null, type };
}

// ─── Detail Row ───────────────────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
        <div className="mt-0.5 text-sm text-gray-900">{children}</div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { uid } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const booking = await prisma.booking.findUnique({
    where: { uid },
    include: {
      eventType: {
        select: {
          id: true,
          title: true,
          duration: true,
          locations: true,
          color: true,
          slug: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
              bio: true,
            },
          },
        },
      },
    },
  });

  // Not found or doesn't belong to this user
  if (!booking || booking.userId !== userId) {
    notFound();
  }

  const { eventType } = booking;
  const locations = (eventType.locations ?? null) as EventTypeLocation[] | null;
  const { display: locationDisplay, type: locationType } = getLocationDisplay(
    booking.location,
    locations
  );

  const formattedDate = formatDateInTimezone(
    booking.startTime,
    booking.attendeeTimezone,
    'EEEE, MMMM d, yyyy'
  );
  const formattedTimeRange = `${formatDateInTimezone(
    booking.startTime,
    booking.attendeeTimezone,
    'h:mm a'
  )} – ${formatDateInTimezone(booking.endTime, booking.attendeeTimezone, 'h:mm a')}`;

  const responses = booking.responses as Record<string, string> | null;
  const statusConfig = STATUS_CONFIG[booking.status];

  const hostInitials = eventType.user.name
    ? getInitials(eventType.user.name)
    : (eventType.user.username ?? 'H').charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{booking.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Booking reference: <span className="font-mono text-gray-700">{booking.uid}</span>
          </p>
        </div>
        {/* Large status badge */}
        <span
          className={`inline-flex flex-shrink-0 items-center rounded-full px-3 py-1 text-sm font-semibold ${statusConfig.className}`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Cancellation reason banner */}
      {booking.cancellationReason && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            {booking.status === 'REJECTED' ? 'Rejection reason:' : 'Cancellation reason:'}
          </p>
          <p className="mt-1 text-sm text-red-700">{booking.cancellationReason}</p>
        </div>
      )}

      {/* Actions */}
      <BookingActions
        uid={booking.uid}
        status={booking.status}
        rebookUsername={eventType.user.username}
        rebookEventTypeSlug={eventType.slug}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: main details (2/3 width on large screens) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Event details card */}
          <section
            aria-labelledby="event-details-heading"
            className="rounded-lg border border-gray-200 bg-white overflow-hidden"
          >
            {/* Color bar top */}
            {eventType.color && (
              <div
                className="h-1.5"
                style={{ backgroundColor: eventType.color }}
                aria-hidden="true"
              />
            )}
            <div className="p-6 space-y-4">
              <h2 id="event-details-heading" className="text-base font-semibold text-gray-900">
                {eventType.title}
              </h2>

              <DetailRow icon={<CalendarIcon />} label="Date">
                {formattedDate}
              </DetailRow>

              <DetailRow icon={<ClockIcon />} label="Time">
                {formattedTimeRange}{' '}
                <span className="text-gray-500">({formatDuration(eventType.duration)})</span>
              </DetailRow>

              <DetailRow icon={<GlobeIcon />} label="Timezone">
                {booking.attendeeTimezone}
              </DetailRow>

              {locationDisplay && (
                <DetailRow
                  icon={
                    locationType === 'link' ? (
                      <VideoIcon />
                    ) : locationType === 'phone' ? (
                      <PhoneIcon />
                    ) : (
                      <MapPinIcon />
                    )
                  }
                  label="Location"
                >
                  {locationType === 'link' ? (
                    <a
                      href={locationDisplay}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline break-all"
                    >
                      {locationDisplay}
                    </a>
                  ) : (
                    <span className="break-all">{locationDisplay}</span>
                  )}
                  {booking.meetingUrl && booking.meetingUrl !== locationDisplay && (
                    <a
                      href={booking.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-1 text-primary-600 hover:underline break-all"
                    >
                      Join meeting
                    </a>
                  )}
                </DetailRow>
              )}
            </div>
          </section>

          {/* Attendee info card */}
          <section
            aria-labelledby="attendee-heading"
            className="rounded-lg border border-gray-200 bg-white p-6 space-y-4"
          >
            <h2 id="attendee-heading" className="text-base font-semibold text-gray-900">
              Attendee
            </h2>

            <DetailRow icon={<UserIcon />} label="Name">
              {booking.attendeeName}
            </DetailRow>

            <DetailRow icon={<MailIcon />} label="Email">
              <a
                href={`mailto:${booking.attendeeEmail}`}
                className="text-primary-600 hover:underline"
              >
                {booking.attendeeEmail}
              </a>
            </DetailRow>

            <DetailRow icon={<GlobeIcon />} label="Timezone">
              {booking.attendeeTimezone}
            </DetailRow>

            {booking.attendeeNotes && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                  Notes
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{booking.attendeeNotes}</p>
              </div>
            )}
          </section>

          {/* Custom question responses */}
          {responses && Object.keys(responses).length > 0 && (
            <section
              aria-labelledby="responses-heading"
              className="rounded-lg border border-gray-200 bg-white p-6 space-y-4"
            >
              <h2 id="responses-heading" className="text-base font-semibold text-gray-900">
                Additional Information
              </h2>
              <dl className="space-y-3">
                {Object.entries(responses).map(([question, answer]) => (
                  <div key={question}>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {question}
                    </dt>
                    <dd className="mt-0.5 text-sm text-gray-900">{String(answer)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>

        {/* Right column: host info + timeline (1/3 width on large screens) */}
        <div className="space-y-6">
          {/* Host info card */}
          <section
            aria-labelledby="host-heading"
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            <h2
              id="host-heading"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4"
            >
              Host
            </h2>
            <div className="flex items-center gap-3">
              {eventType.user.avatarUrl ? (
                <img
                  src={eventType.user.avatarUrl}
                  alt={eventType.user.name ?? eventType.user.username ?? 'Host'}
                  className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                  <span className="text-sm font-semibold text-primary-600" aria-hidden="true">
                    {hostInitials}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {eventType.user.name ?? `@${eventType.user.username}`}
                </p>
                {eventType.user.username && (
                  <p className="text-xs text-gray-500 truncate">@{eventType.user.username}</p>
                )}
              </div>
            </div>
          </section>

          {/* Status timeline card */}
          <section
            aria-labelledby="timeline-heading"
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            <h2
              id="timeline-heading"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4"
            >
              Timeline
            </h2>
            <StatusTimeline
              status={booking.status}
              createdAt={booking.createdAt}
              cancelledAt={booking.cancelledAt}
              attendeeTimezone={booking.attendeeTimezone}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
