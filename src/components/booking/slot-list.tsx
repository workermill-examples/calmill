"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { format, parseISO, isToday, isTomorrow, isYesterday } from "date-fns";

export interface TimeSlot {
  time: string; // ISO string in UTC
  localTime: string; // HH:mm in attendee's timezone
  duration: number; // minutes
}

export interface SlotListProps {
  /** Array of available time slots for the selected date */
  slots: TimeSlot[];
  /** Currently selected slot */
  selectedSlot?: TimeSlot;
  /** Callback when a slot is selected */
  onSlotSelect: (slot: TimeSlot) => void;
  /** Whether slots are loading */
  loading?: boolean;
  /** Error message if slots failed to load */
  error?: string;
  /** Retry callback for error state */
  onRetry?: () => void;
  /** Selected date for context */
  selectedDate?: Date;
  /** Timezone for display */
  timezone: string;
  /** Event title for accessibility */
  eventTitle?: string;
  /** Additional CSS classes */
  className?: string;
}

function formatDisplayTime(timeString: string): string {
  try {
    const date = parseISO(timeString);
    return format(date, "h:mm a");
  } catch (error) {
    console.warn("Failed to format time:", timeString, error);
    return timeString;
  }
}

function formatDateContext(date: Date): string {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMM d");
}

function SlotListSkeleton() {
  return (
    <div className="space-y-3">
      <LoadingSkeleton className="w-32 h-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-11 rounded-md" />
        ))}
      </div>
    </div>
  );
}

function SlotListError({
  error,
  onRetry,
  selectedDate,
}: {
  error: string;
  onRetry?: () => void;
  selectedDate?: Date;
}) {
  return (
    <div className="space-y-4">
      {selectedDate && (
        <h3 className="text-lg font-semibold text-foreground">
          {formatDateContext(selectedDate)}
        </h3>
      )}

      <EmptyState
        title="Failed to load time slots"
        description={
          error || "Something went wrong while loading available times."
        }
        action={
          onRetry
            ? {
                text: "Try again",
                onClick: onRetry,
              }
            : undefined
        }
      />
    </div>
  );
}

function SlotListEmpty({ selectedDate }: { selectedDate?: Date }) {
  return (
    <div className="space-y-4">
      {selectedDate && (
        <h3 className="text-lg font-semibold text-foreground">
          {formatDateContext(selectedDate)}
        </h3>
      )}

      <EmptyState
        title="No time slots available"
        description="There are no available times for this date. Please select another day."
        action={undefined}
      />
    </div>
  );
}

export function SlotList({
  slots,
  selectedSlot,
  onSlotSelect,
  loading = false,
  error,
  onRetry,
  selectedDate,
  timezone,
  eventTitle,
  className,
}: SlotListProps) {
  // Group slots by time period for better organization
  const groupedSlots = React.useMemo(() => {
    if (!slots.length) return {};

    const groups: Record<string, TimeSlot[]> = {
      morning: [], // 6 AM - 12 PM
      afternoon: [], // 12 PM - 5 PM
      evening: [], // 5 PM - 10 PM
    };

    slots.forEach((slot) => {
      try {
        // Use localTime to determine the time period
        const [hourStr] = slot.localTime.split(":");
        const hour = parseInt(hourStr, 10);

        if (hour >= 6 && hour < 12) {
          groups.morning.push(slot);
        } else if (hour >= 12 && hour < 17) {
          groups.afternoon.push(slot);
        } else {
          groups.evening.push(slot);
        }
      } catch (error) {
        console.warn("Failed to group slot:", slot, error);
        groups.morning.push(slot); // Default fallback
      }
    });

    // Remove empty groups
    return Object.entries(groups).reduce(
      (acc, [key, value]) => {
        if (value.length > 0) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, TimeSlot[]>,
    );
  }, [slots]);

  const groupLabels = {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
  };

  // Handle slot selection with keyboard support
  const handleSlotClick = React.useCallback(
    (slot: TimeSlot) => {
      onSlotSelect(slot);
    },
    [onSlotSelect],
  );

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, slot: TimeSlot) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleSlotClick(slot);
      }
    },
    [handleSlotClick],
  );

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <SlotListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("space-y-4", className)}>
        <SlotListError
          error={error}
          onRetry={onRetry}
          selectedDate={selectedDate}
        />
      </div>
    );
  }

  if (!slots.length) {
    return (
      <div className={cn("space-y-4", className)}>
        <SlotListEmpty selectedDate={selectedDate} />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Date header */}
      {selectedDate && (
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">
            {formatDateContext(selectedDate)}
          </h3>
          <p className="text-sm text-muted-foreground">
            {timezone} • {slots.length} available time
            {slots.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Grouped time slots */}
      {Object.entries(groupedSlots).map(([period, periodSlots]) => (
        <div key={period} className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {groupLabels[period as keyof typeof groupLabels]}
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {periodSlots.map((slot, index) => {
              const isSelected = selectedSlot?.time === slot.time;
              const displayTime = formatDisplayTime(slot.time);

              return (
                <Button
                  key={`${slot.time}-${index}`}
                  variant={isSelected ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleSlotClick(slot)}
                  onKeyDown={(e) => handleKeyDown(e, slot)}
                  className={cn(
                    "h-11 text-sm font-medium transition-all duration-200",
                    isSelected
                      ? "shadow-md"
                      : "hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700",
                    "focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                  )}
                  aria-label={
                    eventTitle
                      ? `Book ${eventTitle} at ${displayTime} for ${slot.duration} minutes`
                      : `Select time slot ${displayTime} for ${slot.duration} minutes`
                  }
                  aria-pressed={isSelected}
                >
                  {displayTime}
                </Button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Selection context for screen readers */}
      {selectedSlot && (
        <div className="sr-only" aria-live="polite">
          Selected time: {formatDisplayTime(selectedSlot.time)} for{" "}
          {selectedSlot.duration} minutes
          {eventTitle && `, ${eventTitle}`}
        </div>
      )}

      {/* Additional info */}
      <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
        <p>Times shown in {timezone}</p>
        {selectedSlot && (
          <p>
            Duration: {selectedSlot.duration} minute
            {selectedSlot.duration !== 1 ? "s" : ""}
            {eventTitle && ` • ${eventTitle}`}
          </p>
        )}
      </div>
    </div>
  );
}

export default SlotList;
