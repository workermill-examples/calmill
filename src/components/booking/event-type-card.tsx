import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { EventTypeLocation } from '@/types';

export interface EventTypeCardProps {
  title: string;
  slug: string;
  description?: string | null;
  duration: number;
  locations?: EventTypeLocation[] | null;
  price?: number;
  currency?: string;
  color?: string | null;
  username: string;
}

/**
 * Format duration in minutes to a human-readable string.
 * e.g. 30 → "30 min", 60 → "1 hr", 90 → "1 hr 30 min"
 */
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} hr`;
  return `${hours} hr ${remaining} min`;
}

/**
 * Format a price in cents to a currency string.
 * Returns null for free events (price === 0).
 */
function formatPrice(cents: number, currency: string): string | null {
  if (cents === 0) return null;
  const amount = cents / 100;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `$${amount}`;
  }
}

/** Icon for video/link meeting type */
function VideoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10l4.553-2.276A1 1 0 0121 8.72v6.56a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

/** Icon for in-person meeting type */
function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

/** Icon for phone meeting type */
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"
      />
    </svg>
  );
}

/** Arrow icon for card link */
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

/** Clock icon for duration */
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function LocationDisplay({ locations }: { locations: EventTypeLocation[] }) {
  const primary = locations[0];
  if (!primary) return null;

  const icons = {
    link: <VideoIcon className="text-gray-400" />,
    inPerson: <LocationIcon className="text-gray-400" />,
    phone: <PhoneIcon className="text-gray-400" />,
  };

  const labels = {
    link: 'Video call',
    inPerson: 'In-person',
    phone: 'Phone call',
  };

  const icon = icons[primary.type];
  const label = primary.value || labels[primary.type];

  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-500">
      {icon}
      <span className="truncate">{label}</span>
    </div>
  );
}

/**
 * EventTypeCard — public booking profile card for a single event type.
 * Renders title, duration badge, description, location, and optional price.
 * Links to the booking page at /[username]/[slug].
 */
export function EventTypeCard({
  title,
  slug,
  description,
  duration,
  locations,
  price = 0,
  currency = 'USD',
  color,
  username,
}: EventTypeCardProps) {
  const href = `/${username}/${slug}`;
  const formattedPrice = formatPrice(price, currency);
  const parsedLocations = locations as EventTypeLocation[] | null;

  // Dot color: use event type color or default to primary blue
  const dotColor = color ?? '#3b82f6';

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex flex-col rounded-lg border border-gray-200 bg-white p-6',
        'transition-shadow duration-150 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'
      )}
      aria-label={`Book ${title} — ${formatDuration(duration)}`}
    >
      {/* Color bar at top of card */}
      <div
        className="absolute inset-x-0 top-0 h-1 rounded-t-lg"
        style={{ backgroundColor: dotColor }}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {/* Color dot */}
          <div
            className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: dotColor }}
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1">
            {/* Title */}
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {title}
            </h3>

            {/* Duration badge */}
            <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
              <ClockIcon />
              <span>{formatDuration(duration)}</span>
            </div>

            {/* Description — max 2 lines */}
            {description && (
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">{description}</p>
            )}

            {/* Location */}
            {parsedLocations && parsedLocations.length > 0 && (
              <div className="mt-2">
                <LocationDisplay locations={parsedLocations} />
              </div>
            )}

            {/* Price (only shown if non-zero) */}
            {formattedPrice && (
              <div className="mt-2 text-sm font-medium text-gray-900">{formattedPrice}</div>
            )}
          </div>
        </div>

        {/* Arrow icon */}
        <div className="shrink-0 text-gray-400 transition-transform duration-150 group-hover:translate-x-1 group-hover:text-primary-600">
          <ArrowRightIcon />
        </div>
      </div>
    </Link>
  );
}
