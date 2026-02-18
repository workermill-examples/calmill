import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BookingPageClient } from '@/components/booking/booking-page-client';
import type { EventTypeLocation, CustomQuestion } from '@/types';

interface TeamBookingPageProps {
  params: Promise<{ slug: string; eventSlug: string }>;
  searchParams: Promise<{ date?: string }>;
}

export default async function TeamBookingPage({ params, searchParams }: TeamBookingPageProps) {
  const { slug, eventSlug } = await params;
  const { date: initialDate } = await searchParams;

  // Look up the team
  const team = await prisma.team.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
    },
  });

  if (!team) {
    notFound();
  }

  // Look up the team event type by team + slug.
  // There is no unique constraint on (teamId, slug) in the schema, so use findFirst
  // with orderBy to ensure deterministic results if slugs collide.
  const eventType = await prisma.eventType.findFirst({
    where: {
      teamId: team.id,
      slug: eventSlug,
      isActive: true,
    },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      title: true,
      duration: true,
      locations: true,
      color: true,
      customQuestions: true,
      schedulingType: true,
    },
  });

  if (!eventType) {
    notFound();
  }

  const locations = (eventType.locations ?? null) as EventTypeLocation[] | null;
  const customQuestions = (eventType.customQuestions ?? []) as CustomQuestion[];
  // Team event types have no single meaningful week-start owner; default to Sunday (0).
  const weekStart = 0 as const;

  return (
    <BookingPageClient
      eventTypeId={eventType.id}
      eventTypeTitle={eventType.title}
      duration={eventType.duration}
      color={eventType.color}
      username={slug}
      backHref={`/team/${slug}`}
      locations={locations}
      customQuestions={customQuestions}
      weekStart={weekStart}
      initialDate={initialDate ?? null}
    />
  );
}
