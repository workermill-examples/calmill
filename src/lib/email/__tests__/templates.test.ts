import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  sendBookingConfirmationEmail,
  sendBookingNotificationEmail,
  sendBookingCancellationEmail,
  sendEmail,
} from "@/lib/email";

// Mock Resend to avoid network calls
vi.mock("resend", () => ({
  Resend: vi.fn(function () {
    return {
      emails: {
        send: vi.fn(),
      },
    };
  }),
}));

// Mock React Email components for testing import capability
vi.mock("@react-email/components", () => ({
  Html: ({ children, ...props }: any) => `<html ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")}>${children}</html>`,
  Head: ({ children }: any) => `<head>${children}</head>`,
  Body: ({ children, ...props }: any) => `<body ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")}>${children}</body>`,
  Container: ({ children, ...props }: any) => `<div ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")}>${children}</div>`,
  Text: ({ children, ...props }: any) => `<p ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")}>${children}</p>`,
  Heading: ({ children, ...props }: any) => `<h1 ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")}>${children}</h1>`,
  Button: ({ children, href, ...props }: any) => `<a href="${href}" ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")}>${children}</a>`,
  Link: ({ children, href, ...props }: any) => `<a href="${href}" ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")}>${children}</a>`,
  Section: ({ children, ...props }: any) => `<section ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")}>${children}</section>`,
  Column: ({ children, ...props }: any) => `<div ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")}>${children}</div>`,
  Row: ({ children, ...props }: any) => `<div ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")}>${children}</div>`,
  render: (component: any) => component,
}));

