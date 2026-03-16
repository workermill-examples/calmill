"use client";

import * as React from "react";
import { addMonths, format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, startOfWeek, endOfWeek } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface CalendarProps {
  mode?: "single" | "multiple" | "range";
  selected?: Date | Date[];
  onSelect?: (date: Date | Date[] | undefined) => void;
  disabled?: (date: Date) => boolean;
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

    const handleDateClick = React.useCallback((date: Date) => {
      if (disabled?.(date)) return;

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
    }, [mode, selected, onSelect, disabled]);

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
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("prev")}
            className="h-7 w-7 p-0"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="sr-only">Previous month</span>
          </Button>

          <h2 className="font-semibold">
            {format(month, "MMMM yyyy")}
          </h2>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("next")}
            className="h-7 w-7 p-0"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="sr-only">Next month</span>
          </Button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mt-4">
          {orderedWeekdays.map(weekday => (
            <div
              key={weekday}
              className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {weekday}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 mt-1">
          {weeks.flat().map((date, index) => {
            const isOutsideMonth = !isSameMonth(date, month);
            const isDisabled = disabled?.(date);
            const isSelectedDate = isSelected(date);
            const isTodayDate = isToday(date);

            if (isOutsideMonth && !showOutsideDays) {
              return <div key={index} className="h-8" />;
            }

            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                  isOutsideMonth && "text-muted-foreground opacity-50",
                  isSelectedDate && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  isTodayDate && !isSelectedDate && "bg-accent text-accent-foreground",
                  isDisabled && "text-muted-foreground opacity-50 cursor-not-allowed hover:bg-transparent"
                )}
                aria-selected={isSelectedDate}
                disabled={isDisabled}
                onClick={() => handleDateClick(date)}
              >
                {format(date, "d")}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }
);

Calendar.displayName = "Calendar";

export { Calendar };