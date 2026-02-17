import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateInTimezone, getInitials } from "@/lib/utils";
import { buildGoogleCalendarUrl, buildICSDataUri } from "@/lib/ics";
import type { EventTypeLocation } from "@/types";

interface BookingConfirmationPageProps {
  params: Promise<{ uid: string }>;
}

// ─── LOCATION DISPLAY ─────────────────────────────────────────────────────────

function getLocationDisplay(location: string | null, locations: EventTypeLocation[] | null): string | null {
  // If there's a specific location set on the booking, use it
  if (location) return location;
  // Otherwise fall back to the first event type location
  if (locations && locations.length > 0 && locations[0]) {
    return locations[0].value || null;
  }
  return null;
}

function getLocationType(locations: EventTypeLocation[] | null): "inPerson" | "link" | "phone" | null {
  if (!locations || locations.length === 0) return null;
  return locations[0]?.type ?? null;
}

// ─── ICON COMPONENTS ─────────────────────────────────────────────────────────

function CheckCircleIcon() {
  return (
    <svg
      className="h-16 w-16 text-green-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
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
      className={className ?? "h-5 w-5"}
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
      className={className ?? "h-5 w-5"}
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
      className={className ?? "h-5 w-5"}
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
      className={className ?? "h-5 w-5"}
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

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
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

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
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

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default async function BookingConfirmationPage({ params }: BookingConfirmationPageProps) {
  const { uid } = await params;

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
          requiresConfirmation: true,
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

  if (!booking) {
    notFound();
  }

  const { eventType } = booking;
  const locations = (eventType.locations ?? null) as EventTypeLocation[] | null;
  const locationDisplay = getLocationDisplay(booking.location, locations);
  const locationType = getLocationType(locations);
  const hostInitials = eventType.user.name
    ? getInitials(eventType.user.name)
    : (eventType.user.username ?? "H").charAt(0).toUpperCase();

  // Format date/time in attendee's timezone
  const formattedDateTime = formatDateInTimezone(
    booking.startTime,
    booking.attendeeTimezone,
    "EEEE, MMMM d, yyyy 'at' h:mm a"
  );

  const formattedDuration =
    eventType.duration >= 60
      ? `${eventType.duration / 60} hr${eventType.duration > 60 ? "s" : ""}`
      : `${eventType.duration} min`;

  // Build calendar add options
  const calendarTitle = booking.title || `${eventType.title} with ${eventType.user.name ?? eventType.user.username}`;
  const icsOptions = {
    uid: booking.uid,
    title: calendarTitle,
    startTime: booking.startTime,
    endTime: booking.endTime,
    location: locationDisplay ?? undefined,
    description: booking.attendeeNotes ?? undefined,
    organizerName: eventType.user.name ?? undefined,
    attendeeName: booking.attendeeName,
    attendeeEmail: booking.attendeeEmail,
  };

  const googleCalendarUrl = buildGoogleCalendarUrl(icsOptions);
  const icsDataUri = buildICSDataUri(icsOptions);
  const icsFilename = `${eventType.title.replace(/\s+/g, "-")}.ics`;

  // Status-specific display
  const isPending = booking.status === "PENDING";
  const isCancelled = booking.status === "CANCELLED";
  const isRescheduled = booking.status === "RESCHEDULED";

  const responses = booking.responses as Record<string, string> | null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Status banner */}
      <div
        className={`rounded-lg border p-6 text-center ${
          isCancelled
            ? "border-red-200 bg-red-50"
            : isRescheduled
            ? "border-yellow-200 bg-yellow-50"
            : isPending
            ? "border-yellow-200 bg-yellow-50"
            : "border-green-200 bg-green-50"
        }`}
      >
        {isCancelled ? (
          <>
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
            <p className="mt-2 text-gray-600">This meeting has been cancelled.</p>
            {booking.cancellationReason && (
              <p className="mt-1 text-sm text-gray-500">
                Reason: {booking.cancellationReason}
              </p>
            )}
          </>
        ) : isPending ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <svg
                className="h-10 w-10 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Booking Pending Confirmation</h1>
            <p className="mt-2 text-gray-600">
              Your booking request has been sent. You will receive a confirmation email once{" "}
              {eventType.user.name ?? "the host"} accepts it.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Your meeting has been scheduled!
            </h1>
            <p className="mt-2 text-gray-600">
              A confirmation email has been sent to {booking.attendeeEmail}.
            </p>
          </>
        )}
      </div>

      {/* Event details card */}
      <div className="rounded-lg border border-gray-200 bg-white">
        {/* Color bar */}
        {eventType.color && (
          <div
            className="h-1.5 rounded-t-lg"
            style={{ backgroundColor: eventType.color }}
            aria-hidden="true"
          />
        )}

        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{eventType.title}</h2>

          {/* Date & time */}
          <div className="flex items-start gap-3 text-gray-700">
            <CalendarIcon className="h-5 w-5 flex-shrink-0 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">{formattedDateTime}</p>
              <p className="text-sm text-gray-500">{booking.attendeeTimezone}</p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-3 text-gray-700">
            <ClockIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
            <span>{formattedDuration}</span>
          </div>

          {/* Location / meeting link */}
          {locationDisplay && (
            <div className="flex items-start gap-3 text-gray-700">
              {locationType === "link" ? (
                <VideoIcon className="h-5 w-5 flex-shrink-0 text-gray-400 mt-0.5" />
              ) : locationType === "phone" ? (
                <PhoneIcon className="h-5 w-5 flex-shrink-0 text-gray-400 mt-0.5" />
              ) : (
                <MapPinIcon className="h-5 w-5 flex-shrink-0 text-gray-400 mt-0.5" />
              )}
              {locationType === "link" ? (
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
            </div>
          )}

          {/* Host info */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            {eventType.user.avatarUrl ? (
              <img
                src={eventType.user.avatarUrl}
                alt={eventType.user.name ?? eventType.user.username ?? "Host"}
                className="h-9 w-9 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                <span className="text-sm font-semibold text-primary-600" aria-hidden="true">
                  {hostInitials}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {eventType.user.name ?? `@${eventType.user.username}`}
              </p>
              <p className="text-xs text-gray-500">Host</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Calendar — only for confirmed/pending bookings */}
      {!isCancelled && !isRescheduled && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Add to Calendar
          </h3>
          <div className="flex flex-col gap-2 sm:flex-row">
            {/* Google Calendar */}
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {/* Google Calendar icon (simplified) */}
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 15l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Google Calendar
            </a>

            {/* Outlook (.ics download) */}
            <a
              href={icsDataUri}
              download={icsFilename}
              className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 13v4M10 15l2 2 2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Outlook
            </a>

            {/* Apple Calendar (.ics download) */}
            <a
              href={icsDataUri}
              download={icsFilename}
              className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="15" r="2" stroke="currentColor" strokeWidth="2" />
              </svg>
              Apple Calendar
            </a>
          </div>
        </div>
      )}

      {/* Attendee info */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Your Information
        </h3>

        <div className="flex items-center gap-3 text-gray-700">
          <UserIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
          <span>{booking.attendeeName}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <MailIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
          <span>{booking.attendeeEmail}</span>
        </div>

        {booking.attendeeNotes && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-1">Notes</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{booking.attendeeNotes}</p>
          </div>
        )}

        {/* Custom question responses */}
        {responses && Object.keys(responses).length > 0 && (
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <p className="text-sm font-medium text-gray-600">Additional Information</p>
            {Object.entries(responses).map(([key, value]) => (
              <div key={key}>
                <p className="text-xs text-gray-500">{key}</p>
                <p className="text-sm text-gray-700">{String(value)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking reference */}
      <div className="text-center text-xs text-gray-400">
        Booking reference: <span className="font-mono">{booking.uid}</span>
      </div>

      {/* Actions */}
      {!isCancelled && !isRescheduled && (
        <div className="flex items-center justify-center gap-4 pb-4">
          <Link
            href={`/booking/${booking.uid}/reschedule`}
            className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2"
          >
            Reschedule
          </Link>
          <span className="text-gray-300" aria-hidden="true">|</span>
          <Link
            href={`/booking/${booking.uid}/cancel`}
            className="text-sm text-red-600 hover:text-red-800 underline underline-offset-2"
          >
            Cancel
          </Link>
        </div>
      )}

      {/* Rebook option if cancelled */}
      {isCancelled && eventType.user.username && (
        <div className="text-center pb-4">
          <Link
            href={`/${eventType.user.username}`}
            className="text-sm text-primary-600 hover:text-primary-700 underline underline-offset-2"
          >
            Book a new meeting with {eventType.user.name ?? eventType.user.username}
          </Link>
        </div>
      )}
    </div>
  );
}
