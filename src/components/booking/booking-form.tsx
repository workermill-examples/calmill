"use client";

import * as React from "react";
import { z } from "zod";
import { cn, formatDateInTimezone } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { bookingCreateSchema } from "@/lib/validations";
import type { AvailableSlot, CustomQuestion } from "@/types";

// ─── PROPS ───────────────────────────────────────────────────

export interface BookingFormProps {
  /** CUID of the event type */
  eventTypeId: string;
  /** Display title of the event type */
  eventTypeTitle: string;
  /** Duration in minutes */
  duration: number;
  /** The confirmed slot from SlotList */
  selectedSlot: AvailableSlot;
  /** IANA timezone of the attendee */
  timezone: string;
  /** Custom questions defined on the event type */
  customQuestions?: CustomQuestion[];
  /**
   * Called with the created booking object on successful submission.
   * The parent is responsible for redirecting to /booking/[uid].
   */
  onSuccess?: (booking: Record<string, unknown>) => void;
  /** Called when the user wants to go back to the slot picker */
  onBack?: () => void;
  className?: string;
}

// ─── ICONS ───────────────────────────────────────────────────

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────

/** Get the abbreviated timezone name (e.g. "EST", "PST") */
function getTimezoneAbbr(timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    })
      .formatToParts(new Date())
      .find((p) => p.type === "timeZoneName")?.value ?? timezone;
  } catch {
    return timezone;
  }
}

// ─── CUSTOM QUESTION RENDERERS ───────────────────────────────

interface QuestionFieldProps {
  question: CustomQuestion;
  value: string | string[];
  onChange: (id: string, value: string | string[]) => void;
  error?: string;
}

