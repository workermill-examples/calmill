"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { NoBookings, SearchEmpty } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  uid: string;
  title: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "ACCEPTED" | "CANCELLED" | "REJECTED" | "RESCHEDULED";
  attendeeName: string;
  attendeeEmail: string;
  attendeeTimezone: string;
  attendeeNotes?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  eventType: {
    id: string;
    title: string;
    color: string;
    duration: number;
  };
}

interface BookingResponse {
  bookings: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface EventType {
  id: string;
  title: string;
  color: string;
  duration: number;
}

const statusConfig = {
  PENDING: {
    variant: "warning" as const,
    label: "Pending",
  },
  ACCEPTED: {
    variant: "success" as const,
    label: "Confirmed",
  },
  CANCELLED: {
    variant: "secondary" as const,
    label: "Cancelled",
  },
  REJECTED: {
    variant: "danger" as const,
    label: "Rejected",
  },
  RESCHEDULED: {
    variant: "outline" as const,
    label: "Rescheduled",
  },
};

// Separate component for search params handling
function BookingsPageContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get filter values from URL params
  const activeTab = searchParams.get("tab") || "upcoming";
  const eventTypeFilter = searchParams.get("eventType") || "";
  const attendeeEmailFilter = searchParams.get("attendee") || "";
  const startDateFilter = searchParams.get("startDate") || "";
  const endDateFilter = searchParams.get("endDate") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");

  // Update URL params helper
  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when changing filters
    if (Object.keys(updates).some((key) => key !== "page")) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Determine status filter based on active tab
  const statusFilter = useMemo(() => {
    const now = new Date();
    switch (activeTab) {
      case "upcoming":
        return { status: "ACCEPTED", futureOnly: true };
      case "past":
        return { status: "ACCEPTED", pastOnly: true };
      case "cancelled":
        return { status: ["CANCELLED", "REJECTED", "RESCHEDULED"] };
      case "pending":
        return { status: "PENDING" };
      default:
        return {};
    }
  }, [activeTab]);

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      // Add status filter
      if (Array.isArray(statusFilter.status)) {
        statusFilter.status.forEach((status) =>
          params.append("status", status),
        );
      } else if (statusFilter.status) {
        params.set("status", statusFilter.status);
      }

      // Add date filters
      if (statusFilter.futureOnly) {
        const today = new Date().toISOString().split("T")[0];
        params.set("startDate", today);
      } else if (statusFilter.pastOnly) {
        const today = new Date().toISOString().split("T")[0];
        params.set("endDate", today);
      } else {
        if (startDateFilter) params.set("startDate", startDateFilter);
        if (endDateFilter) params.set("endDate", endDateFilter);
      }

      // Add other filters
      if (eventTypeFilter) params.set("eventTypeId", eventTypeFilter);
      if (attendeeEmailFilter) params.set("attendeeEmail", attendeeEmailFilter);
      params.set("page", currentPage.toString());
      params.set("limit", "20");

