import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/api-auth';

// GET /api/dashboard — Aggregated dashboard data for authenticated user
export const GET = withAuth(async (_request, _context, user) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  try {
    const [
      upcomingCount,
      pendingCount,
      monthlyCount,
      upcomingBookings,
      recentBookings,
      eventTypeCounts,
    ] = await Promise.all([
      // Count upcoming ACCEPTED bookings in next 7 days
      prisma.booking.count({
        where: {
          userId: user.id,
          status: 'ACCEPTED',
          startTime: { gte: now, lte: next7Days },
        },
      }),
      // Count PENDING bookings requiring action
      prisma.booking.count({
        where: {
          userId: user.id,
          status: 'PENDING',
        },
      }),
      // Count bookings created this calendar month
      prisma.booking.count({
        where: {
          userId: user.id,
          createdAt: { gte: startOfMonth },
        },
      }),
      // Next 5 upcoming ACCEPTED bookings
      prisma.booking.findMany({
        where: {
          userId: user.id,
          status: 'ACCEPTED',
          startTime: { gte: now },
        },
        include: {
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
        take: 5,
      }),
      // Last 30 days bookings for time-series chart
      prisma.booking.findMany({
        where: {
          userId: user.id,
          createdAt: { gte: last30Days },
        },
        select: {
          createdAt: true,
          status: true,
          eventTypeId: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      // Bookings per event type (all time for this user)
      prisma.booking.groupBy({
        by: ['eventTypeId'],
        where: { userId: user.id },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
    ]);

    // Aggregate bookings by day for last 30 days
    const bookingsByDayMap = new Map<string, number>();
    for (const booking of recentBookings) {
      const dateKey = booking.createdAt.toISOString().slice(0, 10);
      bookingsByDayMap.set(dateKey, (bookingsByDayMap.get(dateKey) ?? 0) + 1);
    }

    // Fill in all 30 days (including zeros)
    const bookingsByDay: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = d.toISOString().slice(0, 10);
      bookingsByDay.push({ date: dateKey, count: bookingsByDayMap.get(dateKey) ?? 0 });
    }

    // Aggregate bookings by status
    const statusCounts = { ACCEPTED: 0, PENDING: 0, CANCELLED: 0 };
    for (const booking of recentBookings) {
      if (booking.status === 'ACCEPTED') statusCounts.ACCEPTED++;
      else if (booking.status === 'PENDING') statusCounts.PENDING++;
      else if (booking.status === 'CANCELLED' || booking.status === 'REJECTED') {
        statusCounts.CANCELLED++;
      }
    }

    // Resolve event type names for the event type chart
    const eventTypeIds = eventTypeCounts.map((e) => e.eventTypeId);
    const eventTypeNames =
      eventTypeIds.length > 0
        ? await prisma.eventType.findMany({
            where: { id: { in: eventTypeIds }, userId: user.id },
            select: { id: true, title: true },
          })
        : [];

    const nameById = new Map(eventTypeNames.map((et) => [et.id, et.title]));

    const bookingsByEventType = eventTypeCounts.map((e) => ({
      title: nameById.get(e.eventTypeId) ?? 'Unknown',
      count: e._count.id,
    }));

    // Determine most popular event type
    const popularEventType =
      bookingsByEventType.length > 0
        ? { title: bookingsByEventType[0]!.title, count: bookingsByEventType[0]!.count }
        : null;

    return NextResponse.json({
      upcomingCount,
      pendingCount,
      monthlyCount,
      popularEventType,
      upcomingBookings,
      bookingsByDay,
      bookingsByEventType,
      bookingsByStatus: statusCounts,
    });
  } catch (error) {
    console.error('GET /api/dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
