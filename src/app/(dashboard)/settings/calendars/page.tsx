'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalendarConnection {
  id: string;
  email: string;
  isPrimary: boolean;
  expiresAt: string | null;
  createdAt: string;
}

// ─── Google Icon ──────────────────────────────────────────────────────────────

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('h-5 w-5', className)} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── CalendarCard ─────────────────────────────────────────────────────────────

interface CalendarCardProps {
  connection: CalendarConnection;
  onDisconnect: (id: string) => Promise<void>;
  isDisconnecting: boolean;
}

function CalendarCard({ connection, onDisconnect, isDisconnecting }: CalendarCardProps) {
  const connectedDate = new Date(connection.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 border border-gray-200">
          <GoogleIcon />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900">{connection.email}</p>
            {connection.isPrimary && (
              <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 border border-primary-200">
                Primary
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Connected {connectedDate}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDisconnect(connection.id)}
        loading={isDisconnecting}
        disabled={isDisconnecting}
      >
        Disconnect
      </Button>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

function CalendarsSettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const justConnected = searchParams.get('connected') === 'true';

  // Fetch connected calendars
  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch('/api/integrations/google/calendars');
      if (!res.ok) {
        throw new Error('Failed to load calendar connections');
      }
      const data = await res.json();
      setConnections(data.data ?? []);
    } catch {
      setError('Failed to load calendar connections. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  // Remove ?connected=true from URL after showing the success banner
  useEffect(() => {
    if (justConnected) {
      const timeout = setTimeout(() => {
        router.replace('/settings/calendars', { scroll: false });
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [justConnected, router]);

  // Open OAuth popup to connect Google Calendar
  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const res = await fetch('/api/integrations/google/connect');
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Failed to start Google Calendar connection');
        return;
      }

      const { url } = await res.json();

      // Open OAuth popup
      const popup = window.open(
        url,
        'google-oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        // Popup was blocked — fallback to redirect
        window.location.href = url;
        return;
      }

      // Poll until popup closes, then refresh connections
      const pollInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollInterval);
          setIsConnecting(false);
          fetchConnections();
        }
      }, 500);
    } catch {
      setError('Failed to connect Google Calendar. Please try again.');
      setIsConnecting(false);
    }
  };

  // Disconnect a calendar connection
  const handleDisconnect = async (connectionId: string) => {
    setDisconnectingId(connectionId);
    setError(null);

    try {
      const res = await fetch('/api/integrations/google/disconnect', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Failed to disconnect calendar');
        return;
      }

      // Remove from local state
      setConnections((prev) => prev.filter((c) => c.id !== connectionId));
    } catch {
      setError('Failed to disconnect calendar. Please try again.');
    } finally {
      setDisconnectingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Calendar Integrations</h2>
        <p className="mt-1 text-sm text-gray-500">
          Connect your calendars so CalMill can check your availability when calculating open time
          slots.
        </p>
      </div>

      {/* Success banner */}
      {justConnected && (
        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <svg
            className="h-5 w-5 text-green-600 mt-0.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-green-800">
              Google Calendar connected successfully
            </p>
            <p className="text-sm text-green-700 mt-0.5">
              CalMill will now check your Google Calendar for conflicts when showing available time
              slots.
            </p>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <svg
            className="h-5 w-5 text-red-500 mt-0.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Connected calendars section */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Connected Calendars</h3>
            <p className="mt-0.5 text-sm text-gray-500">Your connected calendar accounts</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConnect}
            loading={isConnecting}
            disabled={isConnecting}
          >
            <span className="flex items-center gap-2">
              {!isConnecting && (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              )}
              Connect Google Calendar
            </span>
          </Button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 animate-pulse"
                >
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 rounded bg-gray-200" />
                    <div className="h-3 w-32 rounded bg-gray-200" />
                  </div>
                  <div className="h-8 w-24 rounded-md bg-gray-200" />
                </div>
              ))}
            </div>
          ) : connections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
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
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">No calendars connected</p>
              <p className="mt-1 text-sm text-gray-500 max-w-sm">
                Connect your Google Calendar to automatically check for scheduling conflicts.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConnect}
                loading={isConnecting}
                disabled={isConnecting}
                className="mt-4"
              >
                <span className="flex items-center gap-2">
                  <GoogleIcon className="h-4 w-4" />
                  Connect Google Calendar
                </span>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {connections.map((connection) => (
                <CalendarCard
                  key={connection.id}
                  connection={connection}
                  onDisconnect={handleDisconnect}
                  isDisconnecting={disconnectingId === connection.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Explanation section */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h3 className="text-sm font-semibold text-gray-900">How calendar integration works</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <svg
              className="h-4 w-4 text-primary-500 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            CalMill reads your calendar to find busy times and hides those slots from your booking
            page.
          </li>
          <li className="flex items-start gap-2">
            <svg
              className="h-4 w-4 text-primary-500 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            When a booking is confirmed, CalMill creates an event on your calendar automatically.
          </li>
          <li className="flex items-start gap-2">
            <svg
              className="h-4 w-4 text-primary-500 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            CalMill only requests calendar access — it never modifies or deletes events you
            didn&apos;t create through CalMill.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function CalendarsSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div>
            <div className="h-8 w-56 rounded bg-gray-200 animate-pulse" />
            <div className="mt-2 h-4 w-96 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="p-6 space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 animate-pulse"
                >
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 rounded bg-gray-200" />
                    <div className="h-3 w-32 rounded bg-gray-200" />
                  </div>
                  <div className="h-8 w-24 rounded-md bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <CalendarsSettingsContent />
    </Suspense>
  );
}
