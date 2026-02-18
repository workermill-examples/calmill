import Link from 'next/link';
import { cn } from '@/lib/utils';

interface StatCard {
  label: string;
  value: string | number;
  description: string;
  href: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}

interface StatCardsProps {
  upcomingCount: number;
  pendingCount: number;
  monthlyCount: number;
  popularEventType: { title: string; count: number } | null;
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-6 w-6', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-6 w-6', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-6 w-6', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-6 w-6', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function StatCards({
  upcomingCount,
  pendingCount,
  monthlyCount,
  popularEventType,
}: StatCardsProps) {
  const cards: StatCard[] = [
    {
      label: 'Upcoming',
      value: upcomingCount,
      description: 'Confirmed in next 7 days',
      href: '/bookings',
      icon: <CalendarIcon className="text-blue-600" />,
      colorClass: 'text-blue-700',
      bgClass: 'bg-blue-50',
    },
    {
      label: 'Pending',
      value: pendingCount,
      description: 'Awaiting your response',
      href: '/bookings',
      icon: <ClockIcon className="text-yellow-600" />,
      colorClass: 'text-yellow-700',
      bgClass: 'bg-yellow-50',
    },
    {
      label: 'This Month',
      value: monthlyCount,
      description: 'Total bookings this month',
      href: '/bookings',
      icon: <InboxIcon className="text-green-600" />,
      colorClass: 'text-green-700',
      bgClass: 'bg-green-50',
    },
    {
      label: 'Popular',
      value: popularEventType?.title ?? '—',
      description: popularEventType
        ? `${popularEventType.count} booking${popularEventType.count === 1 ? '' : 's'} total`
        : 'No bookings yet',
      href: '/event-types',
      icon: <StarIcon className="text-purple-600" />,
      colorClass: 'text-purple-700',
      bgClass: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Link
          key={card.label}
          href={card.href}
          className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <div className="flex items-center justify-between">
            <div
              className={cn('flex h-10 w-10 items-center justify-center rounded-lg', card.bgClass)}
            >
              {card.icon}
            </div>
            <ChevronRightIcon className="text-gray-400 transition-transform group-hover:translate-x-0.5" />
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p
              className={cn('mt-1 truncate text-2xl font-bold', card.colorClass)}
              title={typeof card.value === 'string' ? card.value : undefined}
            >
              {card.value}
            </p>
            <p className="mt-1 text-xs text-gray-500">{card.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
