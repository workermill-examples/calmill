'use client';

import * as React from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isPast,
  addMonths,
  subMonths,
  format,
  parseISO,
  startOfDay,
} from 'date-fns';
import { cn } from '@/lib/utils';

export interface CalendarPickerProps {
  /** Set of available date strings in "YYYY-MM-DD" format */
  availableDates: Set<string>;
  /** Currently selected date string in "YYYY-MM-DD" format, or null */
  selectedDate: string | null;
  /** Callback when a date is selected */
  onSelect: (date: string) => void;
  /** Day of week that starts the week: 0 = Sunday, 1 = Monday */
  weekStart?: 0 | 1;
  /** Optional className for the outer container */
  className?: string;
}

/** Format a Date to "YYYY-MM-DD" key string */
function toDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/** Chevron left icon */
function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

/** Chevron right icon */
function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

const FULL_DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const SHORT_DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/**
 * CalendarPicker — interactive month-grid calendar for date selection.
 *
 * Displays a full month grid with day cells. Available dates (passed via
 * `availableDates`) are clickable; past and unavailable dates are grayed
 * out. The selected date gets primary-color highlight. Today has a dot
 * indicator. Supports configurable week start (Sunday or Monday).
 *
 * Keyboard navigation:
 * - Arrow keys move focus between days
 * - Enter/Space select the focused day
 * - PageUp/PageDown navigate months
 * - Home/End jump to first/last day of week
 */