      const response = await fetch(`/api/bookings?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch bookings");
      }

      const data: BookingResponse = await response.json();
      setBookings(data.bookings);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  // Fetch event types for filter dropdown
  const fetchEventTypes = async () => {
    try {
      const response = await fetch("/api/event-types");
      if (response.ok) {
        const data = await response.json();
        setEventTypes(data.eventTypes || []);
      }
    } catch (err) {
      console.error("Error fetching event types:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchEventTypes();
  }, [
    activeTab,
    eventTypeFilter,
    attendeeEmailFilter,
    startDateFilter,
    endDateFilter,
    currentPage,
  ]);

  const formatBookingTime = (
    startTime: string,
    endTime: string,
    timezone: string,
  ) => {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const date = format(start, "MMM d, yyyy");
      const time = `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
      return { date, time };
    } catch {
      return { date: "Invalid Date", time: "Invalid Time" };
    }
  };

  const getBookingCounts = () => {
    // In a real app, these would come from a separate API endpoint or be included in the response
    return {
      upcoming: bookings.filter(
        (b) => b.status === "ACCEPTED" && new Date(b.startTime) > new Date(),
      ).length,
      past: bookings.filter(
        (b) => b.status === "ACCEPTED" && new Date(b.startTime) <= new Date(),
      ).length,
      cancelled: bookings.filter((b) =>
        ["CANCELLED", "REJECTED", "RESCHEDULED"].includes(b.status),
      ).length,
      pending: bookings.filter((b) => b.status === "PENDING").length,
    };
  };

  const counts = getBookingCounts();

  const hasActiveFilters =
    eventTypeFilter || attendeeEmailFilter || startDateFilter || endDateFilter;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
            <p className="text-muted-foreground">
              Manage your upcoming and past appointments
            </p>
          </div>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage your upcoming and past appointments
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading bookings
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <div className="mt-4">
                <Button onClick={fetchBookings} variant="outline" size="sm">
                  Try again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => updateParams({ tab: value })}
      >
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming
            {counts.upcoming > 0 && (
              <Badge variant="secondary" size="sm" className="ml-2">
                {counts.upcoming}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">
            Past
            {counts.past > 0 && (
              <Badge variant="secondary" size="sm" className="ml-2">
                {counts.past}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled
            {counts.cancelled > 0 && (
              <Badge variant="secondary" size="sm" className="ml-2">
                {counts.cancelled}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {counts.pending > 0 && (
              <Badge variant="warning" size="sm" className="ml-2">
                {counts.pending}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="flex-1">
            <Input
              placeholder="Search by attendee email..."
              value={attendeeEmailFilter}
              onChange={(e) =>
                updateParams({ attendee: e.target.value || null })
              }
              className="max-w-sm"
            />
          </div>
          <Select
            value={eventTypeFilter}
            onValueChange={(value) =>
              updateParams({ eventType: value || null })
            }
            options={[
              { value: "", label: "All event types" },
              ...eventTypes.map((et) => ({
                value: et.id,
                label: et.title,
              })),
            ]}
            placeholder="Filter by event type"
            className="min-w-48"
          />
          <div className="flex gap-2">
            <Input
              type="date"
              placeholder="Start date"
              value={startDateFilter}
              onChange={(e) =>
                updateParams({ startDate: e.target.value || null })
              }
              className="w-40"
            />
            <Input
              type="date"
              placeholder="End date"
              value={endDateFilter}
              onChange={(e) =>
                updateParams({ endDate: e.target.value || null })
              }
              className="w-40"
            />
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={() =>
                updateParams({
                  eventType: null,
                  attendee: null,
                  startDate: null,
                  endDate: null,
                })
              }
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Tab Content */}
        <TabsContent value={activeTab} className="mt-6">
          {bookings.length === 0 ? (
            hasActiveFilters ? (
              <SearchEmpty
                query={attendeeEmailFilter || eventTypeFilter || "your filters"}
                onClearSearch={() =>
                  updateParams({
                    eventType: null,
                    attendee: null,
                    startDate: null,
                    endDate: null,
                  })
                }
              />
            ) : (
              <NoBookings
                onViewEventTypes={() => router.push("/event-types")}
              />
            )
          ) : (
            <div className="space-y-4">
              {/* Bookings list */}
              {bookings.map((booking) => {
                const { date, time } = formatBookingTime(
                  booking.startTime,
                  booking.endTime,
                  booking.attendeeTimezone,
                );

                return (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {/* Color indicator */}
                          <div
                            className="w-1 h-12 rounded-full flex-shrink-0"
                            style={{ backgroundColor: booking.eventType.color }}
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Link
                                href={`/bookings/${booking.uid}`}
                                className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                              >
                                {booking.title}
                              </Link>
                              <Badge
                                variant={statusConfig[booking.status].variant}
                                size="sm"
                              >
                                {statusConfig[booking.status].label}
                              </Badge>
                            </div>

                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  📅 {date}
                                </span>
                                <span className="flex items-center gap-1">
                                  ⏰ {time}
                                </span>
                                <span className="flex items-center gap-1">
                                  ⏱️ {booking.eventType.duration} min
                                </span>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  👤 {booking.attendeeName}
                                </span>
                                <span className="flex items-center gap-1">
                                  ✉️ {booking.attendeeEmail}
                                </span>
                                {booking.location && (
                                  <span className="flex items-center gap-1">
                                    📍 {booking.location}
                                  </span>
                                )}
                              </div>

                              {booking.attendeeNotes && (
                                <div className="text-xs bg-muted p-2 rounded mt-2">
                                  <strong>Notes:</strong>{" "}
                                  {booking.attendeeNotes}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link href={`/bookings/${booking.uid}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}{" "}
                    of {pagination.total} bookings
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasPrev}
                      onClick={() =>
                        updateParams({ page: (currentPage - 1).toString() })
                      }
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1,
                      )
                        .filter((page) => {
                          // Show current page, first/last, and pages around current
                          return (
                            page === 1 ||
                            page === pagination.totalPages ||
                            Math.abs(page - pagination.page) <= 1
                          );
                        })
                        .map((page, index, pages) => {
                          // Add ellipsis if there's a gap
                          const shouldShowEllipsis =
                            index > 0 && page - pages[index - 1] > 1;

                          return (
                            <div key={page} className="flex items-center gap-1">
                              {shouldShowEllipsis && (
                                <span className="text-muted-foreground px-2">
                                  ...
                                </span>
                              )}
                              <Button
                                variant={
                                  page === pagination.page
                                    ? "primary"
                                    : "outline"
                                }
                                size="sm"
                                className="min-w-10"
                                onClick={() =>
                                  updateParams({ page: page.toString() })
                                }
                              >
                                {page}
                              </Button>
                            </div>
                          );
                        })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasNext}
                      onClick={() =>
                        updateParams({ page: (currentPage + 1).toString() })
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main component with Suspense wrapper
export default function BookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
              <p className="text-muted-foreground">
                Manage your upcoming and past appointments
              </p>
            </div>
          </div>
          <TableSkeleton />
        </div>
      }
    >
      <BookingsPageContent />
    </Suspense>
  );
}
