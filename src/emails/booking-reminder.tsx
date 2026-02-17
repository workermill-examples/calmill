import React from "react";

export type BookingReminderEmailProps = {
  eventTypeTitle: string;
  hostName: string;
  startTime: Date;
  attendeeTimezone: string;
  location?: string | null;
  timeUntil: string;
  rescheduleUrl: string;
  cancelUrl: string;
};

export function BookingReminderEmail(props: BookingReminderEmailProps): React.ReactElement {
  const {
    eventTypeTitle,
    hostName,
    startTime,
    timeUntil,
    location,
    rescheduleUrl,
    cancelUrl,
  } = props;

  return React.createElement(
    "div",
    null,
    React.createElement("h1", null, `Reminder: ${eventTypeTitle} in ${timeUntil}`),
    React.createElement("p", null, "Your meeting is coming up."),
    React.createElement("p", null, `Host: ${hostName}`),
    React.createElement("p", null, `Date: ${startTime.toISOString()}`),
    location && React.createElement("a", { href: location }, "Join Meeting"),
    React.createElement("a", { href: rescheduleUrl }, "Reschedule"),
    React.createElement("a", { href: cancelUrl }, "Cancel")
  );
}

export default BookingReminderEmail;
