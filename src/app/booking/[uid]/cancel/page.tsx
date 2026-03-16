"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowLeft,
  X,
  CheckCircle,
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
  cancellationReason?: string;
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

export default function BookingCancelPage({ params }: RouteParams) {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

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

        // Check if booking is already cancelled
        if (bookingData.status === "CANCELLED") {
          setError("This booking has already been cancelled.");
          setBooking(bookingData);
          return;
        }

        // Check if booking is in the past
        const startTime = parseISO(bookingData.startTime);
        if (startTime < new Date()) {
          setError("Cannot cancel a booking that has already occurred.");
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

  const handleCancelBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!booking || !cancellationReason.trim()) {
      setError("Please provide a reason for cancellation.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`/api/bookings/${booking.uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "cancel",
          cancellationReason: cancellationReason.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to cancel booking");
      }

      setSuccess(true);

      // Redirect to confirmation page after a short delay
      setTimeout(() => {
        router.push(`/booking/${booking.uid}`);
      }, 3000);
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to cancel booking. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="space-y-6">
            <CardSkeleton className="h-32" />
            <CardSkeleton className="h-48" />
            <CardSkeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Booking Cancelled
            </h1>
            <p className="text-gray-600 mb-6">
              Your booking has been successfully cancelled. A confirmation email
              has been sent to you and the host.
            </p>
            <div className="space-y-3">
              <Button  className="w-full">
                <Link href={`/booking/${booking?.uid}`}>
                  View Booking Details
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
              Unable to Cancel Booking
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

  const startTime = new TZDate(
    parseISO(booking.startTime),
    booking.attendeeTimezone,
  );
  const endTime = new TZDate(
    parseISO(booking.endTime),
    booking.attendeeTimezone,
  );
  const isAlreadyCancelled = booking.status === "CANCELLED";
  const canCancel = !isAlreadyCancelled && !error;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
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
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                isAlreadyCancelled ? "bg-gray-100" : "bg-red-100",
              )}
            >
              {isAlreadyCancelled ? (
                <X className="w-8 h-8 text-gray-600" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-600" />
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isAlreadyCancelled
                ? "Booking Already Cancelled"
                : "Cancel Booking"}
            </h1>
            <p className="text-gray-600">
              {isAlreadyCancelled
                ? "This booking has already been cancelled."
                : "Are you sure you want to cancel this booking?"}
            </p>
          </div>

          {/* Error Message */}
          {error && !isAlreadyCancelled && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{booking.title}</span>
                </CardTitle>
                {isAlreadyCancelled && (
                  <Badge variant="secondary">Cancelled</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {format(startTime, "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(startTime, "h:mm a")} -{" "}
                      {format(endTime, "h:mm a")} ({booking.eventType.duration}{" "}
                      min)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.attendeeTimezone}
                    </p>
                  </div>
                </div>

                {booking.location && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.location}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Host</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.user.name || booking.user.email}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Already Cancelled Reason */}
          {isAlreadyCancelled && booking.cancellationReason && (
            <Card>
              <CardHeader>
                <CardTitle>Cancellation Reason</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {booking.cancellationReason}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Cancellation Form */}
          {canCancel && (
            <Card>
              <CardHeader>
                <CardTitle>Reason for Cancellation</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Please let the host know why you&apos;re cancelling this
                  booking.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCancelBooking} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="cancellation-reason"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cancellation Reason *
                    </label>
                    <textarea
                      id="cancellation-reason"
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      placeholder="Please explain why you need to cancel this booking..."
                      rows={4}
                      required
                      disabled={submitting}
                      className="resize-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
                    />
                    <p className="text-xs text-muted-foreground">
                      This reason will be shared with the host and included in
                      the cancellation confirmation.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="submit"
                      variant="danger"
                      className="flex-1"
                      loading={submitting}
                      disabled={submitting || !cancellationReason.trim()}
                    >
                      {submitting ? "Cancelling..." : "Confirm Cancellation"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      
                      disabled={submitting}
                    >
                      <Link href={`/booking/${booking.uid}`}>Keep Booking</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Warning Note */}
          {canCancel && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium mb-1">Important:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• This action cannot be undone</li>
                      <li>
                        • Both you and the host will receive a cancellation
                        confirmation email
                      </li>
                      <li>
                        • If you need to reschedule instead, use the
                        &quot;Reschedule&quot; option
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