export function CalendarPicker({
  availableDates,
  selectedDate,
  onSelect,
  weekStart = 0,
  className,
}: CalendarPickerProps) {
  // The month currently displayed in the calendar
  const [displayMonth, setDisplayMonth] = React.useState<Date>(() => {
    if (selectedDate) {
      try {
        return startOfMonth(parseISO(selectedDate));
      } catch {
        return startOfMonth(new Date());
      }
    }
    return startOfMonth(new Date());
  });

  // Track focused day for keyboard navigation (separate from selected).
  // Initialised to today so that keyboard users have a sensible entry point.
  const [focusedDate, setFocusedDate] = React.useState<Date | null>(() => new Date());

  // Ref map so we can imperatively focus day buttons
  const dayRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  // When the selected date changes externally, move the keyboard focus anchor to it
  React.useEffect(() => {
    if (selectedDate) {
      try {
        setFocusedDate(parseISO(selectedDate));
      } catch {
        // ignore invalid dates
      }
    }
  }, [selectedDate]);

  // Build ordered day-of-week header (Sunday-start or Monday-start)
  const dayOrder = React.useMemo(() => {
    const base = [0, 1, 2, 3, 4, 5, 6];
    if (weekStart === 1) {
      // Rotate so Monday (1) is first
      return [...base.slice(1), base[0]!];
    }
    return base;
  }, [weekStart]);

  // Build the grid of days to display (may include days from adjacent months
  // to fill the first and last weeks)
  const calendarDays = React.useMemo(() => {
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);

    const gridStart = startOfWeek(monthStart, { weekStartsOn: weekStart });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: weekStart });

    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [displayMonth, weekStart]);

  function prevMonth() {
    setDisplayMonth((d) => {
      const prev = startOfMonth(subMonths(d, 1));
      setFocusedDate(prev);
      return prev;
    });
  }

  function nextMonth() {
    setDisplayMonth((d) => {
      const next = startOfMonth(addMonths(d, 1));
      setFocusedDate(next);
      return next;
    });
  }

  function handleDayClick(day: Date) {
    const key = toDateKey(day);
    if (!availableDates.has(key)) return;
    // Past dates (before today's start) are not selectable
    if (isPast(startOfDay(day)) && !isToday(day)) return;
    onSelect(key);
  }

  function handleDayKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, day: Date) {
    let newFocus: Date | null = null;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newFocus = new Date(day);
        newFocus.setDate(day.getDate() - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newFocus = new Date(day);
        newFocus.setDate(day.getDate() + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newFocus = new Date(day);
        newFocus.setDate(day.getDate() - 7);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newFocus = new Date(day);
        newFocus.setDate(day.getDate() + 7);
        break;
      case 'Home':
        e.preventDefault();
        // Jump to first day of current week
        newFocus = startOfWeek(day, { weekStartsOn: weekStart });
        break;
      case 'End':
        e.preventDefault();
        // Jump to last day of current week
        newFocus = endOfWeek(day, { weekStartsOn: weekStart });
        break;
      case 'PageUp':
        e.preventDefault();
        newFocus = subMonths(day, 1);
        setDisplayMonth(startOfMonth(newFocus));
        break;
      case 'PageDown':
        e.preventDefault();
        newFocus = addMonths(day, 1);
        setDisplayMonth(startOfMonth(newFocus));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleDayClick(day);
        return;
      default:
        return;
    }

    if (newFocus) {
      // If the new focus is outside the displayed month, navigate to it
      if (!isSameMonth(newFocus, displayMonth)) {
        setDisplayMonth(startOfMonth(newFocus));
      }
      setFocusedDate(newFocus);
    }
  }

  const monthLabel = format(displayMonth, 'MMMM yyyy');

  return (
    <div
      className={cn('w-full select-none', className)}
      role="group"
      aria-label={`Calendar — ${monthLabel}`}
    >
      {/* ── Month header ──────────────────────────────────── */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Go to previous month"
          className={cn(
            'rounded-md p-1.5 text-gray-600 transition-colors',
            'hover:bg-gray-100 hover:text-gray-900',
            'focus-ring'
          )}
        >
          <ChevronLeftIcon />
        </button>

        <h2 className="text-sm font-semibold text-gray-900" aria-live="polite" aria-atomic="true">
          {monthLabel}
        </h2>

        <button
          type="button"
          onClick={nextMonth}
          aria-label="Go to next month"
          className={cn(
            'rounded-md p-1.5 text-gray-600 transition-colors',
            'hover:bg-gray-100 hover:text-gray-900',
            'focus-ring'
          )}
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* ── Day-of-week headers ───────────────────────────── */}
      <div className="mb-1 grid grid-cols-7 text-center" role="row" aria-hidden="true">
        {dayOrder.map((dayIndex) => (
          <div
            key={dayIndex}
            className="py-1 text-xs font-medium text-gray-400"
            title={FULL_DAY_NAMES[dayIndex]}
          >
            {SHORT_DAY_NAMES[dayIndex]}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ─────────────────────────────────── */}
      <div role="grid" aria-label={monthLabel} className="grid grid-cols-7">
        {calendarDays.map((day) => {
          const key = toDateKey(day);
          const isCurrentMonth = isSameMonth(day, displayMonth);
          const isSelected = selectedDate === key;
          const isTodayDate = isToday(day);
          // A day is in the past if it's strictly before the start of today
          const isPastDay = isPast(startOfDay(day)) && !isTodayDate;
          const isAvailable = availableDates.has(key);
          const isDisabled = isPastDay || !isAvailable || !isCurrentMonth;

          return (
            <div
              key={key}
              role="gridcell"
              aria-selected={isSelected || undefined}
              className="flex items-center justify-center p-0.5"
            >
              <button
                type="button"
                ref={(el) => {
                  if (el) {
                    dayRefs.current.set(key, el);
                  } else {
                    dayRefs.current.delete(key);
                  }
                }}
                disabled={isDisabled}
                onClick={() => handleDayClick(day)}
                onKeyDown={(e) => handleDayKeyDown(e, day)}
                aria-label={format(day, 'EEEE, MMMM d, yyyy')}
                aria-pressed={isSelected}
                aria-current={isTodayDate ? 'date' : undefined}
                tabIndex={focusedDate && isSameDay(day, focusedDate) ? 0 : -1}
                className={cn(
                  // Base layout
                  'relative flex h-9 w-9 flex-col items-center justify-center',
                  'rounded-full text-sm transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',

                  // Out-of-month days: invisible but in grid
                  !isCurrentMonth && 'invisible pointer-events-none',

                  // Default state for current-month, available days
                  isCurrentMonth &&
                    !isDisabled &&
                    !isSelected &&
                    'font-medium text-gray-900 hover:bg-primary-50 hover:text-primary-700',

                  // Disabled / past / unavailable
                  isDisabled && isCurrentMonth && 'cursor-not-allowed font-normal text-gray-300',

                  // Selected date
                  isSelected && 'bg-primary-600 font-semibold text-white hover:bg-primary-700',

                  // Today (not selected)
                  isTodayDate && !isSelected && 'font-semibold text-primary-600'
                )}
              >
                <span>{format(day, 'd')}</span>

                {/* Today dot indicator */}
                {isTodayDate && !isSelected && (
                  <span
                    className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-600"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
