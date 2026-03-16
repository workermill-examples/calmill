import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingForm } from "@/components/booking/booking-form";
import type {
  BookingFormProps,
  CustomQuestion,
  BookingFormData,
} from "@/components/booking/booking-form";

// Mock UI components
vi.mock("@/components/ui/button", () => ({
  Button: vi.fn(({ children, onClick, disabled, loading, type, ...props }) => (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  )),
}));

vi.mock("@/components/ui/input", () => ({
  Input: vi.fn((props) => <input {...props} />),
}));

vi.mock("@/components/ui/card", () => ({
  Card: vi.fn(({ children, ...props }) => <div {...props}>{children}</div>),
  CardContent: vi.fn(({ children, ...props }) => (
    <div {...props}>{children}</div>
  )),
  CardDescription: vi.fn(({ children, ...props }) => (
    <p {...props}>{children}</p>
  )),
  CardHeader: vi.fn(({ children, ...props }) => (
    <div {...props}>{children}</div>
  )),
  CardTitle: vi.fn(({ children, ...props }) => <h2 {...props}>{children}</h2>),
}));

vi.mock("@/components/ui/loading-skeleton", () => ({
  Skeleton: vi.fn(({ className }) => (
    <div className={className}>Loading...</div>
  )),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  AlertCircle: () => <span data-testid="alert-icon">⚠️</span>,
  Calendar: () => <span data-testid="calendar-icon">📅</span>,
  Clock: () => <span data-testid="clock-icon">⏰</span>,
  MapPin: () => <span data-testid="mappin-icon">📍</span>,
}));