function QuestionField({ question, value, onChange, error }: QuestionFieldProps) {
  const fieldId = `question-${question.id}`;
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";
  const inputClasses = cn(
    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
    "placeholder:text-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
    "transition-colors",
    error && "border-danger focus:ring-danger"
  );

  switch (question.type) {
    case "text":
      return (
        <div className="w-full">
          <label htmlFor={fieldId} className={labelClasses}>
            {question.label}
            {question.required && <span className="text-danger ml-1">*</span>}
          </label>
          <input
            id={fieldId}
            type="text"
            value={value as string}
            onChange={(e) => onChange(question.id, e.target.value)}
            required={question.required}
            aria-required={question.required}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={inputClasses}
          />
          {error && (
            <p id={`${fieldId}-error`} className="mt-1.5 text-sm text-danger">
              {error}
            </p>
          )}
        </div>
      );

    case "phone":
      return (
        <div className="w-full">
          <label htmlFor={fieldId} className={labelClasses}>
            {question.label}
            {question.required && <span className="text-danger ml-1">*</span>}
          </label>
          <input
            id={fieldId}
            type="tel"
            value={value as string}
            onChange={(e) => onChange(question.id, e.target.value)}
            required={question.required}
            aria-required={question.required}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            placeholder="+1 (555) 000-0000"
            className={inputClasses}
          />
          {error && (
            <p id={`${fieldId}-error`} className="mt-1.5 text-sm text-danger">
              {error}
            </p>
          )}
        </div>
      );

    case "textarea":
      return (
        <div className="w-full">
          <label htmlFor={fieldId} className={labelClasses}>
            {question.label}
            {question.required && <span className="text-danger ml-1">*</span>}
          </label>
          <textarea
            id={fieldId}
            value={value as string}
            onChange={(e) => onChange(question.id, e.target.value)}
            required={question.required}
            aria-required={question.required}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            rows={3}
            className={cn(
              "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
              "placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
              "transition-colors resize-none",
              error && "border-danger focus:ring-danger"
            )}
          />
          {error && (
            <p id={`${fieldId}-error`} className="mt-1.5 text-sm text-danger">
              {error}
            </p>
          )}
        </div>
      );

    case "select":
      return (
        <div className="w-full">
          <label htmlFor={fieldId} className={labelClasses}>
            {question.label}
            {question.required && <span className="text-danger ml-1">*</span>}
          </label>
          <select
            id={fieldId}
            value={value as string}
            onChange={(e) => onChange(question.id, e.target.value)}
            required={question.required}
            aria-required={question.required}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={cn(inputClasses, "cursor-pointer")}
          >
            <option value="">Select an option</option>
            {question.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {error && (
            <p id={`${fieldId}-error`} className="mt-1.5 text-sm text-danger">
              {error}
            </p>
          )}
        </div>
      );

    case "radio": {
      return (
        <fieldset className="w-full" aria-invalid={error ? "true" : "false"}>
          <legend className={cn(labelClasses, "mb-2")}>
            {question.label}
            {question.required && <span className="text-danger ml-1">*</span>}
          </legend>
          <div className="flex flex-col gap-2" role="radiogroup">
            {question.options?.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <input
                  type="radio"
                  name={fieldId}
                  value={opt}
                  checked={(value as string) === opt}
                  onChange={() => onChange(question.id, opt)}
                  required={question.required}
                  className={cn(
                    "h-4 w-4 border-gray-300 text-primary-600",
                    "focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
                    error && "border-danger"
                  )}
                />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
          {error && (
            <p className="mt-1.5 text-sm text-danger">{error}</p>
          )}
        </fieldset>
      );
    }

    case "checkbox": {
      const selectedValues = Array.isArray(value) ? value : [];
      const isSingleCheck = !question.options || question.options.length === 0;

      if (isSingleCheck) {
        // Single checkbox (boolean-style)
        return (
          <div className="w-full">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                id={fieldId}
                type="checkbox"
                checked={selectedValues.includes("true")}
                onChange={(e) =>
                  onChange(question.id, e.target.checked ? ["true"] : [])
                }
                aria-invalid={error ? "true" : "false"}
                className={cn(
                  "h-4 w-4 rounded border-gray-300 text-primary-600",
                  "focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
                  error && "border-danger"
                )}
              />
              <span className="text-sm font-medium text-gray-700">
                {question.label}
                {question.required && (
                  <span className="text-danger ml-1">*</span>
                )}
              </span>
            </label>
            {error && (
              <p className="mt-1.5 text-sm text-danger">{error}</p>
            )}
          </div>
        );
      }

      return (
        <fieldset className="w-full" aria-invalid={error ? "true" : "false"}>
          <legend className={cn(labelClasses, "mb-2")}>
            {question.label}
            {question.required && <span className="text-danger ml-1">*</span>}
          </legend>
          <div className="flex flex-col gap-2">
            {question.options?.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={opt}
                  checked={selectedValues.includes(opt)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange(question.id, [...selectedValues, opt]);
                    } else {
                      onChange(
                        question.id,
                        selectedValues.filter((v) => v !== opt)
                      );
                    }
                  }}
                  className={cn(
                    "h-4 w-4 rounded border-gray-300 text-primary-600",
                    "focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
                    error && "border-danger"
                  )}
                />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
          {error && (
            <p className="mt-1.5 text-sm text-danger">{error}</p>
          )}
        </fieldset>
      );
    }

    default:
      return null;
  }
}

// ─── MAIN COMPONENT ──────────────────────────────────────────

/**
 * BookingForm — State 2 of the booking flow.
 *
 * Renders after the user selects a time slot and clicks "Confirm".
 * Displays the confirmed slot summary, name/email/notes fields,
 * dynamic custom question renderers, and a submit button.
 *
 * On success, calls onSuccess(booking) so the parent can navigate
 * to /booking/[uid].
 */
export function BookingForm({
  eventTypeId,
  eventTypeTitle,
  duration,
  selectedSlot,
  timezone,
  customQuestions = [],
  onSuccess,
  onBack,
  className,
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [responses, setResponses] = React.useState<
    Record<string, string | string[]>
  >(() =>
    Object.fromEntries(
      customQuestions.map((q) => [
        q.id,
        q.type === "checkbox" ? [] : "",
      ])
    )
  );

  // Formatted slot label for the summary header
  const slotLabel = formatDateInTimezone(
    selectedSlot.time,
    timezone,
    "EEEE, MMMM d, yyyy 'at' h:mm a"
  );
  const tzAbbr = getTimezoneAbbr(timezone);

  // Update a single custom question response
  const handleResponseChange = (id: string, value: string | string[]) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const attendeeName = formData.get("attendeeName") as string;
    const attendeeEmail = formData.get("attendeeEmail") as string;
    const attendeeNotes = (formData.get("attendeeNotes") as string) || undefined;

    try {
      // Validate required custom questions before Zod parse
      // (responses is z.record(z.string(), z.any()) so Zod can't enforce required)
      const customErrors: Record<string, string> = {};
      for (const q of customQuestions) {
        if (q.required) {
          const val = responses[q.id];
          const isEmpty =
            val === undefined ||
            val === "" ||
            (Array.isArray(val) && val.length === 0);
          if (isEmpty) {
            customErrors[q.id] = `${q.label} is required`;
          }
        }
      }
      if (Object.keys(customErrors).length > 0) {
        setErrors(customErrors);
        return;
      }

      // Build payload matching bookingCreateSchema
      const payload = {
        eventTypeId,
        startTime: selectedSlot.time,
        attendeeName,
        attendeeEmail,
        attendeeTimezone: timezone,
        attendeeNotes,
        responses: Object.keys(responses).length > 0 ? responses : undefined,
      };

      // Client-side Zod validation
      const validated = bookingCreateSchema.parse(payload);

      // Submit to API
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({
            general:
              "This time slot is no longer available. Please go back and choose another time.",
          });
        } else if (response.status === 400 && data.details) {
          const fieldErrors: Record<string, string> = {};
          (data.details as { field: string; message: string }[]).forEach(
            (detail) => {
              fieldErrors[detail.field] = detail.message;
            }
          );
          setErrors(fieldErrors);
        } else {
          setErrors({
            general: data.error || "Failed to schedule meeting. Please try again.",
          });
        }
        return;
      }

      // Success
      onSuccess?.(data.data as Record<string, unknown>);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: "An unexpected error occurred. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Selected time summary */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ClockIcon className="mt-0.5 shrink-0 text-primary-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {eventTypeTitle}
              </p>
              <p className="mt-0.5 text-sm text-gray-600">
                {slotLabel} ({tzAbbr})
              </p>
              <p className="mt-0.5 text-xs text-gray-400">{duration} min</p>
            </div>
          </div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className={cn(
                "shrink-0 inline-flex items-center gap-1 text-sm font-medium text-primary-600",
                "hover:text-primary-700 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded"
              )}
              aria-label="Go back to time selection"
            >
              <ChevronLeftIcon />
              Change
            </button>
          )}
        </div>
      </div>

      {/* General error banner */}
      {errors.general && (
        <div className="mb-6 rounded-md border border-danger/20 bg-danger/10 px-4 py-3">
          <p className="text-sm text-danger">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Core fields */}
        <Input
          label="Your Name"
          type="text"
          name="attendeeName"
          required
          autoComplete="name"
          error={errors.attendeeName}
          placeholder="Alex Smith"
        />

        <Input
          label="Email Address"
          type="email"
          name="attendeeEmail"
          required
          autoComplete="email"
          error={errors.attendeeEmail}
          placeholder="you@example.com"
        />

        {/* Notes textarea */}
        <div className="w-full">
          <label
            htmlFor="attendeeNotes"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Additional Notes
          </label>
          <textarea
            id="attendeeNotes"
            name="attendeeNotes"
            rows={3}
            placeholder="Anything you'd like the host to know..."
            aria-describedby={errors.attendeeNotes ? "attendeeNotes-error" : undefined}
            aria-invalid={errors.attendeeNotes ? "true" : "false"}
            className={cn(
              "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
              "placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
              "transition-colors resize-none",
              errors.attendeeNotes && "border-danger focus:ring-danger"
            )}
          />
          {errors.attendeeNotes && (
            <p id="attendeeNotes-error" className="mt-1.5 text-sm text-danger">
              {errors.attendeeNotes}
            </p>
          )}
        </div>

        {/* Custom questions */}
        {customQuestions.length > 0 && (
          <>
            <div className="border-t border-gray-200 pt-5">
              <p className="mb-4 text-sm font-medium text-gray-700">
                Additional Information
              </p>
              <div className="space-y-5">
                {customQuestions.map((q) => (
                  <QuestionField
                    key={q.id}
                    question={q}
                    value={responses[q.id] ?? (q.type === "checkbox" ? [] : "")}
                    onChange={handleResponseChange}
                    error={errors[q.id]}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
          </Button>
        </div>
      </form>
    </div>
  );
}
