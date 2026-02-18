import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { EventTypeLocation, SchedulingType } from '@/types';

interface TeamPublicPageProps {
  params: Promise<{ slug: string }>;
}

// ─── ICONS ────────────────────────────────────────────────────

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

// ─── HELPERS ──────────────────────────────────────────────────

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} hr`;
  return `${hours} hr ${remaining} min`;
}

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

function getSchedulingTypeLabel(type: SchedulingType | null): string | null {
  if (type === 'ROUND_ROBIN') return 'Round Robin';
  if (type === 'COLLECTIVE') return 'Collective';
  return null;
}

function getSchedulingTypeBadgeColor(type: SchedulingType | null): string {
  if (type === 'ROUND_ROBIN') return 'bg-blue-100 text-blue-700';
  if (type === 'COLLECTIVE') return 'bg-purple-100 text-purple-700';
  return 'bg-gray-100 text-gray-700';
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────

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

  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-500">
      {icons[primary.type]}
      <span className="truncate">{primary.value || labels[primary.type]}</span>
    </div>
  );
}

interface TeamEventTypeCardProps {
  title: string;
  slug: string;
  description?: string | null;
  duration: number;
  locations?: EventTypeLocation[] | null;
  price?: number;
  currency?: string;
  color?: string | null;
  schedulingType?: SchedulingType | null;
  teamSlug: string;
}

function TeamEventTypeCard({
  title,
  slug,
  description,
  duration,
  locations,
  price = 0,
  currency = 'USD',
  color,
  schedulingType,
  teamSlug,
}: TeamEventTypeCardProps) {
  const href = `/team/${teamSlug}/${slug}`;
  const formattedPrice = formatPrice(price, currency);
  const dotColor = color ?? '#3b82f6';
  const parsedLocations = locations as EventTypeLocation[] | null;
  const schedulingLabel = getSchedulingTypeLabel(schedulingType ?? null);
  const badgeColor = getSchedulingTypeBadgeColor(schedulingType ?? null);

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

            {/* Scheduling type badge */}
            {schedulingLabel && (
              <div className="mt-2">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                    badgeColor
                  )}
                >
                  {schedulingLabel}
                </span>
              </div>
            )}

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

// ─── MEMBER AVATAR ────────────────────────────────────────────

interface MemberAvatarProps {
  name: string | null;
  avatarUrl: string | null;
}

function MemberAvatar({ name, avatarUrl }: MemberAvatarProps) {
  const initials = name ? getInitials(name) : '?';

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name ?? 'Team member'}
        title={name ?? undefined}
        className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
      />
    );
  }

  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 ring-2 ring-white"
      title={name ?? undefined}
    >
      <span className="text-xs font-semibold text-primary-600" aria-hidden="true">
        {initials}
      </span>
      <span className="sr-only">{name ?? 'Team member'}</span>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────

export default async function TeamPublicPage({ params }: TeamPublicPageProps) {
  const { slug } = await params;

  const team = await prisma.team.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      bio: true,
      members: {
        where: { accepted: true },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
      eventTypes: {
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          duration: true,
          locations: true,
          price: true,
          currency: true,
          color: true,
          schedulingType: true,
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!team) {
    notFound();
  }

  const members = team.members.map((m) => m.user);
  const eventTypes = team.eventTypes;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Team profile header */}
      <div className="text-center">
        {team.logoUrl ? (
          <img
            src={team.logoUrl}
            alt={team.name}
            className="mx-auto h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
            <span className="text-2xl font-semibold text-primary-600" aria-hidden="true">
              {getInitials(team.name) || team.name.charAt(0).toUpperCase()}
            </span>
            <span className="sr-only">{team.name}</span>
          </div>
        )}

        <h1 className="mt-4 text-2xl font-bold text-gray-900">{team.name}</h1>

        {team.bio && <p className="mt-2 text-gray-600">{team.bio}</p>}

        {/* Member avatars row */}
        {members.length > 0 && (
          <div
            className="mt-4 flex items-center justify-center"
            aria-label={`${members.length} team member${members.length !== 1 ? 's' : ''}`}
          >
            <div className="flex -space-x-2">
              {members.map((member) => (
                <MemberAvatar key={member.id} name={member.name} avatarUrl={member.avatarUrl} />
              ))}
            </div>
            <span className="ml-3 text-sm text-gray-500">
              {members.length} member{members.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Event types grid */}
      {eventTypes.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="mt-4 text-sm text-gray-600">No available event types</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {eventTypes.map((eventType) => (
            <TeamEventTypeCard
              key={eventType.id}
              title={eventType.title}
              slug={eventType.slug}
              description={eventType.description}
              duration={eventType.duration}
              locations={eventType.locations as EventTypeLocation[] | null}
              price={eventType.price}
              currency={eventType.currency}
              color={eventType.color}
              schedulingType={eventType.schedulingType}
              teamSlug={slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
