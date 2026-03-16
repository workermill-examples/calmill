// Dashboard stats endpoint
// GET /api/dashboard - Dashboard statistics and chart data

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BookingStatus } from '@/generated/prisma'
import { startOfMonth, endOfMonth, subDays, eachDayOfInterval, format } from 'date-fns'
import { TZDate } from '@date-fns/tz'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const userTimezone = session.user.timezone || 'UTC'
    const now = new TZDate(new Date(), userTimezone)

    // Define date ranges
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    const last30Days = subDays(now, 30)

    // Basic stats queries
    const [
      upcomingCount,
      pendingCount,
      thisMonthCount,
      eventTypes,
      recentBookings,
      bookingsLast30Days,
      bookingsByStatus
    ] = await Promise.all([
      // Upcoming bookings (accepted bookings after now)
      prisma.booking.count({
        where: {
          userId,
          status: BookingStatus.ACCEPTED,
          startTime: { gt: now }
        }
      }),

      // Pending bookings
      prisma.booking.count({
        where: {
          userId,
          status: BookingStatus.PENDING
        }
      }),

      // This month's bookings (all statuses except cancelled/rejected)
      prisma.booking.count({
        where: {
          userId,
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          },
          status: {
            in: [BookingStatus.PENDING, BookingStatus.ACCEPTED, BookingStatus.RESCHEDULED]
          }
        }
      }),

      // Event types with booking counts
      prisma.eventType.findMany({
        where: { userId, isActive: true },
        include: {
          _count: {
            select: {
              bookings: {
                where: {
                  createdAt: { gte: monthStart },
                  status: {
                    in: [BookingStatus.PENDING, BookingStatus.ACCEPTED, BookingStatus.RESCHEDULED]
                  }
                }
              }
            }
          }
        },
        take: 5,
        orderBy: {
          bookings: {
            _count: 'desc'
          }
        }
      }),

      // Next 5 upcoming bookings
      prisma.booking.findMany({
        where: {
          userId,
          status: BookingStatus.ACCEPTED,
          startTime: { gt: now }
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
        orderBy: { startTime: 'asc' },
        take: 5
      }),

      // Bookings for last 30 days for chart
      prisma.booking.findMany({
        where: {
          userId,
          createdAt: { gte: last30Days },
          status: {
            in: [BookingStatus.PENDING, BookingStatus.ACCEPTED, BookingStatus.RESCHEDULED]
          }
        },
        select: {
          createdAt: true,
          eventTypeId: true,
          eventType: {
            select: {
              title: true,
              color: true
            }
          }
        }
      }),

      // Bookings by status for donut chart
      prisma.booking.groupBy({
        by: ['status'],
        where: {
          userId,
          createdAt: { gte: monthStart }
        },
        _count: {
          status: true
        }
      })
    ])

    // Find most popular event type
    const popularEventType = eventTypes.length > 0 ? eventTypes[0] : null

    // Generate chart data for bookings per day (last 30 days)
    const days = eachDayOfInterval({
      start: last30Days,
      end: now
    })

    const bookingsPerDay = days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const count = bookingsLast30Days.filter(booking =>
        format(new TZDate(booking.createdAt, userTimezone), 'yyyy-MM-dd') === dayStr
      ).length

      return {
        date: dayStr,
        bookings: count
      }
    })

    // Group bookings by event type for bar chart
    const bookingsByEventType = eventTypes.map(et => ({
      eventType: et.title,
      bookings: et._count.bookings,
      color: et.color
    }))

    // Format bookings by status for donut chart
    const bookingsByStatusFormatted = bookingsByStatus.map(item => ({
      status: item.status,
      count: item._count.status,
      color: getStatusColor(item.status)
    }))

    // Format upcoming bookings
    const upcomingBookings = recentBookings.map(booking => ({
      id: booking.id,
      uid: booking.uid,
      title: booking.title,
      attendeeName: booking.attendeeName,
      attendeeEmail: booking.attendeeEmail,
      startTime: booking.startTime,
      endTime: booking.endTime,
      eventType: {
        title: booking.eventType.title,
        color: booking.eventType.color,
        duration: booking.eventType.duration
      }
    }))

    return NextResponse.json({
      stats: {
        upcoming: upcomingCount,
        pending: pendingCount,
        thisMonth: thisMonthCount,
        popular: popularEventType ? {
          title: popularEventType.title,
          bookings: popularEventType._count.bookings
        } : null
      },
      upcomingBookings,
      charts: {
        bookingsPerDay,
        bookingsByEventType,
        bookingsByStatus: bookingsByStatusFormatted
      }
    })

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'internal', message: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

function getStatusColor(status: BookingStatus): string {
  switch (status) {
    case BookingStatus.PENDING:
      return '#F59E0B' // amber-500
    case BookingStatus.ACCEPTED:
      return '#10B981' // emerald-500
    case BookingStatus.CANCELLED:
      return '#EF4444' // red-500
    case BookingStatus.REJECTED:
      return '#DC2626' // red-600
    case BookingStatus.RESCHEDULED:
      return '#6366F1' // indigo-500
    default:
      return '#6B7280' // gray-500
  }
}