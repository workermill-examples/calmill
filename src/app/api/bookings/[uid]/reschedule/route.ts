import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getAvailableSlots } from '@/lib/slots'
import { triggerWebhooks, WEBHOOK_EVENTS } from '@/lib/webhooks'
import { sendBookingConfirmationEmail, sendBookingCancellationEmail } from '@/lib/email'

// Validation schema
const rescheduleBookingSchema = z.object({
  newStartTime: z.string().datetime(),
  attendeeTimezone: z.string(),
  reason: z.string().optional(),
})

interface RouteParams {
  params: Promise<{ uid: string }>
}

/**
 * PUT /api/bookings/[uid]/reschedule - Reschedule a booking (create new, mark old as RESCHEDULED)
 * Public endpoint - attendees can reschedule their own bookings
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { uid } = await params
    const body = await request.json()
    const { newStartTime, attendeeTimezone, reason } = rescheduleBookingSchema.parse(body)

    // Find the original booking
    const originalBooking = await prisma.booking.findUnique({
      where: { uid },
      include: {
        eventType: {
          select: {
            id: true,
            title: true,
            duration: true,
            color: true,
            requiresConfirmation: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            timezone: true,
          }
        }
      }
    })

    if (!originalBooking) {
      return NextResponse.json(
        { error: 'not_found', message: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if booking can be rescheduled
    if (originalBooking.status === 'CANCELLED' || originalBooking.status === 'REJECTED') {
      return NextResponse.json(
        { error: 'invalid', message: 'Cannot reschedule cancelled or rejected bookings' },
        { status: 400 }
      )
    }

    if (originalBooking.status === 'RESCHEDULED') {
      return NextResponse.json(
        { error: 'invalid', message: 'This booking has already been rescheduled' },
        { status: 400 }
      )
    }

    const newStart = new Date(newStartTime)
    const newEnd = new Date(newStart.getTime() + (originalBooking.eventType.duration * 60 * 1000))

    // Re-verify new slot availability
    const dateStr = newStart.toISOString().split('T')[0]
    const availableSlots = await getAvailableSlots({
      eventTypeId: originalBooking.eventType.id,
      startDate: dateStr,
      endDate: dateStr,
      timezone: attendeeTimezone,
    })

    const requestedSlot = availableSlots.find(slot =>
      new Date(slot.time).getTime() === newStart.getTime()
    )

    if (!requestedSlot) {
      return NextResponse.json(
        { error: 'conflict', message: 'Selected time slot is not available' },
        { status: 409 }
      )
    }

    // Create new booking and mark old as rescheduled in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Mark original booking as rescheduled
      const rescheduledBooking = await tx.booking.update({
        where: { uid },
        data: {
          status: 'RESCHEDULED',
          cancellationReason: reason || 'Rescheduled to new time',
        },
      })

      // Create new booking
      const newBooking = await tx.booking.create({
        data: {
          uid: crypto.randomUUID(),
          title: originalBooking.title,
          startTime: newStart,
          endTime: newEnd,
          status: originalBooking.eventType.requiresConfirmation ? 'PENDING' : 'ACCEPTED',
          attendeeName: originalBooking.attendeeName,
          attendeeEmail: originalBooking.attendeeEmail,
          attendeeTimezone: attendeeTimezone,
          attendeeNotes: originalBooking.attendeeNotes,
          location: originalBooking.location,
          responses: originalBooking.responses as any,
          meetingUrl: originalBooking.meetingUrl,
          // Don't copy recurring info - reschedule creates single booking
          recurringEventId: null,
          userId: originalBooking.userId,
          eventTypeId: originalBooking.eventTypeId,
        },
        include: {
          eventType: {
            select: {
              title: true,
              color: true,
              duration: true,
              requiresConfirmation: true,
            }
          },
          user: {
            select: {
              name: true,
              email: true,
              timezone: true,
            }
          }
        }
      })

      return { rescheduledBooking, newBooking }
    })

    // Send notification emails
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const cancelUrl = `${baseUrl}/booking/${result.newBooking.uid}/cancel`
    const rescheduleUrl = `${baseUrl}/booking/${result.newBooking.uid}/reschedule`

    // Send confirmation email for new booking to attendee
    sendBookingConfirmationEmail({
      attendeeName: originalBooking.attendeeName,
      attendeeEmail: originalBooking.attendeeEmail,
      eventTitle: originalBooking.eventType.title,
      startTime: result.newBooking.startTime,
      endTime: result.newBooking.endTime,
      timezone: attendeeTimezone,
      location: originalBooking.location || undefined,
      meetingUrl: originalBooking.meetingUrl || undefined,
      hostName: originalBooking.user.name || originalBooking.user.email,
      bookingUid: result.newBooking.uid,
      cancelUrl,
      rescheduleUrl,
    })

    // Send cancellation email for old booking to host
    sendBookingCancellationEmail({
      recipientName: originalBooking.user.name || originalBooking.user.email,
      recipientEmail: originalBooking.user.email,
      eventTitle: originalBooking.eventType.title,
      startTime: originalBooking.startTime,
      timezone: originalBooking.user.timezone,
      cancellationReason: `Rescheduled to ${new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
        timeZone: attendeeTimezone,
      }).format(result.newBooking.startTime)}`,
      isHost: true,
    })

    // Send notification email for new booking to host
    // Similar to booking creation notification
    const acceptUrl = originalBooking.eventType.requiresConfirmation
      ? `${baseUrl}/api/bookings/${result.newBooking.uid}?action=accept&token=${result.newBooking.uid}`
      : undefined
    const rejectUrl = originalBooking.eventType.requiresConfirmation
      ? `${baseUrl}/api/bookings/${result.newBooking.uid}?action=reject&token=${result.newBooking.uid}`
      : undefined

    // For now, we'll just use the booking confirmation - in a real app you'd have a reschedule notification template

    // Trigger webhooks for both events
    await triggerWebhooks(originalBooking.userId, WEBHOOK_EVENTS.BOOKING_RESCHEDULED, {
      originalBookingId: originalBooking.id,
      originalBookingUid: originalBooking.uid,
      newBookingId: result.newBooking.id,
      newBookingUid: result.newBooking.uid,
      eventTypeId: originalBooking.eventTypeId,
      attendeeEmail: originalBooking.attendeeEmail,
      originalStartTime: originalBooking.startTime.toISOString(),
      originalEndTime: originalBooking.endTime.toISOString(),
      newStartTime: result.newBooking.startTime.toISOString(),
      newEndTime: result.newBooking.endTime.toISOString(),
      reason,
    })

    return NextResponse.json({
      originalBooking: result.rescheduledBooking,
      newBooking: result.newBooking,
      message: 'Booking rescheduled successfully',
    })

  } catch (error) {
    console.error('Error rescheduling booking:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'validation', message: 'Invalid reschedule data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'internal', message: 'Failed to reschedule booking' },
      { status: 500 }
    )
  }
}