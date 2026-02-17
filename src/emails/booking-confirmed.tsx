import React from "react";

export type BookingConfirmedEmailProps = {
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

export function BookingConfirmedEmail(props: BookingConfirmedEmailProps): React.ReactElement {
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
    React.createElement("h1", null, `Your meeting with ${hostName} is confirmed`),
    React.createElement("p", null, `Hi ${attendeeName},`),
    React.createElement("p", null, `Your ${eventTypeDuration}-minute ${eventTypeTitle} has been scheduled.`),
    React.createElement("p", null, `Date: ${startTime.toISOString()}`),
    location && React.createElement("p", null, `Location: ${location}`),
    React.createElement("a", { href: rescheduleUrl }, "Reschedule"),
    React.createElement("a", { href: cancelUrl }, "Cancel")
  );
}

export default BookingConfirmedEmail;
