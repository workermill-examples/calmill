/**
 * ICS (iCalendar) file generation utility
 * Generates RFC 5545-compliant .ics files for calendar integrations.
 *
 * Spec: https://www.ietf.org/rfc/rfc5545.txt
 */

export interface ICSEventOptions {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date | string; // UTC datetime
  endTime: Date | string;   // UTC datetime
  organizerName?: string;
  organizerEmail?: string;
  attendeeName?: string;
  attendeeEmail?: string;
  url?: string;
}

/**
 * Format a Date to iCalendar UTC datetime string: 20260220T150000Z
 */
function formatICSDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * Fold long iCalendar lines per RFC 5545 §3.1:
 * Lines longer than 75 octets are folded by inserting CRLF + single space.
 */
function foldLine(line: string): string {
  if (line.length <= 75) return line;

  const chunks: string[] = [];
  let remaining = line;

  // First chunk: 75 chars
  chunks.push(remaining.slice(0, 75));
  remaining = remaining.slice(75);

  // Subsequent chunks: 74 chars (1 char is the folding space)
  while (remaining.length > 74) {
    chunks.push(" " + remaining.slice(0, 74));
    remaining = remaining.slice(74);
  }

  if (remaining.length > 0) {
    chunks.push(" " + remaining);
  }

  return chunks.join("\r\n");
}

/**
 * Escape special characters in iCalendar text values per RFC 5545 §3.3.11
 */
function escapeText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

/**
 * Generate a valid iCalendar (.ics) file content string.
 *
 * @returns String with CRLF line endings as required by RFC 5545
 */
export function generateICS(options: ICSEventOptions): string {
  const {
    uid,
    title,
    description,
    location,
    startTime,
    endTime,
    organizerName,
    organizerEmail,
    attendeeName,
    attendeeEmail,
    url,
  } = options;

  const now = formatICSDate(new Date());
  const dtstart = formatICSDate(startTime);
  const dtend = formatICSDate(endTime);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CalMill//CalMill//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}@calmill`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    foldLine(`SUMMARY:${escapeText(title)}`),
  ];

  if (description) {
    lines.push(foldLine(`DESCRIPTION:${escapeText(description)}`));
  }

  if (location) {
    lines.push(foldLine(`LOCATION:${escapeText(location)}`));
  }

  if (url) {
    lines.push(foldLine(`URL:${url}`));
  }

  if (organizerEmail) {
    const organizer = organizerName
      ? `CN=${organizerName}:mailto:${organizerEmail}`
      : `mailto:${organizerEmail}`;
    lines.push(foldLine(`ORGANIZER;${organizer}`));
  }

  if (attendeeEmail) {
    const attendee = attendeeName
      ? `CN=${attendeeName}:mailto:${attendeeEmail}`
      : `mailto:${attendeeEmail}`;
    lines.push(foldLine(`ATTENDEE;RSVP=TRUE;ROLE=REQ-PARTICIPANT;${attendee}`));
  }

  lines.push(
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR"
  );

  // RFC 5545 requires CRLF line endings
  return lines.join("\r\n");
}

/**
 * Build a Google Calendar event URL with pre-filled event details.
 * Opens in a new tab for the user to add to their Google Calendar.
 */
export function buildGoogleCalendarUrl(options: ICSEventOptions): string {
  const startStr = formatICSDate(options.startTime);
  const endStr = formatICSDate(options.endTime);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: options.title,
    dates: `${startStr}/${endStr}`,
  });

  if (options.description) {
    params.set("details", options.description);
  }
  if (options.location) {
    params.set("location", options.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Build a data URI for downloading an .ics file directly in the browser.
 * Used for Outlook and Apple Calendar download links.
 */
export function buildICSDataUri(options: ICSEventOptions): string {
  const icsContent = generateICS(options);
  // Use percent-encoding to safely embed content in data URI
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
}

/**
 * Trigger a browser download of an .ics file.
 * Must be called from a client component or event handler.
 */
export function downloadICS(options: ICSEventOptions, filename?: string): void {
  const icsContent = generateICS(options);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename ?? `${options.title.replace(/\s+/g, "-")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
