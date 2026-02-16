import { z } from "zod";

// ─── AUTH SCHEMAS ───────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password is too long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
});

// ─── EVENT TYPE SCHEMAS ─────────────────────────────────

export const eventTypeSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .trim(),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  duration: z
    .number()
    .int()
    .min(5, "Duration must be at least 5 minutes")
    .max(480, "Duration cannot exceed 8 hours"),
  isActive: z.boolean().default(true),
  requiresConfirmation: z.boolean().default(false),
  price: z
    .number()
    .int()
    .min(0, "Price cannot be negative")
    .default(0),
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter code")
    .default("USD"),
  minimumNotice: z
    .number()
    .int()
    .min(0, "Minimum notice cannot be negative")
    .default(120),
  beforeBuffer: z
    .number()
    .int()
    .min(0, "Before buffer cannot be negative")
    .default(0),
  afterBuffer: z
    .number()
    .int()
    .min(0, "After buffer cannot be negative")
    .default(0),
  slotInterval: z
    .number()
    .int()
    .min(5, "Slot interval must be at least 5 minutes")
    .optional(),
  maxBookingsPerDay: z
    .number()
    .int()
    .min(1, "Max bookings per day must be at least 1")
    .optional(),
  maxBookingsPerWeek: z
    .number()
    .int()
    .min(1, "Max bookings per week must be at least 1")
    .optional(),
  futureLimit: z
    .number()
    .int()
    .min(1, "Future limit must be at least 1 day")
    .default(60),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color must be a valid hex color")
    .optional(),
  successRedirectUrl: z
    .string()
    .url("Success redirect URL must be a valid URL")
    .optional(),
  recurringEnabled: z.boolean().default(false),
  recurringMaxOccurrences: z
    .number()
    .int()
    .min(1, "Max occurrences must be at least 1")
    .optional(),
  recurringFrequency: z
    .enum(["weekly", "biweekly", "monthly"])
    .optional(),
  locations: z
    .array(
      z.object({
        type: z.enum(["inPerson", "link", "phone"]),
        value: z.string().min(1, "Location value is required"),
      })
    )
    .optional(),
  customQuestions: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1, "Question label is required"),
        type: z.enum(["text", "textarea", "select", "radio", "checkbox", "phone"]),
        required: z.boolean().default(false),
        options: z.array(z.string()).optional(),
      })
    )
    .optional(),
});

// ─── BOOKING SCHEMAS ────────────────────────────────────

export const bookingSchema = z.object({
  attendeeName: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters")
    .trim(),
  attendeeEmail: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  attendeeTimezone: z
    .string()
    .min(1, "Timezone is required"),
  attendeeNotes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
  startTime: z
    .string()
    .datetime("Start time must be a valid datetime"),
  endTime: z
    .string()
    .datetime("End time must be a valid datetime"),
  responses: z
    .record(z.string(), z.any())
    .optional(),
}).refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  {
    message: "End time must be after start time",
    path: ["endTime"],
  }
);

export const cancelBookingSchema = z.object({
  cancellationReason: z
    .string()
    .max(500, "Cancellation reason must be less than 500 characters")
    .optional(),
});

export const rescheduleBookingSchema = z.object({
  startTime: z
    .string()
    .datetime("Start time must be a valid datetime"),
  endTime: z
    .string()
    .datetime("End time must be a valid datetime"),
}).refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  {
    message: "End time must be after start time",
    path: ["endTime"],
  }
);

// ─── SCHEDULE SCHEMAS ───────────────────────────────────

export const scheduleSchema = z.object({
  name: z
    .string()
    .min(1, "Schedule name is required")
    .max(255, "Name must be less than 255 characters")
    .trim(),
  timezone: z
    .string()
    .min(1, "Timezone is required"),
  isDefault: z.boolean().default(false),
});

export const availabilitySchema = z.object({
  day: z
    .number()
    .int()
    .min(0, "Day must be between 0 (Sunday) and 6 (Saturday)")
    .max(6, "Day must be between 0 (Sunday) and 6 (Saturday)"),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:mm format"),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:mm format"),
}).refine(
  (data) => {
    const [startHour, startMinute] = data.startTime.split(":").map(Number);
    const [endHour, endMinute] = data.endTime.split(":").map(Number);
    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
    return endTotal > startTotal;
  },
  {
    message: "End time must be after start time",
    path: ["endTime"],
  }
);

export const dateOverrideSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:mm format")
    .optional(),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:mm format")
    .optional(),
  isUnavailable: z.boolean().default(false),
}).refine(
  (data) => {
    if (data.startTime && data.endTime) {
      const [startHour, startMinute] = data.startTime.split(":").map(Number);
      const [endHour, endMinute] = data.endTime.split(":").map(Number);
      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;
      return endTotal > startTotal;
    }
    return true;
  },
  {
    message: "End time must be after start time",
    path: ["endTime"],
  }
);

// ─── USER SCHEMAS ───────────────────────────────────────

export const updateUserSchema = z.object({
  name: z
    .string()
    .max(255, "Name must be less than 255 characters")
    .trim()
    .optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
    .toLowerCase()
    .trim()
    .optional(),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional(),
  timezone: z
    .string()
    .min(1, "Timezone is required")
    .optional(),
  weekStart: z
    .number()
    .int()
    .min(0, "Week start must be between 0 (Sunday) and 6 (Saturday)")
    .max(6, "Week start must be between 0 (Sunday) and 6 (Saturday)")
    .optional(),
  theme: z
    .enum(["light", "dark", "system"])
    .optional(),
  avatarUrl: z
    .string()
    .url("Avatar URL must be a valid URL")
    .optional(),
});

// ─── TEAM SCHEMAS ───────────────────────────────────────

export const teamSchema = z.object({
  name: z
    .string()
    .min(1, "Team name is required")
    .max(255, "Name must be less than 255 characters")
    .trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .trim(),
  bio: z
    .string()
    .max(1000, "Bio must be less than 1000 characters")
    .optional(),
  logoUrl: z
    .string()
    .url("Logo URL must be a valid URL")
    .optional(),
});

export const inviteTeamMemberSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  role: z
    .enum(["OWNER", "ADMIN", "MEMBER"])
    .default("MEMBER"),
});

// ─── WEBHOOK SCHEMAS ────────────────────────────────────

export const webhookSchema = z.object({
  url: z
    .string()
    .url("Webhook URL must be a valid URL"),
  eventTriggers: z
    .array(z.string())
    .min(1, "At least one event trigger is required"),
  active: z.boolean().default(true),
  secret: z
    .string()
    .min(8, "Secret must be at least 8 characters")
    .optional(),
});

// ─── TYPE EXPORTS ───────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type EventTypeInput = z.infer<typeof eventTypeSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type RescheduleBookingInput = z.infer<typeof rescheduleBookingSchema>;
export type ScheduleInput = z.infer<typeof scheduleSchema>;
export type AvailabilityInput = z.infer<typeof availabilitySchema>;
export type DateOverrideInput = z.infer<typeof dateOverrideSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type TeamInput = z.infer<typeof teamSchema>;
export type InviteTeamMemberInput = z.infer<typeof inviteTeamMemberSchema>;
export type WebhookInput = z.infer<typeof webhookSchema>;