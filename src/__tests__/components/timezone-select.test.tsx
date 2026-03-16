import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimezoneSelect } from "@/components/booking/timezone-select";
import type { TimezoneSelectProps } from "@/components/booking/timezone-select";

// Mock the UI components
vi.mock("@/components/ui/button", () => ({
  Button: vi.fn(({ children, onClick, disabled, ...props }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )),
}));

vi.mock("@/components/ui/input", () => ({
  Input: vi.fn((props) => <input {...props} />),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Clock: () => <span data-testid="clock-icon">⏰</span>,
  Search: () => <span data-testid="search-icon">🔍</span>,
  Check: () => <span data-testid="check-icon">✓</span>,
}));

describe("TimezoneSelect", () => {
  const mockOnChange = vi.fn();

  const defaultProps: TimezoneSelectProps = {
    value: "America/New_York",
    onChange: mockOnChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock Intl.DateTimeFormat for each test
    global.Intl.DateTimeFormat = vi.fn().mockImplementation((locale, options) => ({
      resolvedOptions: () => ({ timeZone: "America/New_York" }),
      format: vi.fn(() => "12/25/2023"),
      formatToParts: vi.fn(() => [
        { type: "month", value: "12" },
        { type: "literal", value: "/" },
        { type: "day", value: "25" },
        { type: "literal", value: "/" },
        { type: "year", value: "2023" },
        { type: "timeZoneName", value: "EST" }
      ]),
    }));
  });

  afterEach(() => {
    // Clean up any document event listeners
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      fireEvent.click(document.body); // Close any open dropdowns
    });
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<TimezoneSelect {...defaultProps} />);

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByTestId("clock-icon")).toBeInTheDocument();
    });

    it("displays selected timezone correctly", () => {
      render(<TimezoneSelect {...defaultProps} value="America/Los_Angeles" />);

      expect(screen.getByText("Los Angeles")).toBeInTheDocument();
      expect(screen.getByText("(UTC-8/-7)")).toBeInTheDocument();
    });

    it("shows placeholder when no value is selected", () => {
      render(
        <TimezoneSelect
          {...defaultProps}
          value=""
          placeholder="Choose timezone"
        />
      );

      expect(screen.getByText("Choose timezone")).toBeInTheDocument();
    });

    it("can be disabled", () => {
      render(<TimezoneSelect {...defaultProps} disabled={true} />);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });
  });

  describe("Dropdown Interaction", () => {
    it("opens dropdown when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(<TimezoneSelect {...defaultProps} />);

      const trigger = screen.getByRole("button");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search timezones...")).toBeInTheDocument();
      });
    });

    it("closes dropdown when clicking outside", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <TimezoneSelect {...defaultProps} />
          <div data-testid="outside">Outside</div>
        </div>
      );

      // Open dropdown
      const trigger = screen.getByRole("button");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search timezones...")).toBeInTheDocument();
      });

      // Click outside
      const outside = screen.getByTestId("outside");
      await user.click(outside);

      await waitFor(() => {
        expect(screen.queryByPlaceholderText("Search timezones...")).not.toBeInTheDocument();
      });
    });

    it("closes dropdown when Escape is pressed", async () => {
      const user = userEvent.setup();
      render(<TimezoneSelect {...defaultProps} />);

      // Open dropdown
      const trigger = screen.getByRole("button");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search timezones...")).toBeInTheDocument();
      });

      // Press Escape
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByPlaceholderText("Search timezones...")).not.toBeInTheDocument();
      });
    });
  });

  describe("Search Functionality", () => {
    it("filters timezones based on search input", async () => {
      const user = userEvent.setup();
      render(<TimezoneSelect {...defaultProps} />);

      // Open dropdown
      const trigger = screen.getByRole("button");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search timezones...")).toBeInTheDocument();
      });

      // Search for "london"
      const searchInput = screen.getByPlaceholderText("Search timezones...");
      await user.type(searchInput, "london");

      await waitFor(() => {
        expect(screen.getByText("London")).toBeInTheDocument();
        // Should not show unrelated timezones
        expect(screen.queryByText("Tokyo")).not.toBeInTheDocument();
      });
    });

    it("shows no results message when search returns nothing", async () => {
      const user = userEvent.setup();
      render(<TimezoneSelect {...defaultProps} />);

      // Open dropdown
      const trigger = screen.getByRole("button");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search timezones...")).toBeInTheDocument();
      });

      // Search for something that doesn't exist
      const searchInput = screen.getByPlaceholderText("Search timezones...");
      await user.type(searchInput, "nonexistent");

      await waitFor(() => {
        expect(screen.getByText(/No timezones found matching "nonexistent"/)).toBeInTheDocument();
      });
    });

    it("clears search when dropdown is closed", async () => {
      const user = userEvent.setup();
      render(<TimezoneSelect {...defaultProps} />);

      // Open dropdown and search
      const trigger = screen.getByRole("button");
      await user.click(trigger);

      const searchInput = await screen.findByPlaceholderText("Search timezones...");
      await user.type(searchInput, "test");

      // Close dropdown
      await user.keyboard("{Escape}");

      // Reopen dropdown
      await user.click(trigger);

      const newSearchInput = await screen.findByPlaceholderText("Search timezones...");
      expect(newSearchInput).toHaveValue("");
    });
  });

  describe("Timezone Selection", () => {
    it("selects timezone when option is clicked", async () => {
      const user = userEvent.setup();
      render(<TimezoneSelect {...defaultProps} value="" />);

      // Open dropdown
      const trigger = screen.getByRole("button");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("London")).toBeInTheDocument();
      });

      // Click on London option
      const londonOption = screen.getByText("London");
      await user.click(londonOption);

      expect(mockOnChange).toHaveBeenCalledWith("Europe/London");
    });

    it("shows check mark for selected timezone", async () => {
      const user = userEvent.setup();
      render(<TimezoneSelect {...defaultProps} value="Europe/London" />);

      // Open dropdown
      const trigger = screen.getByRole("button");
      await user.click(trigger);

      await waitFor(() => {
        // Should show check mark next to London
        const checkIcons = screen.getAllByTestId("check-icon");
        expect(checkIcons.length).toBeGreaterThan(0);
      });
    });

    it("highlights selected timezone in dropdown", async () => {
      const user = userEvent.setup();
      render(<TimezoneSelect {...defaultProps} value="Europe/London" />);

      // Open dropdown
      const trigger = screen.getByRole("button");
      await user.click(trigger);

      await waitFor(() => {
        const londonButton = screen.getByRole("option", { name: /London/ });
        expect(londonButton).toHaveAttribute("aria-selected", "true");
      });
    });
  });

  describe("Auto-Detection", () => {
    it("shows detected timezone section when different from selected", async () => {
      const user = userEvent.setup();

      // Set a different timezone as detected
      global.Intl.DateTimeFormat = vi.fn().mockImplementation(() => ({
        resolvedOptions: () => ({ timeZone: "America/Los_Angeles" }),
      }));

      render(<TimezoneSelect {...defaultProps} value="Europe/London" />);

      // Open dropdown
      const trigger = screen.getByRole("button");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Detected")).toBeInTheDocument();
      });
    });

    it("auto-selects detected timezone when no value is set", () => {
      render(<TimezoneSelect {...defaultProps} value="" />);

      // Should auto-detect and call onChange with detected timezone
      expect(mockOnChange).toHaveBeenCalledWith("America/New_York");
    });

    it("does not show detected section when same as selected", async () => {
      const user = userEvent.setup();
      render(<TimezoneSelect {...defaultProps} value="America/New_York" />);

      const trigger = screen.getByRole("button");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.queryByText("Detected")).not.toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(<TimezoneSelect {...defaultProps} />);

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
      expect(trigger).toHaveAttribute("aria-label", "Select timezone");
    });

    it("updates aria-expanded when dropdown opens", async () => {
      const user = userEvent.setup();
      render(<TimezoneSelect {...defaultProps} />);

      const trigger = screen.getByRole("button");
      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("focuses search input when dropdown opens", async () => {
      const user = userEvent.setup();
      render(<TimezoneSelect {...defaultProps} />);

      const trigger = screen.getByRole("button");
      await user.click(trigger);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText("Search timezones...");
        expect(searchInput).toHaveFocus();
      });
    });

    it("provides proper role and aria-selected for options", async () => {
      const user = userEvent.setup();
      render(<TimezoneSelect {...defaultProps} value="Europe/London" />);

      const trigger = screen.getByRole("button");
      await user.click(trigger);

      await waitFor(() => {
        const options = screen.getAllByRole("option");
        expect(options.length).toBeGreaterThan(0);

        const londonOption = screen.getByRole("option", { name: /London/ });
        expect(londonOption).toHaveAttribute("aria-selected", "true");
      });
    });
  });

  describe("Error Handling", () => {
    it("handles invalid timezone gracefully", () => {
      // Mock console.warn to avoid noise in tests
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(<TimezoneSelect {...defaultProps} value="Invalid/Timezone" />);

      // Should still render without crashing
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("Invalid/Timezone")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("handles Intl.DateTimeFormat errors gracefully", () => {
      // Mock Intl.DateTimeFormat to throw an error
      global.Intl.DateTimeFormat = vi.fn().mockImplementation(() => {
        throw new Error("Timezone not supported");
      });

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(<TimezoneSelect {...defaultProps} value="UTC" />);

      // Should still render without crashing
      expect(screen.getByRole("button")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe("Custom Props", () => {
    it("applies custom className", () => {
      render(
        <TimezoneSelect
          {...defaultProps}
          className="custom-timezone-class"
        />
      );

      const container = screen.getByRole("button").parentElement;
      expect(container).toHaveClass("custom-timezone-class");
    });

    it("uses custom placeholder", () => {
      render(
        <TimezoneSelect
          {...defaultProps}
          value=""
          placeholder="Pick your timezone"
        />
      );

      expect(screen.getByText("Pick your timezone")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles timezone with unusual formatting", async () => {
      const user = userEvent.setup();
      render(<TimezoneSelect {...defaultProps} />);

      // Open dropdown
      const trigger = screen.getByRole("button");
      await user.click(trigger);

      await waitFor(() => {
        // Look for India timezone which has unusual +5:30 offset
        expect(screen.getByText("Mumbai")).toBeInTheDocument();
        expect(screen.getByText(/UTC\+5:30/)).toBeInTheDocument();
      });
    });

    it("handles empty search gracefully", async () => {
      const user = userEvent.setup();
      render(<TimezoneSelect {...defaultProps} />);

      const trigger = screen.getByRole("button");
      await user.click(trigger);

      const searchInput = await screen.findByPlaceholderText("Search timezones...");

      // Type and then clear
      await user.type(searchInput, "test");
      await user.clear(searchInput);

      // Should show all timezones again
      await waitFor(() => {
        expect(screen.getByText("London")).toBeInTheDocument();
        expect(screen.getByText("Tokyo")).toBeInTheDocument();
      });
    });

    it("handles rapid open/close interactions", async () => {
      const user = userEvent.setup();
      render(<TimezoneSelect {...defaultProps} />);

      const trigger = screen.getByRole("button");

      // Rapidly open and close
      await user.click(trigger);
      await user.keyboard("{Escape}");
      await user.click(trigger);
      await user.keyboard("{Escape}");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search timezones...")).toBeInTheDocument();
      });
    });
  });
});