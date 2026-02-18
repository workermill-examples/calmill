'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EventTypeCard, type EventTypeCardData } from '@/components/event-types/event-type-card';
import { CreateDialog } from '@/components/event-types/create-dialog';

interface EventTypeListClientProps {
  initialEventTypes: EventTypeCardData[];
  username: string;
  appUrl: string;
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
          <svg
            className="h-6 w-6 text-primary-600"
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
        <h3 className="mt-4 text-lg font-medium text-gray-900">No event types yet</h3>
        <p className="mt-2 text-sm text-gray-600">
          Create your first event type to start accepting bookings.
        </p>
        <div className="mt-6">
          <Button variant="primary" onClick={onCreateClick}>
            Create your first event type
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EventTypeListClient({
  initialEventTypes,
  username,
  appUrl,
}: EventTypeListClientProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Event Types</h2>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage your event types for scheduling
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          New Event Type
        </Button>
      </div>

      {/* Event type list or empty state */}
      {initialEventTypes.length === 0 ? (
        <EmptyState onCreateClick={() => setCreateOpen(true)} />
      ) : (
        <div className="space-y-3">
          {initialEventTypes.map((et) => (
            <EventTypeCard key={et.id} eventType={et} username={username} appUrl={appUrl} />
          ))}
        </div>
      )}

      {/* Create dialog */}
      <CreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
