import { Resend } from 'resend';

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailOptions {
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Initialize Resend client if API key is available
let resend: Resend | null = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

/**
 * Send email via Resend with graceful degradation
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  // If no Resend API key, log the email attempt but don't fail
  if (!resend || !process.env.RESEND_API_KEY) {
    console.log('📧 Email would be sent (no RESEND_API_KEY):', {
      to: Array.isArray(options.to) ? options.to.map(r => r.email) : [options.to.email],
      subject: options.subject,
      from: options.from || process.env.EMAIL_FROM || 'CalMill <noreply@calmill.workermill.com>',
    });

    // Return success to not break the application flow
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
    };
  }

  try {
    const fromAddress = options.from || process.env.EMAIL_FROM || 'CalMill <noreply@calmill.workermill.com>';

    // Format recipients
    const formatRecipient = (recipient: EmailRecipient): string => {
      return recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email;
    };

    const to = Array.isArray(options.to)
      ? options.to.map(formatRecipient)
      : [formatRecipient(options.to)];

    const cc = options.cc?.map(formatRecipient);
    const bcc = options.bcc?.map(formatRecipient);

    // Prepare attachments if any
    const attachments = options.attachments?.map(attachment => ({
      filename: attachment.filename,
      content: attachment.content,
      type: attachment.contentType,
    }));

    const emailData: any = {
      from: fromAddress,
      to,
      subject: options.subject,
    };

    if (options.html) emailData.html = options.html;
    if (options.text) emailData.text = options.text;
    if (cc) emailData.cc = cc;
    if (bcc) emailData.bcc = bcc;
    if (attachments) emailData.attachments = attachments;

    const response = await resend.emails.send(emailData);

    if (response.error) {
      console.error('Resend API error:', response.error);
      return {
        success: false,
        error: response.error.message || 'Failed to send email',
      };
    }

    return {
      success: true,
      messageId: response.data?.id,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fire-and-forget email sending
 */
export function sendEmailAsync(options: EmailOptions): void {
  // Don't await - fire and forget
  void sendEmail(options).catch(error => {
    console.error('Async email sending failed:', error);
  });
}

/**
 * Booking confirmation email to attendee
 */
export function sendBookingConfirmationEmail(data: {
  attendeeName: string;
  attendeeEmail: string;
  eventTitle: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  location?: string;
  meetingUrl?: string;
  hostName: string;
  bookingUid: string;
  cancelUrl: string;
  rescheduleUrl: string;
}): void {
  const formatDateTime = (date: Date, timezone: string): string => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
      timeZone: timezone,
    }).format(date);
  };

  const startTimeFormatted = formatDateTime(data.startTime, data.timezone);
  const duration = Math.round((data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60));

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 16px;">
        📅 Booking Confirmed
      </h1>

      <p style="color: #374151; font-size: 16px;">
        Hi ${data.attendeeName},
      </p>

      <p style="color: #374151; font-size: 16px;">
        Your booking for <strong>${data.eventTitle}</strong> has been confirmed.
      </p>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px;">Event Details</h2>
        <p style="margin: 8px 0; color: #374151;"><strong>Event:</strong> ${data.eventTitle}</p>
        <p style="margin: 8px 0; color: #374151;"><strong>Date & Time:</strong> ${startTimeFormatted}</p>
        <p style="margin: 8px 0; color: #374151;"><strong>Duration:</strong> ${duration} minutes</p>
        <p style="margin: 8px 0; color: #374151;"><strong>Host:</strong> ${data.hostName}</p>
        ${data.location ? `<p style="margin: 8px 0; color: #374151;"><strong>Location:</strong> ${data.location}</p>` : ''}
        ${data.meetingUrl ? `<p style="margin: 8px 0; color: #374151;"><strong>Meeting URL:</strong> <a href="${data.meetingUrl}" style="color: #3b82f6;">${data.meetingUrl}</a></p>` : ''}
      </div>

      <div style="margin: 32px 0;">
        <a href="${data.rescheduleUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 16px;">
          📅 Reschedule
        </a>
        <a href="${data.cancelUrl}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          ❌ Cancel
        </a>
      </div>

      <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
        This email was sent by CalMill. If you need to make any changes, please use the links above.
      </p>
    </div>
  `;

  const text = `
Booking Confirmed

Hi ${data.attendeeName},

Your booking for ${data.eventTitle} has been confirmed.

Event Details:
- Event: ${data.eventTitle}
- Date & Time: ${startTimeFormatted}
- Duration: ${duration} minutes
- Host: ${data.hostName}
${data.location ? `- Location: ${data.location}` : ''}
${data.meetingUrl ? `- Meeting URL: ${data.meetingUrl}` : ''}

To reschedule: ${data.rescheduleUrl}
To cancel: ${data.cancelUrl}

