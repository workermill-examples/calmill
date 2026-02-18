'use client';

import * as React from 'react';
import { BookingPageClient } from '@/components/booking/booking-page-client';
import type { EventTypeLocation, CustomQuestion } from '@/types';

export interface EmbedBookingPageClientProps {
  eventTypeId: string;
  eventTypeTitle: string;
  duration: number;
  color: string | null;
  username: string;
  locations: EventTypeLocation[] | null;
  customQuestions: CustomQuestion[];
  weekStart?: 0 | 1;
  initialDate?: string | null;
  initialTimezone?: string | null;
  theme?: 'light' | 'dark';
  hideEventDetails?: boolean;
}

/**
 * EmbedBookingPageClient — wraps BookingPageClient for iframe embedding.
 *
 * Adds:
 * - postMessage({ type: "calmill:resize", height: N }) on content height change
 * - postMessage({ type: "calmill:booked", booking: { uid, title, startTime } }) on success
 * - theme-aware background (transparent for light, dark bg for dark)
 * - pre-set timezone from query param
 *
 * The parent window (calmill-embed.js) listens for these messages to:
 * - Resize the iframe to match content height (eliminating scrollbars)
 * - Notify the host page when a booking is completed
 */
export function EmbedBookingPageClient({
  eventTypeId,
  eventTypeTitle,
  duration,
  color,
  username,
  locations,
  customQuestions,
  weekStart = 0,
  initialDate,
  initialTimezone,
  theme = 'light',
  hideEventDetails = false,
}: EmbedBookingPageClientProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Send resize messages whenever content height changes
  React.useEffect(() => {
    const sendHeight = () => {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: 'calmill:resize', height }, '*');
    };

    // Send immediately on mount
    sendHeight();

    // Observe DOM size changes
    const observer = new ResizeObserver(sendHeight);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    // Also observe body in case layout shifts happen outside container
    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);

  // Handle successful booking — notify parent and optionally redirect within embed
  const handleBookingSuccess = (booking: Record<string, unknown>) => {
    const uid = booking.uid as string;
    const startTime = booking.startTime as string | undefined;

    // Notify host page about completed booking
    window.parent.postMessage(
      {
        type: 'calmill:booked',
        booking: {
          uid,
          title: eventTypeTitle,
          startTime: startTime ?? null,
        },
      },
      '*'
    );

    // Navigate within the iframe to the booking confirmation
    if (uid) {
      window.location.href = `/booking/${uid}`;
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      ref={containerRef}
      className={isDark ? 'bg-gray-900 text-white min-h-screen' : 'bg-white min-h-screen'}
      data-calmill-theme={theme}
    >
      <div className="p-4 sm:p-6">
        <BookingPageClient
          eventTypeId={eventTypeId}
          eventTypeTitle={eventTypeTitle}
          duration={duration}
          color={color}
          username={username}
          locations={hideEventDetails ? null : locations}
          customQuestions={customQuestions}
          weekStart={weekStart}
          initialDate={initialDate ?? undefined}
          initialTimezone={initialTimezone ?? undefined}
          onBookingSuccess={handleBookingSuccess}
          isEmbed
        />
      </div>
    </div>
  );
}
