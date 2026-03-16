import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SlotList } from "@/components/booking/slot-list";
import type { SlotListProps, TimeSlot } from "@/components/booking/slot-list";

// Mock UI components
vi.mock("@/components/ui/button", () => ({
  Button: vi.fn(({ children, onClick, variant, disabled, ...props }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={variant === "primary" ? "primary-button" : "outline-button"}
      {...props}
    >
      {children}
    </button>
  )),
}));

vi.mock("@/components/ui/loading-skeleton", () => ({
  LoadingSkeleton: vi.fn(({ className }) => (
    <div className={className}>Loading skeleton</div>
  )),
}));

vi.mock("@/components/ui/empty-state", () => ({
  EmptyState: vi.fn(({ title, description, action }) => (
    <div data-testid="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {action && <button onClick={action.onClick}>{action.text}</button>}
    </div>
  )),
}));

describe("SlotList", () => {
  const mockOnSlotSelect = vi.fn();
  const mockOnRetry = vi.fn();

  const testTimezone = "America/New_York";
  const testDate = new Date("2024-01-15T00:00:00Z");

  const sampleSlots: TimeSlot[] = [
    {
      time: "2024-01-15T14:00:00Z", // 9:00 AM EST (morning)
      localTime: "09:00",
      duration: 30,
    },
    {
      time: "2024-01-15T15:30:00Z", // 10:30 AM EST (morning)
      localTime: "10:30",
      duration: 30,
    },
    {
      time: "2024-01-15T18:00:00Z", // 1:00 PM EST (afternoon)
      localTime: "13:00",
      duration: 30,
    },
    {
      time: "2024-01-15T19:30:00Z", // 2:30 PM EST (afternoon)
      localTime: "14:30",
      duration: 30,
    },
    {
      time: "2024-01-15T22:00:00Z", // 5:00 PM EST (evening)
      localTime: "17:00",
      duration: 30,
    },
    {
      time: "2024-01-15T23:30:00Z", // 6:30 PM EST (evening)
      localTime: "18:30",
      duration: 30,
    },
  ];

  const defaultProps: SlotListProps = {
    slots: [],
    onSlotSelect: mockOnSlotSelect,
    timezone: testTimezone,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<SlotList {...defaultProps} />);
      // With empty slots, should show empty state
      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });

    it("displays loading state when loading", () => {
      render(<SlotList {...defaultProps} loading={true} />);

      expect(screen.getAllByText("Loading skeleton")).toHaveLength(13); // 1 header + 12 slot skeletons
    });

    it("displays error state when error provided", () => {
      render(
        <SlotList
          {...defaultProps}
          error="Failed to load slots"
          onRetry={mockOnRetry}
          selectedDate={testDate}
        />,
      );

      expect(screen.getByText("Failed to load time slots")).toBeInTheDocument();
      expect(screen.getByText("Failed to load slots")).toBeInTheDocument();
      expect(screen.getByText("Try again")).toBeInTheDocument();
    });

    it("displays empty state when no slots available", () => {
      render(<SlotList {...defaultProps} selectedDate={testDate} />);

      expect(screen.getByText("No time slots available")).toBeInTheDocument();
      expect(
        screen.getByText(
          "There are no available times for this date. Please select another day.",
        ),
      ).toBeInTheDocument();
    });

    it("renders slots grouped by time period", () => {
      render(
        <SlotList
          {...defaultProps}
          slots={sampleSlots}
          selectedDate={testDate}
        />,
      );

      expect(screen.getByText("Morning")).toBeInTheDocument();
      expect(screen.getByText("Afternoon")).toBeInTheDocument();
      expect(screen.getByText("Evening")).toBeInTheDocument();

      // Should have buttons for each slot
      expect(screen.getByText("9:00 AM")).toBeInTheDocument();
      expect(screen.getByText("10:30 AM")).toBeInTheDocument();
      expect(screen.getByText("1:00 PM")).toBeInTheDocument();
      expect(screen.getByText("2:30 PM")).toBeInTheDocument();
      expect(screen.getByText("5:00 PM")).toBeInTheDocument();
      expect(screen.getByText("6:30 PM")).toBeInTheDocument();
    });

    it("shows selected date context", () => {
      render(
        <SlotList
          {...defaultProps}
          slots={sampleSlots}
          selectedDate={testDate}
        />,
      );

      expect(screen.getByText("Monday, Jan 15")).toBeInTheDocument();
      expect(screen.getByText(/6 available times/)).toBeInTheDocument();
      expect(screen.getByText(testTimezone)).toBeInTheDocument();
    });

    it("handles today/tomorrow/yesterday date labels", () => {
      const today = new Date();
      render(
        <SlotList {...defaultProps} slots={sampleSlots} selectedDate={today} />,
      );

      expect(screen.getByText("Today")).toBeInTheDocument();
    });
  });

  describe("Slot Selection", () => {
    it("calls onSlotSelect when slot is clicked", async () => {
      const user = userEvent.setup();
      render(
        <SlotList
          {...defaultProps}
          slots={sampleSlots}
          selectedDate={testDate}
        />,
      );

      const slotButton = screen.getByText("9:00 AM");
      await user.click(slotButton);

      expect(mockOnSlotSelect).toHaveBeenCalledWith(sampleSlots[0]);
    });

    it("highlights selected slot", () => {
      render(
        <SlotList
          {...defaultProps}
          slots={sampleSlots}
          selectedSlot={sampleSlots[0]}
          selectedDate={testDate}
        />,
      );

      const selectedButton = screen.getByText("9:00 AM");
      expect(selectedButton).toHaveClass("primary-button");

      const unselectedButton = screen.getByText("10:30 AM");
      expect(unselectedButton).toHaveClass("outline-button");
    });

    it("updates aria-pressed for selected slot", () => {
      render(
        <SlotList
          {...defaultProps}
          slots={sampleSlots}
          selectedSlot={sampleSlots[0]}
          selectedDate={testDate}
        />,
      );

      const selectedButton = screen.getByText("9:00 AM");
      expect(selectedButton).toHaveAttribute("aria-pressed", "true");

      const unselectedButton = screen.getByText("10:30 AM");
      expect(unselectedButton).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("Keyboard Navigation", () => {
    it("handles Enter key for slot selection", async () => {
      render(
        <SlotList
          {...defaultProps}
          slots={sampleSlots}
          selectedDate={testDate}
        />,
      );

      const slotButton = screen.getByText("9:00 AM");
      fireEvent.keyDown(slotButton, { key: "Enter" });

      expect(mockOnSlotSelect).toHaveBeenCalledWith(sampleSlots[0]);
    });

    it("handles Space key for slot selection", async () => {
      render(
        <SlotList
          {...defaultProps}
          slots={sampleSlots}
          selectedDate={testDate}
        />,
      );

      const slotButton = screen.getByText("9:00 AM");
      fireEvent.keyDown(slotButton, { key: " " });

      expect(mockOnSlotSelect).toHaveBeenCalledWith(sampleSlots[0]);
    });

    it("ignores other keys", async () => {
      render(
        <SlotList
          {...defaultProps}
          slots={sampleSlots}
          selectedDate={testDate}
        />,
      );

      const slotButton = screen.getByText("9:00 AM");
      fireEvent.keyDown(slotButton, { key: "a" });

      expect(mockOnSlotSelect).not.toHaveBeenCalled();
    });
  });

  describe("Time Period Grouping", () => {
    it("groups slots into morning (6 AM - 12 PM)", () => {
      const morningSlots: TimeSlot[] = [
        { time: "2024-01-15T11:00:00Z", localTime: "06:00", duration: 30 }, // 6 AM
        { time: "2024-01-15T17:00:00Z", localTime: "12:00", duration: 30 }, // 12 PM (noon)
      ];

      render(
        <SlotList
          {...defaultProps}
          slots={morningSlots}
          selectedDate={testDate}
        />,
      );

      expect(screen.getByText("Morning")).toBeInTheDocument();
      expect(screen.queryByText("Afternoon")).not.toBeInTheDocument();
    });

    it("groups slots into afternoon (12 PM - 5 PM)", () => {
      const afternoonSlots: TimeSlot[] = [
        { time: "2024-01-15T17:00:00Z", localTime: "12:00", duration: 30 }, // 12 PM
        { time: "2024-01-15T22:00:00Z", localTime: "17:00", duration: 30 }, // 5 PM
      ];

      render(
        <SlotList
          {...defaultProps}
          slots={afternoonSlots}
          selectedDate={testDate}
        />,
      );

      expect(screen.getByText("Afternoon")).toBeInTheDocument();
      expect(screen.queryByText("Morning")).not.toBeInTheDocument();
    });

    it("groups slots into evening (5 PM+)", () => {
      const eveningSlots: TimeSlot[] = [
        { time: "2024-01-15T22:00:00Z", localTime: "17:00", duration: 30 }, // 5 PM
        { time: "2024-01-15T02:00:00Z", localTime: "21:00", duration: 30 }, // 9 PM
      ];

      render(
        <SlotList
          {...defaultProps}
          slots={eveningSlots}
          selectedDate={testDate}
        />,
      );

      expect(screen.getByText("Evening")).toBeInTheDocument();
      expect(screen.queryByText("Morning")).not.toBeInTheDocument();
    });

    it("shows only groups that have slots", () => {
      const morningOnlySlots: TimeSlot[] = [
        { time: "2024-01-15T14:00:00Z", localTime: "09:00", duration: 30 },
      ];

      render(
        <SlotList
          {...defaultProps}
          slots={morningOnlySlots}
          selectedDate={testDate}
        />,
      );

      expect(screen.getByText("Morning")).toBeInTheDocument();
      expect(screen.queryByText("Afternoon")).not.toBeInTheDocument();
      expect(screen.queryByText("Evening")).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("calls retry function when retry button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <SlotList
          {...defaultProps}
          error="Network error"
          onRetry={mockOnRetry}
          selectedDate={testDate}
        />,
      );

      const retryButton = screen.getByText("Try again");
      await user.click(retryButton);

      expect(mockOnRetry).toHaveBeenCalledOnce();
    });

    it("gracefully handles malformed slot times", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const malformedSlots: TimeSlot[] = [
        { time: "invalid-time", localTime: "09:00", duration: 30 },
        { time: "2024-01-15T14:00:00Z", localTime: "10:00", duration: 30 },
      ];

      render(
        <SlotList
          {...defaultProps}
          slots={malformedSlots}
          selectedDate={testDate}
        />,
      );

      // Should still render valid slots
      expect(screen.getByText("10:00 AM")).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("provides proper ARIA labels for slots", () => {
      render(
        <SlotList
          {...defaultProps}
          slots={sampleSlots}
          selectedDate={testDate}
          eventTitle="Team Meeting"
        />,
      );

      const slotButtons = screen.getAllByText("9:00 AM");
      const slotButton = slotButtons[0];
      expect(slotButton).toHaveAttribute(
        "aria-label",
        "Book Team Meeting at 9:00 AM for 30 minutes",
      );
    });

    it("provides default aria-label when no event title", () => {
      render(
        <SlotList
          {...defaultProps}
          slots={sampleSlots}
          selectedDate={testDate}
        />,
      );

      const slotButtons = screen.getAllByText("9:00 AM");
      const slotButton = slotButtons[0];
      expect(slotButton).toHaveAttribute(
        "aria-label",
        "Select time slot 9:00 AM for 30 minutes",
      );
    });

    it("provides live region updates for selected slot", () => {
      render(
        <SlotList
          {...defaultProps}
          slots={sampleSlots}
          selectedSlot={sampleSlots[0]}
          selectedDate={testDate}
          eventTitle="Team Meeting"
        />,
      );

      const liveRegion = screen.getByText(
        /Selected time: 9:00 AM for 30 minutes, Team Meeting/,
      );
      expect(liveRegion.parentElement).toHaveClass("sr-only");
      expect(liveRegion.parentElement).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Event Information", () => {
    it("shows event title in slot context", () => {
      render(
        <SlotList
          {...defaultProps}
          slots={sampleSlots}
          selectedSlot={sampleSlots[0]}
          selectedDate={testDate}
          eventTitle="Technical Interview"
        />,
      );

      const matches = screen.getAllByText(/Technical Interview/);
      expect(matches.length).toBeGreaterThan(0);
    });

    it("shows duration information", () => {
      const longerSlots: TimeSlot[] = [
        { time: "2024-01-15T14:00:00Z", localTime: "09:00", duration: 60 },
      ];

      render(
        <SlotList
          {...defaultProps}
          slots={longerSlots}
          selectedSlot={longerSlots[0]}
          selectedDate={testDate}
        />,
      );

      expect(screen.getByText("Duration: 60 minutes")).toBeInTheDocument();
    });

    it("handles singular duration correctly", () => {
      const shortSlots: TimeSlot[] = [
        { time: "2024-01-15T14:00:00Z", localTime: "09:00", duration: 1 },
      ];

      render(
        <SlotList
          {...defaultProps}
          slots={shortSlots}
          selectedSlot={shortSlots[0]}
          selectedDate={testDate}
        />,
      );

      expect(screen.getByText("Duration: 1 minute")).toBeInTheDocument();
    });
  });

  describe("Custom CSS Classes", () => {
    it("applies custom className", () => {
      render(
        <SlotList
          {...defaultProps}
          slots={sampleSlots}
          className="custom-slot-list"
          selectedDate={testDate}
        />,
      );

      const container = screen.getByText("Monday, Jan 15").parentElement;
      expect(container).toHaveClass("custom-slot-list");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty slots array gracefully", () => {
      render(<SlotList {...defaultProps} slots={[]} selectedDate={testDate} />);

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });

    it("handles missing selectedDate gracefully", () => {
      render(<SlotList {...defaultProps} slots={sampleSlots} />);

      // Should still render slots without date context
      expect(screen.getByText("Morning")).toBeInTheDocument();
      expect(screen.queryByText("Monday, Jan 15")).not.toBeInTheDocument();
    });

    it("handles slots with same time gracefully", () => {
      const duplicateSlots: TimeSlot[] = [
        { time: "2024-01-15T14:00:00Z", localTime: "09:00", duration: 30 },
        { time: "2024-01-15T14:00:00Z", localTime: "09:00", duration: 60 }, // Same time, different duration
      ];

      render(
        <SlotList
          {...defaultProps}
          slots={duplicateSlots}
          selectedDate={testDate}
        />,
      );

      // Should render both slots
      const slotButtons = screen.getAllByText("9:00 AM");
      expect(slotButtons).toHaveLength(2);
    });

    it("handles very late/early slots correctly", () => {
      const extremeSlots: TimeSlot[] = [
        { time: "2024-01-15T06:00:00Z", localTime: "01:00", duration: 30 }, // 1 AM
        { time: "2024-01-15T09:00:00Z", localTime: "04:00", duration: 30 }, // 4 AM
      ];

      render(
        <SlotList
          {...defaultProps}
          slots={extremeSlots}
          selectedDate={testDate}
        />,
      );

      // Early morning slots should still be grouped as "Evening" based on hour logic
      expect(screen.getByText("Evening")).toBeInTheDocument();
    });
  });
});
