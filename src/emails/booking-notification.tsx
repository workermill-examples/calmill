import { Button, Hr, Link, Section, Text } from '@react-email/components';
import { EmailLayout, colors } from './components/email-layout';
import { DetailRow } from './components/detail-row';

export interface BookingNotificationEmailProps {
  /** Host's display name */
  hostName: string;
  /** Attendee's display name */
  attendeeName: string;
  /** Attendee's email address */
  attendeeEmail: string;
  /** Event type title (e.g. "30 Minute Meeting") */
  eventTypeTitle: string;
  /** Duration in minutes */
  duration: number;
  /** Formatted start time in host's timezone */
  startTime: string;
  /** Formatted end time in host's timezone */
  endTime: string;
  /** Host's timezone */
  timezone: string;
  /** Optional location or meeting URL */
  location?: string;
  /** Optional notes from the attendee */
  notes?: string;
  /** Optional custom question responses (question label → answer) */
  responses?: Record<string, string>;
  /** URL to the booking detail in dashboard */
  bookingUrl: string;
  /** Whether this booking requires manual acceptance */
  requiresConfirmation?: boolean;
}

export function BookingNotificationEmail({
  hostName,
  attendeeName,
  attendeeEmail,
  eventTypeTitle,
  duration,
  startTime,
  endTime,
  timezone,
  location,
  notes,
  responses,
  bookingUrl,
  requiresConfirmation = false,
}: BookingNotificationEmailProps) {
  const preview = `New booking: ${attendeeName} – ${eventTypeTitle}`;

  return (
    <EmailLayout preview={preview}>
      {/* Status icon + heading */}
      <Section style={styles.centeredSection}>
        <Text style={styles.statusIcon}>📅</Text>
      </Section>

      <Text style={styles.heading}>You have a new booking</Text>
      <Text style={styles.subheading}>
        Hi {hostName}, <strong>{attendeeName}</strong> has booked a meeting with you.
        {requiresConfirmation && <> This booking requires your confirmation.</>}
      </Text>

      <Hr style={styles.divider} />

      {/* Event details */}
      <Section style={styles.detailsCard}>
        <Text style={styles.eventTitle}>{eventTypeTitle}</Text>

        <DetailRow icon="📅" label="Date & Time">
          {startTime} – {endTime}
          <br />
          <span style={styles.timezone}>{timezone}</span>
        </DetailRow>

        <DetailRow icon="⏱" label="Duration">
          {duration} minutes
        </DetailRow>

        <DetailRow icon="👤" label="Attendee">
          {attendeeName}{' '}
          <Link href={`mailto:${attendeeEmail}`} style={styles.link}>
            ({attendeeEmail})
          </Link>
        </DetailRow>

        {location && (
          <DetailRow icon="📍" label="Location">
            {location}
          </DetailRow>
        )}
      </Section>

      {/* Attendee notes */}
      {notes && (
        <>
          <Hr style={styles.divider} />
          <Section>
            <Text style={styles.sectionTitle}>Attendee Notes</Text>
            <Text style={styles.notesText}>{notes}</Text>
          </Section>
        </>
      )}

      {/* Custom question responses */}
      {responses && Object.keys(responses).length > 0 && (
        <>
          <Hr style={styles.divider} />
          <Section>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            {Object.entries(responses).map(([question, answer]) => (
              <Section key={question} style={styles.responseRow}>
                <Text style={styles.responseQuestion}>{question}</Text>
                <Text style={styles.responseAnswer}>{answer}</Text>
              </Section>
            ))}
          </Section>
        </>
      )}

      <Hr style={styles.divider} />

      {/* CTA */}
      <Section style={styles.centeredSection}>
        <Button href={bookingUrl} style={styles.primaryButton}>
          {requiresConfirmation ? 'Review Booking' : 'View Booking'}
        </Button>
      </Section>

      {requiresConfirmation && (
        <Text style={styles.confirmationHint}>
          Log in to your dashboard to accept or reject this booking.
        </Text>
      )}
    </EmailLayout>
  );
}

const styles = {
  centeredSection: {
    textAlign: 'center' as const,
  },
  statusIcon: {
    fontSize: '48px',
    margin: '0 auto 16px',
    textAlign: 'center' as const,
  },
  heading: {
    color: colors.text,
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '1.3',
    margin: '0 0 8px',
    textAlign: 'center' as const,
  },
  subheading: {
    color: colors.textMuted,
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '0 0 24px',
    textAlign: 'center' as const,
  },
  divider: {
    borderColor: colors.border,
    margin: '24px 0',
  },
  detailsCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: '8px',
    padding: '16px 20px',
  },
  eventTitle: {
    color: colors.primary,
    fontSize: '17px',
    fontWeight: '700',
    margin: '0 0 16px',
  },
  timezone: {
    color: colors.textMuted,
    fontSize: '13px',
  },
  link: {
    color: colors.primary,
    textDecoration: 'none',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 8px',
  },
  notesText: {
    backgroundColor: colors.background,
    borderLeftColor: colors.border,
    borderLeftStyle: 'solid' as const,
    borderLeftWidth: '3px',
    borderRadius: '4px',
    color: colors.text,
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0',
    padding: '12px 16px',
  },
  responseRow: {
    marginBottom: '12px',
  },
  responseQuestion: {
    color: colors.textMuted,
    fontSize: '13px',
    fontWeight: '600',
    margin: '0 0 2px',
  },
  responseAnswer: {
    color: colors.text,
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '0',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: '6px',
    color: colors.white,
    display: 'inline-block',
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '12px',
    padding: '12px 24px',
    textDecoration: 'none',
  },
  confirmationHint: {
    color: colors.textMuted,
    fontSize: '13px',
    lineHeight: '1.5',
    margin: '0',
    textAlign: 'center' as const,
  },
} as const;

export default BookingNotificationEmail;
