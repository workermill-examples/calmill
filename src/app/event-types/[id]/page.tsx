"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/toggle";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  Settings,
  Clock,
  Calendar,
  CreditCard,
  FileText,
  RotateCcw,
} from "lucide-react";
import { z } from "zod";

// Types and interfaces
interface EventType {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: number;
  isActive: boolean;
  requiresConfirmation: boolean;
  price: number | null;
  currency: string | null;
  minimumNotice: number;
  beforeBuffer: number;
  afterBuffer: number;
  slotInterval: number | null;
  maxBookingsPerDay: number | null;
  maxBookingsPerWeek: number | null;
  futureLimit: number | null;
  color: string;
  customQuestions: CustomQuestion[] | null;
  recurringEnabled: boolean;
  recurringFrequency: "weekly" | "biweekly" | "monthly" | null;
  scheduleId: string | null;
  schedule?: {
    id: string;
    name: string;
    timezone: string;
  } | null;
  bookingCount: number;
}

interface CustomQuestion {
  id: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "phone";
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface Schedule {
  id: string;
  name: string;
  timezone: string;
  eventTypeCount: number;
}

const customQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(["text", "textarea", "select", "radio", "checkbox", "phone"]),
  label: z.string().min(1, "Question label is required"),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  placeholder: z.string().optional(),
});

const eventTypeSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  description: z.string().optional(),
  duration: z
    .number()
    .int()
    .min(1, "Duration must be at least 1 minute")
    .max(480, "Duration cannot exceed 8 hours"),
  isActive: z.boolean(),
  requiresConfirmation: z.boolean(),
  price: z.number().int().min(0).nullable(),
  currency: z.string().length(3).nullable(),
  minimumNotice: z.number().int().min(0),
  beforeBuffer: z.number().int().min(0),
  afterBuffer: z.number().int().min(0),
  slotInterval: z.number().int().min(1).nullable(),
  maxBookingsPerDay: z.number().int().min(1).nullable(),
  maxBookingsPerWeek: z.number().int().min(1).nullable(),
  futureLimit: z.number().int().min(1).nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color"),
  customQuestions: z.array(customQuestionSchema).nullable(),
  recurringEnabled: z.boolean(),
  recurringFrequency: z.enum(["weekly", "biweekly", "monthly"]).nullable(),
  scheduleId: z.string().nullable(),
});

