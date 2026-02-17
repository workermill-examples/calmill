import React from "react";

export type BookingCancelledEmailProps = {
  eventTypeTitle: string;
  startTime: Date;
  attendeeTimezone: string;
  cancellationReason?: string | null;
  rebookUrl: string;
};

export function BookingCancelledEmail(props: BookingCancelledEmailProps): React.ReactElement {
  const { eventTypeTitle, startTime, cancellationReason, rebookUrl } = props;

  return React.createElement(
    "div",
    null,
    React.createElement("h1", null, `Meeting cancelled: ${eventTypeTitle}`),
    React.createElement("p", null, "Your meeting has been cancelled."),
    React.createElement("p", null, `Original date: ${startTime.toISOString()}`),
    cancellationReason &&
      React.createElement("p", null, `Reason: ${cancellationReason}`),
    React.createElement("a", { href: rebookUrl }, "Rebook")
  );
}

export default BookingCancelledEmail;
