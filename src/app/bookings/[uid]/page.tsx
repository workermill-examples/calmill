"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { cn } from "@/lib/utils";

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
  recurringEventId?: string;
  calendarEventId?: string;
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
    description: "This booking is waiting for your approval",
    canAccept: true,
    canReject: true,
    canCancel: true,
  },
  ACCEPTED: {
    variant: "success" as const,
    label: "Confirmed",
    description: "This booking has been confirmed",
    canAccept: false,
    canReject: false,
    canCancel: true,
  },
  CANCELLED: {
    variant: "secondary" as const,
    label: "Cancelled",
    description: "This booking has been cancelled",
    canAccept: false,
    canReject: false,
    canCancel: false,
  },
  REJECTED: {
    variant: "danger" as const,
    label: "Rejected",
    description: "This booking request was declined",
    canAccept: false,
    canReject: false,
    canCancel: false,
  },
  RESCHEDULED: {
    variant: "outline" as const,
    label: "Rescheduled",
    description: "This booking was moved to a different time",
    canAccept: false,
    canReject: false,
    canCancel: false,
  },
};

export default function BookingDetailPage({ params }: RouteParams) {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Resolve params
  useEffect(() => {
    params.then(({ uid: bookingUid }) => {
      setUid(bookingUid);
    });
  }, [params]);

  // Fetch booking details
  useEffect(() => {
    if (!uid) return;

    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/bookings/${uid}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch booking");
        }

        const data = await response.json();
        setBooking(data.booking);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch booking");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [uid]);

  const handleAction = async (action: "accept" | "reject" | "cancel") => {
    if (!booking || !uid) return;

    try {
      setActionLoading(action);

      const body: any = { action };
      if (action === "cancel" && cancellationReason) {
        body.cancellationReason = cancellationReason;
      }

      const response = await fetch(`/api/bookings/${uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} booking`);
      }

      const data = await response.json();
      setBooking(data.booking);
      setShowCancelDialog(false);
      setCancellationReason("");

      // Show success message (in a real app, you might use a toast notification)
      alert(`Booking ${action}${action === "cancel" ? "led" : "ed"} successfully!`);
    } catch (err) {
      console.error(`Error ${action}ing booking:`, err);
      alert(err instanceof Error ? err.message : `Failed to ${action} booking`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDateTime = (startTime: string, endTime: string, timezone: string) => {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      return {
        date: format(start, "EEEE, MMMM d, yyyy"),
        time: `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`,
        timezone: timezone,
      };
    } catch {
      return {
        date: "Invalid Date",
        time: "Invalid Time",
        timezone: timezone || "UTC",
      };
    }
  };

  const generateCalendarUrls = () => {
    if (!booking) return {};

    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);
    const title = encodeURIComponent(booking.title);
    const description = encodeURIComponent(
      [
        `Event: ${booking.title}`,
        `Host: ${booking.user.name || booking.user.email}`,
        booking.location && `Location: ${booking.location}`,
        booking.attendeeNotes && `Notes: ${booking.attendeeNotes}`,
      ].filter(Boolean).join("\n")
    );

    const location = encodeURIComponent(booking.location || "");

    // Google Calendar URL
    const googleUrl = new URL("https://calendar.google.com/calendar/render");
    googleUrl.searchParams.set("action", "TEMPLATE");
    googleUrl.searchParams.set("text", title);
    googleUrl.searchParams.set("dates", `${startTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`);
    googleUrl.searchParams.set("details", description);
    googleUrl.searchParams.set("location", location);

    // Outlook URL
    const outlookUrl = new URL("https://outlook.live.com/calendar/0/deeplink/compose");
    outlookUrl.searchParams.set("subject", title);
    outlookUrl.searchParams.set("startdt", startTime.toISOString());
    outlookUrl.searchParams.set("enddt", endTime.toISOString());
    outlookUrl.searchParams.set("body", description);
    outlookUrl.searchParams.set("location", location);

    // ICS download (simplified)
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//CalMill//CalMill//EN",
      "BEGIN:VEVENT",
      `UID:${booking.uid}@calmill.workermill.com`,
      `DTSTART:${startTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTEND:${endTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `SUMMARY:${booking.title}`,
      `DESCRIPTION:${booking.title}`,
      booking.location && `LOCATION:${booking.location}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].filter(Boolean).join("\n");

    const icsBlob = new Blob([icsContent], { type: "text/calendar" });
    const icsUrl = URL.createObjectURL(icsBlob);

    return {
      google: googleUrl.toString(),
      outlook: outlookUrl.toString(),
      ics: icsUrl,
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Booking Details</h1>
          </div>
        </div>
        <CardSkeleton />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Booking Details</h1>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {error ? "Error loading booking" : "Booking not found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {error || "The booking you're looking for doesn't exist or you don't have access to it."}
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => router.back()}>
                  Go Back
                </Button>
                <Link href="/bookings">
                  <Button variant="primary">View All Bookings</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { date, time, timezone } = formatDateTime(
    booking.startTime,
    booking.endTime,
    booking.attendeeTimezone
  );

  const statusInfo = statusConfig[booking.status];
  const calendarUrls = generateCalendarUrls();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          ← Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{booking.title}</h1>
          <p className="text-muted-foreground">Booking details and actions</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: booking.eventType.color }}
                  />
                  Booking Status
                </CardTitle>
                <Badge variant={statusInfo.variant} size="lg">
                  {statusInfo.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {statusInfo.description}
              </p>

              {booking.cancellationReason && (
                <div className="bg-muted p-3 rounded-md mb-4">
                  <p className="text-sm font-medium">Cancellation Reason:</p>
                  <p className="text-sm text-muted-foreground">{booking.cancellationReason}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {statusInfo.canAccept && (
                  <Button
                    onClick={() => handleAction("accept")}
                    loading={actionLoading === "accept"}
                    variant="success"
                    size="sm"
                  >
                    Accept
                  </Button>
                )}
                {statusInfo.canReject && (
                  <Button
                    onClick={() => handleAction("reject")}
                    loading={actionLoading === "reject"}
                    variant="danger"
                    size="sm"
                  >
                    Reject
                  </Button>
                )}
                {statusInfo.canCancel && (
                  <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Booking</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Are you sure you want to cancel this booking? This action cannot be undone.
                        </p>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Cancellation Reason (optional)
                          </label>
                          <Input
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            placeholder="Explain why you're cancelling..."
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowCancelDialog(false);
                              setCancellationReason("");
                            }}
                          >
                            Keep Booking
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleAction("cancel")}
                            loading={actionLoading === "cancel"}
                          >
                            Cancel Booking
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Date</p>
                  <p className="text-sm">{date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Time</p>
                  <p className="text-sm">{time} ({timezone})</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Duration</p>
                  <p className="text-sm">{booking.eventType.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Event Type</p>
                  <p className="text-sm">{booking.eventType.title}</p>
                </div>
              </div>

              {booking.eventType.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{booking.eventType.description}</p>
                </div>
              )}

              {booking.location && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                  <p className="text-sm">{booking.location}</p>
                </div>
              )}

              {booking.meetingUrl && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Meeting URL</p>
                  <Link href={booking.meetingUrl as any} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      Join Meeting
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attendee Information */}
          <Card>
            <CardHeader>
              <CardTitle>Attendee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
                  <p className="text-sm">{booking.attendeeName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                  <p className="text-sm">{booking.attendeeEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Timezone</p>
                  <p className="text-sm">{booking.attendeeTimezone}</p>
                </div>
              </div>

              {booking.attendeeNotes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">{booking.attendeeNotes}</p>
                  </div>
                </div>
              )}

              {booking.responses && Object.keys(booking.responses).length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Custom Questions</p>
                  <div className="space-y-2">
                    {Object.entries(booking.responses).map(([question, answer]) => (
                      <div key={question} className="bg-muted p-3 rounded-md">
                        <p className="text-sm font-medium">{question}</p>
                        <p className="text-sm text-muted-foreground">{String(answer)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`mailto:${booking.attendeeEmail}`}>
                <Button variant="outline" className="w-full justify-start">
                  📧 Email Attendee
                </Button>
              </Link>

              {booking.status === "ACCEPTED" && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Add to Calendar</p>
                  <div className="space-y-2">
                    <Link href={calendarUrls.google as any} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        📅 Google Calendar
                      </Button>
                    </Link>
                    <Link href={calendarUrls.outlook as any} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        📅 Outlook
                      </Button>
                    </Link>
                    <Link href={calendarUrls.ics as any} download={`${booking.title}.ics`}>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        📥 Download .ics
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              <Link href={`/booking/${booking.uid}` as any}>
                <Button variant="outline" className="w-full justify-start">
                  🔗 Public Link
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Host Information */}
          <Card>
            <CardHeader>
              <CardTitle>Host Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
                <p className="text-sm">{booking.user.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                <p className="text-sm">{booking.user.email}</p>
              </div>
              {booking.user.username && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Username</p>
                  <p className="text-sm">@{booking.user.username}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Timezone</p>
                <p className="text-sm">{booking.user.timezone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                <div>
                  <p className="text-sm font-medium">Booking Created</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(booking.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>

              {booking.updatedAt !== booking.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(booking.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5",
                  booking.status === "ACCEPTED" && "bg-green-500",
                  booking.status === "PENDING" && "bg-yellow-500",
                  booking.status === "CANCELLED" && "bg-red-500",
                  booking.status === "REJECTED" && "bg-red-500",
                  booking.status === "RESCHEDULED" && "bg-gray-500"
                )} />
                <div>
                  <p className="text-sm font-medium">Current Status</p>
                  <p className="text-xs text-muted-foreground">{statusInfo.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}