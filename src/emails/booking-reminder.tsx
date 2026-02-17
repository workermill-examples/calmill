import { Button, Column, Hr, Link, Row, Section, Text } from "@react-email/components";
import { EmailLayout, colors } from "./components/email-layout";
import { DetailRow } from "./components/detail-row";

export interface BookingReminderEmailProps {
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
  /** Duration in minutes */
  duration: number;
  /** Human-readable time until meeting (e.g. "1 hour", "24 hours") */
  timeUntil: string;
  /** Formatted start time in recipient's timezone */
  startTime: string;
  /** Formatted end time in recipient's timezone */
  endTime: string;
  /** Recipient's timezone */
  timezone: string;
  /** Optional location or meeting URL */
  location?: string;
  /** Direct join URL if video meeting */
  meetingUrl?: string;
  /** URL to reschedule (only shown to attendee) */
  rescheduleUrl?: string;
  /** URL to cancel (only shown to attendee) */
  cancelUrl?: string;
}

export function BookingReminderEmail({
  recipientName,
  hostName,
  attendeeName,
  isHost,
  eventTypeTitle,
  duration,
  timeUntil,
  startTime,
  endTime,
  timezone,
  location,
  meetingUrl,
  rescheduleUrl,
  cancelUrl,
}: BookingReminderEmailProps) {
  const preview = `Reminder: ${eventTypeTitle} in ${timeUntil}`;
  const otherParty = isHost ? attendeeName : hostName;

  return (
    <EmailLayout preview={preview}>
      {/* Status icon + heading */}
      <Section style={styles.centeredSection}>
        <Text style={styles.statusIcon}>⏰</Text>
      </Section>

      <Text style={styles.heading}>Your meeting is coming up</Text>
      <Text style={styles.subheading}>
        Hi {recipientName}, you have a meeting with{" "}
        <strong>{otherParty}</strong> in <strong>{timeUntil}</strong>.
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

        <DetailRow icon="👤" label={isHost ? "Attendee" : "Host"}>
          {otherParty}
        </DetailRow>

        {location && !meetingUrl && (
          <DetailRow icon="📍" label="Location">
            {location}
          </DetailRow>
        )}
      </Section>

      <Hr style={styles.divider} />

      {/* Join meeting CTA */}
      {meetingUrl && (
        <Section style={styles.centeredSection}>
          <Button href={meetingUrl} style={styles.primaryButton}>
            Join Meeting
          </Button>
          <Text style={styles.meetingLinkText}>
            Or copy the link:{" "}
            <Link href={meetingUrl} style={styles.link}>
              {meetingUrl}
            </Link>
          </Text>
        </Section>
      )}

      {/* Secondary actions (attendee only) */}
      {!isHost && rescheduleUrl && cancelUrl && (
        <Row style={styles.secondaryActions}>
          <Column style={styles.actionColumn}>
            <Link href={rescheduleUrl} style={styles.secondaryLink}>
              Reschedule
            </Link>
          </Column>
          <Column style={styles.dotColumn}>
            <Text style={styles.dot}>·</Text>
          </Column>
          <Column style={styles.actionColumn}>
            <Link href={cancelUrl} style={styles.cancelLink}>
              Cancel
            </Link>
          </Column>
        </Row>
      )}

      {!meetingUrl && !rescheduleUrl && (
        <Text style={styles.hint}>See you soon!</Text>
      )}
    </EmailLayout>
  );
}

const styles = {
  centeredSection: {
    textAlign: "center" as const,
  },
  statusIcon: {
    fontSize: "48px",
    margin: "0 auto 16px",
    textAlign: "center" as const,
  },
  heading: {
    color: colors.text,
    fontSize: "24px",
    fontWeight: "700",
    lineHeight: "1.3",
    margin: "0 0 8px",
    textAlign: "center" as const,
  },
  subheading: {
    color: colors.textMuted,
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0 0 24px",
    textAlign: "center" as const,
  },
  divider: {
    borderColor: colors.border,
    margin: "24px 0",
  },
  detailsCard: {
    backgroundColor: colors.warningLight,
    borderRadius: "8px",
    padding: "16px 20px",
  },
  eventTitle: {
    color: colors.warning,
    fontSize: "17px",
    fontWeight: "700",
    margin: "0 0 16px",
  },
  timezone: {
    color: colors.textMuted,
    fontSize: "13px",
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: "6px",
    color: colors.white,
    display: "inline-block",
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "12px",
    padding: "12px 24px",
    textDecoration: "none",
  },
  meetingLinkText: {
    color: colors.textMuted,
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "12px 0 0",
    textAlign: "center" as const,
  },
  link: {
    color: colors.primary,
    textDecoration: "none",
  },
  secondaryActions: {
    textAlign: "center" as const,
    width: "100%",
  },
  actionColumn: {
    textAlign: "center" as const,
    width: "auto",
  },
  dotColumn: {
    textAlign: "center" as const,
    width: "24px",
  },
  secondaryLink: {
    color: colors.primary,
    fontSize: "14px",
    textDecoration: "none",
  },
  dot: {
    color: colors.textMuted,
    fontSize: "14px",
    margin: "0",
  },
  cancelLink: {
    color: colors.textMuted,
    fontSize: "14px",
    textDecoration: "none",
  },
  hint: {
    color: colors.textMuted,
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "0",
    textAlign: "center" as const,
  },
} as const;

export default BookingReminderEmail;
