"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  ExternalLink,
  Copy,
  Trash2,
  Edit,
  MoreVertical
} from "lucide-react";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/dropdown";

interface EventType {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: number;
  isActive: boolean;
  color: string;
  bookingCount: number;
  schedule?: {
    id: string;
    name: string;
    timezone: string;
  } | null;
}

interface EventTypesResponse {
  eventTypes: EventType[];
}

function EventTypesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetchEventTypes();
  }, [showInactive]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchEventTypes = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = new URL('/api/event-types', window.location.origin);
      if (showInactive) {
        url.searchParams.set('includeInactive', 'true');
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Failed to fetch event types');
      }

      const data: EventTypesResponse = await response.json();
      setEventTypes(data.eventTypes);
    } catch (err) {
      console.error('Error fetching event types:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch event types');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (eventTypeId: string) => {
    try {
      const response = await fetch(`/api/event-types/${eventTypeId}/toggle`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle event type');
      }

      const data = await response.json();

      // Update local state
      setEventTypes(prev =>
        prev.map(et =>
          et.id === eventTypeId
            ? { ...et, isActive: data.eventType.isActive }
            : et
        )
      );
    } catch (err) {
      console.error('Error toggling event type:', err);
      // Show error feedback to user
      alert(err instanceof Error ? err.message : 'Failed to toggle event type');
    }
  };

  const handleDuplicate = async (eventType: EventType) => {
    try {
      const response = await fetch('/api/event-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventType,
          title: `${eventType.title} (Copy)`,
          slug: `${eventType.slug}-copy-${Date.now()}`,
          scheduleId: eventType.schedule?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to duplicate event type');
      }

      // Refresh the list
      await fetchEventTypes();
    } catch (err) {
      console.error('Error duplicating event type:', err);
      alert(err instanceof Error ? err.message : 'Failed to duplicate event type');
    }
  };

  const handleDelete = async (eventTypeId: string) => {
    if (!confirm('Are you sure you want to delete this event type? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/event-types/${eventTypeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete event type');
      }

      // Remove from local state
      setEventTypes(prev => prev.filter(et => et.id !== eventTypeId));
    } catch (err) {
      console.error('Error deleting event type:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete event type');
    }
  };

  const copyEventTypeUrl = (eventType: EventType) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/demo/${eventType.slug}`;
    navigator.clipboard.writeText(url);

    // Show feedback (you could use a toast here instead)
    const button = document.activeElement as HTMLButtonElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    }
  };

  // Filter event types based on search query
  const filteredEventTypes = eventTypes.filter(et =>
    et.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    et.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeEventTypes = filteredEventTypes.filter(et => et.isActive);
  const inactiveEventTypes = filteredEventTypes.filter(et => !et.isActive);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load event types"
        description={error}
        onRetry={fetchEventTypes}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Types</h1>
          <p className="text-muted-foreground">
            Manage your schedulable meeting types
          </p>
        </div>
        <Button>
          <Link href="/event-types/new" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Event Type
          </Link>
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search event types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Toggle
            pressed={showInactive}
            onPressedChange={setShowInactive}
            aria-label="Show inactive event types"
          >
            Show Inactive
          </Toggle>
        </div>
      </div>

      {/* Event types list */}
      {filteredEventTypes.length === 0 ? (
        <EmptyState
          title="No event types found"
          description={
            searchQuery
              ? "No event types match your search criteria."
              : "Create your first event type to start accepting bookings."
          }
          action={{
            text: "Create Event Type",
            onClick: () => window.location.href = '/event-types/new'
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Active Event Types */}
          {activeEventTypes.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Active Event Types ({activeEventTypes.length})
              </h2>
              <div className="grid gap-4">
                {activeEventTypes.map((eventType) => (
                  <EventTypeCard
                    key={eventType.id}
                    eventType={eventType}
                    onToggleActive={handleToggleActive}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                    onCopyUrl={copyEventTypeUrl}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Inactive Event Types */}
          {showInactive && inactiveEventTypes.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-muted-foreground mb-4">
                Inactive Event Types ({inactiveEventTypes.length})
              </h2>
              <div className="grid gap-4">
                {inactiveEventTypes.map((eventType) => (
                  <EventTypeCard
                    key={eventType.id}
                    eventType={eventType}
                    onToggleActive={handleToggleActive}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                    onCopyUrl={copyEventTypeUrl}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface EventTypeCardProps {
  eventType: EventType;
  onToggleActive: (id: string) => void;
  onDuplicate: (eventType: EventType) => void;
  onDelete: (id: string) => void;
  onCopyUrl: (eventType: EventType) => void;
}

function EventTypeCard({
  eventType,
  onToggleActive,
  onDuplicate,
  onDelete,
  onCopyUrl
}: EventTypeCardProps) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const publicUrl = `${baseUrl}/demo/${eventType.slug}`;

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${!eventType.isActive ? 'opacity-60' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          {/* Color bar */}
          <div
            className="w-1 h-16 rounded-full flex-shrink-0"
            style={{ backgroundColor: eventType.color }}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {eventType.title}
                </h3>
                {eventType.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {eventType.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {eventType.duration}m
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {eventType.bookingCount} bookings
                  </div>
                  {eventType.schedule && (
                    <Badge variant="secondary" className="text-xs">
                      {eventType.schedule.name}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <Toggle
                  pressed={eventType.isActive}
                  onPressedChange={() => onToggleActive(eventType.id)}
                  aria-label={`${eventType.isActive ? 'Deactivate' : 'Activate'} ${eventType.title}`}
                  size="sm"
                >
                  {eventType.isActive ? 'Active' : 'Inactive'}
                </Toggle>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCopyUrl(eventType)}
                  className="hidden sm:flex"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `/event-types/${eventType.id}`}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>

                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-2"
                      aria-label="More actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownContent align="end">
                    <DropdownItem
                      onClick={() => onCopyUrl(eventType)}
                      className="sm:hidden"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownItem>
                    <DropdownItem onClick={() => onDuplicate(eventType)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem
                      onClick={() => onDelete(eventType.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownItem>
                  </DropdownContent>
                </Dropdown>
              </div>
            </div>

            {/* Public URL */}
            <div className="mt-3 p-2 bg-muted rounded-lg text-sm text-muted-foreground">
              <span className="font-mono">{publicUrl}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EventTypesPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <EventTypesContent />
    </Suspense>
  );
}