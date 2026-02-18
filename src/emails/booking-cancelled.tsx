import { Button, Hr, Section, Text } from '@react-email/components';
import { EmailLayout, colors } from './components/email-layout';
import { DetailRow } from './components/detail-row';

export interface BookingCancelledEmailProps {
  /** Display name of the person receiving the email */
  recipientName: string;
  /** Host's display name */
  hostName: string;
  /** Attendee's display name */
  attendeeName: string;
  /** Whether this email is going to the host (vs. attendee) */
  isHost: boolean;
  /** Event type title */
  eventTypeTitle: string;
  /** Formatted start time */
  startTime: string;
  /** Formatted end time */
  endTime: string;
  /** Timezone for display */
  timezone: string;
  /** Optional cancellation reason */
  cancellationReason?: string;
  /** Whether the booking was rejected (vs. cancelled) */
  isRejection?: boolean;
  /** URL to book again (public booking page) */
  rebookUrl?: string;
}

export function BookingCancelledEmail({
  recipientName,
  hostName,
  attendeeName,
  isHost,
  eventTypeTitle,
  startTime,
  endTime,
  timezone,
  cancellationReason,
  isRejection = false,
  rebookUrl,
}: BookingCancelledEmailProps) {
  const actionLabel = isRejection ? 'rejected' : 'cancelled';
  const preview = `Meeting ${actionLabel}: ${eventTypeTitle}`;
  const heading = isRejection ? 'Meeting request declined' : 'Meeting cancelled';

  const subheading = isHost
    ? `The booking with ${attendeeName} for "${eventTypeTitle}" has been ${actionLabel}.`
    : isRejection
      ? `${hostName} has declined your meeting request for "${eventTypeTitle}".`
      : `Your meeting "${eventTypeTitle}" has been ${actionLabel}.`;

  return (
    <EmailLayout preview={preview}>
      {/* Status icon + heading */}
      <Section style={styles.centeredSection}>
        <Text style={styles.statusIconCircle}>✗</Text>
      </Section>

      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.subheading}>
        Hi {recipientName}, {subheading}
      </Text>

      <Hr style={styles.divider} />

      {/* Event details */}
      <Section style={styles.detailsCard}>
        <Text style={styles.eventTitle}>{eventTypeTitle}</Text>

        <DetailRow icon="📅" label="Original Date & Time">
          {startTime} – {endTime}
          <br />
          <span style={styles.timezone}>{timezone}</span>
        </DetailRow>

        <DetailRow icon="👤" label={isHost ? 'Attendee' : 'Host'}>
          {isHost ? attendeeName : hostName}
        </DetailRow>
      </Section>

      {/* Cancellation reason */}
      {cancellationReason && (
        <>
          <Hr style={styles.divider} />
          <Section>
            <Text style={styles.sectionTitle}>
              {isRejection ? 'Reason for declining' : 'Cancellation reason'}
            </Text>
            <Text style={styles.reasonText}>{cancellationReason}</Text>
          </Section>
        </>
      )}

      <Hr style={styles.divider} />

      {/* Rebook CTA (only for attendee) */}
      {!isHost && rebookUrl && (
        <Section style={styles.centeredSection}>
          <Button href={rebookUrl} style={styles.primaryButton}>
            Book Again
          </Button>
        </Section>
      )}

      {!isHost && !rebookUrl && (
        <Text style={styles.hint}>
          You can visit the host&apos;s booking page to schedule a new meeting.
        </Text>
      )}

      {isHost && <Text style={styles.hint}>No further action is required.</Text>}
    </EmailLayout>
  );
}

const styles = {
  centeredSection: {
    textAlign: 'center' as const,
  },
  statusIconCircle: {
    backgroundColor: colors.danger,
    borderRadius: '50%',
    color: colors.white,
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 auto 16px',
    padding: '12px 16px',
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
    backgroundColor: colors.dangerLight,
    borderRadius: '8px',
    padding: '16px 20px',
  },
  eventTitle: {
    color: colors.danger,
    fontSize: '17px',
    fontWeight: '700',
    margin: '0 0 16px',
  },
  timezone: {
    color: colors.textMuted,
    fontSize: '13px',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 8px',
  },
  reasonText: {
    backgroundColor: colors.background,
    borderLeftColor: colors.danger,
    borderLeftStyle: 'solid' as const,
    borderLeftWidth: '3px',
    borderRadius: '4px',
    color: colors.text,
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0',
    padding: '12px 16px',
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
  hint: {
    color: colors.textMuted,
    fontSize: '13px',
    lineHeight: '1.5',
    margin: '0',
    textAlign: 'center' as const,
  },
} as const;

export default BookingCancelledEmail;
