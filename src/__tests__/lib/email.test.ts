import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { EmailOptions } from "@/lib/email";

// Mock Resend
const mockSend = vi.fn();

vi.mock("resend", () => ({
  Resend: vi.fn(function () {
    return {
      emails: {
        send: mockSend,
      },
    };
  }),
}));

describe("Email Library", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    vi.clearAllMocks();
    originalEnv = process.env;
    // Reset modules to ensure clean state
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = originalEnv;
    vi.resetModules();
  });

  describe("sendEmail without API key", () => {
    beforeEach(() => {
      // Remove API key to test graceful degradation
      process.env = { ...originalEnv };
      delete process.env.RESEND_API_KEY;
    });

    it("should gracefully degrade when no RESEND_API_KEY is set", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const { sendEmail } = await import("@/lib/email");

      const options: EmailOptions = {
        to: { email: "test@example.com", name: "Test User" },
        subject: "Test Email",
        html: "<p>Test content</p>",
      };

      const result = await sendEmail(options);

      expect(result.success).toBe(true);
      expect(result.messageId).toMatch(/^mock-\d+$/);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("📧 Email would be sent"),
        expect.objectContaining({
          to: ["test@example.com"],
          subject: "Test Email",
        }),
      );

      consoleSpy.mockRestore();
    });

    it("should use default from address when none provided", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const { sendEmail } = await import("@/lib/email");

      const options: EmailOptions = {
        to: { email: "test@example.com" },
        subject: "Test Email",
        html: "<p>Test</p>",
      };

      await sendEmail(options);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          from: "CalMill <noreply@calmill.workermill.com>",
        }),
      );

      consoleSpy.mockRestore();
    });
  });

  describe("sendEmail with API key", () => {
    beforeEach(() => {
      // Set API key for these tests
      process.env = { ...originalEnv, RESEND_API_KEY: "test-api-key" };
    });

    it("should send email successfully via Resend", async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: "email-123" },
        error: null,
      });

      const { sendEmail } = await import("@/lib/email");

      const options: EmailOptions = {
        to: { email: "test@example.com", name: "Test User" },
        subject: "Test Email",
        html: "<p>Test content</p>",
        text: "Test content",
      };

      const result = await sendEmail(options);

      expect(mockSend).toHaveBeenCalledWith({
        from: "CalMill <noreply@calmill.workermill.com>",
        to: ["Test User <test@example.com>"],
        subject: "Test Email",
        html: "<p>Test content</p>",
        text: "Test content",
      });

      expect(result).toEqual({
        success: true,
        messageId: "email-123",
      });
    });

    it("should format multiple recipients correctly", async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: "email-123" },
        error: null,
      });

      const { sendEmail } = await import("@/lib/email");

      const options: EmailOptions = {
        to: [
          { email: "user1@example.com", name: "User One" },
          { email: "user2@example.com" }, // No name
        ],
        cc: [{ email: "cc@example.com", name: "CC User" }],
        bcc: [{ email: "bcc@example.com" }],
        subject: "Test Email",
        html: "<p>Test</p>",
      };

      await sendEmail(options);

      expect(mockSend).toHaveBeenCalledWith({
        from: "CalMill <noreply@calmill.workermill.com>",
        to: ["User One <user1@example.com>", "user2@example.com"],
        cc: ["CC User <cc@example.com>"],
        bcc: ["bcc@example.com"],
        subject: "Test Email",
        html: "<p>Test</p>",
      });
    });

    it("should handle attachments", async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: "email-123" },
        error: null,
      });

      const { sendEmail } = await import("@/lib/email");

      const options: EmailOptions = {
        to: { email: "test@example.com" },
        subject: "Email with attachment",
        html: "<p>See attachment</p>",
        attachments: [
          {
            filename: "invoice.pdf",
            content: Buffer.from("PDF content"),
            contentType: "application/pdf",
          },
        ],
      };

      await sendEmail(options);

      expect(mockSend).toHaveBeenCalledWith({
        from: "CalMill <noreply@calmill.workermill.com>",
        to: ["test@example.com"],
        subject: "Email with attachment",
        html: "<p>See attachment</p>",
        attachments: [
          {
            filename: "invoice.pdf",
            content: Buffer.from("PDF content"),
            type: "application/pdf",
          },
        ],
      });
    });

    it("should handle Resend API errors", async () => {
      mockSend.mockResolvedValueOnce({
        data: null,
        error: { message: "Invalid API key" },
      });

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { sendEmail } = await import("@/lib/email");

      const options: EmailOptions = {
        to: { email: "test@example.com" },
        subject: "Test Email",
        html: "<p>Test</p>",
      };

      const result = await sendEmail(options);

      expect(result).toEqual({
        success: false,
        error: "Invalid API key",
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith("Resend API error:", {
        message: "Invalid API key",
      });

      consoleErrorSpy.mockRestore();
    });

    it("should handle network errors", async () => {
      mockSend.mockRejectedValueOnce(new Error("Network error"));

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { sendEmail } = await import("@/lib/email");

      const options: EmailOptions = {
        to: { email: "test@example.com" },
        subject: "Test Email",
        html: "<p>Test</p>",
      };

      const result = await sendEmail(options);

      expect(result).toEqual({
        success: false,
        error: "Network error",
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Email sending error:",
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });

    it("should use custom from address when provided", async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: "email-123" },
        error: null,
      });

      const { sendEmail } = await import("@/lib/email");

      const options: EmailOptions = {
        to: { email: "test@example.com" },
        subject: "Test Email",
        html: "<p>Test</p>",
        from: "Custom Sender <custom@example.com>",
      };

      await sendEmail(options);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "Custom Sender <custom@example.com>",
        }),
      );
    });

    it("should use EMAIL_FROM environment variable when available", async () => {
      process.env.EMAIL_FROM = "Environment <env@example.com>";

      mockSend.mockResolvedValueOnce({
        data: { id: "email-123" },
        error: null,
      });

      const { sendEmail } = await import("@/lib/email");

      const options: EmailOptions = {
        to: { email: "test@example.com" },
        subject: "Test Email",
        html: "<p>Test</p>",
      };

      await sendEmail(options);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "Environment <env@example.com>",
        }),
      );
    });
  });

  describe("sendEmailAsync", () => {
    it("should be fire-and-forget", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { sendEmailAsync } = await import("@/lib/email");

      const options: EmailOptions = {
        to: { email: "test@example.com" },
        subject: "Async Email",
        html: "<p>Test</p>",
      };

      // Should not wait for completion
      const startTime = Date.now();
      sendEmailAsync(options);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(10); // Should return immediately

      consoleErrorSpy.mockRestore();
    });
  });

  describe("sendBookingConfirmationEmail", () => {
    it("should format booking confirmation email correctly", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const { sendBookingConfirmationEmail } = await import("@/lib/email");

      const data = {
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
        rescheduleUrl:
          "https://calmill.example.com/booking/booking-123/reschedule",
      };

      sendBookingConfirmationEmail(data);

      // Since no API key is set, it should log the email attempt
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("📧 Email would be sent"),
        expect.objectContaining({
          to: ["john@example.com"],
          subject: "Booking Confirmed: 30 Minute Meeting",
          from: "CalMill <noreply@calmill.workermill.com>",
        }),
      );

      consoleSpy.mockRestore();
    });
  });
});
