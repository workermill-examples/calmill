import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BookingPageClient } from '@/components/booking/booking-page-client';
import type { EventTypeLocation, CustomQuestion } from '@/types';

interface BookingPageProps {
  params: Promise<{ username: string; slug: string }>;
  searchParams: Promise<{ date?: string; month?: string }>;
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { username, slug } = await params;
  const { date: initialDate } = await searchParams;

  // Look up user
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      weekStart: true,
    },
  });

  if (!user) {
    notFound();
  }

  // Look up the event type
  const eventType = await prisma.eventType.findFirst({
    where: {
      userId: user.id,
      slug,
      isActive: true,
    },
    select: {
      id: true,
      title: true,
      duration: true,
      locations: true,
      color: true,
      customQuestions: true,
    },
  });

  if (!eventType) {
    notFound();
  }

  const locations = (eventType.locations ?? null) as EventTypeLocation[] | null;
  const customQuestions = (eventType.customQuestions ?? []) as CustomQuestion[];
  const weekStart = (user.weekStart === 1 ? 1 : 0) as 0 | 1;

  return (
    <BookingPageClient
      eventTypeId={eventType.id}
      eventTypeTitle={eventType.title}
      duration={eventType.duration}
      color={eventType.color}
      username={username}
      locations={locations}
      customQuestions={customQuestions}
      weekStart={weekStart}
      initialDate={initialDate ?? null}
    />
  );
}
