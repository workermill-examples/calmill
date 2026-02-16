import type {
  User,
  Account,
  Session,
  EventType,
  Booking,
  Schedule,
  Availability,
  DateOverride,
  Team,
  TeamMember,
  CalendarConnection,
  Webhook,
  BookingStatus,
  SchedulingType,
  TeamRole,
} from "@/generated/prisma/client";

// ─── PRISMA TYPES WITH RELATIONS ────────────────────────

export type UserWithRelations = User & {
  accounts?: Account[];
  sessions?: Session[];
  eventTypes?: EventTypeWithRelations[];
  bookings?: BookingWithRelations[];
  schedules?: ScheduleWithRelations[];
  teamMemberships?: TeamMemberWithRelations[];
  webhooks?: Webhook[];
  calendarConnections?: CalendarConnection[];
};

export type EventTypeWithRelations = EventType & {
  user?: UserWithRelations;
  schedule?: ScheduleWithRelations;
  team?: TeamWithRelations;
  bookings?: BookingWithRelations[];
  _count?: {
    bookings: number;
  };
};

export type BookingWithRelations = Booking & {
  user?: UserWithRelations;
  eventType?: EventTypeWithRelations;
};

export type ScheduleWithRelations = Schedule & {
  user?: UserWithRelations;
  availability?: Availability[];
  eventTypes?: EventTypeWithRelations[];
  dateOverrides?: DateOverride[];
};

export type TeamWithRelations = Team & {
  members?: TeamMemberWithRelations[];
  eventTypes?: EventTypeWithRelations[];
  _count?: {
    members: number;
    eventTypes: number;
  };
};

export type TeamMemberWithRelations = TeamMember & {
  user?: UserWithRelations;
  team?: TeamWithRelations;
};

// ─── API RESPONSE TYPES ─────────────────────────────────

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: string;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: Record<string, any>;
}

// ─── AUTH TYPES ─────────────────────────────────────────

export interface AuthSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    username?: string | null;
    timezone?: string | null;
    image?: string | null;
  };
  expires: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  username?: string;
  timezone?: string;
  name?: string;
  sub: string;
  iat: number;
  exp: number;
  jti: string;
}

// ─── BOOKING TYPES ──────────────────────────────────────

export interface BookingSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface AvailabilitySlot {
  start: string; // HH:mm format
  end: string;   // HH:mm format
}

export interface DayAvailability {
  day: number; // 0-6 (Sunday-Saturday)
  available: boolean;
  slots: AvailabilitySlot[];
}

export interface BookingConflict {
  start: Date;
  end: Date;
  title: string;
  type: "booking" | "override" | "buffer";
}

// ─── EVENT TYPE TYPES ───────────────────────────────────

export interface EventTypeLocation {
  type: "inPerson" | "link" | "phone";
  value: string;
}

export interface CustomQuestion {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "phone";
  required: boolean;
  options?: string[];
}

export interface EventTypeSettings {
  requiresConfirmation: boolean;
  price: number;
  currency: string;
  minimumNotice: number;
  beforeBuffer: number;
  afterBuffer: number;
  slotInterval?: number;
  maxBookingsPerDay?: number;
  maxBookingsPerWeek?: number;
  futureLimit: number;
  locations?: EventTypeLocation[];
  customQuestions?: CustomQuestion[];
}

// ─── CALENDAR TYPES ─────────────────────────────────────

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  source: "booking" | "external";
  status?: "busy" | "free" | "tentative";
}

export interface CalendarProvider {
  id: string;
  name: string;
  type: "google" | "outlook" | "apple";
  connected: boolean;
  primary: boolean;
  email?: string;
}

// ─── WEBHOOK TYPES ──────────────────────────────────────

export type WebhookEventType =
  | "BOOKING_CREATED"
  | "BOOKING_CANCELLED"
  | "BOOKING_RESCHEDULED"
  | "BOOKING_CONFIRMED"
  | "BOOKING_REJECTED";

export interface WebhookPayload {
  event: WebhookEventType;
  timestamp: string;
  data: {
    booking?: BookingWithRelations;
    eventType?: EventTypeWithRelations;
    user?: UserWithRelations;
  };
}

// ─── UTILITY TYPES ──────────────────────────────────────

export interface TimeSlot {
  time: string; // "HH:mm"
  available: boolean;
  reason?: string; // Why unavailable
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface Timezone {
  value: string; // IANA timezone identifier
  label: string; // Human-readable label
  offset: string; // UTC offset (e.g., "UTC-5")
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface FilterParams {
  status?: BookingStatus | BookingStatus[];
  startDate?: string;
  endDate?: string;
  eventTypeId?: string;
  userId?: string;
  teamId?: string;
}

// ─── FORM TYPES ─────────────────────────────────────────

export interface BookingFormData {
  attendeeName: string;
  attendeeEmail: string;
  attendeeTimezone: string;
  attendeeNotes?: string;
  responses?: Record<string, any>;
}

export interface EventTypeFormData {
  title: string;
  slug: string;
  description?: string;
  duration: number;
  locations?: EventTypeLocation[];
  settings: EventTypeSettings;
  customQuestions?: CustomQuestion[];
}

export interface ScheduleFormData {
  name: string;
  timezone: string;
  isDefault: boolean;
  availability: Array<{
    day: number;
    enabled: boolean;
    startTime: string;
    endTime: string;
  }>;
}

// ─── ANALYTICS TYPES ────────────────────────────────────

export interface BookingStats {
  total: number;
  pending: number;
  accepted: number;
  cancelled: number;
  rejected: number;
  rescheduled: number;
}

export interface EventTypeStats {
  id: string;
  title: string;
  totalBookings: number;
  acceptedBookings: number;
  cancelledBookings: number;
  averageDuration: number;
  revenue: number; // in cents
}

export interface UserStats {
  totalEventTypes: number;
  activeEventTypes: number;
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number; // in cents
}

// ─── EXPORT ENUMS ──────────────────────────────────────

export { BookingStatus, SchedulingType, TeamRole };

// ─── TYPE GUARDS ────────────────────────────────────────

export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return typeof obj === "object" && obj !== null && typeof obj.success === "boolean";
}

export function isPaginatedResponse<T>(obj: any): obj is PaginatedResponse<T> {
  return (
    isApiResponse(obj) &&
    Array.isArray(obj.data) &&
    typeof obj.pagination === "object" &&
    obj.pagination !== null
  );
}

export function isErrorResponse(obj: any): obj is ErrorResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    obj.success === false &&
    typeof obj.error === "string"
  );
}

// ─── CONSTANTS ──────────────────────────────────────────

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  CANCELLED: "Cancelled",
  REJECTED: "Rejected",
  RESCHEDULED: "Rescheduled",
};

export const TEAM_ROLE_LABELS: Record<TeamRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

export const SCHEDULING_TYPE_LABELS: Record<SchedulingType, string> = {
  ROUND_ROBIN: "Round Robin",
  COLLECTIVE: "Collective",
};

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DAYS_SHORT = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export const CUSTOM_QUESTION_TYPES = [
  "text",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "phone",
] as const;

export const LOCATION_TYPES = ["inPerson", "link", "phone"] as const;

export const WEBHOOK_EVENTS = [
  "BOOKING_CREATED",
  "BOOKING_CANCELLED",
  "BOOKING_RESCHEDULED",
  "BOOKING_CONFIRMED",
  "BOOKING_REJECTED",
] as const;