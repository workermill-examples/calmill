'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TimezoneSelectProps {
  value: string;
  onChange: (timezone: string) => void;
  className?: string;
}

/** Chevron down icon */
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/** Globe/timezone icon */
function GlobeIcon({ className }: { className?: string }) {
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
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  );
}

/** Search icon */
function SearchIcon({ className }: { className?: string }) {
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
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

/** Get UTC offset string for a timezone, e.g. "UTC-5" or "UTC+5:30" */
function getUtcOffset(timezone: string): string {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    }).formatToParts(now);
    const offsetPart = parts.find((p) => p.type === 'timeZoneName');
    if (offsetPart) {
      // "GMT-5" → "UTC-5", "GMT+5:30" → "UTC+5:30"
      return offsetPart.value.replace('GMT', 'UTC');
    }
    return 'UTC';
  } catch {
    return 'UTC';
  }
}

/** Get numeric offset minutes for sorting */
function getOffsetMinutes(timezone: string): number {
  try {
    const now = new Date();
    const utc = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    );
    const local = new Date(now.toLocaleString('en-US', { timeZone: timezone })).getTime();
    return Math.round((local - utc) / 60000);
  } catch {
    return 0;
  }
}

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
  offsetMinutes: number;
  region: string;
}

/** Build and cache the full timezone list */
function buildTimezoneOptions(): TimezoneOption[] {
  let timezones: string[] = [];
  try {
    timezones = Intl.supportedValuesOf('timeZone') as string[];
  } catch {
    // Fallback to a minimal list if the API isn't available
    timezones = [
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Anchorage',
      'Pacific/Honolulu',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Kolkata',
      'Australia/Sydney',
      'Pacific/Auckland',
      'UTC',
    ];
  }

  return timezones.map((tz) => {
    const region = tz.split('/')[0] ?? tz;
    const cityRaw = tz.split('/').slice(1).join('/');
    const city = cityRaw.replace(/_/g, ' ') || tz;
    const offset = getUtcOffset(tz);
    const offsetMinutes = getOffsetMinutes(tz);
    return {
      value: tz,
      label: city || tz,
      offset,
      offsetMinutes,
      region,
    };
  });
}

// Region display names
const REGION_LABELS: Record<string, string> = {
  Africa: 'Africa',
  America: 'Americas',
  Antarctica: 'Antarctica',
  Arctic: 'Arctic',
  Asia: 'Asia',
  Atlantic: 'Atlantic',
  Australia: 'Australia & Pacific',
  Europe: 'Europe',
  Indian: 'Indian Ocean',
  Pacific: 'Pacific',
  Etc: 'Other',
  UTC: 'UTC',
};

/** Detect browser timezone */
function detectBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

// Lazily computed timezone list (module-level cache)
let cachedOptions: TimezoneOption[] | null = null;
function getTimezoneOptions(): TimezoneOption[] {
  if (!cachedOptions) {
    cachedOptions = buildTimezoneOptions();
  }
  return cachedOptions;
}

/**
 * TimezoneSelect — searchable timezone dropdown with region grouping.
 *
 * Features:
 * - Auto-detects browser timezone as default
 * - Groups timezones by region (America, Europe, Asia, etc.)
 * - Shows UTC offset next to each option ("UTC-5")
 * - Supports keyboard navigation (ArrowUp/Down, Enter, Escape)
 * - Accessible combobox pattern with ARIA attributes
 */
