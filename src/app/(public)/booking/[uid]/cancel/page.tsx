import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDateInTimezone } from "@/lib/utils";
import type { EventTypeLocation } from "@/types";
import CancelPageClient from "./cancel-client";

interface CancelPageProps {
  params: Promise<{ uid: string }>;
}

export default async function CancelPage({ params }: CancelPageProps) {
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
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  // Only PENDING or ACCEPTED bookings can be cancelled
  if (booking.status === "CANCELLED") {
    // Already cancelled — show that state
    const formattedDateTime = formatDateInTimezone(
      booking.startTime,
      booking.attendeeTimezone,
      "EEEE, MMMM d, yyyy 'at' h:mm a"
    );

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
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Already Cancelled</h1>
          <p className="mt-2 text-gray-600">
            This meeting on {formattedDateTime} has already been cancelled.
          </p>
          {booking.cancellationReason && (
            <p className="mt-1 text-sm text-gray-500">Reason: {booking.cancellationReason}</p>
          )}
        </div>
        {booking.eventType.user.username && (
          <div className="text-center">
            <a
              href={`/${booking.eventType.user.username}`}
              className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              Book a new meeting with {booking.eventType.user.name ?? booking.eventType.user.username}
            </a>
          </div>
        )}
      </div>
    );
  }

  if (booking.status === "RESCHEDULED" || booking.status === "REJECTED") {
    notFound();
  }

  const formattedDateTime = formatDateInTimezone(
    booking.startTime,
    booking.attendeeTimezone,
    "EEEE, MMMM d, yyyy 'at' h:mm a"
  );

  const formattedDuration =
    booking.eventType.duration >= 60
      ? `${booking.eventType.duration / 60} hr${booking.eventType.duration > 60 ? "s" : ""}`
      : `${booking.eventType.duration} min`;

  const locations = (booking.eventType.locations ?? null) as EventTypeLocation[] | null;
  const firstLocation = locations && locations.length > 0 ? locations[0] : null;

  return (
    <CancelPageClient
      uid={uid}
      eventTypeTitle={booking.eventType.title}
      eventTypeColor={booking.eventType.color}
      formattedDateTime={formattedDateTime}
      formattedDuration={formattedDuration}
      attendeeTimezone={booking.attendeeTimezone}
      attendeeName={booking.attendeeName}
      hostName={booking.eventType.user.name}
      hostUsername={booking.eventType.user.username}
      locationValue={firstLocation?.value ?? null}
      locationType={firstLocation?.type ?? null}
    />
  );
}