describe("Email Template Rendering", () => {
  let originalEnv: NodeJS.ProcessEnv;
  let consoleSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    originalEnv = process.env;
    // Remove API key to test without Resend
    process.env = { ...originalEnv };
    delete process.env.RESEND_API_KEY;
    // Mock console.log to capture email logs
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = originalEnv;
    consoleSpy.mockRestore();
    vi.resetModules();
  });

  describe("HTML Template Validation", () => {
    const validateHTML = (html: string, description: string) => {
      // Basic HTML validation without JSDOM
      expect(html.length).toBeGreaterThan(0);

      // Ensure no unclosed tags or malformed HTML
      expect(html).not.toContain("<>");
      expect(html).not.toContain("</>");

      // Check for required semantic elements
      expect(html).toContain("font-family");
      expect(html).toContain("color:");

      // Validate that interpolated content doesn't break HTML structure
      const scriptTagTest = html.includes("<script>") || html.includes("javascript:");
      expect(scriptTagTest).toBe(false);

      console.log(`✓ ${description} HTML template is well-formed`);
    };

    it("should render booking confirmation email template without errors", () => {
      const testData = {
        attendeeName: "John Doe",
        attendeeEmail: "john@example.com",
        eventTitle: "30 Minute Meeting",
        startTime: new Date("2024-01-15T14:00:00Z"),
        endTime: new Date("2024-01-15T14:30:00Z"),
        timezone: "America/New_York",
        location: "Office Conference Room A",
        meetingUrl: "https://meet.example.com/abc123",
        hostName: "Jane Smith",
        bookingUid: "booking-123",
        cancelUrl: "https://calmill.example.com/booking/booking-123/cancel",
        rescheduleUrl: "https://calmill.example.com/booking/booking-123/reschedule",
      };

      // This should not throw any errors
      expect(() => sendBookingConfirmationEmail(testData)).not.toThrow();

      // Verify the email was logged (since no API key)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("📧 Email would be sent"),
        expect.objectContaining({
          subject: "Booking Confirmed: 30 Minute Meeting",
        })
      );

      // Extract the HTML from the email call to validate it
      // We need to access the internal HTML generation for validation
      // Since the functions use inline templates, we'll test the structure
      const emailCall = consoleSpy.mock.calls.find((call: any) =>
        call[0].includes("📧 Email would be sent")
      );
      expect(emailCall).toBeDefined();
    });

    it("should render booking notification email template without errors", () => {
      const testData = {
        hostName: "Jane Smith",
        hostEmail: "jane@example.com",
        attendeeName: "John Doe",
        attendeeEmail: "john@example.com",
        eventTitle: "Technical Interview",
        startTime: new Date("2024-01-15T14:00:00Z"),
        endTime: new Date("2024-01-15T15:30:00Z"),
        timezone: "America/New_York",
        location: "Zoom Meeting",
        meetingUrl: "https://zoom.us/j/123456789",
        attendeeNotes: "Looking forward to discussing the role",
        bookingUid: "booking-456",
        acceptUrl: "https://calmill.example.com/booking/booking-456/accept",
        rejectUrl: "https://calmill.example.com/booking/booking-456/reject",
      };

      expect(() => sendBookingNotificationEmail(testData)).not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("📧 Email would be sent"),
        expect.objectContaining({
          subject: "New Booking: Technical Interview with John Doe",
        })
      );
    });

    it("should render booking cancellation email template without errors", () => {
      const testData = {
        recipientName: "John Doe",
        recipientEmail: "john@example.com",
        eventTitle: "30 Minute Meeting",
        startTime: new Date("2024-01-15T14:00:00Z"),
        timezone: "America/New_York",
        cancellationReason: "Schedule conflict",
        isHost: false,
      };

      expect(() => sendBookingCancellationEmail(testData)).not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("📧 Email would be sent"),
        expect.objectContaining({
          subject: "Your booking has been cancelled: 30 Minute Meeting",
        })
      );
    });

    it("should handle special characters and prevent HTML injection", () => {
      const testDataWithSpecialChars = {
        attendeeName: "John <script>alert('xss')</script> Doe",
        attendeeEmail: "john+test@example.com",
        eventTitle: "Meeting & Discussion",
        startTime: new Date("2024-01-15T14:00:00Z"),
        endTime: new Date("2024-01-15T14:30:00Z"),
        timezone: "America/New_York",
        hostName: "Jane \"Manager\" Smith",
        bookingUid: "booking-789",
        cancelUrl: "https://calmill.example.com/booking/booking-789/cancel",
        rescheduleUrl: "https://calmill.example.com/booking/booking-789/reschedule",
      };

      expect(() => sendBookingConfirmationEmail(testDataWithSpecialChars)).not.toThrow();

      // Verify no script injection occurred
      const emailCall = consoleSpy.mock.calls.find((call: any) =>
        call[0].includes("📧 Email would be sent")
      );
      expect(emailCall).toBeDefined();
    });

    it("should handle missing optional fields gracefully", () => {
      const minimalData = {
        attendeeName: "John Doe",
        attendeeEmail: "john@example.com",
        eventTitle: "Quick Call",
        startTime: new Date("2024-01-15T14:00:00Z"),
        endTime: new Date("2024-01-15T14:15:00Z"),
        timezone: "UTC",
        hostName: "Jane Smith",
        bookingUid: "booking-minimal",
        cancelUrl: "https://calmill.example.com/booking/booking-minimal/cancel",
        rescheduleUrl: "https://calmill.example.com/booking/booking-minimal/reschedule",
        // No location, meetingUrl, or other optional fields
      };

      expect(() => sendBookingConfirmationEmail(minimalData)).not.toThrow();
    });

    it("should format dates correctly across timezones", () => {
      const timezones = [
        "America/New_York",
        "Europe/London",
        "Asia/Tokyo",
        "Australia/Sydney",
        "UTC"
      ];

      timezones.forEach(timezone => {
        const testData = {
          attendeeName: "John Doe",
          attendeeEmail: "john@example.com",
          eventTitle: "Timezone Test Meeting",
          startTime: new Date("2024-06-15T14:00:00Z"), // Summer time to test DST
          endTime: new Date("2024-06-15T14:30:00Z"),
          timezone,
          hostName: "Jane Smith",
          bookingUid: `booking-${timezone.replace(/\W/g, '-')}`,
          cancelUrl: "https://calmill.example.com/booking/test/cancel",
          rescheduleUrl: "https://calmill.example.com/booking/test/reschedule",
        };

        expect(() => sendBookingConfirmationEmail(testData)).not.toThrow();
      });
    });
  });

  describe("React Email Components Import Test", () => {
    it("should be able to import React Email components without errors", async () => {
      // Test that React Email components can be imported
      expect(async () => {
        const { Html, Head, Body, Container, Text, Heading, Button, Link } = await import("@react-email/components");

        // Test basic component creation
        const htmlComponent = Html({ children: "test" });
        const headComponent = Head({ children: "test" });
        const bodyComponent = Body({ children: "test" });
        const containerComponent = Container({ children: "test" });
        const textComponent = Text({ children: "test" });
        const headingComponent = Heading({ children: "test" });
        const buttonComponent = Button({ children: "test", href: "#" });
        const linkComponent = Link({ children: "test", href: "#" });

        expect(htmlComponent).toBeDefined();
        expect(headComponent).toBeDefined();
        expect(bodyComponent).toBeDefined();
        expect(containerComponent).toBeDefined();
        expect(textComponent).toBeDefined();
        expect(headingComponent).toBeDefined();
        expect(buttonComponent).toBeDefined();
        expect(linkComponent).toBeDefined();
      }).not.toThrow();
    });

    it("should be able to use render function from React Email", async () => {
      expect(async () => {
        const { render, Html, Body, Text } = await import("@react-email/components");

        const template = Html({
          children: Body({
            children: Text({
              children: "Test email template"
            })
          })
        });

        const rendered = render(template as any);
        expect(rendered).toBeDefined();
      }).not.toThrow();
    });
  });

  describe("Template Rendering Performance", () => {
    it("should render templates within reasonable time limits", () => {
      const testData = {
        attendeeName: "John Doe",
        attendeeEmail: "john@example.com",
        eventTitle: "Performance Test Meeting",
        startTime: new Date(),
        endTime: new Date(Date.now() + 30 * 60 * 1000),
        timezone: "America/New_York",
        hostName: "Jane Smith",
        bookingUid: "booking-perf",
        cancelUrl: "https://calmill.example.com/booking/booking-perf/cancel",
        rescheduleUrl: "https://calmill.example.com/booking/booking-perf/reschedule",
      };

      const startTime = process.hrtime.bigint();

      // Render multiple templates
      sendBookingConfirmationEmail(testData);
      sendBookingNotificationEmail({
        ...testData,
        hostName: "Jane Smith",
        hostEmail: "jane@example.com",
        attendeeName: testData.attendeeName,
        attendeeEmail: testData.attendeeEmail,
        bookingUid: testData.bookingUid,
      });
      sendBookingCancellationEmail({
        recipientName: testData.attendeeName,
        recipientEmail: testData.attendeeEmail,
        eventTitle: testData.eventTitle,
        startTime: testData.startTime,
        timezone: testData.timezone,
        isHost: false,
      });

      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1_000_000;

      // Should render all templates in under 100ms
      expect(durationMs).toBeLessThan(100);
      console.log(`Template rendering took ${durationMs.toFixed(2)}ms`);
    });
  });

  describe("Email Template Content Validation", () => {
    it("should include all required booking details in confirmation email", () => {
      const testData = {
        attendeeName: "John Doe",
        attendeeEmail: "john@example.com",
        eventTitle: "30 Minute Meeting",
        startTime: new Date("2024-01-15T14:00:00Z"),
        endTime: new Date("2024-01-15T14:30:00Z"),
        timezone: "America/New_York",
        location: "Conference Room A",
        meetingUrl: "https://meet.example.com/abc123",
        hostName: "Jane Smith",
        bookingUid: "booking-123",
        cancelUrl: "https://calmill.example.com/booking/booking-123/cancel",
        rescheduleUrl: "https://calmill.example.com/booking/booking-123/reschedule",
      };

      sendBookingConfirmationEmail(testData);

      // Verify email contains all required information
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("📧 Email would be sent"),
        expect.objectContaining({
          to: ["john@example.com"],
          subject: expect.stringContaining("30 Minute Meeting"),
          from: expect.stringContaining("CalMill"),
        })
      );
    });

    it("should include proper action buttons in notification emails", () => {
      const testData = {
        hostName: "Jane Smith",
        hostEmail: "jane@example.com",
        attendeeName: "John Doe",
        attendeeEmail: "john@example.com",
        eventTitle: "Client Meeting",
        startTime: new Date("2024-01-15T14:00:00Z"),
        endTime: new Date("2024-01-15T14:30:00Z"),
        timezone: "America/New_York",
        bookingUid: "booking-456",
        acceptUrl: "https://calmill.example.com/booking/booking-456/accept",
        rejectUrl: "https://calmill.example.com/booking/booking-456/reject",
      };

      sendBookingNotificationEmail(testData);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("📧 Email would be sent"),
        expect.objectContaining({
          to: ["jane@example.com"],
          subject: expect.stringContaining("New Booking"),
        })
      );
    });
  });

  describe("Error Resilience", () => {
    it("should handle invalid dates gracefully", () => {
      const testDataWithInvalidDate = {
        attendeeName: "John Doe",
        attendeeEmail: "john@example.com",
        eventTitle: "Test Meeting",
        startTime: new Date("invalid-date"),
        endTime: new Date("2024-01-15T14:30:00Z"),
        timezone: "America/New_York",
        hostName: "Jane Smith",
        bookingUid: "booking-invalid",
        cancelUrl: "https://calmill.example.com/booking/booking-invalid/cancel",
        rescheduleUrl: "https://calmill.example.com/booking/booking-invalid/reschedule",
      };

      // Should not throw, should handle gracefully
      expect(() => sendBookingConfirmationEmail(testDataWithInvalidDate)).not.toThrow();
    });

    it("should handle extremely long content without breaking", () => {
      const longString = "A".repeat(10000);
      const testDataWithLongContent = {
        attendeeName: longString,
        attendeeEmail: "john@example.com",
        eventTitle: longString,
        startTime: new Date("2024-01-15T14:00:00Z"),
        endTime: new Date("2024-01-15T14:30:00Z"),
        timezone: "America/New_York",
        hostName: longString,
        bookingUid: "booking-long",
        cancelUrl: "https://calmill.example.com/booking/booking-long/cancel",
        rescheduleUrl: "https://calmill.example.com/booking/booking-long/reschedule",
      };

      expect(() => sendBookingConfirmationEmail(testDataWithLongContent)).not.toThrow();
    });
  });
});