export function TimezoneSelect({ value, onChange, className }: TimezoneSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const listboxId = React.useId();
  const searchId = React.useId();

  const allOptions = React.useMemo(() => getTimezoneOptions(), []);

  // Filter options by search query
  const filteredOptions = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return allOptions;
    return allOptions.filter(
      (opt) =>
        opt.value.toLowerCase().includes(q) ||
        opt.label.toLowerCase().includes(q) ||
        opt.offset.toLowerCase().includes(q) ||
        opt.region.toLowerCase().includes(q)
    );
  }, [allOptions, search]);

  // Group filtered options by region
  const groupedOptions = React.useMemo(() => {
    const groups = new Map<string, TimezoneOption[]>();
    for (const opt of filteredOptions) {
      const existing = groups.get(opt.region);
      if (existing) {
        existing.push(opt);
      } else {
        groups.set(opt.region, [opt]);
      }
    }
    return groups;
  }, [filteredOptions]);

  // Flat list for keyboard navigation
  const flatOptions = React.useMemo(() => filteredOptions, [filteredOptions]);

  // Current value display
  const selectedOption = React.useMemo(
    () => allOptions.find((o) => o.value === value),
    [allOptions, value]
  );

  // Reset highlight when options change
  React.useEffect(() => {
    const idx = flatOptions.findIndex((o) => o.value === value);
    setHighlightedIndex(idx >= 0 ? idx : 0);
  }, [flatOptions, value]);

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (!isOpen) return;
    const list = listRef.current;
    if (!list) return;
    const item = list.querySelector(`[data-index="${highlightedIndex}"]`) as HTMLElement | null;
    if (item) {
      item.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  // Close on outside click
  React.useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Focus search input when opened
  React.useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    }
  }, [isOpen]);

  function openDropdown() {
    setIsOpen(true);
    setSearch('');
  }

  function selectOption(tz: string) {
    onChange(tz);
    setIsOpen(false);
    setSearch('');
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      openDropdown();
    }
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, flatOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (flatOptions[highlightedIndex]) {
          selectOption(flatOptions[highlightedIndex]!.value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearch('');
        break;
      case 'Tab':
        setIsOpen(false);
        setSearch('');
        break;
    }
  }

  const displayLabel = selectedOption
    ? `${selectedOption.label} (${selectedOption.offset})`
    : value || 'Select timezone';

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger button */}
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        onClick={openDropdown}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'flex w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2',
          'text-sm text-gray-900 shadow-sm transition-colors',
          'hover:border-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
          isOpen && 'border-primary-500 ring-2 ring-primary-500 ring-offset-1'
        )}
      >
        <GlobeIcon className="shrink-0 text-gray-400" />
        <span className="min-w-0 flex-1 truncate text-left">{displayLabel}</span>
        <ChevronDownIcon
          className={cn('shrink-0 text-gray-400 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1 w-full min-w-[280px] rounded-md border border-gray-200',
            'bg-white shadow-lg'
          )}
        >
          {/* Search input */}
          <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
            <SearchIcon className="shrink-0 text-gray-400" />
            <input
              ref={searchRef}
              id={searchId}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search timezones…"
              aria-label="Search timezones"
              aria-controls={listboxId}
              className={cn(
                'flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400',
                'focus:outline-none'
              )}
            />
          </div>

          {/* Options list */}
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label="Timezones"
            className="max-h-60 overflow-y-auto py-1"
          >
            {flatOptions.length === 0 ? (
              <li className="px-3 py-4 text-center text-sm text-gray-500">No timezones found</li>
            ) : (
              Array.from(groupedOptions.entries()).map(([region, options]) => {
                const regionLabel = REGION_LABELS[region] ?? region;
                return (
                  <React.Fragment key={region}>
                    {/* Region group label */}
                    <li
                      role="presentation"
                      className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400"
                      aria-hidden="true"
                    >
                      {regionLabel}
                    </li>
                    {options.map((opt) => {
                      const globalIndex = flatOptions.indexOf(opt);
                      const isHighlighted = globalIndex === highlightedIndex;
                      const isSelected = opt.value === value;
                      return (
                        <li
                          key={opt.value}
                          role="option"
                          aria-selected={isSelected}
                          data-index={globalIndex}
                          onClick={() => selectOption(opt.value)}
                          onMouseEnter={() => setHighlightedIndex(globalIndex)}
                          className={cn(
                            'flex cursor-pointer items-center justify-between px-3 py-2 text-sm',
                            isHighlighted && !isSelected && 'bg-primary-50 text-primary-700',
                            isSelected && 'bg-primary-100 font-medium text-primary-800',
                            !isHighlighted && !isSelected && 'text-gray-900'
                          )}
                        >
                          <span className="truncate">{opt.label}</span>
                          <span
                            className={cn(
                              'ml-3 shrink-0 text-xs tabular-nums',
                              isSelected ? 'text-primary-600' : 'text-gray-400'
                            )}
                          >
                            {opt.offset}
                          </span>
                        </li>
                      );
                    })}
                  </React.Fragment>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Detect and return the browser's current IANA timezone.
 * Returns "UTC" as fallback if detection fails.
 */
export function detectTimezone(): string {
  return detectBrowserTimezone();
}
