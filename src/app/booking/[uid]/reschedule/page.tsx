"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO, addDays, startOfDay, isSameDay } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarPicker } from "@/components/booking/calendar-picker";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  X,
  Edit,
} from "lucide-react";

interface RouteParams {
  params: Promise<{ uid: string }>;
}

interface Booking {
  id: string;
  uid: string;
  title: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "ACCEPTED" | "CANCELLED" | "REJECTED" | "RESCHEDULED";
  attendeeName: string;
  attendeeEmail: string;
  attendeeTimezone: string;
  attendeeNotes?: string;
  location?: string;
  meetingUrl?: string;
  eventType: {
    id: string;
    title: string;
    description?: string;
    duration: number;
    color: string;
    requiresConfirmation: boolean;
  };
  user: {
    name?: string;
    email: string;
    username?: string;
    timezone: string;
  };
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function BookingReschedulePage({ params }: RouteParams) {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newBookingUid, setNewBookingUid] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [rescheduleReason, setRescheduleReason] = useState("");

  // Extract params
  useEffect(() => {
    const extractParams = async () => {
      const resolvedParams = await params;
      setUid(resolvedParams.uid);
    };
    extractParams();
  }, [params]);

  // Fetch booking data
  useEffect(() => {
    if (!uid) return;

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bookings/${uid}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Booking not found. Please check the link and try again.");
          } else {
            setError("Unable to load booking details. Please try again later.");
          }
          return;
        }

        const data = await response.json();
        const bookingData = data.booking;

        // Check if booking can be rescheduled
        if (
          bookingData.status === "CANCELLED" ||
          bookingData.status === "REJECTED"
        ) {
          setError("Cannot reschedule cancelled or declined bookings.");
          setBooking(bookingData);
          return;
        }

        if (bookingData.status === "RESCHEDULED") {
          setError("This booking has already been rescheduled.");
          setBooking(bookingData);
          return;
        }

        // Check if booking is in the past
        const startTime = parseISO(bookingData.startTime);
        if (startTime < new Date()) {
          setError("Cannot reschedule a booking that has already occurred.");
          setBooking(bookingData);
          return;
        }

