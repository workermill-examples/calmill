"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import { format, parseISO, startOfDay, addDays } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { CalendarPicker } from "@/components/booking/calendar-picker";
import { SlotList, TimeSlot } from "@/components/booking/slot-list";
import { TimezoneSelect } from "@/components/booking/timezone-select";
import { BookingForm, BookingFormData } from "@/components/booking/booking-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { cn } from "@/lib/utils";
import { ArrowLeft, Clock, MapPin, DollarSign, Info, Check } from "lucide-react";

interface User {
  id: string;
  username: string;
  name: string;
  image?: string;
  timezone: string;
}

interface EventType {
  id: string;
  title: string;
  slug: string;
  description?: string;
  duration: number;
  price?: number;
  currency?: string;
  color?: string;
  requiresConfirmation: boolean;
  minimumNotice?: number;
  beforeBuffer?: number;
  afterBuffer?: number;
  slotInterval?: number;
  maxBookingsPerDay?: number;
  maxBookingsPerWeek?: number;
  futureLimit?: number;
  customQuestions: Array<{
    id: string;
    type: "text" | "textarea" | "select" | "radio" | "checkbox" | "phone";
    label: string;
    required?: boolean;
    placeholder?: string;
    options?: string[];
  }>;
  recurringEnabled: boolean;
  recurringFrequency?: "weekly" | "biweekly" | "monthly";
  user: User;
  schedule?: {
    id: string;
    name: string;
    timezone: string;
  };
}

interface PublicBookingPageProps {
  eventType: EventType;
  initialDate?: string;
  initialTime?: string;
  initialTimezone?: string;
}

type BookingStep = "datetime" | "details" | "confirmation";

interface BookingState {
  step: BookingStep;
  selectedDate?: Date;
  selectedSlot?: TimeSlot;
  timezone: string;
  bookingData?: BookingFormData;
  bookingUid?: string;
}

// Auto-detect user's timezone
function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn("Failed to detect timezone:", error);
    return "UTC";
  }
}

// Format price
function formatPrice(price: number | undefined, currency: string | undefined): string {
  if (!price || price === 0) return "Free";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  });
  return formatter.format(price / 100); // Assuming price is stored in cents
}

// Format duration
function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }
}

