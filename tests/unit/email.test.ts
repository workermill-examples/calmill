import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Tests for email sending service (src/lib/email.ts)
 *
 * These tests verify that:
 * - sendEmail() calls the Resend API with correct parameters
 * - Email is skipped gracefully when RESEND_API_KEY is not set
 * - Correct templates are rendered per booking action
 * - Email send errors are handled without crashing the caller
 * - FROM address uses the configured EMAIL_FROM env var
 */

// ─── MODULE MOCKS ─────────────────────────────────────────────────────────────

const mockSend = vi.fn();

// Mock Resend class — sendEmail creates `new Resend()` on each call
// Must use a regular function (not arrow) so it works as a constructor with 'new'
vi.mock("resend", () => ({
  Resend: vi.fn(function (this: Record<string, unknown>) {
    this.emails = { send: mockSend };
  }),
}));

// Static import — works because vi.mock("resend") is already hoisted
import { sendEmail } from "@/lib/email";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** A minimal React element for use as a template */
const mockTemplate = { type: "div", props: { children: "Email content" }, key: null };

// ─── TESTS ───────────────────────────────────────────────────────────────────

describe("sendEmail", () => {
  const savedEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({ data: { id: "email-id-default" }, error: null });
  });

  afterEach(() => {
    // Restore environment variables after each test
    process.env = savedEnv;
  });

  it("sends email via Resend when RESEND_API_KEY is configured", async () => {
    process.env.RESEND_API_KEY = "re_test_key_123";
    process.env.EMAIL_FROM = "CalMill <noreply@calmill.workermill.com>";

    await sendEmail({
      to: "recipient@example.com",
      subject: "Test Subject",
      template: mockTemplate as never,
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "recipient@example.com",
        subject: "Test Subject",
        from: "CalMill <noreply@calmill.workermill.com>",
      })
    );
  });

  it("skips sending when RESEND_API_KEY is not set", async () => {
    delete process.env.RESEND_API_KEY;

    // Should not throw
    await expect(
      sendEmail({
        to: "recipient@example.com",
        subject: "Test Subject",
        template: mockTemplate as never,
      })
    ).resolves.not.toThrow();

    // Resend send should NOT be called
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("uses default FROM address when EMAIL_FROM env is not set", async () => {
    process.env.RESEND_API_KEY = "re_test_key_123";
    delete process.env.EMAIL_FROM;

    await sendEmail({
      to: "user@example.com",
      subject: "Hello",
      template: mockTemplate as never,
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const callArg = mockSend.mock.calls[0]![0];
    // Should use a default CalMill address
    expect(callArg.from).toContain("calmill");
  });

  it("passes the React template element to Resend as the react property", async () => {
    process.env.RESEND_API_KEY = "re_test_api_key";
    process.env.EMAIL_FROM = "CalMill <noreply@calmill.workermill.com>";

    const bookingTemplate = { type: "BookingConfirmed", props: { name: "Jane" }, key: null };

    await sendEmail({
      to: "jane@example.com",
      subject: "Your booking is confirmed",
      template: bookingTemplate as never,
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        react: bookingTemplate,
      })
    );
  });

  it("does not throw when Resend API returns an error response", async () => {
    process.env.RESEND_API_KEY = "re_test_key_abc";

    mockSend.mockResolvedValue({
      data: null,
      error: { name: "validation_error", message: "Invalid email address" },
    });

    // sendEmail should handle the error gracefully (not throw)
    await expect(
      sendEmail({
        to: "bad-email",
        subject: "Test",
        template: mockTemplate as never,
      })
    ).resolves.not.toThrow();
  });

  it("does not throw when Resend throws a network error", async () => {
    process.env.RESEND_API_KEY = "re_test_key_xyz";

    mockSend.mockRejectedValue(new Error("Network error: connection refused"));

    // sendEmail should catch and swallow network errors
    await expect(
      sendEmail({
        to: "user@example.com",
        subject: "Test",
        template: mockTemplate as never,
      })
    ).resolves.not.toThrow();
  });

  it("sends to the correct recipient address", async () => {
    process.env.RESEND_API_KEY = "re_valid_key";
    process.env.EMAIL_FROM = "CalMill <noreply@calmill.workermill.com>";

    await sendEmail({
      to: "specific-user@domain.com",
      subject: "Specific email",
      template: mockTemplate as never,
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const callArg = mockSend.mock.calls[0]![0];
    expect(callArg.to).toBe("specific-user@domain.com");
  });
});

// ─── EMAIL TEMPLATE SELECTION ────────────────────────────────────────────────

describe("Email template selection for booking lifecycle events", () => {
  /**
   * These tests verify that the correct email template is used for each
   * booking action, as specified in the trigger points table in the ticket.
   *
   * The email templates are React components that accept typed props.
   * We verify they are callable and return a defined value.
   */

  it("BookingConfirmedEmail renders with required props", async () => {
    const { BookingConfirmedEmail } = await import("@/emails/booking-confirmed");

    const props = {
      hostName: "Alex Host",
      attendeeName: "Jane Doe",
      eventTypeTitle: "30 Minute Meeting",
      duration: 30,
      startTime: "Feb 20, 2026 at 2:00 PM",
      endTime: "Feb 20, 2026 at 2:30 PM",
      timezone: "America/New_York",
      location: "https://meet.google.com/abc",
      rescheduleUrl: "https://calmill.workermill.com/alex/30-min?reschedule=uid-abc",
      cancelUrl: "https://calmill.workermill.com/api/bookings/uid-abc/cancel",
    };

    // Should be callable without throwing
    expect(() => BookingConfirmedEmail(props)).not.toThrow();

    const rendered = BookingConfirmedEmail(props);
    expect(rendered).toBeDefined();
  });

  it("BookingNotificationEmail renders for host notification", async () => {
    const { BookingNotificationEmail } = await import("@/emails/booking-notification");

    const props = {
      hostName: "Alex Host",
      attendeeName: "Jane Doe",
      attendeeEmail: "jane@example.com",
      eventTypeTitle: "30 Minute Meeting",
      duration: 30,
      startTime: "Mar 10, 2026 at 3:00 PM",
      endTime: "Mar 10, 2026 at 3:30 PM",
      timezone: "UTC",
      notes: "Looking forward to connecting",
      bookingUrl: "https://calmill.workermill.com/bookings/uid-abc",
    };

    expect(() => BookingNotificationEmail(props)).not.toThrow();

    const rendered = BookingNotificationEmail(props);
    expect(rendered).toBeDefined();
  });

  it("BookingCancelledEmail renders with cancellation reason", async () => {
    const { BookingCancelledEmail } = await import("@/emails/booking-cancelled");

    const props = {
      recipientName: "Jane Doe",
      hostName: "Alex Host",
      attendeeName: "Jane Doe",
      isHost: false,
      eventTypeTitle: "30 Minute Meeting",
      startTime: "Mar 10, 2026 at 3:00 PM",
      endTime: "Mar 10, 2026 at 3:30 PM",
      timezone: "America/New_York",
      cancellationReason: "Scheduling conflict",
      rebookUrl: "https://calmill.workermill.com/alex/30-min",
    };

    expect(() => BookingCancelledEmail(props)).not.toThrow();

    const rendered = BookingCancelledEmail(props);
    expect(rendered).toBeDefined();
  });

  it("BookingReminderEmail renders with time until meeting", async () => {
    const { BookingReminderEmail } = await import("@/emails/booking-reminder");

    const props = {
      recipientName: "Jane Doe",
      hostName: "Alex Host",
      attendeeName: "Jane Doe",
      isHost: false,
      eventTypeTitle: "30 Minute Meeting",
      duration: 30,
      timeUntil: "1 hour",
      startTime: "Mar 10, 2026 at 3:00 PM",
      endTime: "Mar 10, 2026 at 3:30 PM",
      timezone: "UTC",
      location: "https://meet.google.com/abc",
      rescheduleUrl: "https://calmill.workermill.com/alex/30-min?reschedule=uid-abc",
      cancelUrl: "https://calmill.workermill.com/api/bookings/uid-abc/cancel",
    };

    expect(() => BookingReminderEmail(props)).not.toThrow();

    const rendered = BookingReminderEmail(props);
    expect(rendered).toBeDefined();
  });
});
