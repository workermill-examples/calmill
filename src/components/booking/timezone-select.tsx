"use client";

import * as React from "react";
import { Check, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
  city: string;
}

export interface TimezoneSelectProps {
  /** Current selected timezone */
  value: string;
  /** Callback when timezone changes */
  onChange: (timezone: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
}

// Common timezone options with proper formatting
const TIMEZONE_OPTIONS: TimezoneOption[] = [
  // US/Canada
  { value: "America/New_York", label: "Eastern Time", offset: "UTC-5/-4", city: "New York" },
  { value: "America/Chicago", label: "Central Time", offset: "UTC-6/-5", city: "Chicago" },
  { value: "America/Denver", label: "Mountain Time", offset: "UTC-7/-6", city: "Denver" },
  { value: "America/Los_Angeles", label: "Pacific Time", offset: "UTC-8/-7", city: "Los Angeles" },
  { value: "America/Anchorage", label: "Alaska Time", offset: "UTC-9/-8", city: "Anchorage" },
  { value: "Pacific/Honolulu", label: "Hawaii Time", offset: "UTC-10", city: "Honolulu" },
  { value: "America/Toronto", label: "Eastern Time", offset: "UTC-5/-4", city: "Toronto" },
  { value: "America/Vancouver", label: "Pacific Time", offset: "UTC-8/-7", city: "Vancouver" },

  // Europe
  { value: "Europe/London", label: "Greenwich Mean Time", offset: "UTC±0/+1", city: "London" },
  { value: "Europe/Dublin", label: "Greenwich Mean Time", offset: "UTC±0/+1", city: "Dublin" },
  { value: "Europe/Paris", label: "Central European Time", offset: "UTC+1/+2", city: "Paris" },
  { value: "Europe/Berlin", label: "Central European Time", offset: "UTC+1/+2", city: "Berlin" },
  { value: "Europe/Rome", label: "Central European Time", offset: "UTC+1/+2", city: "Rome" },
  { value: "Europe/Amsterdam", label: "Central European Time", offset: "UTC+1/+2", city: "Amsterdam" },
  { value: "Europe/Madrid", label: "Central European Time", offset: "UTC+1/+2", city: "Madrid" },
  { value: "Europe/Stockholm", label: "Central European Time", offset: "UTC+1/+2", city: "Stockholm" },
  { value: "Europe/Helsinki", label: "Eastern European Time", offset: "UTC+2/+3", city: "Helsinki" },
  { value: "Europe/Athens", label: "Eastern European Time", offset: "UTC+2/+3", city: "Athens" },
  { value: "Europe/Istanbul", label: "Turkey Time", offset: "UTC+3", city: "Istanbul" },
  { value: "Europe/Moscow", label: "Moscow Standard Time", offset: "UTC+3", city: "Moscow" },

  // Asia Pacific
  { value: "Asia/Dubai", label: "Gulf Standard Time", offset: "UTC+4", city: "Dubai" },
  { value: "Asia/Kolkata", label: "India Standard Time", offset: "UTC+5:30", city: "Mumbai" },
  { value: "Asia/Dhaka", label: "Bangladesh Standard Time", offset: "UTC+6", city: "Dhaka" },
  { value: "Asia/Singapore", label: "Singapore Standard Time", offset: "UTC+8", city: "Singapore" },
  { value: "Asia/Hong_Kong", label: "Hong Kong Time", offset: "UTC+8", city: "Hong Kong" },
  { value: "Asia/Shanghai", label: "China Standard Time", offset: "UTC+8", city: "Shanghai" },
  { value: "Asia/Tokyo", label: "Japan Standard Time", offset: "UTC+9", city: "Tokyo" },
  { value: "Asia/Seoul", label: "Korea Standard Time", offset: "UTC+9", city: "Seoul" },
  { value: "Australia/Sydney", label: "Australian Eastern Time", offset: "UTC+10/+11", city: "Sydney" },
  { value: "Australia/Melbourne", label: "Australian Eastern Time", offset: "UTC+10/+11", city: "Melbourne" },
  { value: "Australia/Perth", label: "Australian Western Time", offset: "UTC+8", city: "Perth" },
  { value: "Pacific/Auckland", label: "New Zealand Standard Time", offset: "UTC+12/+13", city: "Auckland" },

  // Other regions
  { value: "America/Sao_Paulo", label: "Brasília Time", offset: "UTC-3", city: "São Paulo" },
  { value: "America/Argentina/Buenos_Aires", label: "Argentina Time", offset: "UTC-3", city: "Buenos Aires" },
  { value: "America/Mexico_City", label: "Central Standard Time", offset: "UTC-6/-5", city: "Mexico City" },
  { value: "Africa/Cairo", label: "Eastern European Time", offset: "UTC+2", city: "Cairo" },
  { value: "Africa/Lagos", label: "West Africa Time", offset: "UTC+1", city: "Lagos" },
  { value: "Africa/Johannesburg", label: "South Africa Standard Time", offset: "UTC+2", city: "Johannesburg" },
];

// Auto-detect user's timezone
function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn("Failed to detect timezone:", error);
    return "UTC";
  }
}