describe("BookingForm", () => {
  const mockOnSubmit = vi.fn();
  const defaultTimezone = "America/New_York";

  const defaultProps: BookingFormProps = {
    onSubmit: mockOnSubmit,
    timezone: defaultTimezone,
  };

  const sampleEventDetails = {
    title: "30 Minute Meeting",
    duration: 30,
    date: "January 15, 2024",
    time: "10:00 AM",
    timezone: "America/New_York",
  };

  const sampleCustomQuestions: CustomQuestion[] = [
    {
      id: "company",
      type: "text",
      label: "Company",
      required: true,
      placeholder: "Your company name",
    },
    {
      id: "meeting-purpose",
      type: "select",
      label: "Meeting Purpose",
      required: true,
      options: ["Sales Demo", "Technical Discussion", "General Inquiry"],
    },
    {
      id: "additional-info",
      type: "textarea",
      label: "Additional Information",
      required: false,
    },
    {
      id: "contact-method",
      type: "radio",
      label: "Preferred Contact Method",
      required: true,
      options: ["Email", "Phone", "Slack"],
    },
    {
      id: "interests",
      type: "checkbox",
      label: "Areas of Interest",
      options: ["Product Demo", "Pricing", "Implementation", "Support"],
    },
    {
      id: "phone",
      type: "phone",
      label: "Phone Number",
      required: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<BookingForm {...defaultProps} />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /confirm booking/i }),
      ).toBeInTheDocument();
    });

    it("shows loading skeleton when submitting without form data", () => {
      render(<BookingForm {...defaultProps} submitting={true} />);

      expect(screen.getAllByText("Loading...")).toHaveLength(7); // Multiple skeleton elements
    });

    it("renders event details when provided", () => {
      render(
        <BookingForm {...defaultProps} eventDetails={sampleEventDetails} />,
      );

      expect(screen.getByText("30 Minute Meeting")).toBeInTheDocument();
      expect(screen.getByText("January 15, 2024")).toBeInTheDocument();
      expect(screen.getByText("10:00 AM (30m)")).toBeInTheDocument();
      expect(screen.getByText("America/New_York")).toBeInTheDocument();
    });

    it("renders custom questions when provided", () => {
      render(
        <BookingForm
          {...defaultProps}
          customQuestions={sampleCustomQuestions}
        />,
      );

      expect(screen.getByText("Additional Information")).toBeInTheDocument();
      expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/meeting purpose/i)).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("shows validation errors for required fields", async () => {
      const user = userEvent.setup();
      render(<BookingForm {...defaultProps} />);

      const submitButton = screen.getByRole("button", {
        name: /confirm booking/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Please fix the following errors:"),
        ).toBeInTheDocument();
        expect(screen.getByText("Name is required")).toBeInTheDocument();
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(screen.getByText("Timezone is required")).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("validates email format", async () => {
      const user = userEvent.setup();
      render(<BookingForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "invalid-email");

      const submitButton = screen.getByRole("button", {
        name: /confirm booking/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Valid email is required")).toBeInTheDocument();
      });
    });

    it("validates required custom questions", async () => {
      const user = userEvent.setup();
      render(
        <BookingForm
          {...defaultProps}
          customQuestions={sampleCustomQuestions}
        />,
      );

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");

      const submitButton = screen.getByRole("button", {
        name: /confirm booking/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Company is required")).toBeInTheDocument();
        expect(
          screen.getByText("Meeting Purpose is required"),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Preferred Contact Method is required"),
        ).toBeInTheDocument();
      });
    });

    it("validates phone number format", async () => {
      const user = userEvent.setup();
      render(
        <BookingForm
          {...defaultProps}
          customQuestions={sampleCustomQuestions}
        />,
      );

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const phoneInput = screen.getByLabelText(/phone number/i);

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(phoneInput, "invalid-phone");

      const submitButton = screen.getByRole("button", {
        name: /confirm booking/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Phone Number must be a valid phone number"),
        ).toBeInTheDocument();
      });
    });

    it("clears validation errors when form is corrected", async () => {
      const user = userEvent.setup();
      render(<BookingForm {...defaultProps} />);

      const submitButton = screen.getByRole("button", {
        name: /confirm booking/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Name is required")).toBeInTheDocument();
      });

      // Fix the validation error
      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "John Doe");

      await waitFor(() => {
        expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("submits valid form data", async () => {
      const user = userEvent.setup();
      render(<BookingForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const notesInput = screen.getByLabelText(/notes/i);

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(notesInput, "Looking forward to our meeting");

      const submitButton = screen.getByRole("button", {
        name: /confirm booking/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: "John Doe",
          email: "john@example.com",
          notes: "Looking forward to our meeting",
          timezone: defaultTimezone,
          customResponses: {},
        });
      });
    });

    it("submits form with custom question responses", async () => {
      const user = userEvent.setup();
      render(
        <BookingForm
          {...defaultProps}
          customQuestions={sampleCustomQuestions}
        />,
      );

      // Fill basic fields
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");

      // Fill custom questions
      await user.type(screen.getByLabelText(/company/i), "Acme Corp");
      await user.selectOptions(
        screen.getByLabelText(/meeting purpose/i),
        "Sales Demo",
      );
      await user.type(
        screen.getByLabelText(/additional information/i),
        "Need pricing details",
      );

      // Select radio option
      await user.click(screen.getByLabelText("Email"));

      // Select checkbox options
      await user.click(screen.getByLabelText("Product Demo"));
      await user.click(screen.getByLabelText("Pricing"));

      const submitButton = screen.getByRole("button", {
        name: /confirm booking/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: "John Doe",
          email: "john@example.com",
          notes: "",
          timezone: defaultTimezone,
          customResponses: {
            company: "Acme Corp",
            "meeting-purpose": "Sales Demo",
            "additional-info": "Need pricing details",
            "contact-method": "Email",
            interests: ["Product Demo", "Pricing"],
          },
        });
      });
    });

    it("shows loading state while submitting", async () => {
      const user = userEvent.setup();
      render(<BookingForm {...defaultProps} submitting={true} />);

      const submitButton = screen.getByRole("button", { name: /loading/i });
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent("Loading...");
    });

    it("handles async submission errors gracefully", async () => {
      const user = userEvent.setup();
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockOnSubmit.mockRejectedValueOnce(new Error("Submission failed"));

      render(<BookingForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");

      const submitButton = screen.getByRole("button", {
        name: /confirm booking/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Form submission error:",
          expect.any(Error),
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Custom Question Types", () => {
    beforeEach(() => {
      render(
        <BookingForm
          {...defaultProps}
          customQuestions={sampleCustomQuestions}
        />,
      );
    });

    it("renders text input correctly", () => {
      const textInput = screen.getByLabelText(/company/i);
      expect(textInput).toHaveAttribute("type", "text");
      expect(textInput).toHaveAttribute("placeholder");
    });

    it("renders textarea correctly", () => {
      const textarea = screen.getByLabelText(/additional information/i);
      expect(textarea.tagName).toBe("TEXTAREA");
    });

    it("renders select dropdown correctly", () => {
      const select = screen.getByLabelText(/meeting purpose/i);
      expect(select.tagName).toBe("SELECT");
      expect(screen.getByText("Sales Demo")).toBeInTheDocument();
      expect(screen.getByText("Technical Discussion")).toBeInTheDocument();
    });

    it("renders radio buttons correctly", () => {
      const emailRadio = screen.getByLabelText("Email");
      const phoneRadio = screen.getByLabelText("Phone");
      expect(emailRadio).toHaveAttribute("type", "radio");
      expect(phoneRadio).toHaveAttribute("type", "radio");
      expect(emailRadio).toHaveAttribute("name", "contact-method");
      expect(phoneRadio).toHaveAttribute("name", "contact-method");
    });

    it("renders checkboxes correctly", () => {
      const checkbox1 = screen.getByLabelText("Product Demo");
      const checkbox2 = screen.getByLabelText("Pricing");
      expect(checkbox1).toHaveAttribute("type", "checkbox");
      expect(checkbox2).toHaveAttribute("type", "checkbox");
    });

    it("renders phone input correctly", () => {
      const phoneInput = screen.getByLabelText(/phone number/i);
      expect(phoneInput).toHaveAttribute("type", "tel");
      expect(phoneInput).toHaveAttribute("placeholder", "+1 (555) 123-4567");
    });
  });

  describe("Custom Question Interactions", () => {
    it("handles checkbox selections correctly", async () => {
      const user = userEvent.setup();
      render(
        <BookingForm
          {...defaultProps}
          customQuestions={sampleCustomQuestions}
        />,
      );

      const checkbox1 = screen.getByLabelText("Product Demo");
      const checkbox2 = screen.getByLabelText("Pricing");

      await user.click(checkbox1);
      await user.click(checkbox2);
      await user.click(checkbox1); // Uncheck first one

      expect(checkbox1).not.toBeChecked();
      expect(checkbox2).toBeChecked();
    });

    it("handles radio button selection correctly", async () => {
      const user = userEvent.setup();
      render(
        <BookingForm
          {...defaultProps}
          customQuestions={sampleCustomQuestions}
        />,
      );

      const emailRadio = screen.getByLabelText("Email");
      const phoneRadio = screen.getByLabelText("Phone");

      await user.click(emailRadio);
      expect(emailRadio).toBeChecked();

      await user.click(phoneRadio);
      expect(phoneRadio).toBeChecked();
      expect(emailRadio).not.toBeChecked();
    });

    it("handles select dropdown changes", async () => {
      const user = userEvent.setup();
      render(
        <BookingForm
          {...defaultProps}
          customQuestions={sampleCustomQuestions}
        />,
      );

      const select = screen.getByLabelText(/meeting purpose/i);
      await user.selectOptions(select, "Technical Discussion");

      expect(select).toHaveValue("Technical Discussion");
    });
  });

  describe("Required Field Indicators", () => {
    it("shows asterisk for required fields", () => {
      render(
        <BookingForm
          {...defaultProps}
          customQuestions={sampleCustomQuestions}
        />,
      );

      // Basic required fields
      expect(screen.getByText("Name *")).toBeInTheDocument();
      expect(screen.getByText("Email *")).toBeInTheDocument();

      // Required custom question
      const companyLabel = screen.getByText(/company/i);
      const requiredAsterisk =
        companyLabel.parentElement?.querySelector(".text-red-500");
      expect(requiredAsterisk).toBeInTheDocument();
    });

    it("does not show asterisk for optional fields", () => {
      render(
        <BookingForm
          {...defaultProps}
          customQuestions={sampleCustomQuestions}
        />,
      );

      // Additional notes should not have asterisk
      const notesLabel = screen.getByText("Additional notes");
      expect(notesLabel).not.toHaveTextContent("*");
    });
  });

  describe("Accessibility", () => {
    it("associates labels with form controls", () => {
      render(<BookingForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);

      expect(nameInput).toHaveAttribute("id");
      expect(emailInput).toHaveAttribute("id");
    });

    it("provides error announcements for screen readers", async () => {
      const user = userEvent.setup();
      render(<BookingForm {...defaultProps} />);

      const submitButton = screen.getByRole("button", {
        name: /confirm booking/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        const errorRegion = screen.getByRole("region");
        expect(errorRegion).toBeInTheDocument();
      });
    });

    it("uses proper form attributes", () => {
      render(<BookingForm {...defaultProps} />);

      const form = screen.getByRole("form");
      expect(form).toBeInTheDocument();

      const submitButton = screen.getByRole("button", {
        name: /confirm booking/i,
      });
      expect(submitButton).toHaveAttribute("type", "submit");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty custom questions array", () => {
      render(<BookingForm {...defaultProps} customQuestions={[]} />);

      expect(
        screen.queryByText("Additional Information"),
      ).not.toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    it("handles custom questions without options", () => {
      const questionWithoutOptions: CustomQuestion = {
        id: "simple",
        type: "select",
        label: "Simple Question",
        options: undefined,
      };

      render(
        <BookingForm
          {...defaultProps}
          customQuestions={[questionWithoutOptions]}
        />,
      );

      // Should still render but might not have options
      expect(screen.getByText("Simple Question")).toBeInTheDocument();
    });

    it("handles very long form inputs", async () => {
      const user = userEvent.setup();
      render(<BookingForm {...defaultProps} />);

      const longText = "A".repeat(1000);
      const notesInput = screen.getByLabelText(/notes/i);

      await user.type(notesInput, longText);

      expect(notesInput).toHaveValue(longText);
    });
  });
});
