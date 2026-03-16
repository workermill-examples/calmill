"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  formatISO,
  isBefore,
  startOfDay,
} from "date-fns";
import { TZDate, tz } from "@date-fns/tz";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Calendar,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

interface TeamEventType {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  duration: number;
  color?: string | null;
  schedulingType: string;
  requiresConfirmation: boolean;
  minimumNotice?: number | null;
  price?: number | null;
  currency?: string | null;
  customQuestions?: any;
}

interface PublicTeam {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  bio?: string | null;
  members: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      name: string | null;
      username: string | null;
      image?: string | null;
    };
  }>;
}

interface TimeSlot {
  time: string; // ISO string in UTC
  localTime: string; // ISO string in user's timezone
  duration: number;
}

interface BookingFormData {
  attendeeName: string;
  attendeeEmail: string;
  attendeeNotes: string;
  responses: Record<string, any>;
}

const TIMEZONE_OPTIONS = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
];

function CalendarPicker({
  selectedDate,
  onDateSelect,
  availableDates,
  timezone,
}: {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  availableDates: Set<string>;
  timezone: string;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startDate = startOfMonth(currentMonth);
  const startOfWeek = startDate.getDay();
  const emptyDays = Array.from({ length: startOfWeek }, (_, i) => i);

  const today = startOfDay(new Date());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {daysInMonth.map((day) => {
          const dayStr = format(day, "yyyy-MM-dd");
          const isAvailable = availableDates.has(dayStr);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isPast = isBefore(day, today);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);

          return (
            <button
              key={dayStr}
              className={`aspect-square text-sm rounded-md border transition-colors ${
                !isCurrentMonth
                  ? "text-muted-foreground/50 cursor-not-allowed"
                  : isPast
                    ? "text-muted-foreground cursor-not-allowed"
                    : isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : isAvailable
                        ? "hover:bg-primary/10 border-transparent text-foreground cursor-pointer"
                        : "text-muted-foreground/50 cursor-not-allowed"
              } ${isTodayDate && !isSelected ? "border-primary" : "border-border"}`}
              onClick={() => isAvailable && !isPast && onDateSelect(day)}
              disabled={!isAvailable || isPast || !isCurrentMonth}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimeSlotList({
  slots,
  selectedSlot,
  onSlotSelect,
  timezone,
  loading,
}: {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
  timezone: string;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        <div className="text-lg font-semibold mb-4">Available Times</div>
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No times available</h3>
        <p className="text-muted-foreground">Please select a different date.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-lg font-semibold mb-4">Available Times</div>
      <div className="grid gap-2 max-h-80 overflow-y-auto">
        {slots.map((slot) => {
          const localTime = new TZDate(parseISO(slot.time), timezone);
          const isSelected = selectedSlot?.time === slot.time;

          return (
            <button
              key={slot.time}
              className={`p-3 rounded-md border text-left transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-primary/10 border-border"
              }`}
              onClick={() => onSlotSelect(slot)}
            >
              {format(localTime, "h:mm a")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BookingForm({
  eventType,
  team,
  selectedSlot,
  timezone,
  onSubmit,
  onBack,
  loading,
}: {
  eventType: TeamEventType;
  team: PublicTeam;
  selectedSlot: TimeSlot;
  timezone: string;
  onSubmit: (data: BookingFormData) => void;
  onBack: () => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState<BookingFormData>({
    attendeeName: "",
    attendeeEmail: "",
    attendeeNotes: "",
    responses: {},
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const localTime = new TZDate(parseISO(selectedSlot.time), timezone);
  const endTime = new Date(
    localTime.getTime() + eventType.duration * 60 * 1000,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 pb-6 border-b">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold">{eventType.title}</h2>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{eventType.duration} minutes</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {format(localTime, "MMMM d, yyyy 'at' h:mm a")} -{" "}
                {format(endTime, "h:mm a")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Your Name *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.attendeeName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  attendeeName: e.target.value,
                }))
              }
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address *
            </label>
            <Input
              id="email"
              type="email"
              value={formData.attendeeEmail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  attendeeEmail: e.target.value,
                }))
              }
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Additional Notes (optional)
          </label>
          <textarea
            id="notes"
            value={formData.attendeeNotes}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                attendeeNotes: e.target.value,
              }))
            }
            placeholder="Please share anything that will help prepare for our meeting..."
            className="w-full px-3 py-2 border rounded-md resize-none h-24"
            maxLength={500}
          />
        </div>

        {/* Custom Questions */}
        {eventType.customQuestions &&
          Array.isArray(eventType.customQuestions) && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              {eventType.customQuestions.map((question: any, index: number) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-1">
                    {question.label}
                    {question.required && " *"}
                  </label>
                  {question.type === "text" && (
                    <Input
                      type="text"
                      value={formData.responses[question.name] || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          responses: {
                            ...prev.responses,
                            [question.name]: e.target.value,
                          },
                        }))
                      }
                      placeholder={question.placeholder}
                      required={question.required}
                    />
                  )}
                  {question.type === "textarea" && (
                    <textarea
                      value={formData.responses[question.name] || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          responses: {
                            ...prev.responses,
                            [question.name]: e.target.value,
                          },
                        }))
                      }
                      placeholder={question.placeholder}
                      className="w-full px-3 py-2 border rounded-md resize-none h-20"
                      required={question.required}
                    />
                  )}
                  {question.type === "select" && (
                    <select
                      value={formData.responses[question.name] || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          responses: {
                            ...prev.responses,
                            [question.name]: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-md"
                      required={question.required}
                    >
                      <option value="">Select an option...</option>
                      {question.options?.map(
                        (option: string, optIndex: number) => (
                          <option key={optIndex} value={option}>
                            {option}
                          </option>
                        ),
                      )}
                    </select>
                  )}
                </div>
              ))}
            </div>
          )}

        <div className="flex justify-end space-x-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={loading}
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={
              loading || !formData.attendeeName || !formData.attendeeEmail
            }
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              `Book Meeting${eventType.price ? ` ($${(eventType.price / 100).toFixed(2)})` : ""}`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function BookingSuccess({
  booking,
  eventType,
  team,
}: {
  booking: any;
  eventType: TeamEventType;
  team: PublicTeam;
}) {
  const localTime = new TZDate(
    parseISO(booking.startTime),
    booking.attendeeTimezone,
  );
  const endTime = new Date(
    localTime.getTime() + eventType.duration * 60 * 1000,
  );
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-3">
          <Check className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">
          {eventType.requiresConfirmation
            ? "Booking Requested!"
            : "Booking Confirmed!"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {eventType.requiresConfirmation
            ? "Your booking request has been sent. You'll receive a confirmation email once the host approves your request."
            : "Your booking has been confirmed. You'll receive a confirmation email shortly."}
        </p>
      </div>

      <Card className="p-6 text-left max-w-md mx-auto">
        <div className="flex items-start space-x-4">
          <div
            className="w-4 h-16 rounded-full"
            style={{ backgroundColor: eventType.color || "#3b82f6" }}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{eventType.title}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>
                  {format(localTime, "MMMM d, yyyy 'at' h:mm a")} -{" "}
                  {format(endTime, "h:mm a")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>With {team.name}</span>
              </div>
              {booking.attendeeNotes && (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{booking.attendeeNotes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-center space-x-4">
        <a
          href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            eventType.title,
          )}&dates=${formatISO(new Date(booking.startTime)).replace(/[-:]/g, "").split(".")[0]}Z/${
            formatISO(new Date(booking.endTime))
              .replace(/[-:]/g, "")
              .split(".")[0]
          }Z&details=${encodeURIComponent(
            `Booked via CalMill\n\nBooking ID: ${booking.uid}\n\nCancel: ${baseUrl}/booking/${booking.uid}/cancel\nReschedule: ${baseUrl}/booking/${booking.uid}/reschedule`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Add to Google Calendar
        </a>
        <Link
          href={`${baseUrl}/booking/${booking.uid}` as any}
          className="text-blue-600 hover:underline"
        >
          View Booking Details
        </Link>
      </div>

      <div className="pt-6">
        <Link href={`/team/${team.slug}`}>
          <Button variant="outline">Back to {team.name}</Button>
        </Link>
      </div>
    </div>
  );
}

export default function TeamEventBookingPage({
  params,
}: {
  params: Promise<{ slug: string; eventSlug: string }>;
}) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{
    slug: string;
    eventSlug: string;
  } | null>(null);

  // State for team and event type
  const [team, setTeam] = useState<PublicTeam | null>(null);
  const [eventType, setEventType] = useState<TeamEventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for booking flow
  const [step, setStep] = useState<"datetime" | "form" | "success">("datetime");
  const [timezone, setTimezone] = useState("America/New_York");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // State for available dates and slots
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // State for booking submission
  const [bookingLoading, setBookingLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Detect timezone
  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TIMEZONE_OPTIONS.find((tz) => tz.value === detectedTimezone)) {
      setTimezone(detectedTimezone);
    }
  }, []);

  // Fetch team and event type
  useEffect(() => {
    if (!resolvedParams) return;

    const fetchTeamAndEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch team data
        const teamResponse = await fetch(
          `/api/teams/${resolvedParams.slug}/public`,
        );
        const teamResult = await teamResponse.json();

        if (!teamResponse.ok) {
          throw new Error(teamResult.message || "Team not found");
        }

        const foundEventType = teamResult.team.eventTypes.find(
          (et: any) => et.slug === resolvedParams.eventSlug,
        );

        if (!foundEventType) {
          throw new Error("Event type not found");
        }

        setTeam(teamResult.team);
        setEventType(foundEventType);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load event",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeamAndEvent();
  }, [resolvedParams]);

  // Fetch available dates when event type changes
  useEffect(() => {
    if (!eventType) return;

    const fetchAvailableDates = async () => {
      try {
        const now = new Date();
        const endDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days from now

        const response = await fetch(
          `/api/slots?eventTypeId=${eventType.id}&startDate=${format(now, "yyyy-MM-dd")}&endDate=${format(endDate, "yyyy-MM-dd")}&timezone=${timezone}`,
        );

        const result = await response.json();

        if (response.ok) {
          const dates = new Set<string>();
          result.slots.forEach((slot: TimeSlot) => {
            const slotDate = new TZDate(parseISO(slot.time), timezone);
            dates.add(format(slotDate, "yyyy-MM-dd"));
          });
          setAvailableDates(dates);
        }
      } catch (error) {
        console.error("Error fetching available dates:", error);
      }
    };

    fetchAvailableDates();
  }, [eventType, timezone]);

  // Fetch slots for selected date
  useEffect(() => {
    if (!eventType || !selectedDate) {
      setSlots([]);
      return;
    }

    const fetchSlots = async () => {
      try {
        setSlotsLoading(true);
        const dateStr = format(selectedDate, "yyyy-MM-dd");

        const response = await fetch(
          `/api/slots?eventTypeId=${eventType.id}&startDate=${dateStr}&endDate=${dateStr}&timezone=${timezone}`,
        );

        const result = await response.json();

        if (response.ok) {
          setSlots(result.slots || []);
        } else {
          setSlots([]);
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [eventType, selectedDate, timezone]);

  const handleBookingSubmit = async (formData: BookingFormData) => {
    if (!selectedSlot || !eventType || !team) return;

    try {
      setBookingLoading(true);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventTypeId: eventType.id,
          startTime: selectedSlot.time,
          attendeeName: formData.attendeeName,
          attendeeEmail: formData.attendeeEmail,
          attendeeTimezone: timezone,
          attendeeNotes: formData.attendeeNotes,
          responses: formData.responses,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create booking");
      }

      setBooking(result.booking);
      setStep("success");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert(
        error instanceof Error ? error.message : "Failed to create booking",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (!resolvedParams) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !team || !eventType) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-8">
              {error ||
                "The event you're looking for doesn't exist or is not available for booking."}
            </p>
            <Link href={`/team/${resolvedParams.slug}`}>
              <Button>Back to Team</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {step === "success" && booking ? (
            <BookingSuccess
              booking={booking}
              eventType={eventType}
              team={team}
            />
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center space-x-4 mb-8">
                <Avatar size="md">
                  {team.logoUrl && (
                    <AvatarImage src={team.logoUrl} alt={team.name} />
                  )}
                  <AvatarFallback>
                    {team.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{eventType.title}</h1>
                  <p className="text-muted-foreground">with {team.name}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{eventType.duration} minutes</span>
                    </div>
                    {eventType.schedulingType && (
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {eventType.schedulingType === "ROUND_ROBIN"
                            ? "Round Robin"
                            : "Collective"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {eventType.description && (
                <p className="text-muted-foreground mb-8">
                  {eventType.description}
                </p>
              )}

              {step === "datetime" ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Calendar */}
                  <div>
                    <CalendarPicker
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      availableDates={availableDates}
                      timezone={timezone}
                    />

                    {/* Timezone Selector */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2">
                        Timezone
                      </label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        {TIMEZONE_OPTIONS.map((tz) => (
                          <option key={tz.value} value={tz.value}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    {selectedDate ? (
                      <TimeSlotList
                        slots={slots}
                        selectedSlot={selectedSlot}
                        onSlotSelect={(slot) => {
                          setSelectedSlot(slot);
                          setStep("form");
                        }}
                        timezone={timezone}
                        loading={slotsLoading}
                      />
                    ) : (
                      <div className="text-center py-16">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          Select a Date
                        </h3>
                        <p className="text-muted-foreground">
                          Choose a date from the calendar to see available
                          times.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : selectedSlot ? (
                <BookingForm
                  eventType={eventType}
                  team={team}
                  selectedSlot={selectedSlot}
                  timezone={timezone}
                  onSubmit={handleBookingSubmit}
                  onBack={() => setStep("datetime")}
                  loading={bookingLoading}
                />
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
