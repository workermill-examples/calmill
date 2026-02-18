import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatDateInTimezone } from '@/lib/utils';
import type { EventTypeLocation } from '@/types';
import ReschedulePageClient from './reschedule-client';

interface ReschedulePageProps {
  params: Promise<{ uid: string }>;
}

export default async function ReschedulePage({ params }: ReschedulePageProps) {
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
              weekStart: true,
            },
          },
        },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  // Only PENDING or ACCEPTED bookings can be rescheduled
  if (booking.status !== 'PENDING' && booking.status !== 'ACCEPTED') {
    notFound();
  }

  const { eventType } = booking;
  const locations = (eventType.locations ?? null) as EventTypeLocation[] | null;

  const formattedOriginalTime = formatDateInTimezone(
    booking.startTime,
    booking.attendeeTimezone,
    "EEEE, MMMM d, yyyy 'at' h:mm a"
  );

  const weekStart = eventType.user.weekStart === 1 ? 1 : 0;

  return (
    <ReschedulePageClient
      uid={uid}
      eventTypeId={eventType.id}
      eventTypeTitle={eventType.title}
      eventTypeColor={eventType.color}
      duration={eventType.duration}
      locations={locations}
      weekStart={weekStart as 0 | 1}
      originalFormattedTime={formattedOriginalTime}
      originalTimezone={booking.attendeeTimezone}
    />
  );
}
