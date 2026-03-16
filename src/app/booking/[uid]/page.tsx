"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { TZDate, toZonedTime } from "@date-fns/tz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { cn } from "@/lib/utils";
import { createBookingICS, createICSFilename } from "@/lib/ics";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Globe,
  Download,
  ExternalLink,
  Edit,
  X
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
  responses?: Record<string, any>;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
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

const statusConfig = {
  PENDING: {
    variant: "warning" as const,
    label: "Pending Confirmation",
    description: "Your booking request is waiting for confirmation",
    showActions: true,
  },
  ACCEPTED: {
    variant: "success" as const,
    label: "Confirmed",
    description: "Your booking has been confirmed",
    showActions: true,
  },
  CANCELLED: {
    variant: "secondary" as const,
    label: "Cancelled",
    description: "This booking has been cancelled",
    showActions: false,
  },
  REJECTED: {
    variant: "danger" as const,
    label: "Declined",
    description: "This booking request was declined",
    showActions: false,
  },
  RESCHEDULED: {
    variant: "outline" as const,
    label: "Rescheduled",
    description: "This booking was moved to a different time",
    showActions: false,
  },
};

export default function BookingConfirmationPage({ params }: RouteParams) {
  const [uid, setUid] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setBooking(data.booking);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Unable to load booking details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [uid]);

  // Generate calendar download
  const handleDownloadCalendar = () => {
    if (!booking) return;

    const startTime = parseISO(booking.startTime);
    const endTime = parseISO(booking.endTime);

    const icsContent = createBookingICS({
      uid: booking.uid,
      title: booking.title,
      startTime,
      endTime,
      location: booking.location,
      meetingUrl: booking.meetingUrl,
      attendeeName: booking.attendeeName,
      attendeeEmail: booking.attendeeEmail,
      hostName: booking.user.name || booking.user.email,
      hostEmail: booking.user.email,
      description: booking.eventType.description,
    });

    const filename = createICSFilename(booking.title, startTime);
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate Google Calendar URL
  const getGoogleCalendarUrl = () => {
    if (!booking) return "";

    const startTime = toZonedTime(parseISO(booking.startTime), "UTC");
    const endTime = toZonedTime(parseISO(booking.endTime), "UTC");

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    };

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: booking.title,
      dates: `${formatGoogleDate(startTime)}/${formatGoogleDate(endTime)}`,
      details: booking.eventType.description || "",
      location: booking.location || booking.meetingUrl || "",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="space-y-6">
            <CardSkeleton className="h-48" />
            <CardSkeleton className="h-32" />
            <CardSkeleton className="h-24" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Booking
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "This booking could not be found."}
            </p>
            <Button asChild variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[booking.status];
  const startTime = toZonedTime(parseISO(booking.startTime), booking.attendeeTimezone);
  const endTime = toZonedTime(parseISO(booking.endTime), booking.attendeeTimezone);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
              booking.status === "ACCEPTED" && "bg-green-100",
              booking.status === "PENDING" && "bg-yellow-100",
              booking.status === "CANCELLED" && "bg-gray-100",
              booking.status === "REJECTED" && "bg-red-100",
              booking.status === "RESCHEDULED" && "bg-blue-100"
            )}>
              {booking.status === "ACCEPTED" && <CheckCircle className="w-8 h-8 text-green-600" />}
              {booking.status === "PENDING" && <Clock className="w-8 h-8 text-yellow-600" />}
              {booking.status === "CANCELLED" && <X className="w-8 h-8 text-gray-600" />}
              {booking.status === "REJECTED" && <X className="w-8 h-8 text-red-600" />}
              {booking.status === "RESCHEDULED" && <Edit className="w-8 h-8 text-blue-600" />}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {statusInfo.label}
            </h1>
            <p className="text-gray-600">
              {statusInfo.description}
            </p>
          </div>

          {/* Booking Status */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Badge variant={statusInfo.variant} className="text-sm">
                  {statusInfo.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Booking #{booking.uid.slice(-8).toUpperCase()}
                </span>
              </div>
            </CardHeader>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{booking.title}</span>
              </CardTitle>
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
                      {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")} ({booking.eventType.duration} min)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Timezone</p>
                    <p className="text-sm text-muted-foreground">
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

                {booking.meetingUrl && (
                  <div className="flex items-start space-x-3">
                    <ExternalLink className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Meeting Link</p>
                      <a
                        href={booking.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {booking.eventType.description && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    {booking.eventType.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attendee Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Attendee Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{booking.attendeeName}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{booking.attendeeEmail}</span>
              </div>

              {booking.attendeeNotes && (
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.attendeeNotes}
                  </p>
                </div>
              )}

              {booking.responses && Object.keys(booking.responses).length > 0 && (
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Additional Information:</p>
                  <div className="space-y-2">
                    {Object.entries(booking.responses).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium text-gray-700">{key}: </span>
                        <span className="text-muted-foreground">
                          {Array.isArray(value) ? value.join(", ") : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Host Information */}
          <Card>
            <CardHeader>
              <CardTitle>Meeting Host</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">
                  {booking.user.name || booking.user.email}
                </span>
                {booking.user.name && (
                  <span className="text-sm text-muted-foreground">
                    ({booking.user.email})
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Calendar Integration */}
          {(booking.status === "ACCEPTED" || booking.status === "PENDING") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Add to Calendar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadCalendar}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .ics</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex items-center space-x-2"
                  >
                    <a href={getGoogleCalendarUrl()} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      <span>Google Calendar</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {statusInfo.showActions && (
            <Card>
              <CardHeader>
                <CardTitle>Manage Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/booking/${booking.uid}/reschedule`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Reschedule
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/booking/${booking.uid}/cancel`}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cancellation Reason */}
          {booking.status === "CANCELLED" && booking.cancellationReason && (
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
        </div>
      </div>
    </div>
  );
}