"use client";

import * as React from "react";
import { addMonths, format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, startOfWeek, endOfWeek, isAfter, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface CalendarProps {
  mode?: "single" | "multiple" | "range";
  selected?: Date | Date[];
  onSelect?: (date: Date | Date[] | undefined) => void;
  disabled?: (date: Date) => boolean;
  availableDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showOutsideDays?: boolean;
  fixedWeeks?: boolean;
  numberOfMonths?: number;
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({
    className,
    mode = "single",
    selected,
    onSelect,
    disabled,
    availableDates = [],
    minDate,
    maxDate,
    weekStartsOn = 0,
    showOutsideDays = true,
    fixedWeeks = false,
    numberOfMonths = 1,
    ...props
  }, ref) => {
    const [month, setMonth] = React.useState<Date>(new Date());

    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    // Generate calendar grid
    const calendarStart = startOfWeek(monthStart, { weekStartsOn });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn });

    let calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // If fixedWeeks is true, ensure we always show 6 weeks (42 days)
    if (fixedWeeks && calendarDays.length < 42) {
      const additionalDays = 42 - calendarDays.length;
      for (let i = 1; i <= additionalDays; i++) {
        calendarDays.push(new Date(calendarEnd.getTime() + i * 24 * 60 * 60 * 1000));
      }
    }

    // Group days into weeks
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }

    const isSelected = React.useCallback((date: Date) => {
      if (!selected) return false;

      if (mode === "single") {
        return selected instanceof Date && isSameDay(date, selected);
      } else if (mode === "multiple") {
        return Array.isArray(selected) && selected.some(d => isSameDay(date, d));
      } else if (mode === "range") {
        if (Array.isArray(selected) && selected.length === 2) {
          const [start, end] = selected;
          return date >= start && date <= end;
        }
      }

      return false;
    }, [selected, mode]);

    const isDayDisabled = React.useCallback((date: Date) => {
      if (disabled?.(date)) return true;
      if (minDate && isBefore(date, minDate)) return true;
      if (maxDate && isAfter(date, maxDate)) return true;
      return false;
    }, [disabled, minDate, maxDate]);

    const isDayAvailable = React.useCallback((date: Date) => {
      if (availableDates.length === 0) return true;
      return availableDates.some(availableDate => isSameDay(date, availableDate));
    }, [availableDates]);

    const handleDateClick = React.useCallback((date: Date) => {
      if (isDayDisabled(date) || !isDayAvailable(date)) return;

      if (mode === "single") {
        onSelect?.(date);
      } else if (mode === "multiple") {
        const currentSelected = Array.isArray(selected) ? selected : [];
        const isCurrentlySelected = currentSelected.some(d => isSameDay(date, d));

        if (isCurrentlySelected) {
          onSelect?.(currentSelected.filter(d => !isSameDay(date, d)));
        } else {
          onSelect?.([...currentSelected, date]);
        }
      } else if (mode === "range") {
        const currentSelected = Array.isArray(selected) ? selected : [];

        if (currentSelected.length === 0 || currentSelected.length === 2) {
          onSelect?.([date]);
        } else if (currentSelected.length === 1) {
          const [start] = currentSelected;
          if (date < start) {
            onSelect?.([date, start]);
          } else {
            onSelect?.([start, date]);
          }
        }
      }
    }, [mode, selected, onSelect, isDayDisabled, isDayAvailable]);

    const navigateMonth = React.useCallback((direction: "prev" | "next") => {
      setMonth(current =>
        direction === "prev" ? subMonths(current, 1) : addMonths(current, 1)
      );
    }, []);

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const orderedWeekdays = [
      ...weekdays.slice(weekStartsOn),
      ...weekdays.slice(0, weekStartsOn)
    ];

    return (
      <div
        ref={ref}
        className={cn("p-3", className)}
        role="application"
        aria-label="Calendar"
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("prev")}
            aria-label="Previous month"
            className="h-8 w-8 p-0"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>

          <h2 className="text-sm font-semibold text-foreground">
            {format(month, "MMMM yyyy")}
          </h2>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("next")}
            aria-label="Next month"
            className="h-8 w-8 p-0"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2" role="row">
          {orderedWeekdays.map(weekday => (
            <div
              key={weekday}
              role="columnheader"
              className="h-9 w-9 text-xs font-medium text-muted-foreground flex items-center justify-center"
            >
              {weekday}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0" role="grid">
          {weeks.flat().map((date, index) => {
            const isOutsideMonth = !isSameMonth(date, month);
            const isDisabled = isDayDisabled(date);
            const isAvailable = isDayAvailable(date);
            const isSelectedDate = isSelected(date);
            const isTodayDate = isToday(date);

            if (isOutsideMonth && !showOutsideDays) {
              return <div key={index} className="h-9 w-9" />;
            }

            return (
              <button
                key={index}
                type="button"
                role="gridcell"
                aria-label={`${format(date, 'EEEE, MMMM do, yyyy')}`}
                aria-selected={isSelectedDate}
                aria-disabled={isDisabled || !isAvailable}
                disabled={isDisabled || !isAvailable}
                onClick={() => handleDateClick(date)}
                className={cn(
                  "h-9 w-9 text-center text-sm relative flex items-center justify-center",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "transition-colors duration-150 rounded-md",

                  // Base styles
                  !isOutsideMonth ? "text-foreground" : "text-muted-foreground",

                  // Hover states
                  !isOutsideMonth && isAvailable && !isDisabled && "hover:bg-secondary hover:text-secondary-foreground",

                  // Selected state
                  isSelectedDate && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-sm",

                  // Today indicator
                  isTodayDate && !isSelectedDate && "bg-secondary text-secondary-foreground font-semibold",

                  // Disabled/unavailable states
                  (isDisabled || !isAvailable || isOutsideMonth) && "cursor-not-allowed opacity-50",

                  // Available day highlighting
                  isAvailable && !isOutsideMonth && !isSelectedDate && !isTodayDate && "hover:bg-blue-50"
                )}
              >
                {format(date, "d")}

                {/* Today indicator dot */}
                {isTodayDate && !isSelectedDate && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}

                {/* Available day indicator */}
                {isAvailable && !isOutsideMonth && !isSelectedDate && !isTodayDate && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

Calendar.displayName = "Calendar";

export { Calendar };