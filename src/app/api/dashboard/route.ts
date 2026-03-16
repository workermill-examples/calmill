import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startOfMonth, startOfDay, endOfDay, subDays, format } from 'date-fns'
import { TZDate } from '@date-fns/tz'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const userTimezone = session.user.timezone
    const now = new TZDate(new Date(), userTimezone)
    const startOfToday = startOfDay(now)
    const endOfToday = endOfDay(now)
    const startOfThisMonth = startOfMonth(now)

    // Get all counts in parallel
    const [
      upcomingCount,
      pendingCount,
      thisMonthCount,
      popularEventType,
      upcomingBookings,
      chartData,
      eventTypeStats,
      statusStats
    ] = await Promise.all([
      // Upcoming bookings (accepted, today and future)
      prisma.booking.count({
        where: {
          userId,
          status: 'ACCEPTED',
          startTime: {
            gte: startOfToday
          }
        }
      }),

      // Pending bookings (requires confirmation)
      prisma.booking.count({
        where: {
          userId,
          status: 'PENDING'
        }
      }),

      // This month's bookings (all statuses except cancelled/rejected)
      prisma.booking.count({
        where: {
          userId,
          createdAt: {
            gte: startOfThisMonth
          },
          status: {
            in: ['ACCEPTED', 'PENDING', 'RESCHEDULED']
          }
        }
      }),

      // Most popular event type this month
      prisma.booking.groupBy({
        by: ['eventTypeId'],
        where: {
          userId,
          createdAt: {
            gte: startOfThisMonth
          },
          status: {
            in: ['ACCEPTED', 'PENDING', 'RESCHEDULED']
          }
        },
        _count: {
          eventTypeId: true
        },
        orderBy: {
          _count: {
            eventTypeId: 'desc'
          }
        },
        take: 1
      }),

      // Next 5 upcoming bookings
      prisma.booking.findMany({
        where: {
          userId,
          status: 'ACCEPTED',
          startTime: {
            gte: startOfToday
          }
        },
        include: {
          eventType: {
            select: {
              title: true,
              color: true,
              duration: true
            }
          }
        },
        orderBy: {
          startTime: 'asc'
        },
        take: 5
      }),

      // Chart data - bookings per day for last 30 days
      generateChartData(userId, userTimezone),

      // Event type breakdown
      prisma.booking.groupBy({
        by: ['eventTypeId'],
        where: {
          userId,
          createdAt: {
            gte: startOfThisMonth
          },
          status: {
            in: ['ACCEPTED', 'PENDING', 'RESCHEDULED']
          }
        },
        _count: {
          eventTypeId: true
        },
        orderBy: {
          _count: {
            eventTypeId: 'desc'
          }
        },
        take: 5
      }),

      // Status breakdown
      prisma.booking.groupBy({
        by: ['status'],
        where: {
          userId,
          createdAt: {
            gte: startOfThisMonth
          }
        },
        _count: {
          status: true
        }
      })
    ])

    // Get popular event type details
    let popularEventTypeData = null
    if (popularEventType.length > 0) {
      const eventType = await prisma.eventType.findUnique({
        where: { id: popularEventType[0].eventTypeId! },
        select: { title: true }
      })
      popularEventTypeData = {
        title: eventType?.title || 'Unknown',
        count: popularEventType[0]._count.eventTypeId
      }
    }

    // Get event type names for stats
    const eventTypeIds = eventTypeStats.map(stat => stat.eventTypeId!).filter(Boolean)
    const eventTypes = await prisma.eventType.findMany({
      where: { id: { in: eventTypeIds } },
      select: { id: true, title: true, color: true }
    })

    const eventTypeStatsWithNames = eventTypeStats.map(stat => {
      const eventType = eventTypes.find(et => et.id === stat.eventTypeId)
      return {
        name: eventType?.title || 'Unknown',
        count: stat._count.eventTypeId,
        color: eventType?.color || '#3b82f6'
      }
    })

    return NextResponse.json({
      stats: {
        upcoming: upcomingCount,
        pending: pendingCount,
        thisMonth: thisMonthCount,
        popularEventType: popularEventTypeData
      },
      upcomingBookings: upcomingBookings.map(booking => ({
        uid: booking.uid,
        title: booking.title,
        attendeeName: booking.attendeeName,
        startTime: booking.startTime,
        endTime: booking.endTime,
        eventType: booking.eventType
      })),
      chartData,
      eventTypeStats: eventTypeStatsWithNames,
      statusStats: statusStats.map(stat => ({
        status: stat.status,
        count: stat._count.status
      }))
    })

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

async function generateChartData(userId: string, timezone: string) {
  const days = 30
  const chartData = []

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const zonedDate = new TZDate(date, timezone)
    const dayStart = startOfDay(zonedDate)
    const dayEnd = endOfDay(zonedDate)

    const count = await prisma.booking.count({
      where: {
        userId,
        createdAt: {
          gte: dayStart,
          lte: dayEnd
        },
        status: {
          in: ['ACCEPTED', 'PENDING', 'RESCHEDULED']
        }
      }
    })

    chartData.push({
      date: format(zonedDate, 'MMM dd'),
      bookings: count
    })
  }

  return chartData
}