        setBooking(bookingData);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Unable to load booking details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [uid]);

  // Fetch available slots when date is selected
  const fetchAvailableSlots = useCallback(
    async (date: Date) => {
      if (!booking) return;

      try {
        setLoadingSlots(true);
        const dateStr = format(date, "yyyy-MM-dd");

        const params = new URLSearchParams({
          eventTypeId: booking.eventType.id,
          startDate: dateStr,
          endDate: dateStr,
          timezone: booking.attendeeTimezone,
        });

        const response = await fetch(`/api/slots?${params}`);
        if (!response.ok) {
          console.error("Failed to fetch slots");
          setAvailableSlots([]);
          return;
        }

        const data = await response.json();
        setAvailableSlots(data.slots || []);
      } catch (err) {
        console.error("Error fetching slots:", err);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    },
    [booking],
  );

  useEffect(() => {
    if (selectedDate && booking) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate, fetchAvailableSlots, booking]);

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!booking || !selectedDate || !selectedTime) {
      setError("Please select a new date and time.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Combine selected date with selected time
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const newStartTime = new Date(selectedDate);
      newStartTime.setHours(hours, minutes, 0, 0);

      // Convert to UTC for the API
      const utcStartTime = new TZDate(
        newStartTime,
        booking.attendeeTimezone,
      );

      const response = await fetch(`/api/bookings/${booking.uid}/reschedule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newStartTime: utcStartTime.toISOString(),
          attendeeTimezone: booking.attendeeTimezone,
          reason: rescheduleReason.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to reschedule booking");
      }

      const result = await response.json();
      setNewBookingUid(result.newBooking.uid);
      setSuccess(true);

      // Redirect to new booking confirmation after a short delay
      setTimeout(() => {
        router.push(`/booking/${result.newBooking.uid}`);
      }, 3000);
    } catch (err) {
      console.error("Error rescheduling booking:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reschedule booking. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Generate available dates (next 60 days)
  const availableDates = booking
    ? Array.from({ length: 60 }, (_, i) => {
        const date = addDays(startOfDay(new Date()), i);
        // Don't show the current booking date
        const currentBookingDate = parseISO(booking.startTime);
        return !isSameDay(date, currentBookingDate) ? date : null;
      }).filter((date): date is Date => date !== null)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            <CardSkeleton className="h-32" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CardSkeleton className="h-96" />
              <CardSkeleton className="h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success && newBookingUid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Booking Rescheduled
            </h1>
            <p className="text-gray-600 mb-6">
              Your booking has been successfully rescheduled. You&apos;ll
              receive a confirmation email with the new details.
            </p>
            <div className="space-y-3">
              <Button  className="w-full">
                <Link href={`/booking/${newBookingUid}`}>
                  View Updated Booking
                </Link>
              </Button>
              <p className="text-sm text-gray-500">
                Redirecting in 3 seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Reschedule Booking
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button  variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Booking Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              This booking could not be found. Please check the link and try
              again.
            </p>
            <Button  variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const originalStartTime = new TZDate(
    parseISO(booking.startTime),
    booking.attendeeTimezone,
  );
  const originalEndTime = new TZDate(
    parseISO(booking.endTime),
    booking.attendeeTimezone,
  );
  const canReschedule = !error;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" >
              <Link
                href={`/booking/${booking.uid}`}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Booking</span>
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-8 h-8 text-blue-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Reschedule Booking
            </h1>
            <p className="text-gray-600">
              Select a new date and time for your meeting
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Booking Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Current Booking</span>
                </CardTitle>
                <Badge variant="outline">
                  {booking.status === "PENDING"
                    ? "Pending Confirmation"
                    : "Confirmed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{booking.title}</p>
                    <p className="text-sm text-muted-foreground line-through">
                      {format(originalStartTime, "EEEE, MMMM d, yyyy")} at{" "}
                      {format(originalStartTime, "h:mm a")} -{" "}
                      {format(originalEndTime, "h:mm a")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.attendeeTimezone} • {booking.eventType.duration}{" "}
                      minutes
                    </p>
                  </div>
                </div>

                {booking.location && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {booking.location}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Host: {booking.user.name || booking.user.email}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reschedule Form */}
          {canReschedule && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Select New Date</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CalendarPicker
                    selectedDate={selectedDate || undefined}
                    onDateSelect={(date) => {
                      setSelectedDate(date);
                      setSelectedTime(null); // Clear selected time when date changes
                    }}
                    availableDates={availableDates}
                    timezone={booking.attendeeTimezone}
                    minDate={startOfDay(new Date())}
                    maxDate={addDays(new Date(), 60)}
                    eventDuration={booking.eventType.duration}
                    eventTitle={booking.title}
                  />
                </CardContent>
              </Card>

              {/* Time Slots and Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Select New Time</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!selectedDate && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Please select a date first
                      </p>
                    </div>
                  )}

                  {selectedDate && (
                    <>
                      {/* Selected Date Display */}
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-900">
                          {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        </p>
                      </div>

                      {/* Time Slots */}
                      {loadingSlots ? (
                        <div className="space-y-2">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-10 bg-gray-200 rounded animate-pulse"
                            />
                          ))}
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">
                            No available time slots on this date
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {availableSlots
                            .filter((slot) => slot.available)
                            .map((slot) => {
                              const slotTime = parseISO(slot.time);
                              const timeString = format(slotTime, "HH:mm");
                              const displayTime = format(slotTime, "h:mm a");

                              return (
                                <button
                                  key={slot.time}
                                  type="button"
                                  onClick={() => setSelectedTime(timeString)}
                                  className={cn(
                                    "px-3 py-2 text-sm rounded-md border transition-colors",
                                    selectedTime === timeString
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50",
                                  )}
                                >
                                  {displayTime}
                                </button>
                              );
                            })}
                        </div>
                      )}

                      {/* Reason Form */}
                      {selectedTime && (
                        <form
                          onSubmit={handleReschedule}
                          className="space-y-4 pt-4 border-t"
                        >
                          <div className="space-y-2">
                            <label
                              htmlFor="reschedule-reason"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Reason for rescheduling (optional)
                            </label>
                            <textarea
                              id="reschedule-reason"
                              value={rescheduleReason}
                              onChange={(e) =>
                                setRescheduleReason(e.target.value)
                              }
                              placeholder="Let the host know why you're rescheduling..."
                              rows={3}
                              disabled={submitting}
                              className="resize-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                            />
                          </div>

                          <div className="flex flex-col gap-3">
                            <Button
                              type="submit"
                              className="w-full"
                              loading={submitting}
                              disabled={
                                submitting || !selectedDate || !selectedTime
                              }
                            >
                              {submitting
                                ? "Rescheduling..."
                                : "Confirm Reschedule"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                              
                              disabled={submitting}
                            >
                              <Link href={`/booking/${booking.uid}`}>
                                Cancel
                              </Link>
                            </Button>
                          </div>
                        </form>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Warning Note */}
          {canReschedule && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium mb-1">Important:</p>
                    <ul className="space-y-1 text-xs">
                      <li>
                        • This will create a new booking and cancel the current
                        one
                      </li>
                      <li>
                        • Both you and the host will receive email notifications
                      </li>
                      <li>
                        •{" "}
                        {booking.eventType.requiresConfirmation
                          ? "The new booking may require host confirmation"
                          : "The new booking will be automatically confirmed"}
                      </li>
                      <li>
                        • If you need to cancel instead, use the
                        &quot;Cancel&quot; option
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
