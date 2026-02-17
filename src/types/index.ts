import type {
  User,
  EventType,
  Booking,
  Schedule,
  Availability,
  DateOverride,
  Team,
  TeamMember,
  BookingStatus,
  SchedulingType,
  TeamRole,
} from "@/generated/prisma/client";

// ─── USER TYPES ─────────────────────────────────────────────

export type UserWithRelations = User & {
  eventTypes?: EventType[];
  bookings?: Booking[];
  schedules?: Schedule[];
  teamMemberships?: (TeamMember & { team: Team })[];
};

export type PublicUser = Pick<
  User,
  "id" | "name" | "username" | "avatarUrl" | "bio"
>;

// ─── EVENT TYPE TYPES ───────────────────────────────────────

export type EventTypeWithRelations = EventType & {
  user: PublicUser;
  schedule?: Schedule & {
    availability: Availability[];
    dateOverrides: DateOverride[];
  };
  team?: Team;
  _count?: {
    bookings: number;
  };
};

export type EventTypeLocation = {
  type: "inPerson" | "link" | "phone";
  value: string;
};

export type CustomQuestion = {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "phone";
  required: boolean;
  options?: string[];
};

// ─── BOOKING TYPES ──────────────────────────────────────────

export type BookingWithRelations = Booking & {
  user: PublicUser;
  eventType: Pick<EventType, "id" | "title" | "duration" | "locations">;
};

export type BookingSlot = {
  start: Date;
  end: Date;
  available: boolean;
};

export type AvailableSlot = {
  time: string;      // ISO 8601 datetime in UTC
  localTime: string; // HH:mm in attendee's timezone
  duration: number;  // minutes
};

export type BookingWithDetails = Booking & {
  eventType: Pick<EventType, "id" | "title" | "duration" | "locations" | "color"> & {
    user: PublicUser;
  };
};

export type EventTypeWithSchedule = EventType & {
  schedule: (Schedule & {
    availability: Availability[];
    dateOverrides: DateOverride[];
  }) | null;
  _count?: {
    bookings: number;
  };
};

// ─── SCHEDULE TYPES ─────────────────────────────────────────

export type ScheduleWithRelations = Schedule & {
  availability: Availability[];
  dateOverrides: DateOverride[];
  _count?: {
    eventTypes: number;
  };
};

export type WeeklyAvailability = {
  [day: number]: Array<{
    startTime: string;
    endTime: string;
  }>;
};

// ─── TEAM TYPES ─────────────────────────────────────────────

export type TeamWithRelations = Team & {
  members: (TeamMember & {
    user: PublicUser;
  })[];
  eventTypes?: EventType[];
  _count?: {
    members: number;
    eventTypes: number;
  };
};

export type TeamMemberWithUser = TeamMember & {
  user: PublicUser;
  team: Team;
};

// ─── API RESPONSE TYPES ─────────────────────────────────────

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type ApiError = {
  error: string;
  message: string;
  details?: Record<string, any>;
  statusCode?: number;
};

// ─── FORM TYPES ─────────────────────────────────────────────

export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export type FormState<T> = {
  data: T;
  errors: FormErrors<T>;
  isSubmitting: boolean;
  isValid: boolean;
};

// ─── CALENDAR TYPES ─────────────────────────────────────────

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "booking" | "blocked" | "available";
  status?: BookingStatus;
  attendeeName?: string;
  attendeeEmail?: string;
};

export type TimeSlot = {
  hour: number;
  minute: number;
  label: string; // "09:00 AM"
  available: boolean;
};

// ─── WEBHOOK TYPES ──────────────────────────────────────────

export type WebhookEventType =
  | "BOOKING_CREATED"
  | "BOOKING_CANCELLED"
  | "BOOKING_RESCHEDULED"
  | "BOOKING_ACCEPTED"
  | "BOOKING_REJECTED";

export type WebhookPayload<T = any> = {
  event: WebhookEventType;
  timestamp: string;
  data: T;
};

// ─── NOTIFICATION TYPES ─────────────────────────────────────

export type NotificationType = "success" | "error" | "warning" | "info";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // milliseconds, null = persistent
};

// ─── SEARCH & FILTER TYPES ──────────────────────────────────

export type SortOrder = "asc" | "desc";

export type SortField<T> = {
  field: keyof T;
  order: SortOrder;
};

export type FilterOperator =
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "in"
  | "notIn";

export type Filter<T> = {
  field: keyof T;
  operator: FilterOperator;
  value: any;
};

export type QueryParams<T> = {
  page?: number;
  pageSize?: number;
  sort?: SortField<T>;
  filters?: Filter<T>[];
  search?: string;
};

// ─── DATE & TIME TYPES ──────────────────────────────────────

export type TimeRange = {
  start: string; // "HH:mm"
  end: string; // "HH:mm"
};

export type DateRange = {
  start: Date;
  end: Date;
};

export type Timezone = {
  value: string; // IANA timezone (e.g., "America/New_York")
  label: string; // Display name (e.g., "Eastern Time (ET)")
  offset: string; // UTC offset (e.g., "-05:00")
};

// ─── ENUM RE-EXPORTS ────────────────────────────────────────

export { BookingStatus, SchedulingType, TeamRole };

// ─── UTILITY TYPES ──────────────────────────────────────────

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ─── COMPONENT PROP TYPES ───────────────────────────────────

export type BaseComponentProps = {
  className?: string;
  children?: React.ReactNode;
};

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export type InputSize = "sm" | "md" | "lg";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";
