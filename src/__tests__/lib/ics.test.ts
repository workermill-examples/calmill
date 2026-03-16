import { describe, it, expect } from "vitest";
import {
  generateICS,
  generateMultiEventICS,
  createBookingICS,
  createICSFilename,
  getICSMimeType,
  createICSHeaders,
  type ICSEvent,
} from "@/lib/ics";

describe("ICS Library", () => {
  const sampleEvent: ICSEvent = {
    uid: "test-event-123",
    title: "Test Meeting",
    description: "A test meeting for unit tests",
    startTime: new Date("2024-01-15T14:00:00Z"),
    endTime: new Date("2024-01-15T15:00:00Z"),
    location: "Conference Room A",
    organizer: {
      name: "Jane Organizer",
      email: "jane@example.com",
    },
    attendees: [
      {
        name: "John Attendee",
        email: "john@example.com",
      },
    ],
    url: "https://meet.example.com/test-123",
    status: "CONFIRMED",
    sequence: 0,
  };

  describe("generateICS", () => {
    it("should generate valid ICS format for basic event", () => {
      const basicEvent: ICSEvent = {
        uid: "basic-123",
        title: "Basic Meeting",
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
      };

      const ics = generateICS(basicEvent);

      // Check ICS structure
      expect(ics).toContain("BEGIN:VCALENDAR");
      expect(ics).toContain("END:VCALENDAR");
      expect(ics).toContain("BEGIN:VEVENT");
      expect(ics).toContain("END:VEVENT");
      expect(ics).toContain("VERSION:2.0");
      expect(ics).toContain("PRODID:-//CalMill//CalMill Calendar//EN");

      // Check event details
      expect(ics).toContain("UID:basic-123@calmill.workermill.com");
      expect(ics).toContain("SUMMARY:Basic Meeting");
      expect(ics).toContain("DTSTART:20240115T100000Z");
      expect(ics).toContain("DTEND:20240115T110000Z");
      expect(ics).toContain("STATUS:CONFIRMED");

      // Should have DTSTAMP (current time)
      expect(ics).toContain("DTSTAMP:");

      // Lines should end with CRLF
      expect(ics.split("\r\n").length).toBeGreaterThan(5);
    });

    it("should include all optional fields when provided", () => {
      const ics = generateICS(sampleEvent);

      expect(ics).toContain("UID:test-event-123@calmill.workermill.com");
      expect(ics).toContain("SUMMARY:Test Meeting");
      expect(ics).toContain("DESCRIPTION:A test meeting for unit tests");
      expect(ics).toContain("LOCATION:Conference Room A");
      expect(ics).toContain(
        "ORGANIZER;CN=Jane Organizer:mailto:jane@example.com",
      );
      expect(ics).toContain(
        "ATTENDEE;CN=John Attendee;ROLE=REQ-PARTICIPANT:mailto:john@example.com",
      );
      expect(ics).toContain("URL:https://meet.example.com/test-123");
      expect(ics).toContain("STATUS:CONFIRMED");
      expect(ics).toContain("SEQUENCE:0");
    });

    it("should escape special characters in text fields", () => {
      const eventWithSpecialChars: ICSEvent = {
        uid: "special-chars",
        title: "Meeting with; commas, and \\backslashes\nand newlines",
        description: "Description with; special, chars\\and\nnewlines",
        location: "Room; 123, Building\\A\nFloor 2",
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
        organizer: {
          name: "User; with, special\\chars\ninname",
          email: "user@example.com",
        },
      };

      const ics = generateICS(eventWithSpecialChars);

      // Check that special characters are escaped
      expect(ics).toContain(
        "SUMMARY:Meeting with\\; commas\\, and \\\\backslashes\\nand newlines",
      );
      expect(ics).toContain(
        "DESCRIPTION:Description with\\; special\\, chars\\\\and\\nnewlines",
      );
      expect(ics).toContain("LOCATION:Room\\; 123\\, Building\\\\A\\nFloor 2");
      expect(ics).toContain(
        "ORGANIZER;CN=User\\; with\\, special\\\\chars\\ninname:mailto:user@example.com",
      );
    });

    it("should handle multiple attendees", () => {
      const eventWithMultipleAttendees: ICSEvent = {
        uid: "multi-attendees",
        title: "Team Meeting",
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
        attendees: [
          { name: "Alice", email: "alice@example.com" },
          { name: "Bob", email: "bob@example.com" },
          { name: "Charlie", email: "charlie@example.com" },
        ],
      };

      const ics = generateICS(eventWithMultipleAttendees);

      expect(ics).toContain(
        "ATTENDEE;CN=Alice;ROLE=REQ-PARTICIPANT:mailto:alice@example.com",
      );
      expect(ics).toContain(
        "ATTENDEE;CN=Bob;ROLE=REQ-PARTICIPANT:mailto:bob@example.com",
      );
      expect(ics).toContain(
        "ATTENDEE;CN=Charlie;ROLE=REQ-PARTICIPANT:mailto:charlie@example.com",
      );
    });

    it("should format dates correctly in UTC", () => {
      const event: ICSEvent = {
        uid: "date-test",
        title: "Date Test",
        startTime: new Date("2024-12-25T23:59:59Z"), // New Year's Eve
        endTime: new Date("2024-12-26T00:59:59Z"), // New Year's Day
      };

      const ics = generateICS(event);

      expect(ics).toContain("DTSTART:20241225T235959Z");
      expect(ics).toContain("DTEND:20241226T005959Z");
    });

    it("should set default status when not provided", () => {
      const eventWithoutStatus: ICSEvent = {
        uid: "no-status",
        title: "No Status Event",
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
      };

      const ics = generateICS(eventWithoutStatus);

      expect(ics).toContain("STATUS:CONFIRMED");
    });

    it("should handle different status values", () => {
      const statuses: Array<ICSEvent["status"]> = [
        "TENTATIVE",
        "CONFIRMED",
        "CANCELLED",
      ];

      statuses.forEach((status) => {
        const event: ICSEvent = {
          uid: `status-${status}`,
          title: `${status} Event`,
          startTime: new Date("2024-01-15T10:00:00Z"),
          endTime: new Date("2024-01-15T11:00:00Z"),
          status,
        };

        const ics = generateICS(event);
        expect(ics).toContain(`STATUS:${status}`);
      });
    });

    it("should fold long lines according to RFC 5545", () => {
      const longTitle = "A".repeat(100); // Very long title that should be folded
      const eventWithLongTitle: ICSEvent = {
        uid: "long-title",
        title: longTitle,
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
      };

      const ics = generateICS(eventWithLongTitle);

      // Find the SUMMARY line
      const lines = ics.split("\r\n");
      const summaryLineIndex = lines.findIndex((line) =>
        line.startsWith("SUMMARY:"),
      );

      if (summaryLineIndex !== -1) {
        const summaryLine = lines[summaryLineIndex];
        // Should not exceed 75 characters
        expect(summaryLine.length).toBeLessThanOrEqual(75);

        // Next line should be a continuation (start with space)
        if (lines[summaryLineIndex + 1]) {
          expect(lines[summaryLineIndex + 1]).toMatch(/^ /);
        }
      }
    });
  });

  describe("generateMultiEventICS", () => {
    it("should generate ICS with multiple events", () => {
      const events: ICSEvent[] = [
        {
          uid: "event-1",
          title: "First Meeting",
          startTime: new Date("2024-01-15T10:00:00Z"),
          endTime: new Date("2024-01-15T11:00:00Z"),
        },
        {
          uid: "event-2",
          title: "Second Meeting",
          startTime: new Date("2024-01-15T14:00:00Z"),
          endTime: new Date("2024-01-15T15:00:00Z"),
        },
      ];

      const ics = generateMultiEventICS(events);

      // Should have one calendar with multiple events
      expect(ics).toContain("BEGIN:VCALENDAR");
      expect(ics).toContain("END:VCALENDAR");

      // Count VEVENT blocks
      const eventMatches = ics.match(/BEGIN:VEVENT/g);
      expect(eventMatches).toHaveLength(2);

      // Both events should be present
      expect(ics).toContain("SUMMARY:First Meeting");
      expect(ics).toContain("SUMMARY:Second Meeting");
      expect(ics).toContain("UID:event-1@calmill.workermill.com");
      expect(ics).toContain("UID:event-2@calmill.workermill.com");
    });

    it("should handle single event (fallback to generateICS)", () => {
      const events: ICSEvent[] = [sampleEvent];

      const ics = generateMultiEventICS(events);
      const singleIcs = generateICS(sampleEvent);

      expect(ics).toBe(singleIcs);
    });

    it("should handle empty events array", () => {
      const ics = generateMultiEventICS([]);

      expect(ics).toContain("BEGIN:VCALENDAR");
      expect(ics).toContain("END:VCALENDAR");
      expect(ics).toContain("BEGIN:VEVENT");
      expect(ics).toContain("END:VEVENT");
      expect(ics).toContain("SUMMARY:No Events");
    });
  });

  describe("createBookingICS", () => {
    const sampleBooking = {
      uid: "booking-123",
      title: "Client Consultation",
      startTime: new Date("2024-01-15T14:00:00Z"),
      endTime: new Date("2024-01-15T15:00:00Z"),
      location: "Office Conference Room",
      meetingUrl: "https://meet.example.com/consultation",
      attendeeName: "John Client",
      attendeeEmail: "john.client@example.com",
      hostName: "Jane Consultant",
      hostEmail: "jane.consultant@example.com",
      description: "Quarterly business review meeting",
    };

    it("should create ICS from booking data with all fields", () => {
      const ics = createBookingICS(sampleBooking);

      expect(ics).toContain("UID:booking-123@calmill.workermill.com");
      expect(ics).toContain("SUMMARY:Client Consultation");
      expect(ics).toContain("LOCATION:Office Conference Room");
      expect(ics).toContain(
        "ORGANIZER;CN=Jane Consultant:mailto:jane.consultant@example.com",
      );
      expect(ics).toContain(
        "ATTENDEE;CN=John Client;ROLE=REQ-PARTICIPANT:mailto:john.client@example.com",
      );
      expect(ics).toContain("URL:https://meet.example.com/consultation");

      // Description should include original plus meeting details (escaped for ICS format)
      // Note: Long lines are folded per RFC 5545, so we check for content across potential line breaks
      expect(ics).toContain("DESCRIPTION:Quarterly business review meeting");
      expect(ics).toContain("Join the meeting: https://");
      expect(ics).toContain("meet.example.com/consultation");
      expect(ics).toContain("Location: Office Conference Room");
      // "Booked via CalMill" might be split across folded lines
      const unfoldedIcs = ics.replace(/\r\n /g, "");
      expect(unfoldedIcs).toContain("Booked via CalMill");
    });

    it("should handle booking without optional fields", () => {
      const minimalBooking = {
        uid: "minimal-booking",
        title: "Simple Meeting",
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
        attendeeName: "Attendee",
        attendeeEmail: "attendee@example.com",
        hostName: "Host",
        hostEmail: "host@example.com",
      };

      const ics = createBookingICS(minimalBooking);

      expect(ics).toContain("SUMMARY:Simple Meeting");
      expect(ics).toContain("ORGANIZER;CN=Host:mailto:host@example.com");
      expect(ics).toContain(
        "ATTENDEE;CN=Attendee;ROLE=REQ-PARTICIPANT:mailto:attendee@example.com",
      );

      // Should not contain location or URL fields
      expect(ics).not.toContain("LOCATION:");
      expect(ics).not.toContain("URL:");

      // Description should still mention CalMill
      expect(ics).toContain("Booked via CalMill");
    });

    it("should not duplicate location in description when same as meeting URL", () => {
      const bookingWithSameUrlLocation = {
        uid: "same-url-location",
        title: "Online Meeting",
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
        location: "https://zoom.us/j/123456789",
        meetingUrl: "https://zoom.us/j/123456789",
        attendeeName: "Attendee",
        attendeeEmail: "attendee@example.com",
        hostName: "Host",
        hostEmail: "host@example.com",
      };

      const ics = createBookingICS(bookingWithSameUrlLocation);

      // Should contain meeting URL but not duplicate it in description
      expect(ics).toContain("Join the meeting: https://zoom.us/j/123456789");

      // Count occurrences of the URL in description
      const description =
        ics.match(/DESCRIPTION:([^\\r\\n]*(?:\\\\[^\\r\\n]*)*)/)?.[1] || "";
      const urlOccurrences = (
        description.match(/https:\/\/zoom\.us\/j\/123456789/g) || []
      ).length;
      expect(urlOccurrences).toBeLessThanOrEqual(1);
    });
  });

  describe("createICSFilename", () => {
    it("should create valid filename from title and date", () => {
      const title = "Team Meeting";
      const date = new Date("2024-01-15T14:30:00Z");

      const filename = createICSFilename(title, date);

      expect(filename).toBe("team-meeting-2024-01-15.ics");
    });

    it("should sanitize special characters in title", () => {
      const title = "Client Meeting! (Q1 Review) #2024";
      const date = new Date("2024-03-20T10:00:00Z");

      const filename = createICSFilename(title, date);

      expect(filename).toBe("client-meeting-q1-review-2024-2024-03-20.ics");
    });

    it("should handle multiple spaces and convert to hyphens", () => {
      const title = "Very    Long    Title   With   Spaces";
      const date = new Date("2024-06-01T00:00:00Z");

      const filename = createICSFilename(title, date);

      expect(filename).toBe("very-long-title-with-spaces-2024-06-01.ics");
    });

    it("should handle empty title", () => {
      const title = "";
      const date = new Date("2024-12-25T12:00:00Z");

      const filename = createICSFilename(title, date);

      expect(filename).toBe("-2024-12-25.ics");
    });

    it("should handle title with only special characters", () => {
      const title = "!@#$%^&*()";
      const date = new Date("2024-07-04T16:30:00Z");

      const filename = createICSFilename(title, date);

      expect(filename).toBe("-2024-07-04.ics");
    });
  });

  describe("getICSMimeType", () => {
    it("should return correct MIME type for ICS files", () => {
      const mimeType = getICSMimeType();

      expect(mimeType).toBe("text/calendar; charset=utf-8");
    });
  });

  describe("createICSHeaders", () => {
    it("should create proper headers for ICS file download", () => {
      const filename = "test-event-2024-01-15.ics";

      const headers = createICSHeaders(filename);

      expect(headers).toEqual({
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="test-event-2024-01-15.ics"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      });
    });

    it("should handle filenames with special characters", () => {
      const filename = "meeting (updated).ics";

      const headers = createICSHeaders(filename);

      expect(headers["Content-Disposition"]).toBe(
        'attachment; filename="meeting (updated).ics"',
      );
    });
  });

  describe("ICS compliance and edge cases", () => {
    it("should generate RFC 5545 compliant DTSTAMP format", () => {
      const event: ICSEvent = {
        uid: "timestamp-test",
        title: "Timestamp Test",
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
      };

      const ics = generateICS(event);

      // Find DTSTAMP line
      const dtstampMatch = ics.match(/DTSTAMP:(\d{8}T\d{6}Z)/);
      expect(dtstampMatch).toBeTruthy();

      if (dtstampMatch) {
        const timestamp = dtstampMatch[1];
        // Should be in format YYYYMMDDTHHMMSSZ
        expect(timestamp).toMatch(/^\d{8}T\d{6}Z$/);
      }
    });

    it("should handle events that cross midnight", () => {
      const event: ICSEvent = {
        uid: "midnight-crossing",
        title: "Late Night Meeting",
        startTime: new Date("2024-01-15T23:30:00Z"),
        endTime: new Date("2024-01-16T01:00:00Z"), // Next day
      };

      const ics = generateICS(event);

      expect(ics).toContain("DTSTART:20240115T233000Z");
      expect(ics).toContain("DTEND:20240116T010000Z");
    });

    it("should handle events with zero duration", () => {
      const sameTime = new Date("2024-01-15T12:00:00Z");
      const event: ICSEvent = {
        uid: "zero-duration",
        title: "Instant Event",
        startTime: sameTime,
        endTime: sameTime,
      };

      const ics = generateICS(event);

      expect(ics).toContain("DTSTART:20240115T120000Z");
      expect(ics).toContain("DTEND:20240115T120000Z");
    });

    it("should handle very long descriptions with proper folding", () => {
      const longDescription = "A".repeat(200); // Very long description
      const event: ICSEvent = {
        uid: "long-description",
        title: "Event with Long Description",
        description: longDescription,
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
      };

      const ics = generateICS(event);

      // Should contain the full description in the ICS output (which may be folded)
      // We can't expect exact match due to line folding, so check for presence of content
      expect(ics).toContain("DESCRIPTION:");
      expect(ics).toContain("AAAAAAAAAA"); // Check for part of the description

      // Find description lines
      const lines = ics.split("\r\n");
      const descriptionStartIndex = lines.findIndex((line) =>
        line.startsWith("DESCRIPTION:"),
      );

      if (descriptionStartIndex !== -1) {
        const descriptionLine = lines[descriptionStartIndex];
        // First line should not exceed 75 characters
        expect(descriptionLine.length).toBeLessThanOrEqual(75);
      }
    });
  });
});
