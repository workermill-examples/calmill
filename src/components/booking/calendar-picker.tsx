"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  addDays,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  format,
  isSameDay,
  parseISO,
  isAfter,
  isBefore,
} from "date-fns";
import { TZDate } from "@date-fns/tz";

export interface CalendarPickerProps {
  /** Currently selected date */
  selectedDate?: Date;
  /** Callback when date is selected */
  onDateSelect: (date: Date) => void;
  /** Available dates with slots */
  availableDates?: Date[];
  /** Timezone for date calculations */
  timezone: string;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Whether the calendar is loading */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Event type duration for display context */
  eventDuration?: number;
  /** Event type title for accessibility */
  eventTitle?: string;
}

export function CalendarPicker({
  selectedDate,
  onDateSelect,
  availableDates = [],
  timezone,
  minDate,
  maxDate,
  loading = false,
  className,
  eventDuration,
  eventTitle,
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    selectedDate || new Date(),
  );

  // Default constraints: today to 60 days out
  const defaultMinDate = React.useMemo(() => startOfDay(new Date()), []);
  const defaultMaxDate = React.useMemo(() => addDays(new Date(), 60), []);

  const effectiveMinDate = minDate || defaultMinDate;
  const effectiveMaxDate = maxDate || defaultMaxDate;

  // Check if a date is disabled
  const isDayDisabled = React.useCallback(
    (date: Date) => {
      // Past dates
      if (isBefore(date, effectiveMinDate)) return true;

      // Future limit
      if (isAfter(date, effectiveMaxDate)) return true;

      // No available slots
      if (availableDates.length > 0) {
        return !availableDates.some((availableDate) =>
          isSameDay(date, availableDate),
        );
      }

      return false;
    },
    [availableDates, effectiveMinDate, effectiveMaxDate],
  );

  // Check if a date has available slots
  const isDayAvailable = React.useCallback(
    (date: Date) => {
      if (availableDates.length === 0) return true; // Assume available if no data yet
      return availableDates.some((availableDate) =>
        isSameDay(date, availableDate),
      );
    },
    [availableDates],
  );

  // Handle date selection
  const handleDateSelect = React.useCallback(
    (date: Date | Date[] | undefined) => {
      if (!date || Array.isArray(date)) return;

      // Convert to timezone-aware date
      const tzDate = new TZDate(date, timezone);
      onDateSelect(tzDate);
    },
    [onDateSelect, timezone],
  );

  // Generate description for screen readers
  const getDateDescription = React.useCallback(
    (date: Date): string => {
      const isAvailable = isDayAvailable(date);
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const isToday = isSameDay(date, new Date());

      let description = format(date, "EEEE, MMMM do, yyyy");

      if (isToday) description += ", today";
      if (isSelected) description += ", selected";
      if (eventTitle) {
        description += `, ${eventTitle}`;
        if (eventDuration) {
          description += ` (${eventDuration} minutes)`;
        }
      }
      if (isAvailable) {
        description += ", available";
      } else {
        description += ", no availability";
      }

      return description;
    },
    [isDayAvailable, selectedDate, eventTitle, eventDuration],
  );

  // Navigation handlers
  const handlePreviousMonth = React.useCallback(() => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCurrentMonth(previousMonth);
  }, [currentMonth]);

  const handleNextMonth = React.useCallback(() => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  }, [currentMonth]);

  // Check if navigation should be disabled
  const isPreviousDisabled = React.useMemo(() => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    return isBefore(endOfMonth(previousMonth), effectiveMinDate);
  }, [currentMonth, effectiveMinDate]);

  const isNextDisabled = React.useMemo(() => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return isAfter(startOfMonth(nextMonth), effectiveMaxDate);
  }, [currentMonth, effectiveMaxDate]);

  if (loading) {
    return (
      <div className={cn("p-4", className)}>
        <div className="space-y-4">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-muted rounded animate-shimmer" />
            <div className="w-32 h-6 bg-muted rounded animate-shimmer" />
            <div className="w-8 h-8 bg-muted rounded animate-shimmer" />
          </div>

          {/* Weekday headers skeleton */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="w-9 h-6 bg-muted rounded animate-shimmer"
              />
            ))}
          </div>

          {/* Calendar grid skeleton */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 42 }).map((_, i) => (
              <div
                key={i}
                className="w-9 h-9 bg-muted rounded animate-shimmer"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-card border rounded-lg shadow-sm", className)}>
      <div className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={isDayDisabled}
          availableDates={availableDates}
          minDate={effectiveMinDate}
          maxDate={effectiveMaxDate}
          weekStartsOn={0} // Sunday
          showOutsideDays={false}
          fixedWeeks={true}
          className="w-full"
        />

        {/* Accessibility information */}
        <div className="sr-only" aria-live="polite">
          {selectedDate && (
            <span>Selected date: {getDateDescription(selectedDate)}</span>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full" />
              <span>No availability</span>
            </div>
            {selectedDate && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Selected</span>
              </div>
            )}
          </div>

          {eventTitle && (
            <div className="text-xs text-muted-foreground pt-1 border-t">
              <span className="font-medium">{eventTitle}</span>
              {eventDuration && (
                <span>
                  {" "}
                  • {eventDuration} minute{eventDuration !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarPicker;
