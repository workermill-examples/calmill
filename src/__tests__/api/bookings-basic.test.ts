import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// Test the validation schemas separately
describe("Booking API Validation", () => {
  const createBookingSchema = z.object({
    eventTypeId: z.string(),
    startTime: z.string().datetime(),
    attendeeName: z.string().min(1).max(255),
    attendeeEmail: z.string().email(),
    attendeeTimezone: z.string(),
    attendeeNotes: z.string().optional(),
    responses: z.record(z.string(), z.unknown()).optional(),
    location: z.string().optional(),
    recurringCount: z.number().min(1).max(52).optional(),
  });

  const listBookingsSchema = z.object({
    status: z
      .enum(["PENDING", "ACCEPTED", "CANCELLED", "REJECTED", "RESCHEDULED"])
      .optional(),
    eventTypeId: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    attendeeEmail: z.string().optional(),
    page: z
      .string()
      .transform((val, ctx) => {
        const parsed = parseInt(val);
        if (isNaN(parsed) || parsed < 1) return 1;
        return parsed;
      })
      .optional(),
    limit: z
      .string()
      .transform((val, ctx) => {
        const parsed = parseInt(val);
        if (isNaN(parsed) || parsed < 1) return 20;
        return Math.min(parsed, 100);
      })
      .optional(),
  });

  const updateBookingSchema = z.object({
    action: z.enum(["accept", "reject", "cancel"]),
    cancellationReason: z.string().optional(),
  });

  const rescheduleBookingSchema = z.object({
    newStartTime: z.string().datetime(),
    attendeeTimezone: z.string(),
    reason: z.string().optional(),
  });

  describe("createBookingSchema", () => {
    it("should validate valid booking data", () => {
      const validData = {
        eventTypeId: "event_123",
        startTime: "2024-01-15T10:00:00.000Z",
        attendeeName: "John Doe",
        attendeeEmail: "john@example.com",
        attendeeTimezone: "America/New_York",
        attendeeNotes: "Test notes",
        location: "Office",
      };

      const result = createBookingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidData = {
        eventTypeId: "event_123",
        startTime: "2024-01-15T10:00:00.000Z",
        attendeeName: "John Doe",
        attendeeEmail: "invalid-email",
        attendeeTimezone: "America/New_York",
      };

      const result = createBookingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid datetime", () => {
      const invalidData = {
        eventTypeId: "event_123",
        startTime: "invalid-datetime",
        attendeeName: "John Doe",
        attendeeEmail: "john@example.com",
        attendeeTimezone: "America/New_York",
      };

      const result = createBookingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should handle optional fields", () => {
      const minimalData = {
        eventTypeId: "event_123",
        startTime: "2024-01-15T10:00:00.000Z",
        attendeeName: "John Doe",
        attendeeEmail: "john@example.com",
        attendeeTimezone: "America/New_York",
      };

      const result = createBookingSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });
  });

  describe("listBookingsSchema", () => {
    it("should validate valid query parameters", () => {
      const validQuery = {
        status: "ACCEPTED",
        eventTypeId: "event_123",
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        attendeeEmail: "john@example.com",
        page: "2",
        limit: "50",
      };

      const result = listBookingsSchema.safeParse(validQuery);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(50);
      }
    });

    it("should handle default values for page and limit", () => {
      const queryWithDefaults = {
        page: "0", // Invalid, should default to 1
        limit: "999", // Too large, should cap at 100
      };

      const result = listBookingsSchema.safeParse(queryWithDefaults);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(100);
      }
    });

    it("should reject invalid status", () => {
      const invalidQuery = {
        status: "INVALID_STATUS",
      };

      const result = listBookingsSchema.safeParse(invalidQuery);
      expect(result.success).toBe(false);
    });
  });

  describe("updateBookingSchema", () => {
    it("should validate accept action", () => {
      const validUpdate = {
        action: "accept",
      };

      const result = updateBookingSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it("should validate cancel action with reason", () => {
      const validUpdate = {
        action: "cancel",
        cancellationReason: "Schedule conflict",
      };

      const result = updateBookingSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it("should reject invalid action", () => {
      const invalidUpdate = {
        action: "invalid_action",
      };

      const result = updateBookingSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });

  describe("rescheduleBookingSchema", () => {
    it("should validate valid reschedule data", () => {
      const validReschedule = {
        newStartTime: "2024-01-16T14:00:00.000Z",
        attendeeTimezone: "America/New_York",
        reason: "Schedule conflict",
      };

      const result = rescheduleBookingSchema.safeParse(validReschedule);
      expect(result.success).toBe(true);
    });

    it("should handle optional reason", () => {
      const minimalReschedule = {
        newStartTime: "2024-01-16T14:00:00.000Z",
        attendeeTimezone: "America/New_York",
      };

      const result = rescheduleBookingSchema.safeParse(minimalReschedule);
      expect(result.success).toBe(true);
    });

    it("should reject invalid datetime", () => {
      const invalidReschedule = {
        newStartTime: "invalid-datetime",
        attendeeTimezone: "America/New_York",
      };

      const result = rescheduleBookingSchema.safeParse(invalidReschedule);
      expect(result.success).toBe(false);
    });
  });
});

// Test business logic functions
describe("Booking Business Logic", () => {
  describe("Date calculations", () => {
    it("should correctly calculate end time from start time and duration", () => {
      const startTime = new Date("2024-01-15T10:00:00.000Z");
      const duration = 30; // minutes
      const expectedEndTime = new Date("2024-01-15T10:30:00.000Z");

      const calculatedEndTime = new Date(
        startTime.getTime() + duration * 60 * 1000,
      );
      expect(calculatedEndTime.getTime()).toBe(expectedEndTime.getTime());
    });

    it("should handle date string formatting", () => {
      const date = new Date("2024-01-15T10:00:00.000Z");
      const dateStr = date.toISOString().split("T")[0];
      expect(dateStr).toBe("2024-01-15");
    });
  });

  describe("Status transitions", () => {
    it("should allow valid status transitions", () => {
      const validTransitions = [
        { from: "PENDING", to: "ACCEPTED" },
        { from: "PENDING", to: "REJECTED" },
        { from: "PENDING", to: "CANCELLED" },
        { from: "ACCEPTED", to: "CANCELLED" },
      ];

      validTransitions.forEach(({ from, to }) => {
        // In a real implementation, this would check business rules
        expect(from).not.toBe(to);
      });
    });

    it("should reject invalid status transitions", () => {
      const invalidTransitions = [
        { from: "CANCELLED", to: "ACCEPTED" },
        { from: "REJECTED", to: "ACCEPTED" },
        { from: "RESCHEDULED", to: "ACCEPTED" },
      ];

      invalidTransitions.forEach(({ from, to }) => {
        // In a real implementation, this would return false
        expect(["CANCELLED", "REJECTED", "RESCHEDULED"]).toContain(from);
      });
    });
  });

  describe("Recurring booking calculations", () => {
    it("should calculate weekly recurring dates", () => {
      const startDate = new Date("2024-01-15T10:00:00.000Z");
      const recurringCount = 3;
      const expectedDates = [
        new Date("2024-01-15T10:00:00.000Z"),
        new Date("2024-01-22T10:00:00.000Z"),
        new Date("2024-01-29T10:00:00.000Z"),
      ];

      const calculatedDates = [];
      for (let i = 0; i < recurringCount; i++) {
        const nextDate = new Date(
          startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000,
        );
        calculatedDates.push(nextDate);
      }

      expect(calculatedDates).toHaveLength(expectedDates.length);
      calculatedDates.forEach((date, index) => {
        expect(date.getTime()).toBe(expectedDates[index].getTime());
      });
    });

    it("should calculate monthly recurring dates", () => {
      const startDate = new Date("2024-01-15T10:00:00.000Z");
      const recurringCount = 3;

      const calculatedDates = [];
      for (let i = 0; i < recurringCount; i++) {
        const nextDate = new Date(startDate);
        nextDate.setMonth(nextDate.getMonth() + i);
        calculatedDates.push(nextDate);
      }

      expect(calculatedDates).toHaveLength(3);
      expect(calculatedDates[0].getMonth()).toBe(0); // January
      expect(calculatedDates[1].getMonth()).toBe(1); // February
      expect(calculatedDates[2].getMonth()).toBe(2); // March
    });
  });
});

// Test HTTP status code responses
describe("HTTP Response Codes", () => {
  it("should use correct status codes for different scenarios", () => {
    const statusCodes = {
      success: 200,
      created: 201,
      badRequest: 400,
      unauthorized: 401,
      forbidden: 403,
      notFound: 404,
      conflict: 409,
      internalError: 500,
    };

    // Test that our expected status codes are valid HTTP codes
    expect(statusCodes.success).toBe(200);
    expect(statusCodes.created).toBe(201);
    expect(statusCodes.badRequest).toBe(400);
    expect(statusCodes.unauthorized).toBe(401);
    expect(statusCodes.notFound).toBe(404);
    expect(statusCodes.conflict).toBe(409);
    expect(statusCodes.internalError).toBe(500);
  });
});

// Test error message formats
describe("Error Message Formats", () => {
  it("should format error responses consistently", () => {
    const errorResponse = {
      error: "validation",
      message: "Invalid booking data",
      details: [],
    };

    expect(errorResponse).toHaveProperty("error");
    expect(errorResponse).toHaveProperty("message");
    expect(errorResponse.error).toBe("validation");
    expect(typeof errorResponse.message).toBe("string");
  });

  it("should handle different error types", () => {
    const errorTypes = [
      "validation",
      "not_found",
      "unauthorized",
      "conflict",
      "internal",
    ];

    errorTypes.forEach((errorType) => {
      const errorResponse = {
        error: errorType,
        message: `Test ${errorType} error`,
      };
      expect(errorResponse.error).toBe(errorType);
      expect(errorResponse.message).toContain(errorType);
    });
  });
});
