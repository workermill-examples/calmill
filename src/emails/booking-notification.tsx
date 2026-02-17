import React from "react";

export type BookingNotificationEmailProps = {
  attendeeName: string;
  attendeeEmail: string;
  eventTypeTitle: string;
  eventTypeDuration: number;
  startTime: Date;
  hostTimezone: string;
  notes?: string | null;
  dashboardUrl: string;
};

export function BookingNotificationEmail(props: BookingNotificationEmailProps): React.ReactElement {
  const {
    attendeeName,
    attendeeEmail,
    eventTypeTitle,
    eventTypeDuration,
    startTime,
    notes,
    dashboardUrl,
  } = props;

  return React.createElement(
    "div",
    null,
    React.createElement("h1", null, `New booking: ${attendeeName} - ${eventTypeTitle}`),
    React.createElement("p", null, `You have a new booking from ${attendeeName} (${attendeeEmail})`),
    React.createElement("p", null, `Duration: ${eventTypeDuration} minutes`),
    React.createElement("p", null, `Date: ${startTime.toISOString()}`),
    notes && React.createElement("p", null, `Notes: ${notes}`),
    React.createElement("a", { href: dashboardUrl }, "View Booking")
  );
}

export default BookingNotificationEmail;
