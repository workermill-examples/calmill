"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Schedule {
  id: string;
  name: string;
  timezone: string;
  isDefault: boolean;
}

interface SchedulesResponse {
  schedules: Schedule[];
}

interface CreateEventTypeData {
  title: string;
  slug: string;
  description: string;
  duration: number;
  isActive: boolean;
  requiresConfirmation: boolean;
  price: number;
  currency: string;
  minimumNotice: number;
  beforeBuffer: number;
  afterBuffer: number;
  slotInterval: number | null;
  maxBookingsPerDay: number | null;
  maxBookingsPerWeek: number | null;
  futureLimit: number | null;
  color: string;
  scheduleId: string | null;
}

const colors = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
];

function CreateEventTypeContent() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateEventTypeData>({
    title: "",
    slug: "",
    description: "",
    duration: 30,
    isActive: true,
    requiresConfirmation: false,
    price: 0,
    currency: "USD",
    minimumNotice: 120,
    beforeBuffer: 0,
    afterBuffer: 0,
    slotInterval: null,
    maxBookingsPerDay: null,
    maxBookingsPerWeek: null,
    futureLimit: null,
    color: colors[0],
    scheduleId: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    // Auto-generate slug from title
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/schedules');
      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }

      const data: SchedulesResponse = await response.json();
      setSchedules(data.schedules);

      // Set default schedule if available
      const defaultSchedule = data.schedules.find(s => s.isDefault);
      if (defaultSchedule) {
        setFormData(prev => ({ ...prev, scheduleId: defaultSchedule.id }));
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "URL slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "URL slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (formData.duration < 1 || formData.duration > 480) {
      newErrors.duration = "Duration must be between 1 and 480 minutes";
    }

    if (formData.minimumNotice < 0) {
      newErrors.minimumNotice = "Minimum notice cannot be negative";
    }

    if (formData.beforeBuffer < 0) {
      newErrors.beforeBuffer = "Before buffer cannot be negative";
    }

    if (formData.afterBuffer < 0) {
      newErrors.afterBuffer = "After buffer cannot be negative";
    }

    if (formData.slotInterval !== null && (formData.slotInterval < 1 || formData.slotInterval > formData.duration)) {
      newErrors.slotInterval = "Slot interval must be between 1 minute and the event duration";
    }

    if (formData.maxBookingsPerDay !== null && formData.maxBookingsPerDay < 1) {
      newErrors.maxBookingsPerDay = "Max bookings per day must be at least 1";
    }

    if (formData.maxBookingsPerWeek !== null && formData.maxBookingsPerWeek < 1) {
      newErrors.maxBookingsPerWeek = "Max bookings per week must be at least 1";
    }

    if (formData.futureLimit !== null && formData.futureLimit < 1) {
      newErrors.futureLimit = "Future limit must be at least 1 day";
    }

    if (formData.price < 0) {
      newErrors.price = "Price cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch('/api/event-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Convert empty strings to null for optional numeric fields
          slotInterval: formData.slotInterval || undefined,
          maxBookingsPerDay: formData.maxBookingsPerDay || undefined,
          maxBookingsPerWeek: formData.maxBookingsPerWeek || undefined,
          futureLimit: formData.futureLimit || undefined,
          scheduleId: formData.scheduleId || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event type');
      }

      const data = await response.json();
      window.location.href = `/event-types/${data.eventType.id}`;
    } catch (err) {
      console.error('Error creating event type:', err);
      setError(err instanceof Error ? err.message : 'Failed to create event type');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateEventTypeData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load form"
        description={error}
        onRetry={fetchSchedules}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/event-types'}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Event Type</h1>
          <p className="text-muted-foreground">
            Set up a new schedulable meeting type
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                    Event Title
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="30 Minute Meeting"
                    className={cn(errors.title && "border-red-500")}
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-2">
                    URL Slug
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {typeof window !== 'undefined' ? window.location.origin : ''}/demo/
                    </span>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="30-minute-meeting"
                      className={cn("flex-1", errors.slug && "border-red-500")}
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-red-600 text-sm mt-1">{errors.slug}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="A quick 30-minute meeting to discuss your project"
                    rows={3}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-foreground mb-2">
                      Duration (minutes)
                    </label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="480"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 1)}
                      className={cn(errors.duration && "border-red-500")}
                    />
                    {errors.duration && (
                      <p className="text-red-600 text-sm mt-1">{errors.duration}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-foreground mb-2">
                      Color
                    </label>
                    <div className="flex space-x-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleInputChange('color', color)}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                            formData.color === color
                              ? "border-foreground ring-2 ring-primary/20"
                              : "border-gray-300"
                          )}
                          style={{ backgroundColor: color }}
                          aria-label={`Select color ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="schedule" className="block text-sm font-medium text-foreground mb-2">
                    Availability Schedule
                  </label>
                  <Select
                    value={formData.scheduleId || ""}
                    onValueChange={(value) => handleInputChange('scheduleId', value || null)}
                    placeholder="Select a schedule"
                    options={schedules.map((schedule) => ({
                      value: schedule.id,
                      label: `${schedule.name}${schedule.isDefault ? ' (Default)' : ''}`
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="minimumNotice" className="block text-sm font-medium text-foreground mb-2">
                      Minimum Notice (minutes)
                    </label>
                    <Input
                      id="minimumNotice"
                      type="number"
                      min="0"
                      value={formData.minimumNotice}
                      onChange={(e) => handleInputChange('minimumNotice', parseInt(e.target.value) || 0)}
                      className={cn(errors.minimumNotice && "border-red-500")}
                    />
                    {errors.minimumNotice && (
                      <p className="text-red-600 text-sm mt-1">{errors.minimumNotice}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="slotInterval" className="block text-sm font-medium text-foreground mb-2">
                      Slot Interval (minutes, optional)
                    </label>
                    <Input
                      id="slotInterval"
                      type="number"
                      min="1"
                      value={formData.slotInterval || ""}
                      onChange={(e) => handleInputChange('slotInterval', parseInt(e.target.value) || null)}
                      placeholder="Use duration"
                      className={cn(errors.slotInterval && "border-red-500")}
                    />
                    {errors.slotInterval && (
                      <p className="text-red-600 text-sm mt-1">{errors.slotInterval}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="beforeBuffer" className="block text-sm font-medium text-foreground mb-2">
                      Buffer Before (minutes)
                    </label>
                    <Input
                      id="beforeBuffer"
                      type="number"
                      min="0"
                      value={formData.beforeBuffer}
                      onChange={(e) => handleInputChange('beforeBuffer', parseInt(e.target.value) || 0)}
                      className={cn(errors.beforeBuffer && "border-red-500")}
                    />
                    {errors.beforeBuffer && (
                      <p className="text-red-600 text-sm mt-1">{errors.beforeBuffer}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="afterBuffer" className="block text-sm font-medium text-foreground mb-2">
                      Buffer After (minutes)
                    </label>
                    <Input
                      id="afterBuffer"
                      type="number"
                      min="0"
                      value={formData.afterBuffer}
                      onChange={(e) => handleInputChange('afterBuffer', parseInt(e.target.value) || 0)}
                      className={cn(errors.afterBuffer && "border-red-500")}
                    />
                    {errors.afterBuffer && (
                      <p className="text-red-600 text-sm mt-1">{errors.afterBuffer}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="maxBookingsPerDay" className="block text-sm font-medium text-foreground mb-2">
                      Max/Day (optional)
                    </label>
                    <Input
                      id="maxBookingsPerDay"
                      type="number"
                      min="1"
                      value={formData.maxBookingsPerDay || ""}
                      onChange={(e) => handleInputChange('maxBookingsPerDay', parseInt(e.target.value) || null)}
                      placeholder="No limit"
                      className={cn(errors.maxBookingsPerDay && "border-red-500")}
                    />
                    {errors.maxBookingsPerDay && (
                      <p className="text-red-600 text-sm mt-1">{errors.maxBookingsPerDay}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="maxBookingsPerWeek" className="block text-sm font-medium text-foreground mb-2">
                      Max/Week (optional)
                    </label>
                    <Input
                      id="maxBookingsPerWeek"
                      type="number"
                      min="1"
                      value={formData.maxBookingsPerWeek || ""}
                      onChange={(e) => handleInputChange('maxBookingsPerWeek', parseInt(e.target.value) || null)}
                      placeholder="No limit"
                      className={cn(errors.maxBookingsPerWeek && "border-red-500")}
                    />
                    {errors.maxBookingsPerWeek && (
                      <p className="text-red-600 text-sm mt-1">{errors.maxBookingsPerWeek}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="futureLimit" className="block text-sm font-medium text-foreground mb-2">
                      Future Limit (days, optional)
                    </label>
                    <Input
                      id="futureLimit"
                      type="number"
                      min="1"
                      value={formData.futureLimit || ""}
                      onChange={(e) => handleInputChange('futureLimit', parseInt(e.target.value) || null)}
                      placeholder="No limit"
                      className={cn(errors.futureLimit && "border-red-500")}
                    />
                    {errors.futureLimit && (
                      <p className="text-red-600 text-sm mt-1">{errors.futureLimit}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border rounded-lg px-3">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Requires Confirmation</h4>
                    <p className="text-xs text-muted-foreground">Manually approve each booking</p>
                  </div>
                  <Toggle
                    pressed={formData.requiresConfirmation}
                    onPressedChange={(pressed) => handleInputChange('requiresConfirmation', pressed)}
                  />
                </div>

                <div className="flex items-center justify-between py-2 border rounded-lg px-3">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Active</h4>
                    <p className="text-xs text-muted-foreground">Accept new bookings</p>
                  </div>
                  <Toggle
                    pressed={formData.isActive}
                    onPressedChange={(pressed) => handleInputChange('isActive', pressed)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-16 rounded-full flex-shrink-0"
                      style={{ backgroundColor: formData.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {formData.title || "Event Title"}
                      </h3>
                      {formData.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                          {formData.description}
                        </p>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground mt-2">
                        <Eye className="h-3 w-3 mr-1" />
                        {formData.duration}m duration
                      </div>
                    </div>
                  </div>

                  {formData.slug && (
                    <div className="p-2 bg-muted rounded text-xs font-mono text-muted-foreground">
                      {typeof window !== 'undefined' ? window.location.origin : ''}/demo/{formData.slug}
                    </div>
                  )}

                  <div className="text-xs space-y-1 text-muted-foreground">
                    {formData.minimumNotice > 0 && (
                      <div>• {formData.minimumNotice}m minimum notice</div>
                    )}
                    {formData.beforeBuffer > 0 && (
                      <div>• {formData.beforeBuffer}m buffer before</div>
                    )}
                    {formData.afterBuffer > 0 && (
                      <div>• {formData.afterBuffer}m buffer after</div>
                    )}
                    {formData.requiresConfirmation && (
                      <div>• Requires confirmation</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/event-types'}
          >
            Cancel
          </Button>

          <div className="space-x-2">
            <Button
              type="submit"
              disabled={submitting}
              className="min-w-[120px]"
            >
              {submitting ? (
                "Creating..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Event Type
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CreateEventTypePage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <CreateEventTypeContent />
    </Suspense>
  );
}