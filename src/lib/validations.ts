import { z } from "zod";

// ─── AUTH SCHEMAS ───────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required"),
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
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(
      /^[a-z0-9_-]+$/,
      "Username can only contain lowercase letters, numbers, hyphens, and underscores"
    )
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
});

// ─── EVENT TYPE SCHEMAS ─────────────────────────────────────

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
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  description: z.string().max(5000, "Description too long").optional(),
  duration: z
    .number()
    .int()
    .min(5, "Duration must be at least 5 minutes")
    .max(480, "Duration must be less than 8 hours"),
  locations: z
    .array(
      z.object({
        type: z.enum(["inPerson", "link", "phone"]),
        value: z.string().min(1, "Location value is required"),
      })
    )
    .optional(),
  isActive: z.boolean().default(true),
  requiresConfirmation: z.boolean().default(false),
  price: z.number().int().min(0, "Price cannot be negative").default(0),
  currency: z.string().length(3, "Currency must be 3 characters").default("USD"),
  minimumNotice: z
    .number()
    .int()
    .min(0, "Minimum notice cannot be negative")
    .default(120),
  beforeBuffer: z.number().int().min(0).default(0),
  afterBuffer: z.number().int().min(0).default(0),
  slotInterval: z.number().int().min(5).optional(),
  maxBookingsPerDay: z.number().int().min(1).optional(),
  maxBookingsPerWeek: z.number().int().min(1).optional(),
  futureLimit: z.number().int().min(1).max(365).default(60),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color hex").optional(),
  customQuestions: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1, "Question label is required"),
        type: z.enum([
          "text",
          "textarea",
          "select",
          "radio",
          "checkbox",
          "phone",
        ]),
        required: z.boolean().default(false),
        options: z.array(z.string()).optional(),
      })
    )
    .optional(),
  successRedirectUrl: z.string().url("Invalid redirect URL").optional(),
  recurringEnabled: z.boolean().default(false),
  recurringMaxOccurrences: z.number().int().min(2).max(52).optional(),
  recurringFrequency: z.enum(["weekly", "biweekly", "monthly"]).optional(),
  schedulingType: z.enum(["ROUND_ROBIN", "COLLECTIVE"]).optional(),
  scheduleId: z.string().optional(),
  teamId: z.string().optional(),
});

// ─── BOOKING SCHEMAS ────────────────────────────────────────

export const bookingSchema = z.object({
  eventTypeId: z.string().min(1, "Event type is required"),
  startTime: z.coerce.date(),
  attendeeName: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name too long")
    .trim(),
  attendeeEmail: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email")
    .toLowerCase()
    .trim(),
  attendeeTimezone: z.string().min(1, "Timezone is required"),
  attendeeNotes: z.string().max(5000, "Notes too long").optional(),
  responses: z.record(z.string(), z.any()).optional(),
});

export const cancelBookingSchema = z.object({
  cancellationReason: z
    .string()
    .max(1000, "Reason too long")
    .optional()
    .nullable(),
});

export const rescheduleBookingSchema = z.object({
  startTime: z.coerce.date(),
  rescheduleReason: z.string().max(1000, "Reason too long").optional(),
});

// ─── SCHEDULE SCHEMAS ───────────────────────────────────────

export const availabilitySchema = z.object({
  day: z.number().int().min(0, "Invalid day").max(6, "Invalid day"),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
});

export const scheduleSchema = z.object({
  name: z
    .string()
    .min(1, "Schedule name is required")
    .max(100, "Name too long")
    .trim(),
  timezone: z.string().min(1, "Timezone is required"),
  isDefault: z.boolean().default(false),
  availability: z.array(availabilitySchema).min(1, "At least one availability slot is required"),
});

export const dateOverrideSchema = z.object({
  date: z.coerce.date(),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
    .optional()
    .nullable(),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
    .optional()
    .nullable(),
  isUnavailable: z.boolean().default(false),
});

// ─── USER SCHEMAS ───────────────────────────────────────────

export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).trim().optional(),
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9_-]+$/)
    .trim()
    .optional(),
  bio: z.string().max(5000).optional().nullable(),
  timezone: z.string().optional(),
  weekStart: z.number().int().min(0).max(6).optional(),
  theme: z.enum(["light", "dark"]).optional(),
  avatarUrl: z.string().url("Invalid URL").optional().nullable(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── TEAM SCHEMAS ───────────────────────────────────────────

export const teamSchema = z.object({
  name: z.string().min(1, "Team name is required").max(100, "Name too long").trim(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug too long")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  bio: z.string().max(5000, "Bio too long").optional().nullable(),
});

export const inviteTeamMemberSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]).default("MEMBER"),
});

// ─── WEBHOOK SCHEMAS ────────────────────────────────────────

export const webhookSchema = z.object({
  url: z.string().url("Invalid webhook URL"),
  eventTriggers: z
    .array(z.string())
    .min(1, "At least one event trigger is required"),
  active: z.boolean().default(true),
  secret: z.string().min(16, "Secret must be at least 16 characters").optional(),
});

// ─── TYPE EXPORTS ───────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type EventTypeInput = z.infer<typeof eventTypeSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type RescheduleBookingInput = z.infer<typeof rescheduleBookingSchema>;
export type AvailabilityInput = z.infer<typeof availabilitySchema>;
export type ScheduleInput = z.infer<typeof scheduleSchema>;
export type DateOverrideInput = z.infer<typeof dateOverrideSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type TeamInput = z.infer<typeof teamSchema>;
export type InviteTeamMemberInput = z.infer<typeof inviteTeamMemberSchema>;
export type WebhookInput = z.infer<typeof webhookSchema>;
