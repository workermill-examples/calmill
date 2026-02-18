import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatCards } from "@/components/dashboard/stat-cards";
import { UpcomingList } from "@/components/dashboard/upcoming-list";
import { DashboardCharts } from "@/components/dashboard/charts";
import type { EventTypeLocation } from "@/types";

export default async function DashboardPage() {
  const session = await auth();
  // Layout handles redirect if no session, so session.user is always defined here
  const userId = session!.user.id;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    upcomingCount,
    pendingCount,
    monthlyCount,
    upcomingBookingsRaw,
    recentBookings,
    eventTypeCounts,
  ] = await Promise.all([
    prisma.booking.count({
      where: {
        userId,
        status: "ACCEPTED",
        startTime: { gte: now, lte: next7Days },
      },
    }),
    prisma.booking.count({
      where: { userId, status: "PENDING" },
    }),
    prisma.booking.count({
      where: { userId, createdAt: { gte: startOfMonth } },
    }),
    prisma.booking.findMany({
      where: { userId, status: "ACCEPTED", startTime: { gte: now } },
      include: {
        eventType: {
          select: { id: true, title: true, duration: true, locations: true, color: true },
        },
      },
      orderBy: { startTime: "asc" },
      take: 5,
    }),
    prisma.booking.findMany({
      where: { userId, createdAt: { gte: last30Days } },
      select: { createdAt: true, status: true, eventTypeId: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.booking.groupBy({
      by: ["eventTypeId"],
      where: { userId },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
  ]);

  // Build bookings-by-day time series (last 30 days, fill zeros)
  const bookingsByDayMap = new Map<string, number>();
  for (const booking of recentBookings) {
    const dateKey = booking.createdAt.toISOString().slice(0, 10);
    bookingsByDayMap.set(dateKey, (bookingsByDayMap.get(dateKey) ?? 0) + 1);
  }
  const bookingsByDay: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateKey = d.toISOString().slice(0, 10);
    bookingsByDay.push({ date: dateKey, count: bookingsByDayMap.get(dateKey) ?? 0 });
  }

  // Aggregate bookings by status (last 30 days)
  const bookingsByStatus = { ACCEPTED: 0, PENDING: 0, CANCELLED: 0 };
  for (const booking of recentBookings) {
    if (booking.status === "ACCEPTED") bookingsByStatus.ACCEPTED++;
    else if (booking.status === "PENDING") bookingsByStatus.PENDING++;
    else if (booking.status === "CANCELLED" || booking.status === "REJECTED") {
      bookingsByStatus.CANCELLED++;
    }
  }

  // Resolve event type names
  const eventTypeIds = eventTypeCounts.map((e) => e.eventTypeId);
  const eventTypeNames =
    eventTypeIds.length > 0
      ? await prisma.eventType.findMany({
          where: { id: { in: eventTypeIds }, userId },
          select: { id: true, title: true },
        })
      : [];
  const nameById = new Map(eventTypeNames.map((et) => [et.id, et.title]));
  const bookingsByEventType = eventTypeCounts.map((e) => ({
    title: nameById.get(e.eventTypeId) ?? "Unknown",
    count: e._count.id,
  }));

  const popularEventType =
    bookingsByEventType.length > 0
      ? { title: bookingsByEventType[0]!.title, count: bookingsByEventType[0]!.count }
      : null;

  // Shape upcoming bookings for the list component
  const upcomingBookings = upcomingBookingsRaw
    .filter((b) => b.eventType != null)
    .map((b) => ({
      uid: b.uid,
      title: b.title,
      startTime: b.startTime.toISOString(),
      endTime: b.endTime.toISOString(),
      attendeeName: b.attendeeName,
      attendeeEmail: b.attendeeEmail,
      location: b.location,
      eventType: b.eventType
        ? {
            id: b.eventType.id,
            title: b.eventType.title,
            duration: b.eventType.duration,
            locations: (b.eventType.locations as EventTypeLocation[] | null) ?? null,
            color: b.eventType.color,
          }
        : null,
    }));

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your scheduling activity
        </p>
      </div>

      {/* Summary stat cards */}
      <StatCards
        upcomingCount={upcomingCount}
        pendingCount={pendingCount}
        monthlyCount={monthlyCount}
        popularEventType={popularEventType}
      />

      {/* Upcoming bookings */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Upcoming Bookings</h2>
          <Link
            href="/bookings"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            View all
          </Link>
        </div>
        <UpcomingList bookings={upcomingBookings} />
      </div>

      {/* Analytics charts */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Analytics</h2>
        <DashboardCharts
          bookingsByDay={bookingsByDay}
          bookingsByEventType={bookingsByEventType}
          bookingsByStatus={bookingsByStatus}
        />
      </div>
    </div>
  );
}
