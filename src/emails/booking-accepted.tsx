import React from "react";

export type BookingAcceptedEmailProps = {
  hostName: string;
  eventTypeTitle: string;
  eventTypeDuration: number;
  startTime: Date;
  attendeeTimezone: string;
  attendeeName: string;
  location?: string | null;
  rescheduleUrl: string;
  cancelUrl: string;
};

export function BookingAcceptedEmail(props: BookingAcceptedEmailProps): React.ReactElement {
  const {
    hostName,
    eventTypeTitle,
    eventTypeDuration,
    startTime,
    attendeeName,
    location,
    rescheduleUrl,
    cancelUrl,
  } = props;

  return React.createElement(
    "div",
    null,
    React.createElement("h1", null, `Meeting confirmed: ${eventTypeTitle} with ${hostName}`),
    React.createElement("p", null, `Hi ${attendeeName}, your meeting has been confirmed by the host.`),
    React.createElement("p", null, `Duration: ${eventTypeDuration} minutes`),
    React.createElement("p", null, `Date: ${startTime.toISOString()}`),
    location && React.createElement("p", null, `Location: ${location}`),
    React.createElement("a", { href: rescheduleUrl }, "Reschedule"),
    React.createElement("a", { href: cancelUrl }, "Cancel")
  );
}

export default BookingAcceptedEmail;
