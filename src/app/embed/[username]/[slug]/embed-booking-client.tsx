"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { format, parseISO, startOfDay, addDays } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { CalendarPicker } from "@/components/booking/calendar-picker";
import { SlotList, TimeSlot } from "@/components/booking/slot-list";
import { TimezoneSelect } from "@/components/booking/timezone-select";
import {
  BookingForm,
  BookingFormData,
} from "@/components/booking/booking-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Clock,
  MapPin,
  DollarSign,
  Info,
  Check,
} from "lucide-react";

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

interface EmbedBookingPageProps {
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
function formatPrice(
  price: number | undefined,
  currency: string | undefined,
): string {
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
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
  }
}

// Post message to parent window for resize and events
function postMessageToParent(type: string, data: any) {
  if (
    typeof window !== "undefined" &&
    window.parent &&
    window.parent !== window
  ) {
    window.parent.postMessage(
      {
        type: `calmill:${type}`,
        data,
      },
      "*",
    );
  }
}

export function EmbedBookingPage({
  eventType,
  initialDate,
  initialTime,
  initialTimezone,
}: EmbedBookingPageProps) {
  // Initialize state
  const [state, setState] = useState<BookingState>(() => {
    const detectedTimezone = detectTimezone();
    const timezone =
      initialTimezone || eventType.user.timezone || detectedTimezone;

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

  // Post resize message on mount and content change
  useEffect(() => {
    const updateHeight = () => {
      const height = document.body.scrollHeight;
      postMessageToParent("resize", { height });
    };

    // Initial height
    updateHeight();

    // Update on content changes
    const observer = new MutationObserver(updateHeight);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Update on window resize
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  // Post height update when state changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const height = document.body.scrollHeight;
      postMessageToParent("resize", { height });
    }, 100);

    return () => clearTimeout(timer);
  }, [state.step, slots.length, slotsLoading, bookingError]);

  // Fetch slots when date/timezone changes
  React.useEffect(() => {
    if (!state.selectedDate) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSlotsError(null);

      try {
        const dateStr = format(state.selectedDate!, "yyyy-MM-dd");
        const response = await fetch(
          `/api/slots?eventTypeId=${eventType.id}&startDate=${dateStr}&endDate=${dateStr}&timezone=${state.timezone}`,
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
          `/api/slots?eventTypeId=${eventType.id}&startDate=${format(today, "yyyy-MM-dd")}&endDate=${format(endDate, "yyyy-MM-dd")}&timezone=${state.timezone}`,
        );

        if (response.ok) {
          const data = await response.json();
          const dates =
            data.slots?.map((slot: TimeSlot) => {
              return startOfDay(parseISO(slot.time));
            }) || [];

          // Deduplicate dates
          const uniqueDates = Array.from(
            new Set(dates.map((d: Date) => d.getTime())),
          ).map((time) => new Date(time as number));

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
    setState((prev) => ({
      ...prev,
      selectedDate: date,
      selectedSlot: undefined,
    }));
  };

  // Handle timezone change
  const handleTimezoneChange = (timezone: string) => {
    setState((prev) => ({
      ...prev,
      timezone,
      selectedSlot: undefined,
    }));
  };

  // Handle slot selection
  const handleSlotSelect = (slot: TimeSlot) => {
    setState((prev) => ({
      ...prev,
      selectedSlot: slot,
    }));
  };

  // Handle continue to booking form
  const handleContinueToForm = () => {
    if (!state.selectedDate || !state.selectedSlot) return;

    setState((prev) => ({
      ...prev,
      step: "details",
    }));
  };

  // Handle back to datetime selection
  const handleBackToDateTime = () => {
    setState((prev) => ({
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

      setState((prev) => ({
        ...prev,
        step: "confirmation",
        bookingData,
        bookingUid: data.booking.uid,
      }));

      // Post booking event to parent
      postMessageToParent("booking", {
        uid: data.booking.uid,
        eventType: eventType.title,
        attendeeName: bookingData.name,
        attendeeEmail: bookingData.email,
        startTime: state.selectedSlot.time,
        timezone: state.timezone,
        requiresConfirmation: eventType.requiresConfirmation,
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      setBookingError(
        error instanceof Error ? error.message : "Failed to create booking",
      );
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
      <div className="bg-transparent p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-green-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">
                Booking{" "}
                {eventType.requiresConfirmation ? "Request Sent" : "Confirmed"}
              </h2>
              {eventType.requiresConfirmation ? (
                <p className="text-sm text-muted-foreground">
                  Your booking request has been sent to {eventType.user.name}.
                  You&apos;ll receive a confirmation email once they approve it.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your meeting with {eventType.user.name} has been confirmed.
                </p>
              )}
            </div>

            <Card className="bg-white/95 border">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="text-center space-y-1">
                    <h3 className="font-medium">{eventType.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDuration(eventType.duration)} with{" "}
                      {eventType.user.name}
                    </p>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>
                        {format(state.selectedDate!, "MMM d, yyyy")} at{" "}
                        {state.selectedSlot!.localTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span>{state.timezone}</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground border-t pt-2">
                    <p>
                      <strong>Invitee:</strong> {state.bookingData.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent p-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column - Event information */}
          <div className="space-y-4">
            {state.step === "details" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDateTime}
                className="mb-2 p-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}

            {/* Event header */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  {eventType.user.image ? (
                    <Image
                      src={eventType.user.image}
                      alt={eventType.user.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                      {eventType.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Avatar>

                <div className="flex-1 space-y-1">
                  <h1 className="text-lg font-bold text-foreground">
                    {eventType.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    with {eventType.user.name}
                  </p>
                </div>
              </div>

              {eventType.description && (
                <p className="text-sm text-foreground leading-relaxed">
                  {eventType.description}
                </p>
              )}
            </div>

            {/* Event details */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{formatDuration(eventType.duration)}</span>
                {eventType.price && eventType.price > 0 && (
                  <>
                    <DollarSign className="w-4 h-4 text-muted-foreground ml-2" />
                    <span>
                      {formatPrice(eventType.price, eventType.currency)}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>Video call link provided after booking</span>
              </div>

              {eventType.requiresConfirmation && (
                <div className="flex items-center space-x-2 text-sm">
                  <Info className="w-4 h-4 text-blue-500" />
                  <span>Requires host confirmation</span>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Booking interface */}
          <div className="space-y-4">
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
                  className="w-full"
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
                  <div className="pt-2">
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
                    <CardContent className="pt-4">
                      <div className="text-center space-y-1">
                        <p className="font-medium text-foreground text-sm">
                          {format(state.selectedDate, "EEEE, MMMM d, yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground">
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
                          date: format(
                            state.selectedDate,
                            "EEEE, MMMM d, yyyy",
                          ),
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
      </div>
    </div>
  );
}
