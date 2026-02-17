import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getInitials } from "@/lib/utils";
import { EventTypeCard } from "@/components/booking/event-type-card";
import type { EventTypeLocation } from "@/types";

interface PublicProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      avatarUrl: true,
      bio: true,
    },
  });

  if (!user) {
    notFound();
  }

  const eventTypes = await prisma.eventType.findMany({
    where: {
      userId: user.id,
      isActive: true,
    },
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
    },
    orderBy: { createdAt: "asc" },
  });

  const initials = user.name ? getInitials(user.name) : username.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* User profile header */}
      <div className="text-center">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name ?? username}
            className="mx-auto h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
            <span className="text-2xl font-semibold text-primary-600" aria-hidden="true">
              {initials}
            </span>
            <span className="sr-only">{user.name ?? username}</span>
          </div>
        )}

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          {user.name ?? `@${username}`}
        </h1>

        {user.bio && (
          <p className="mt-2 text-gray-600">{user.bio}</p>
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
            <EventTypeCard
              key={eventType.id}
              title={eventType.title}
              slug={eventType.slug}
              description={eventType.description}
              duration={eventType.duration}
              locations={eventType.locations as EventTypeLocation[] | null}
              price={eventType.price}
              currency={eventType.currency}
              color={eventType.color}
              username={username}
            />
          ))}
        </div>
      )}
    </div>
  );
}
