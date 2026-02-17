import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EmbedBookingPageClient } from "@/components/booking/embed-booking-page-client";
import type { EventTypeLocation, CustomQuestion } from "@/types";

interface EmbedBookingPageProps {
  params: Promise<{ username: string; slug: string }>;
  searchParams: Promise<{
    date?: string;
    theme?: string;
    timezone?: string;
    hideEventDetails?: string;
  }>;
}

/**
 * Embed variant of the booking page.
 *
 * Differences from the public booking page:
 * - No header/footer (handled by embed layout)
 * - Accepts ?theme=light|dark, ?timezone=IANA, ?hideEventDetails=true query params
 * - Renders EmbedBookingPageClient which sends postMessage events for resize and booking
 */
export default async function EmbedBookingPage({
  params,
  searchParams,
}: EmbedBookingPageProps) {
  const { username, slug } = await params;
  const {
    date: initialDate,
    theme = "light",
    timezone: initialTimezone,
    hideEventDetails,
  } = await searchParams;

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
    <EmbedBookingPageClient
      eventTypeId={eventType.id}
      eventTypeTitle={eventType.title}
      duration={eventType.duration}
      color={eventType.color}
      username={username}
      locations={locations}
      customQuestions={customQuestions}
      weekStart={weekStart}
      initialDate={initialDate ?? null}
      initialTimezone={initialTimezone ?? null}
      theme={(theme === "dark" ? "dark" : "light") as "light" | "dark"}
      hideEventDetails={hideEventDetails === "true"}
    />
  );
}
