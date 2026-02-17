import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EventTypeListClient } from "./event-types-list";
import type { EventTypeCardData } from "@/components/event-types/event-type-card";
import type { EventTypeLocation } from "@/types";

export default async function EventTypesPage() {
  const session = await auth();
  // Layout handles redirect if no session, so session.user is always defined here
  const userId = session!.user.id;
  const username = session!.user.username;

  const rows = await prisma.eventType.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      duration: true,
      locations: true,
      color: true,
      isActive: true,
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Cast the JSON `locations` field to the typed location array
  const eventTypes: EventTypeCardData[] = rows.map((row) => ({
    ...row,
    locations: (row.locations as EventTypeLocation[] | null) ?? null,
  }));

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <EventTypeListClient
      initialEventTypes={eventTypes}
      username={username}
      appUrl={appUrl}
    />
  );
}
