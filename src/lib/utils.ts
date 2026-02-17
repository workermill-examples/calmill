import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { TZDate } from "@date-fns/tz";

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge
 * Handles conditional classes and deduplicates Tailwind utilities
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string or Date object for display
 * @param date - Date to format (string, Date, or null)
 * @param formatStr - date-fns format string (default: "PPP" = "Apr 29, 2024")
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | null | undefined,
  formatStr: string = "PPP"
): string {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

/**
 * Format a date in a specific timezone
 * @param date - Date to format
 * @param timezone - IANA timezone (e.g., "America/New_York")
 * @param formatStr - date-fns format string
 */
export function formatDateInTimezone(
  date: string | Date,
  timezone: string,
  formatStr: string = "PPP p"
): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    const tzDate = new TZDate(dateObj, timezone);
    return format(tzDate, formatStr);
  } catch (error) {
    console.error("Error formatting date in timezone:", error);
    return "";
  }
}

/**
 * Generate a URL-safe slug from a string
 * @param text - Text to convert to slug
 * @returns URL-safe slug (lowercase, hyphenated)
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces and hyphens)
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generate a username from an email address
 * @param email - Email address
 * @returns Username (part before @)
 */
export function generateUsername(email: string): string {
  const localPart = email.split("@")[0] ?? email;
  return generateSlug(localPart);
}

/**
 * Debounce a function call
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 100)
 * @returns Truncated text
 */
export function truncate(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Check if a string is a valid email
 * @param email - Email to validate
 * @returns true if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get initials from a name
 * @param name - Full name
 * @returns Initials (max 2 characters)
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "";
  }
  if (parts.length === 1) {
    return parts[0]?.charAt(0).toUpperCase() ?? "";
  }
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts[parts.length - 1]?.charAt(0) ?? "";
  return (first + last).toUpperCase();
}
