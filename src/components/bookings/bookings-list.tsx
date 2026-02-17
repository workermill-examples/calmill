"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { BookingCard, type BookingCardData } from "./booking-card";
import type { BookingStatus } from "@/generated/prisma/client";
import type { EventTypeLocation } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "upcoming" | "past" | "cancelled";

interface Tab {
  key: TabKey;
  label: string;
}

const TABS: Tab[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "cancelled", label: "Cancelled" },
];

// Map tab to query params
const TAB_QUERY: Record<TabKey, { statuses: BookingStatus[]; direction: "upcoming" | "past" }> = {
  upcoming: { statuses: ["PENDING", "ACCEPTED"], direction: "upcoming" },
  past: { statuses: ["ACCEPTED", "REJECTED", "RESCHEDULED"], direction: "past" },
  cancelled: { statuses: ["CANCELLED"], direction: "past" },
};

interface BookingsListProps {
  initialBookings: BookingCardData[];
  initialTotal: number;
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: TabKey }) {
  const messages: Record<TabKey, { title: string; body: string }> = {
    upcoming: {
      title: "No upcoming bookings",
      body: "Upcoming bookings will appear here once people start scheduling time with you.",
    },
    past: {
      title: "No past bookings",
      body: "Completed bookings will appear here.",
    },
    cancelled: {
      title: "No cancelled bookings",
      body: "Cancelled or rejected bookings will appear here.",
    },
  };
  const { title, body } = messages[tab];

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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{body}</p>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-0">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
              if (idx > 0 && (arr[idx - 1] as number) + 1 < p) {
                acc.push("...");
              }
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p as number)}
                  aria-current={p === page ? "page" : undefined}
                  className={cn(
                    "relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus-ring",
                    p === page
                      ? "z-10 bg-primary-600 text-white ring-primary-600 hover:bg-primary-700"
                      : "text-gray-900"
                  )}
                >
                  {p}
                </button>
              )
            )}

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BookingsList({ initialBookings, initialTotal }: BookingsListProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");
  const [bookings, setBookings] = useState<BookingCardData[]>(initialBookings);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Track if this is the initial render (use server-fetched data)
  const isInitialRender = useRef(true);

  const fetchBookings = useCallback(
    async (tab: TabKey, currentPage: number, searchTerm: string, start: string, end: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        const tabConfig = TAB_QUERY[tab];

        // For each status in the tab, we make one call or pass multi-status.
        // The API only supports single status filter, so we fetch with each
        // status and merge results for tabs with multiple statuses.
        // For simplicity, we fetch for each status and combine.
        const allResults: BookingCardData[] = [];
        let totalCount = 0;

        // Build base params
        if (start) params.set("startDate", start);
        if (end) params.set("endDate", end);

        // For "upcoming" tab without user-specified dates, default to future bookings
        const now = new Date();
        if (!start && !end && tabConfig.direction === "upcoming") {
          params.set("startDate", now.toISOString());
        }
        // For "past" and "cancelled" tabs, we don't impose a date ceiling by default
        // so that future-dated rejected/rescheduled bookings are still visible

        params.set("page", String(currentPage));
        params.set("limit", "20");

        // Fetch for each status in the tab
        // For tabs with multiple statuses, we need multiple requests or
        // we accept showing partial results. The API doesn't support multi-status.
        // We use the primary status for single-status tabs and first status for multi.
        // For "upcoming" tab (PENDING+ACCEPTED), we fetch without status filter
        // then filter client-side.
        if (tabConfig.statuses.length === 1) {
          params.set("status", tabConfig.statuses[0]);
          const res = await fetch(`/api/bookings?${params.toString()}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              allResults.push(...deserializeBookings(data.data));
              totalCount = data.pagination?.total ?? 0;
            }
          }
        } else {
          // Multiple statuses: fetch each and merge (for pagination accuracy,
          // we only fetch page 1 of each and combine — acceptable tradeoff)
          const fetchPromises = tabConfig.statuses.map(async (status) => {
            const statusParams = new URLSearchParams(params);
            statusParams.set("status", status);
            statusParams.set("page", "1");
            statusParams.set("limit", "20");
            const res = await fetch(`/api/bookings?${statusParams.toString()}`);
            if (!res.ok) return { items: [], total: 0 };
            const data = await res.json();
            if (!data.success) return { items: [], total: 0 };
            return {
              items: deserializeBookings(data.data) as BookingCardData[],
              total: (data.pagination?.total ?? 0) as number,
            };
          });

          const results = await Promise.all(fetchPromises);
          for (const r of results) {
            allResults.push(...r.items);
            totalCount += r.total;
          }

          // Sort combined results
          allResults.sort((a, b) => {
            const aTime = new Date(a.startTime).getTime();
            const bTime = new Date(b.startTime).getTime();
            return tabConfig.direction === "upcoming" ? aTime - bTime : bTime - aTime;
          });

          // Simple client-side pagination for combined results
          const pageSize = 20;
          const startIdx = (currentPage - 1) * pageSize;
          allResults.splice(0, startIdx);
          allResults.splice(pageSize);
        }

        // Client-side search filter (attendee name/email)
        const filtered = searchTerm
          ? allResults.filter(
              (b) =>
                b.attendeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.attendeeEmail.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : allResults;

        setBookings(filtered);
        setTotal(searchTerm ? filtered.length : totalCount);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch when tab/page/filters change (but not on initial render — use server data)
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    fetchBookings(activeTab, page, search, startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page]);

  function handleTabChange(tab: TabKey) {
    // Mark past initial render so the effect triggers a fetch
    isInitialRender.current = false;
    setActiveTab(tab);
    setPage(1);
    setSearch("");
    setStartDate("");
    setEndDate("");
  }

  function handleSearch(value: string) {
    setSearch(value);
    fetchBookings(activeTab, page, value, startDate, endDate);
  }

  function handleApplyFilters() {
    setPage(1);
    isInitialRender.current = false;
    fetchBookings(activeTab, 1, search, startDate, endDate);
  }

  function handleClearFilters() {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
    isInitialRender.current = false;
    fetchBookings(activeTab, 1, "", "", "");
  }

  const hasFilters = search || startDate || endDate;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Bookings</h2>
        <p className="mt-1 text-sm text-gray-600">
          View and manage all your scheduled bookings
        </p>
      </div>

      {/* Tab bar */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6" aria-label="Booking tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={cn(
                "whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              )}
              aria-current={activeTab === tab.key ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        {/* Search */}
        <div className="flex-1">
          <label htmlFor="booking-search" className="block text-xs font-medium text-gray-700 mb-1">
            Search by attendee
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="booking-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
              placeholder="Name or email…"
              className="block w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Date range */}
        <div className="flex items-end gap-2">
          <div>
            <label htmlFor="start-date" className="block text-xs font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-xs font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Filter action buttons */}
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 focus-ring transition-colors"
          >
            Apply
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-ring transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <>
          {/* Booking cards */}
          <div className="space-y-3">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.uid}
                booking={booking}
                onStatusChange={() => {
                  // Re-fetch after status change to keep tabs accurate
                  fetchBookings(activeTab, page, search, startDate, endDate);
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              setPage(p);
              isInitialRender.current = false;
            }}
          />
        </>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deserializeBookings(data: unknown[]): BookingCardData[] {
  return (data as BookingCardData[]).map((b) => ({
    ...b,
    startTime: new Date(b.startTime as unknown as string),
    endTime: new Date(b.endTime as unknown as string),
    eventType: {
      ...b.eventType,
      locations: (b.eventType.locations as EventTypeLocation[] | null) ?? null,
    },
  }));
}