function EventTypeEditorContent() {
  const params = useParams();
  const router = useRouter();
  const eventTypeId = params?.id as string;

  // State management
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Debounced auto-save
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const debouncedSave = useCallback(
    (data: Partial<EventType>) => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      const timeout = setTimeout(async () => {
        if (hasChanges && eventType) {
          try {
            setSaving(true);
            const response = await fetch(`/api/event-types/${eventTypeId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Failed to save changes");
            }

            setHasChanges(false);
            setValidationErrors({});
          } catch (err) {
            console.error("Auto-save error:", err);
            // Don't show error notification for auto-save failures
          } finally {
            setSaving(false);
          }
        }
      }, 2000); // 2 second debounce

      setSaveTimeout(timeout);
    },
    [eventTypeId, hasChanges, eventType, saveTimeout],
  );

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch event type and schedules in parallel
        const [eventTypeResponse, schedulesResponse] = await Promise.all([
          fetch(`/api/event-types/${eventTypeId}`),
          fetch("/api/schedules"),
        ]);

        if (!eventTypeResponse.ok) {
          const errorData = await eventTypeResponse.json();
          throw new Error(errorData.message || "Failed to fetch event type");
        }

        if (!schedulesResponse.ok) {
          const errorData = await schedulesResponse.json();
          throw new Error(errorData.message || "Failed to fetch schedules");
        }

        const eventTypeData = await eventTypeResponse.json();
        const schedulesData = await schedulesResponse.json();

        setEventType(eventTypeData.eventType);
        setSchedules(schedulesData.schedules);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (eventTypeId) {
      fetchData();
    }
  }, [eventTypeId]);

  // Update event type with auto-save
  const updateEventType = useCallback(
    (updates: Partial<EventType>) => {
      if (!eventType) return;

      const updatedEventType = { ...eventType, ...updates };
      setEventType(updatedEventType);
      setHasChanges(true);
      debouncedSave(updatedEventType);
    },
    [eventType, debouncedSave],
  );

  // Manual save
  const handleSave = async () => {
    if (!eventType) return;

    try {
      setSaving(true);
      setValidationErrors({});

      // Validate data
      const validationResult = eventTypeSchema.safeParse(eventType);
      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          errors[path] = issue.message;
        });
        setValidationErrors(errors);
        return;
      }

      const response = await fetch(`/api/event-types/${eventTypeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventType),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save changes");
      }

      const data = await response.json();
      setEventType(data.eventType);
      setHasChanges(false);

      // Show success feedback (you could use a toast here)
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = "Saved!";
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Delete event type
  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this event type? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/event-types/${eventTypeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete event type");
      }

      router.push("/event-types");
    } catch (err) {
      console.error("Delete error:", err);
      alert(err instanceof Error ? err.message : "Failed to delete event type");
    }
  };

  // Custom question management
  const addCustomQuestion = () => {
    const newQuestion: CustomQuestion = {
      id: `custom_${Date.now()}`,
      type: "text",
      label: "",
      required: false,
      placeholder: "",
    };

    const currentQuestions = eventType?.customQuestions || [];
    updateEventType({
      customQuestions: [...currentQuestions, newQuestion],
    });
  };

  const updateCustomQuestion = (
    questionId: string,
    updates: Partial<CustomQuestion>,
  ) => {
    if (!eventType?.customQuestions) return;

    const updatedQuestions = eventType.customQuestions.map((q) =>
      q.id === questionId ? { ...q, ...updates } : q,
    );
    updateEventType({ customQuestions: updatedQuestions });
  };

  const removeCustomQuestion = (questionId: string) => {
    if (!eventType?.customQuestions) return;

    const updatedQuestions = eventType.customQuestions.filter(
      (q) => q.id !== questionId,
    );
    updateEventType({ customQuestions: updatedQuestions });
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load event type"
        description={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!eventType) {
    return (
      <ErrorState
        title="Event type not found"
        description="The event type you're looking for doesn't exist or you don't have permission to access it."
        onRetry={() => router.push("/event-types")}
        retryText="Back to Event Types"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/event-types")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Edit Event Type
            </h1>
            <p className="text-muted-foreground">{eventType.title}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {hasChanges && (
            <span className="text-sm text-muted-foreground">
              Unsaved changes
            </span>
          )}
          {saving && <span className="text-sm text-blue-600">Saving...</span>}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={saving}
            loading={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="availability">
            <Calendar className="h-4 w-4 mr-2" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="limits">
            <Clock className="h-4 w-4 mr-2" />
            Limits & Buffers
          </TabsTrigger>
          <TabsTrigger value="booking-form">
            <FileText className="h-4 w-4 mr-2" />
            Booking Form
          </TabsTrigger>
          <TabsTrigger value="recurring">
            <RotateCcw className="h-4 w-4 mr-2" />
            Recurring
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <GeneralTab
            eventType={eventType}
            onUpdate={updateEventType}
            validationErrors={validationErrors}
          />
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability">
          <AvailabilityTab
            eventType={eventType}
            schedules={schedules}
            onUpdate={updateEventType}
            validationErrors={validationErrors}
          />
        </TabsContent>

        {/* Limits & Buffers Tab */}
        <TabsContent value="limits">
          <LimitsTab
            eventType={eventType}
            onUpdate={updateEventType}
            validationErrors={validationErrors}
          />
        </TabsContent>

        {/* Booking Form Tab */}
        <TabsContent value="booking-form">
          <BookingFormTab
            eventType={eventType}
            onUpdate={updateEventType}
            onAddQuestion={addCustomQuestion}
            onUpdateQuestion={updateCustomQuestion}
            onRemoveQuestion={removeCustomQuestion}
            validationErrors={validationErrors}
          />
        </TabsContent>

        {/* Recurring Tab */}
        <TabsContent value="recurring">
          <RecurringTab
            eventType={eventType}
            onUpdate={updateEventType}
            validationErrors={validationErrors}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Tab Components
function GeneralTab({
  eventType,
  onUpdate,
  validationErrors,
}: {
  eventType: EventType;
  onUpdate: (updates: Partial<EventType>) => void;
  validationErrors: Record<string, string>;
}) {
  const colors = [
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#6B7280",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#F97316",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Event Name *
            </label>
            <Input
              value={eventType.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="30 Minute Meeting"
              className={validationErrors.title ? "border-red-500" : ""}
            />
            {validationErrors.title && (
              <p className="text-sm text-red-600">{validationErrors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              URL Slug *
            </label>
            <Input
              value={eventType.slug}
              onChange={(e) =>
                onUpdate({
                  slug: e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-"),
                })
              }
              placeholder="30-minute-meeting"
              className={validationErrors.slug ? "border-red-500" : ""}
            />
            {validationErrors.slug && (
              <p className="text-sm text-red-600">{validationErrors.slug}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={eventType.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="A brief description of this event type..."
          />
        </div>

        {/* Duration and Color */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Duration (minutes) *
            </label>
            <Input
              type="number"
              min="1"
              max="480"
              value={eventType.duration}
              onChange={(e) =>
                onUpdate({ duration: parseInt(e.target.value) || 1 })
              }
              className={validationErrors.duration ? "border-red-500" : ""}
            />
            {validationErrors.duration && (
              <p className="text-sm text-red-600">
                {validationErrors.duration}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Color</label>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    eventType.color === color
                      ? "border-foreground"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onUpdate({ color })}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Pricing</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Price
              </label>
              <Input
                type="number"
                min="0"
                value={eventType.price || ""}
                onChange={(e) =>
                  onUpdate({
                    price: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Currency
              </label>
              <Select
                value={eventType.currency || ""}
                onValueChange={(value) => onUpdate({ currency: value || null })}
                placeholder="Select currency"
                options={[
                  { value: "USD", label: "USD" },
                  { value: "EUR", label: "EUR" },
                  { value: "GBP", label: "GBP" },
                  { value: "CAD", label: "CAD" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Active
                </label>
                <p className="text-sm text-muted-foreground">
                  Allow new bookings for this event type
                </p>
              </div>
              <Switch
                checked={eventType.isActive}
                onCheckedChange={(checked) => onUpdate({ isActive: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Requires Confirmation
                </label>
                <p className="text-sm text-muted-foreground">
                  Manually approve each booking request
                </p>
              </div>
              <Switch
                checked={eventType.requiresConfirmation}
                onCheckedChange={(checked) =>
                  onUpdate({ requiresConfirmation: checked })
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AvailabilityTab({
  eventType,
  schedules,
  onUpdate,
  validationErrors,
}: {
  eventType: EventType;
  schedules: Schedule[];
  onUpdate: (updates: Partial<EventType>) => void;
  validationErrors: Record<string, string>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Schedule
          </label>
          <Select
            value={eventType.scheduleId || ""}
            onValueChange={(value) => onUpdate({ scheduleId: value || null })}
            placeholder="Use default schedule"
            options={schedules.map((schedule) => ({
              value: schedule.id,
              label: `${schedule.name} (${schedule.timezone})`,
            }))}
          />
          <p className="text-sm text-muted-foreground">
            Select which schedule to use for this event type. If no schedule is
            selected, your default schedule will be used.
          </p>
        </div>

        {eventType.schedule && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-foreground">
              {eventType.schedule.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              Timezone: {eventType.schedule.timezone}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LimitsTab({
  eventType,
  onUpdate,
  validationErrors,
}: {
  eventType: EventType;
  onUpdate: (updates: Partial<EventType>) => void;
  validationErrors: Record<string, string>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Limits & Buffers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Minimum Notice */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Minimum Notice (minutes)
          </label>
          <Input
            type="number"
            min="0"
            value={eventType.minimumNotice}
            onChange={(e) =>
              onUpdate({ minimumNotice: parseInt(e.target.value) || 0 })
            }
            placeholder="0"
          />
          <p className="text-sm text-muted-foreground">
            How much advance notice do you need for bookings?
          </p>
        </div>

        {/* Buffer Times */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Before Buffer (minutes)
            </label>
            <Input
              type="number"
              min="0"
              value={eventType.beforeBuffer}
              onChange={(e) =>
                onUpdate({ beforeBuffer: parseInt(e.target.value) || 0 })
              }
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              After Buffer (minutes)
            </label>
            <Input
              type="number"
              min="0"
              value={eventType.afterBuffer}
              onChange={(e) =>
                onUpdate({ afterBuffer: parseInt(e.target.value) || 0 })
              }
              placeholder="0"
            />
          </div>
        </div>

        {/* Slot Interval */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Slot Interval (minutes)
          </label>
          <Input
            type="number"
            min="1"
            value={eventType.slotInterval || ""}
            onChange={(e) =>
              onUpdate({
                slotInterval: e.target.value ? parseInt(e.target.value) : null,
              })
            }
            placeholder={`${eventType.duration} (same as duration)`}
          />
          <p className="text-sm text-muted-foreground">
            How often should available slots appear? Leave empty to use the
            event duration.
          </p>
        </div>

        {/* Daily and Weekly Limits */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Max Bookings per Day
            </label>
            <Input
              type="number"
              min="1"
              value={eventType.maxBookingsPerDay || ""}
              onChange={(e) =>
                onUpdate({
                  maxBookingsPerDay: e.target.value
                    ? parseInt(e.target.value)
                    : null,
                })
              }
              placeholder="Unlimited"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Max Bookings per Week
            </label>
            <Input
              type="number"
              min="1"
              value={eventType.maxBookingsPerWeek || ""}
              onChange={(e) =>
                onUpdate({
                  maxBookingsPerWeek: e.target.value
                    ? parseInt(e.target.value)
                    : null,
                })
              }
              placeholder="Unlimited"
            />
          </div>
        </div>

        {/* Future Limit */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Future Booking Limit (days)
          </label>
          <Input
            type="number"
            min="1"
            value={eventType.futureLimit || ""}
            onChange={(e) =>
              onUpdate({
                futureLimit: e.target.value ? parseInt(e.target.value) : null,
              })
            }
            placeholder="Unlimited"
          />
          <p className="text-sm text-muted-foreground">
            How far into the future can people book?
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function BookingFormTab({
  eventType,
  onUpdate,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
  validationErrors,
}: {
  eventType: EventType;
  onUpdate: (updates: Partial<EventType>) => void;
  onAddQuestion: () => void;
  onUpdateQuestion: (
    questionId: string,
    updates: Partial<CustomQuestion>,
  ) => void;
  onRemoveQuestion: (questionId: string) => void;
  validationErrors: Record<string, string>;
}) {
  const questionTypes = [
    { value: "text", label: "Short Text" },
    { value: "textarea", label: "Long Text" },
    { value: "select", label: "Dropdown" },
    { value: "radio", label: "Multiple Choice" },
    { value: "checkbox", label: "Checkboxes" },
    { value: "phone", label: "Phone Number" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Standard Fields Info */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Standard Fields</h4>
          <p className="text-sm text-muted-foreground">
            Name and email are always collected. Add custom questions below to
            gather additional information.
          </p>
        </div>

        {/* Custom Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Custom Questions</h4>
            <Button variant="outline" size="sm" onClick={onAddQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          {eventType.customQuestions && eventType.customQuestions.length > 0 ? (
            <div className="space-y-4">
              {eventType.customQuestions.map((question, index) => (
                <Card key={question.id} className="p-4">
                  <div className="space-y-4">
                    {/* Question Type and Required */}
                    <div className="flex items-center justify-between">
                      <Select
                        value={question.type}
                        onValueChange={(value) =>
                          onUpdateQuestion(question.id, {
                            type: value as CustomQuestion["type"],
                          })
                        }
                        options={questionTypes}
                      />
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={question.required}
                          onCheckedChange={(checked) =>
                            onUpdateQuestion(question.id, { required: checked })
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          Required
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRemoveQuestion(question.id)}
                          className="p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Question Label */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Question Label
                      </label>
                      <Input
                        value={question.label}
                        onChange={(e) =>
                          onUpdateQuestion(question.id, {
                            label: e.target.value,
                          })
                        }
                        placeholder="What is your question?"
                      />
                    </div>

                    {/* Placeholder */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Placeholder Text (optional)
                      </label>
                      <Input
                        value={question.placeholder || ""}
                        onChange={(e) =>
                          onUpdateQuestion(question.id, {
                            placeholder: e.target.value,
                          })
                        }
                        placeholder="Placeholder text..."
                      />
                    </div>

                    {/* Options for select, radio, checkbox */}
                    {(question.type === "select" ||
                      question.type === "radio" ||
                      question.type === "checkbox") && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Options (one per line)
                        </label>
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={question.options?.join("\n") || ""}
                          onChange={(e) =>
                            onUpdateQuestion(question.id, {
                              options: e.target.value
                                .split("\n")
                                .filter((opt) => opt.trim()),
                            })
                          }
                          placeholder="Option 1\nOption 2\nOption 3"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No custom questions added yet. Click &quot;Add Question&quot; to
              get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RecurringTab({
  eventType,
  onUpdate,
  validationErrors,
}: {
  eventType: EventType;
  onUpdate: (updates: Partial<EventType>) => void;
  validationErrors: Record<string, string>;
}) {
  const frequencyOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurring Bookings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable Recurring */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Enable Recurring Bookings
            </label>
            <p className="text-sm text-muted-foreground">
              Allow attendees to book multiple sessions at once
            </p>
          </div>
          <Switch
            checked={eventType.recurringEnabled}
            onCheckedChange={(checked) =>
              onUpdate({
                recurringEnabled: checked,
                recurringFrequency: checked ? "weekly" : null,
              })
            }
          />
        </div>

        {/* Recurring Frequency */}
        {eventType.recurringEnabled && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Recurring Frequency
            </label>
            <Select
              value={eventType.recurringFrequency || "weekly"}
              onValueChange={(value) =>
                onUpdate({
                  recurringFrequency: value as
                    | "weekly"
                    | "biweekly"
                    | "monthly",
                })
              }
              options={frequencyOptions}
            />
            <p className="text-sm text-muted-foreground">
              How often should the recurring sessions occur?
            </p>
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium text-foreground mb-2">
            How Recurring Bookings Work
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Attendees can choose to book multiple sessions at once</li>
            <li>
              • Each session will be scheduled based on the selected frequency
            </li>
            <li>
              • All sessions share the same booking details and attendee
              information
            </li>
            <li>
              • Individual sessions can be cancelled without affecting others
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EventTypeEditorPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <EventTypeEditorContent />
    </Suspense>
  );
}
