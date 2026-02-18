import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BookingsList } from '@/components/bookings/bookings-list';
import type { BookingCardData } from '@/components/bookings/booking-card';
import type { EventTypeLocation } from '@/types';

export default async function BookingsPage() {
  const session = await auth();
  // Layout handles redirect if no session, so session.user is always defined here
  const userId = session!.user.id;

  const now = new Date();

  // Fetch initial upcoming bookings (PENDING + ACCEPTED with future startTime)
  const rows = await prisma.booking.findMany({
    where: {
      userId,
      startTime: { gte: now },
      status: { in: ['PENDING', 'ACCEPTED'] },
    },
    select: {
      uid: true,
      title: true,
      startTime: true,
      endTime: true,
      status: true,
      attendeeName: true,
      attendeeEmail: true,
      attendeeTimezone: true,
      location: true,
      cancellationReason: true,
      eventType: {
        select: {
          id: true,
          title: true,
          duration: true,
          locations: true,
          color: true,
        },
      },
    },
    orderBy: { startTime: 'asc' },
    take: 20,
  });

  // Cast JSON locations to typed array, filter out any rows missing eventType
  const initialBookings: BookingCardData[] = rows
    .filter((row) => row.eventType != null)
    .map((row) => ({
      ...row,
      eventType: {
        ...row.eventType!,
        locations: (row.eventType!.locations as EventTypeLocation[] | null) ?? null,
      },
    }));

  return <BookingsList initialBookings={initialBookings} initialTotal={initialBookings.length} />;
}