This email was sent by CalMill.
  `;

  sendEmailAsync({
    to: { email: data.attendeeEmail, name: data.attendeeName },
    subject: `Booking Confirmed: ${data.eventTitle}`,
    html,
    text,
  });
}

/**
 * Booking notification email to host
 */
export function sendBookingNotificationEmail(data: {
  hostName: string;
  hostEmail: string;
  attendeeName: string;
  attendeeEmail: string;
  eventTitle: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  location?: string;
  meetingUrl?: string;
  attendeeNotes?: string;
  bookingUid: string;
  acceptUrl?: string;
  rejectUrl?: string;
}): void {
  const formatDateTime = (date: Date, timezone: string): string => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
      timeZone: timezone,
    }).format(date);
  };

  const startTimeFormatted = formatDateTime(data.startTime, data.timezone);
  const duration = Math.round((data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60));

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 16px;">
        📅 New Booking Request
      </h1>

      <p style="color: #374151; font-size: 16px;">
        Hi ${data.hostName},
      </p>

      <p style="color: #374151; font-size: 16px;">
        You have a new booking request for <strong>${data.eventTitle}</strong>.
      </p>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px;">Booking Details</h2>
        <p style="margin: 8px 0; color: #374151;"><strong>Event:</strong> ${data.eventTitle}</p>
        <p style="margin: 8px 0; color: #374151;"><strong>Date & Time:</strong> ${startTimeFormatted}</p>
        <p style="margin: 8px 0; color: #374151;"><strong>Duration:</strong> ${duration} minutes</p>
        <p style="margin: 8px 0; color: #374151;"><strong>Attendee:</strong> ${data.attendeeName} (${data.attendeeEmail})</p>
        ${data.location ? `<p style="margin: 8px 0; color: #374151;"><strong>Location:</strong> ${data.location}</p>` : ''}
        ${data.meetingUrl ? `<p style="margin: 8px 0; color: #374151;"><strong>Meeting URL:</strong> <a href="${data.meetingUrl}" style="color: #3b82f6;">${data.meetingUrl}</a></p>` : ''}
        ${data.attendeeNotes ? `<p style="margin: 8px 0; color: #374151;"><strong>Notes:</strong> ${data.attendeeNotes}</p>` : ''}
      </div>

      ${data.acceptUrl && data.rejectUrl ? `
      <div style="margin: 32px 0;">
        <a href="${data.acceptUrl}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 16px;">
          ✅ Accept
        </a>
        <a href="${data.rejectUrl}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          ❌ Reject
        </a>
      </div>
      ` : ''}

      <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
        This email was sent by CalMill.
      </p>
    </div>
  `;

  const text = `
New Booking Request

Hi ${data.hostName},

You have a new booking request for ${data.eventTitle}.

Booking Details:
- Event: ${data.eventTitle}
- Date & Time: ${startTimeFormatted}
- Duration: ${duration} minutes
- Attendee: ${data.attendeeName} (${data.attendeeEmail})
${data.location ? `- Location: ${data.location}` : ''}
${data.meetingUrl ? `- Meeting URL: ${data.meetingUrl}` : ''}
${data.attendeeNotes ? `- Notes: ${data.attendeeNotes}` : ''}

${data.acceptUrl && data.rejectUrl ? `To accept: ${data.acceptUrl}\nTo reject: ${data.rejectUrl}` : ''}

This email was sent by CalMill.
  `;

  sendEmailAsync({
    to: { email: data.hostEmail, name: data.hostName },
    subject: `New Booking: ${data.eventTitle} with ${data.attendeeName}`,
    html,
    text,
  });
}

/**
 * Booking cancellation email
 */
export function sendBookingCancellationEmail(data: {
  recipientName: string;
  recipientEmail: string;
  eventTitle: string;
  startTime: Date;
  timezone: string;
  cancellationReason?: string;
  isHost: boolean;
}): void {
  const formatDateTime = (date: Date, timezone: string): string => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
      timeZone: timezone,
    }).format(date);
  };

  const startTimeFormatted = formatDateTime(data.startTime, data.timezone);
  const subject = data.isHost
    ? `Booking Cancelled: ${data.eventTitle}`
    : `Your booking has been cancelled: ${data.eventTitle}`;

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 16px;">
        ❌ Booking Cancelled
      </h1>

      <p style="color: #374151; font-size: 16px;">
        Hi ${data.recipientName},
      </p>

      <p style="color: #374151; font-size: 16px;">
        The booking for <strong>${data.eventTitle}</strong> has been cancelled.
      </p>

      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <h2 style="color: #dc2626; margin: 0 0 16px 0; font-size: 18px;">Cancelled Event</h2>
        <p style="margin: 8px 0; color: #374151;"><strong>Event:</strong> ${data.eventTitle}</p>
        <p style="margin: 8px 0; color: #374151;"><strong>Date & Time:</strong> ${startTimeFormatted}</p>
        ${data.cancellationReason ? `<p style="margin: 8px 0; color: #374151;"><strong>Reason:</strong> ${data.cancellationReason}</p>` : ''}
      </div>

      <p style="color: #374151; font-size: 16px;">
        We apologize for any inconvenience this may cause.
      </p>

      <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
        This email was sent by CalMill.
      </p>
    </div>
  `;

  const text = `
Booking Cancelled

Hi ${data.recipientName},

The booking for ${data.eventTitle} has been cancelled.

Cancelled Event:
- Event: ${data.eventTitle}
- Date & Time: ${startTimeFormatted}
${data.cancellationReason ? `- Reason: ${data.cancellationReason}` : ''}

We apologize for any inconvenience this may cause.

This email was sent by CalMill.
  `;

  sendEmailAsync({
    to: { email: data.recipientEmail, name: data.recipientName },
    subject,
    html,
    text,
  });
}