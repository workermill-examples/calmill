/**
 * ICS (iCalendar) file generation library
 * Generates RFC 5545 compliant calendar files for event downloads
 */

export interface ICSEvent {
  uid: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  organizer?: {
    name: string;
    email: string;
  };
  attendees?: Array<{
    name: string;
    email: string;
  }>;
  url?: string;
  status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
  sequence?: number;
}

/**
 * Escape special characters for ICS format
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Format date for ICS format (YYYYMMDDTHHMMSSZ)
 */
function formatICSDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  const second = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hour}${minute}${second}Z`;
}

/**
 * Fold long lines according to RFC 5545 (max 75 octets per line)
 */
function foldLine(line: string): string {
  if (line.length <= 75) {
    return line;
  }

  const lines: string[] = [];
  let currentLine = line;

  while (currentLine.length > 75) {
    lines.push(currentLine.substring(0, 75));
    currentLine = ' ' + currentLine.substring(75); // Continuation lines start with space
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines.join('\r\n');
}

/**
 * Generate ICS file content for a single event
 */
export function generateICS(event: ICSEvent): string {
  const now = new Date();
  const lines: string[] = [];

  // Calendar header
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//CalMill//CalMill Calendar//EN');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');

  // Event
  lines.push('BEGIN:VEVENT');

  // Required fields
  lines.push(`UID:${event.uid}@calmill.workermill.com`);
  lines.push(`DTSTAMP:${formatICSDate(now)}`);
  lines.push(`DTSTART:${formatICSDate(event.startTime)}`);
  lines.push(`DTEND:${formatICSDate(event.endTime)}`);
  lines.push(`SUMMARY:${escapeICSText(event.title)}`);

  // Optional fields
  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICSText(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICSText(event.location)}`);
  }

  if (event.organizer) {
    lines.push(`ORGANIZER;CN=${escapeICSText(event.organizer.name)}:mailto:${event.organizer.email}`);
  }

  if (event.attendees && event.attendees.length > 0) {
    event.attendees.forEach(attendee => {
      lines.push(`ATTENDEE;CN=${escapeICSText(attendee.name)};ROLE=REQ-PARTICIPANT:mailto:${attendee.email}`);
    });
  }

  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  if (event.status) {
    lines.push(`STATUS:${event.status}`);
  }

  if (event.sequence !== undefined) {
    lines.push(`SEQUENCE:${event.sequence}`);
  }

  // Default status if not provided
  if (!event.status) {
    lines.push('STATUS:CONFIRMED');
  }

  // End event
  lines.push('END:VEVENT');

  // End calendar
  lines.push('END:VCALENDAR');

  // Fold lines and join with CRLF
  return lines.map(foldLine).join('\r\n');
}

/**
 * Generate ICS file content for multiple events
 */
export function generateMultiEventICS(events: ICSEvent[]): string {
  if (events.length === 0) {
    return generateICS({
      uid: 'empty',
      title: 'No Events',
      startTime: new Date(),
      endTime: new Date(),
    });
  }

  if (events.length === 1) {
    return generateICS(events[0]);
  }

  const now = new Date();
  const lines: string[] = [];

  // Calendar header
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//CalMill//CalMill Calendar//EN');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');

  // Add each event
  events.forEach(event => {
    lines.push('BEGIN:VEVENT');

    // Required fields
    lines.push(`UID:${event.uid}@calmill.workermill.com`);
    lines.push(`DTSTAMP:${formatICSDate(now)}`);
    lines.push(`DTSTART:${formatICSDate(event.startTime)}`);
    lines.push(`DTEND:${formatICSDate(event.endTime)}`);
    lines.push(`SUMMARY:${escapeICSText(event.title)}`);

    // Optional fields
    if (event.description) {
      lines.push(`DESCRIPTION:${escapeICSText(event.description)}`);
    }

    if (event.location) {
      lines.push(`LOCATION:${escapeICSText(event.location)}`);
    }

    if (event.organizer) {
      lines.push(`ORGANIZER;CN=${escapeICSText(event.organizer.name)}:mailto:${event.organizer.email}`);
    }

    if (event.attendees && event.attendees.length > 0) {
      event.attendees.forEach(attendee => {
        lines.push(`ATTENDEE;CN=${escapeICSText(attendee.name)};ROLE=REQ-PARTICIPANT:mailto:${attendee.email}`);
      });
    }

    if (event.url) {
      lines.push(`URL:${event.url}`);
    }

    if (event.status) {
      lines.push(`STATUS:${event.status}`);
    } else {
      lines.push('STATUS:CONFIRMED');
    }

    if (event.sequence !== undefined) {
      lines.push(`SEQUENCE:${event.sequence}`);
    }

    lines.push('END:VEVENT');
  });

  // End calendar
  lines.push('END:VCALENDAR');

  // Fold lines and join with CRLF
  return lines.map(foldLine).join('\r\n');
}

/**
 * Create ICS file from booking data
 */
export function createBookingICS(booking: {
  uid: string;
  title: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  meetingUrl?: string;
  attendeeName: string;
  attendeeEmail: string;
  hostName: string;
  hostEmail: string;
  description?: string;
}): string {
  let description = booking.description || '';

  // Add meeting details to description
  if (booking.meetingUrl) {
    description += `\n\nJoin the meeting: ${booking.meetingUrl}`;
  }

  if (booking.location && booking.location !== booking.meetingUrl) {
    description += `\n\nLocation: ${booking.location}`;
  }

  description += `\n\nBooked via CalMill (calmill.workermill.com)`;

  const event: ICSEvent = {
    uid: booking.uid,
    title: booking.title,
    description: description.trim(),
    startTime: booking.startTime,
    endTime: booking.endTime,
    location: booking.location,
    organizer: {
      name: booking.hostName,
      email: booking.hostEmail,
    },
    attendees: [
      {
        name: booking.attendeeName,
        email: booking.attendeeEmail,
      },
    ],
    url: booking.meetingUrl,
    status: 'CONFIRMED',
  };

  return generateICS(event);
}

/**
 * Create filename for ICS download
 */
export function createICSFilename(title: string, date: Date): string {
  // Sanitize title for filename
  const sanitizedTitle = title
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();

  // Format date as YYYY-MM-DD
  const dateStr = date.toISOString().split('T')[0];

  return `${sanitizedTitle}-${dateStr}.ics`;
}

/**
 * Get MIME type for ICS files
 */
export function getICSMimeType(): string {
  return 'text/calendar; charset=utf-8';
}

/**
 * Create Response headers for ICS file download
 */
export function createICSHeaders(filename: string): Record<string, string> {
  return {
    'Content-Type': getICSMimeType(),
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };
}