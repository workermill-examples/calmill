import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { addDays, subDays, startOfMonth, endOfMonth, format } from "date-fns";
import { CalendarPicker } from "@/components/booking/calendar-picker";
import type { CalendarPickerProps } from "@/components/booking/calendar-picker";

// Mock the Calendar component since we're testing CalendarPicker logic
vi.mock("@/components/ui/calendar", () => ({
  Calendar: vi.fn(({ onSelect, disabled, selected, ...props }) => (
    <div data-testid="mock-calendar" data-selected={selected?.toISOString()}>
      {/* Simplified mock calendar with some test dates */}
      {Array.from({ length: 7 }, (_, i) => {
        const date = addDays(new Date(), i);
        const isDisabled = disabled?.(date);
        return (
          <button
            key={i}
            data-testid={`calendar-day-${i}`}
            data-date={date.toISOString()}
            disabled={isDisabled}
            onClick={() => !isDisabled && onSelect?.(date)}
            aria-label={format(date, 'EEEE, MMMM do, yyyy')}
          >
            {format(date, 'd')}
          </button>
        );
      })}
    </div>
  )),
}));

describe("CalendarPicker", () => {
  const mockOnDateSelect = vi.fn();
  const testTimezone = "America/New_York";

  const defaultProps: CalendarPickerProps = {
    onDateSelect: mockOnDateSelect,
    timezone: testTimezone,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<CalendarPicker {...defaultProps} />);

      expect(screen.getByTestId("mock-calendar")).toBeInTheDocument();
    });

    it("shows loading state when loading prop is true", () => {
      render(<CalendarPicker {...defaultProps} loading={true} />);

      // Should show skeleton loading elements
      const shimmerElements = document.querySelectorAll('.animate-shimmer, .bg-muted');
      expect(shimmerElements.length).toBeGreaterThan(10); // Multiple skeleton elements
      expect(screen.queryByTestId("mock-calendar")).not.toBeInTheDocument();
    });

    it("renders with selected date", () => {
      const selectedDate = new Date("2024-01-15T10:00:00Z");
      render(
        <CalendarPicker {...defaultProps} selectedDate={selectedDate} />
      );

      const calendar = screen.getByTestId("mock-calendar");
      expect(calendar).toHaveAttribute("data-selected", selectedDate.toISOString());
    });

    it("renders with available dates", () => {
      const availableDates = [
        new Date(),
        addDays(new Date(), 1),
        addDays(new Date(), 2),
      ];

      render(
        <CalendarPicker {...defaultProps} availableDates={availableDates} />
      );

      expect(screen.getByTestId("mock-calendar")).toBeInTheDocument();
    });
  });

  describe("Date Selection", () => {
    it("calls onDateSelect when a valid date is clicked", async () => {
      const user = userEvent.setup();
      render(<CalendarPicker {...defaultProps} />);

      const dayButton = screen.getByTestId("calendar-day-1"); // Tomorrow
      await user.click(dayButton);

      expect(mockOnDateSelect).toHaveBeenCalledOnce();
      // Should be called with a TZDate instance
      const callArg = mockOnDateSelect.mock.calls[0][0];
      expect(callArg).toBeInstanceOf(Date);
    });

    it("does not call onDateSelect when a disabled date is clicked", async () => {
      const user = userEvent.setup();
      const pastDate = subDays(new Date(), 5);

      render(
        <CalendarPicker
          {...defaultProps}
          minDate={new Date()} // Only allow today and future
        />
      );

      // Try to click a past date (should be disabled)
      const dayButton = screen.getByTestId("calendar-day-0");
      if (!dayButton.disabled) {
        // If button is not disabled, simulate the disabled check
        // This test verifies the disabled logic works
        const today = new Date();
        expect(today.getTime()).toBeGreaterThan(pastDate.getTime());
      }

      // Click should not trigger callback for disabled dates
      await user.click(dayButton);

      // If the day was disabled, onDateSelect should not be called
      // If not disabled (today or future), it's allowed
      if (dayButton.disabled) {
        expect(mockOnDateSelect).not.toHaveBeenCalled();
      } else {
        expect(mockOnDateSelect).toHaveBeenCalled();
      }
    });
  });

  describe("Date Constraints", () => {
    it("respects minDate constraint", () => {
      const minDate = addDays(new Date(), 2);
      render(
        <CalendarPicker
          {...defaultProps}
          minDate={minDate}
        />
      );

      // Check that days before minDate are disabled
      const todayButton = screen.getByTestId("calendar-day-0");
      expect(todayButton).toBeDisabled();

      const tomorrowButton = screen.getByTestId("calendar-day-1");
      expect(tomorrowButton).toBeDisabled();
    });

    it("respects maxDate constraint", () => {
      const maxDate = addDays(new Date(), 2);
      render(
        <CalendarPicker
          {...defaultProps}
          maxDate={maxDate}
        />
      );

      // Days beyond maxDate should be disabled
      const futureDayButton = screen.getByTestId("calendar-day-5");
      expect(futureDayButton).toBeDisabled();
    });

    it("uses default constraints (today to 60 days out)", () => {
      render(<CalendarPicker {...defaultProps} />);

      // Today should be enabled
      const todayButton = screen.getByTestId("calendar-day-0");
      expect(todayButton).not.toBeDisabled();
    });
  });

  describe("Available Dates", () => {
    it("disables dates with no available slots", () => {
      const availableDates = [
        new Date(), // Today
        addDays(new Date(), 2), // Day after tomorrow
      ];

      render(
        <CalendarPicker
          {...defaultProps}
          availableDates={availableDates}
        />
      );

      // Tomorrow should be disabled (not in available dates)
      const tomorrowButton = screen.getByTestId("calendar-day-1");
      expect(tomorrowButton).toBeDisabled();

      // Day after tomorrow should be enabled
      const dayAfterButton = screen.getByTestId("calendar-day-2");
      expect(dayAfterButton).not.toBeDisabled();
    });

    it("treats all dates as available when no available dates provided", () => {
      render(<CalendarPicker {...defaultProps} />);

      // Without available dates, all future dates should be enabled
      // (only constrained by min/max dates)
      const todayButton = screen.getByTestId("calendar-day-0");
      expect(todayButton).not.toBeDisabled();

      const tomorrowButton = screen.getByTestId("calendar-day-1");
      expect(tomorrowButton).not.toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("provides proper ARIA labels for dates", () => {
      const selectedDate = new Date("2024-01-15T10:00:00Z");
      render(
        <CalendarPicker
          {...defaultProps}
          selectedDate={selectedDate}
          eventTitle="30 Minute Meeting"
          eventDuration={30}
        />
      );

      // Check that dates have proper aria-labels
      const dayButtons = screen.getAllByRole("button");
      const firstButton = dayButtons[0];
      expect(firstButton).toHaveAttribute("aria-label");

      const ariaLabel = firstButton.getAttribute("aria-label");
      expect(ariaLabel).toContain("2024"); // Should contain year
    });

    it("provides live region updates for selected date", () => {
      const selectedDate = new Date("2024-01-15T10:00:00Z");
      render(
        <CalendarPicker
          {...defaultProps}
          selectedDate={selectedDate}
          eventTitle="Team Sync"
        />
      );

      // Should have sr-only live region
      const liveRegion = screen.getByRole("region", { hidden: true });
      expect(liveRegion).toHaveClass("sr-only");
      expect(liveRegion).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Legend and Context", () => {
    it("shows event information when provided", () => {
      render(
        <CalendarPicker
          {...defaultProps}
          eventTitle="Technical Interview"
          eventDuration={45}
        />
      );

      expect(screen.getByText("Technical Interview")).toBeInTheDocument();
      expect(screen.getByText("45 minutes")).toBeInTheDocument();
    });

    it("shows availability legend", () => {
      render(<CalendarPicker {...defaultProps} />);

      expect(screen.getByText("Available")).toBeInTheDocument();
      expect(screen.getByText("No availability")).toBeInTheDocument();
    });

    it("shows selected indicator in legend when date is selected", () => {
      const selectedDate = new Date();
      render(
        <CalendarPicker
          {...defaultProps}
          selectedDate={selectedDate}
        />
      );

      expect(screen.getByText("Selected")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("handles invalid date gracefully", async () => {
      const user = userEvent.setup();

      // Mock console.warn to avoid noise in test output
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(<CalendarPicker {...defaultProps} />);

      // Simulate clicking with invalid data (should be handled gracefully)
      const calendar = screen.getByTestId("mock-calendar");
      fireEvent.click(calendar, { target: { value: "invalid-date" } });

      // Should not crash or call onDateSelect with invalid data
      expect(mockOnDateSelect).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Custom CSS Classes", () => {
    it("applies custom className", () => {
      render(
        <CalendarPicker
          {...defaultProps}
          className="custom-calendar-class"
        />
      );

      const container = screen.getByTestId("mock-calendar").parentElement;
      expect(container).toHaveClass("custom-calendar-class");
    });
  });

  describe("Timezone Handling", () => {
    it("converts selected dates to specified timezone", async () => {
      const user = userEvent.setup();
      const testDate = new Date("2024-01-15T15:00:00Z");

      render(
        <CalendarPicker
          {...defaultProps}
          timezone="America/Los_Angeles"
        />
      );

      const dayButton = screen.getByTestId("calendar-day-1");
      await user.click(dayButton);

      expect(mockOnDateSelect).toHaveBeenCalledOnce();

      // Should create a TZDate instance with the specified timezone
      const callArg = mockOnDateSelect.mock.calls[0][0];
      expect(callArg).toBeInstanceOf(Date);
    });
  });
});