export function PublicBookingPage({
  eventType,
  initialDate,
  initialTime,
  initialTimezone,
}: PublicBookingPageProps) {
  // Initialize state
  const [state, setState] = useState<BookingState>(() => {
    const detectedTimezone = detectTimezone();
    const timezone = initialTimezone || eventType.user.timezone || detectedTimezone;

    let selectedDate: Date | undefined;
    if (initialDate) {
      try {
        selectedDate = parseISO(initialDate);
      } catch (error) {
        console.warn("Failed to parse initial date:", initialDate);
      }
    }

    return {
      step: "datetime",
      selectedDate,
      timezone,
    };
  });

  // Fetch available slots
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  // Booking submission
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Fetch slots when date/timezone changes
  React.useEffect(() => {
    if (!state.selectedDate) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSlotsError(null);

      try {
        const dateStr = format(state.selectedDate!, "yyyy-MM-dd");
        const response = await fetch(
          `/api/slots?eventTypeId=${eventType.id}&startDate=${dateStr}&endDate=${dateStr}&timezone=${state.timezone}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch available slots");
        }

        const data = await response.json();
        setSlots(data.slots || []);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setSlotsError("Failed to load available times. Please try again.");
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [state.selectedDate, state.timezone, eventType.id]);

  // Fetch available dates for calendar
  React.useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const today = startOfDay(new Date());
        const endDate = addDays(today, eventType.futureLimit || 60);

        const response = await fetch(
          `/api/slots?eventTypeId=${eventType.id}&startDate=${format(today, "yyyy-MM-dd")}&endDate=${format(endDate, "yyyy-MM-dd")}&timezone=${state.timezone}`
        );

        if (response.ok) {
          const data = await response.json();
          const dates = data.slots?.map((slot: TimeSlot) => {
            return startOfDay(parseISO(slot.time));
          }) || [];

          // Deduplicate dates
          const uniqueDates = Array.from(
            new Set(dates.map((d: Date) => d.getTime()))
          ).map(time => new Date(time as number));

          setAvailableDates(uniqueDates);
        }
      } catch (error) {
        console.error("Error fetching available dates:", error);
      }
    };

    fetchAvailableDates();
  }, [state.timezone, eventType.id, eventType.futureLimit]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setState(prev => ({
      ...prev,
      selectedDate: date,
      selectedSlot: undefined,
    }));
  };

  // Handle timezone change
  const handleTimezoneChange = (timezone: string) => {
    setState(prev => ({
      ...prev,
      timezone,
      selectedSlot: undefined,
    }));
  };

  // Handle slot selection
  const handleSlotSelect = (slot: TimeSlot) => {
    setState(prev => ({
      ...prev,
      selectedSlot: slot,
    }));
  };

  // Handle continue to booking form
  const handleContinueToForm = () => {
    if (!state.selectedDate || !state.selectedSlot) return;

    setState(prev => ({
      ...prev,
      step: "details",
    }));
  };

  // Handle back to datetime selection
  const handleBackToDateTime = () => {
    setState(prev => ({
      ...prev,
      step: "datetime",
      bookingData: undefined,
    }));
  };

  // Handle booking submission
  const handleBookingSubmit = async (bookingData: BookingFormData) => {
    if (!state.selectedDate || !state.selectedSlot) return;

    setBookingLoading(true);
    setBookingError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventTypeId: eventType.id,
          startTime: state.selectedSlot.time,
          timezone: state.timezone,
          attendeeName: bookingData.name,
          attendeeEmail: bookingData.email,
          attendeeNotes: bookingData.notes,
          responses: bookingData.customResponses || {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create booking");
      }

      const data = await response.json();

      setState(prev => ({
        ...prev,
        step: "confirmation",
        bookingData,
        bookingUid: data.booking.uid,
      }));
    } catch (error) {
      console.error("Error creating booking:", error);
      setBookingError(error instanceof Error ? error.message : "Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  };

  // Retry slots fetch
  const handleRetrySlots = () => {
    if (state.selectedDate) {
      setSlotsError(null);
      const event = new CustomEvent("retry-slots");
      window.dispatchEvent(event);
    }
  };

  const canContinue = state.selectedDate && state.selectedSlot;

  // Render confirmation step
  if (state.step === "confirmation" && state.bookingUid && state.bookingData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Booking {eventType.requiresConfirmation ? "Request Sent" : "Confirmed"}
              </h1>
              {eventType.requiresConfirmation ? (
                <p className="text-lg text-muted-foreground">
                  Your booking request has been sent to {eventType.user.name}.
                  You&apos;ll receive a confirmation email once they approve it.
                </p>
              ) : (
                <p className="text-lg text-muted-foreground">
                  Your meeting with {eventType.user.name} has been confirmed.
                </p>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{eventType.title}</CardTitle>
                <CardDescription>
                  {formatDuration(eventType.duration)} meeting with {eventType.user.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {format(state.selectedDate!, "EEEE, MMMM d, yyyy")} at {state.selectedSlot!.localTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{state.timezone}</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground border-t pt-4">
                  <p><strong>Invitee:</strong> {state.bookingData.name} ({state.bookingData.email})</p>
                  {state.bookingData.notes && (
                    <p className="mt-2"><strong>Notes:</strong> {state.bookingData.notes}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => window.print()}
              >
                Print Details
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = `/${eventType.user.username}`}
              >
                Book Another Meeting
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left column - Event information */}
          <div className="space-y-6">
            {state.step === "details" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDateTime}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}

            {/* Event header */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Avatar className="w-12 h-12">
                  {eventType.user.image ? (
                    <Image
                      src={eventType.user.image}
                      alt={eventType.user.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-semibold">
                      {eventType.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Avatar>

                <div className="flex-1 space-y-1">
                  <h1 className="text-2xl font-bold text-foreground">
                    {eventType.title}
                  </h1>
                  <p className="text-muted-foreground">with {eventType.user.name}</p>
                </div>
              </div>

              {eventType.description && (
                <p className="text-foreground leading-relaxed">
                  {eventType.description}
                </p>
              )}
            </div>

            {/* Event details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{formatDuration(eventType.duration)}</span>
                {eventType.price && eventType.price > 0 && (
                  <>
                    <DollarSign className="w-4 h-4 text-muted-foreground ml-2" />
                    <span>{formatPrice(eventType.price, eventType.currency)}</span>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>Video call details will be provided after booking</span>
              </div>

              {eventType.requiresConfirmation && (
                <div className="flex items-center space-x-2 text-sm">
                  <Info className="w-4 h-4 text-blue-500" />
                  <span>This meeting requires host confirmation</span>
                </div>
              )}
            </div>

            {/* Booking constraints */}
            {(eventType.minimumNotice || eventType.futureLimit) && (
              <div className="space-y-2 text-sm text-muted-foreground">
                {eventType.minimumNotice && (
                  <p>• Minimum {eventType.minimumNotice} minutes notice required</p>
                )}
                {eventType.futureLimit && (
                  <p>• Can be booked up to {eventType.futureLimit} days in advance</p>
                )}
              </div>
            )}
          </div>

          {/* Right column - Booking interface */}
          <div className="space-y-6">
            {state.step === "datetime" && (
              <>
                {/* Timezone selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Timezone
                  </label>
                  <TimezoneSelect
                    value={state.timezone}
                    onChange={handleTimezoneChange}
                    disabled={slotsLoading}
                  />
                </div>

                {/* Calendar */}
                <CalendarPicker
                  selectedDate={state.selectedDate}
                  onDateSelect={handleDateSelect}
                  availableDates={availableDates}
                  timezone={state.timezone}
                  eventTitle={eventType.title}
                  eventDuration={eventType.duration}
                  loading={false}
                  className="lg:sticky lg:top-8"
                />

                {/* Time slots */}
                {state.selectedDate && (
                  <SlotList
                    slots={slots}
                    selectedSlot={state.selectedSlot}
                    onSlotSelect={handleSlotSelect}
                    loading={slotsLoading}
                    error={slotsError || undefined}
                    onRetry={handleRetrySlots}
                    selectedDate={state.selectedDate}
                    timezone={state.timezone}
                    eventTitle={eventType.title}
                  />
                )}

                {/* Continue button */}
                {canContinue && (
                  <div className="pt-4">
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleContinueToForm}
                    >
                      Continue
                    </Button>
                  </div>
                )}
              </>
            )}

            {state.step === "details" && (
              <div className="space-y-4">
                {/* Selected time recap */}
                {state.selectedDate && state.selectedSlot && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-1">
                        <p className="font-medium text-foreground">
                          {format(state.selectedDate, "EEEE, MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {state.selectedSlot.localTime} ({state.timezone})
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Booking form */}
                <BookingForm
                  customQuestions={eventType.customQuestions}
                  submitting={bookingLoading}
                  onSubmit={handleBookingSubmit}
                  timezone={state.timezone}
                  eventDetails={
                    state.selectedDate && state.selectedSlot
                      ? {
                          title: eventType.title,
                          duration: eventType.duration,
                          date: format(state.selectedDate, "EEEE, MMMM d, yyyy"),
                          time: state.selectedSlot.localTime,
                          timezone: state.timezone,
                        }
                      : undefined
                  }
                />

                {bookingError && (
                  <ErrorState
                    title="Booking Failed"
                    description={bookingError}
                    onRetry={() => setBookingError(null)}
                    retryText="Try Again"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-12 border-t mt-12">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <a
              href="https://workermill.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              WorkerMill
            </a>{" "}
            • Built autonomously by AI agents
          </p>
        </div>
      </div>
    </div>
  );
}