// Get current time offset for a timezone
function getTimezoneOffset(timezone: string): string {
  try {
    const date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const targetTime = new Date(utc + (0));

    const formatter = new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      timeZoneName: "short"
    });

    const parts = formatter.formatToParts(targetTime);
    const timeZoneName = parts.find(part => part.type === "timeZoneName")?.value || "";

    return timeZoneName;
  } catch (error) {
    return "";
  }
}

// Get display label for a timezone
function getTimezoneDisplay(timezone: string): TimezoneOption | null {
  const option = TIMEZONE_OPTIONS.find(opt => opt.value === timezone);
  if (option) return option;

  // If not in our list, try to create a basic display
  try {
    const formatter = new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      timeZoneName: "long"
    });

    const parts = formatter.formatToParts(new Date());
    const timeZoneName = parts.find(part => part.type === "timeZoneName")?.value || timezone;

    return {
      value: timezone,
      label: timeZoneName,
      offset: getTimezoneOffset(timezone),
      city: timezone.split("/").pop()?.replace(/_/g, " ") || timezone
    };
  } catch (error) {
    return {
      value: timezone,
      label: timezone,
      offset: "",
      city: timezone
    };
  }
}

export function TimezoneSelect({
  value,
  onChange,
  className,
  disabled = false,
  placeholder = "Select timezone..."
}: TimezoneSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [detectedTimezone] = React.useState(detectTimezone);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  // Filter timezones based on search
  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return TIMEZONE_OPTIONS;

    const searchLower = search.toLowerCase();
    return TIMEZONE_OPTIONS.filter(option =>
      option.label.toLowerCase().includes(searchLower) ||
      option.city.toLowerCase().includes(searchLower) ||
      option.value.toLowerCase().includes(searchLower)
    );
  }, [search]);

  // Get current selection display
  const selectedOption = React.useMemo(() => {
    return getTimezoneDisplay(value);
  }, [value]);

  // Handle option selection
  const handleSelect = React.useCallback((timezone: string) => {
    onChange(timezone);
    setIsOpen(false);
    setSearch("");
  }, [onChange]);

  // Auto-detect timezone on mount if no value
  React.useEffect(() => {
    if (!value && detectedTimezone) {
      onChange(detectedTimezone);
    }
  }, [value, detectedTimezone, onChange]);

  // Handle click outside to close
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Focus search when opened
  React.useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setSearch("");
    }
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-between text-left font-normal",
          !selectedOption && "text-muted-foreground"
        )}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select timezone"
      >
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            {selectedOption ? (
              <div className="truncate">
                <span className="font-medium">{selectedOption.city}</span>
                <span className="text-muted-foreground ml-1">
                  ({selectedOption.offset})
                </span>
              </div>
            ) : (
              placeholder
            )}
          </div>
        </div>
        <svg
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                type="text"
                placeholder="Search timezones..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9 h-9"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {/* Auto-detected timezone (if different from selected) */}
            {detectedTimezone && detectedTimezone !== value && (
              <>
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted">
                  Detected
                </div>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-secondary focus:bg-secondary focus:outline-none transition-colors"
                  onClick={() => handleSelect(detectedTimezone)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {getTimezoneDisplay(detectedTimezone)?.city || detectedTimezone}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getTimezoneDisplay(detectedTimezone)?.label}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getTimezoneDisplay(detectedTimezone)?.offset}
                    </div>
                  </div>
                </button>
                <div className="border-t" />
              </>
            )}

            {/* All timezones */}
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted">
              All Timezones
            </div>

            {filteredOptions.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                No timezones found matching &quot;{search}&quot;
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "w-full px-3 py-2 text-left hover:bg-secondary focus:bg-secondary focus:outline-none transition-colors",
                    value === option.value && "bg-secondary"
                  )}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{option.city}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {option.label}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <div className="text-xs text-muted-foreground">
                        {option.offset}
                      </div>
                      {value === option.value && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TimezoneSelect;