"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { FormSkeleton } from "@/components/ui/loading-skeleton";
import { Plus, Trash2, Edit, Clock, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface Availability {
  id?: string;
  day: number; // 0-6, 0 = Sunday
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  _delete?: boolean;
}

interface DateOverride {
  id: string;
  date: string; // YYYY-MM-DD format
  startTime: string | null;
  endTime: string | null;
  isUnavailable: boolean;
}

interface Schedule {
  id: string;
  name: string;
  timezone: string;
  isDefault: boolean;
  eventTypeCount: number;
  availabilities: Availability[];
  dateOverrides: DateOverride[];
  createdAt: string;
  updatedAt: string;
}

interface NewSchedule {
  name: string;
  timezone: string;
  isDefault: boolean;
}

// Common timezone options
const timezoneOptions = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona Time (MST)" },
  { value: "America/Alaska", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Kolkata", label: "Mumbai (IST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT/AEST)" },
];

// Day names
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Generate time slots in 15-minute increments
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeValue = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const time12 = new Date(`2000-01-01 ${timeValue}`).toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        },
      );
      slots.push({ value: timeValue, label: time12 });
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

export default function AvailabilityPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create schedule form state
  const [newSchedule, setNewSchedule] = useState<NewSchedule>({
    name: "",
    timezone: "America/New_York",
    isDefault: false,
  });

  // Date override form state
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [overrideForm, setOverrideForm] = useState({
    date: "",
    startTime: "09:00",
    endTime: "17:00",
    isUnavailable: false,
  });

  const selectedSchedule = useMemo(() => {
    return schedules.find((s) => s.id === selectedScheduleId) || null;
  }, [schedules, selectedScheduleId]);

  // Fetch schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/schedules", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch schedules: ${response.status}`);
        }

        const data = await response.json();
        setSchedules(data.schedules || []);

        // Select default schedule or first one
        const defaultSchedule = data.schedules.find(
          (s: Schedule) => s.isDefault,
        );
        const initialSchedule = defaultSchedule || data.schedules[0];
        if (initialSchedule) {
          setSelectedScheduleId(initialSchedule.id);
        }
      } catch (err) {
        console.error("Error fetching schedules:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load schedules",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Create new schedule
  const handleCreateSchedule = async () => {
    if (!newSchedule.name.trim()) {
      setError("Schedule name is required");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newSchedule),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to create schedule: ${response.status}`,
        );
      }

      const data = await response.json();

      // Refresh schedules list
      const schedulesResponse = await fetch("/api/schedules", {
        method: "GET",
        credentials: "include",
      });

      if (schedulesResponse.ok) {
        const schedulesData = await schedulesResponse.json();
        setSchedules(schedulesData.schedules || []);
        setSelectedScheduleId(data.schedule.id);
      }

      // Reset form
      setNewSchedule({
        name: "",
        timezone: "America/New_York",
        isDefault: false,
      });
      setShowCreateForm(false);
    } catch (err) {
      console.error("Error creating schedule:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create schedule",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Update schedule availabilities
  const handleUpdateAvailabilities = async (availabilities: Availability[]) => {
    if (!selectedSchedule) return;

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(`/api/schedules/${selectedSchedule.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          availabilities,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to update schedule: ${response.status}`,
        );
      }

      const data = await response.json();

      // Update local state
      setSchedules((prev) =>
        prev.map((s) => (s.id === selectedSchedule.id ? data.schedule : s)),
      );
    } catch (err) {
      console.error("Error updating schedule:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update schedule",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Add date override
  const handleAddDateOverride = async () => {
    if (!selectedSchedule || !overrideForm.date) {
      setError("Date is required");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const payload = overrideForm.isUnavailable
        ? { date: overrideForm.date, isUnavailable: true }
        : {
            date: overrideForm.date,
            startTime: overrideForm.startTime,
            endTime: overrideForm.endTime,
            isUnavailable: false,
          };

      const response = await fetch(
        `/api/schedules/${selectedSchedule.id}/overrides`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to add date override: ${response.status}`,
        );
      }

      // Refresh schedule data
      const scheduleResponse = await fetch(
        `/api/schedules/${selectedSchedule.id}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (scheduleResponse.ok) {
        const scheduleData = await scheduleResponse.json();
        setSchedules((prev) =>
          prev.map((s) =>
            s.id === selectedSchedule.id ? scheduleData.schedule : s,
          ),
        );
      }

      // Reset form
      setOverrideForm({
        date: "",
        startTime: "09:00",
        endTime: "17:00",
        isUnavailable: false,
      });
      setShowOverrideForm(false);
    } catch (err) {
      console.error("Error adding date override:", err);
      setError(
        err instanceof Error ? err.message : "Failed to add date override",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Delete date override
  const handleDeleteDateOverride = async (overrideId: string) => {
    if (!selectedSchedule) return;

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(
        `/api/schedules/${selectedSchedule.id}/overrides/${overrideId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to delete date override: ${response.status}`,
        );
      }

      // Refresh schedule data
      const scheduleResponse = await fetch(
        `/api/schedules/${selectedSchedule.id}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (scheduleResponse.ok) {
        const scheduleData = await scheduleResponse.json();
        setSchedules((prev) =>
          prev.map((s) =>
            s.id === selectedSchedule.id ? scheduleData.schedule : s,
          ),
        );
      }
    } catch (err) {
      console.error("Error deleting date override:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete date override",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <FormSkeleton />
      </div>
    );
  }

  if (error && schedules.length === 0) {
    return (
      <div className="p-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">
                Failed to load availability
              </p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Availability</h1>
          <p className="text-muted-foreground">
            Manage your schedule and set your available hours for bookings.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Schedule
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-4">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Schedule Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select
              value={selectedScheduleId}
              onValueChange={setSelectedScheduleId}
              options={schedules.map((schedule) => ({
                value: schedule.id,
                label: `${schedule.name}${schedule.isDefault ? " (Default)" : ""} - ${schedule.eventTypeCount} event types`,
              }))}
              placeholder="Select a schedule"
            />

            {selectedSchedule && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {timezoneOptions.find(
                    (tz) => tz.value === selectedSchedule.timezone,
                  )?.label || selectedSchedule.timezone}
                </span>
                {selectedSchedule.isDefault && (
                  <Badge variant="secondary">Default</Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Schedule Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Schedule Name
              </label>
              <Input
                value={newSchedule.name}
                onChange={(e) =>
                  setNewSchedule((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Business Hours"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Timezone</label>
              <Select
                value={newSchedule.timezone}
                onValueChange={(value) =>
                  setNewSchedule((prev) => ({ ...prev, timezone: value }))
                }
                options={timezoneOptions}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={newSchedule.isDefault}
                onCheckedChange={(checked) =>
                  setNewSchedule((prev) => ({ ...prev, isDefault: checked }))
                }
              />
              <label className="text-sm font-medium">
                Set as default schedule
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateSchedule}
                disabled={isSaving || !newSchedule.name.trim()}
                loading={isSaving}
              >
                Create Schedule
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewSchedule({
                    name: "",
                    timezone: "America/New_York",
                    isDefault: false,
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Schedule Grid */}
      {selectedSchedule && (
        <WeeklyScheduleGrid
          schedule={selectedSchedule}
          onUpdateAvailabilities={handleUpdateAvailabilities}
          isSaving={isSaving}
        />
      )}

      {/* Date Overrides */}
      {selectedSchedule && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date-Specific Overrides
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOverrideForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Override
            </Button>
          </CardHeader>
          <CardContent>
            {/* Add Override Form */}
            {showOverrideForm && (
              <div className="mb-6 p-4 border rounded-lg bg-secondary/50">
                <h4 className="font-medium mb-4">Add Date Override</h4>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={overrideForm.date}
                      onChange={(e) =>
                        setOverrideForm((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
                    <Switch
                      checked={overrideForm.isUnavailable}
                      onCheckedChange={(checked) =>
                        setOverrideForm((prev) => ({
                          ...prev,
                          isUnavailable: checked,
                        }))
                      }
                    />
                    <label className="text-sm font-medium">
                      Mark as unavailable
                    </label>
                  </div>

                  {!overrideForm.isUnavailable && (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Start Time
                        </label>
                        <Select
                          value={overrideForm.startTime}
                          onValueChange={(value) =>
                            setOverrideForm((prev) => ({
                              ...prev,
                              startTime: value,
                            }))
                          }
                          options={timeSlots}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          End Time
                        </label>
                        <Select
                          value={overrideForm.endTime}
                          onValueChange={(value) =>
                            setOverrideForm((prev) => ({
                              ...prev,
                              endTime: value,
                            }))
                          }
                          options={timeSlots.filter(
                            (slot) => slot.value > overrideForm.startTime,
                          )}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleAddDateOverride}
                    disabled={isSaving || !overrideForm.date}
                    loading={isSaving}
                  >
                    Add Override
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowOverrideForm(false);
                      setOverrideForm({
                        date: "",
                        startTime: "09:00",
                        endTime: "17:00",
                        isUnavailable: false,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Date Overrides List */}
            <div className="space-y-3">
              {selectedSchedule.dateOverrides.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No date overrides configured.
                </p>
              ) : (
                selectedSchedule.dateOverrides.map((override) => (
                  <div
                    key={override.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {format(
                            new Date(override.date),
                            "EEEE, MMMM d, yyyy",
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {override.isUnavailable ? (
                            <span className="text-destructive">
                              Unavailable
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {override.startTime} - {override.endTime}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDateOverride(override.id)}
                      disabled={isSaving}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Weekly Schedule Grid Component
interface WeeklyScheduleGridProps {
  schedule: Schedule;
  onUpdateAvailabilities: (availabilities: Availability[]) => void;
  isSaving: boolean;
}

function WeeklyScheduleGrid({
  schedule,
  onUpdateAvailabilities,
  isSaving,
}: WeeklyScheduleGridProps) {
  const [availabilities, setAvailabilities] = useState<Availability[]>(
    schedule.availabilities,
  );

  useEffect(() => {
    // Only update if schedule changes from outside
    const timeout = setTimeout(() => {
      if (JSON.stringify(availabilities) !== JSON.stringify(schedule.availabilities)) {
        setAvailabilities(schedule.availabilities);
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [schedule.availabilities]);

  // Save changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        JSON.stringify(availabilities) !==
        JSON.stringify(schedule.availabilities)
      ) {
        onUpdateAvailabilities(availabilities);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [availabilities, schedule.availabilities, onUpdateAvailabilities]);

  // Toggle day availability
  const toggleDay = (day: number, enabled: boolean) => {
    if (enabled) {
      // Add default availability for this day
      setAvailabilities((prev) => [
        ...prev.filter((a) => a.day !== day),
        { day, startTime: "09:00", endTime: "17:00" },
      ]);
    } else {
      // Remove all availabilities for this day
      setAvailabilities((prev) => prev.filter((a) => a.day !== day));
    }
  };

  // Update time for day
  const updateTime = (
    day: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setAvailabilities((prev) =>
      prev.map((a) => (a.day === day ? { ...a, [field]: value } : a)),
    );
  };

  // Add time slot for day
  const addTimeSlot = (day: number) => {
    const existingSlots = availabilities.filter((a) => a.day === day);
    const lastSlot = existingSlots[existingSlots.length - 1];
    const startTime = lastSlot ? lastSlot.endTime : "09:00";

    setAvailabilities((prev) => [
      ...prev,
      { day, startTime, endTime: "17:00" },
    ]);
  };

  // Remove time slot
  const removeTimeSlot = (day: number, index: number) => {
    const daySlots = availabilities.filter((a) => a.day === day);
    if (daySlots.length > 1) {
      setAvailabilities((prev) => {
        const newAvailabilities = [...prev];
        const slotIndex = newAvailabilities.findIndex(
          (a, i) => a.day === day && daySlots.indexOf(a) === index,
        );
        if (slotIndex >= 0) {
          newAvailabilities.splice(slotIndex, 1);
        }
        return newAvailabilities;
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Weekly Schedule
        </CardTitle>
        {isSaving && (
          <Badge variant="secondary" className="animate-pulse">
            Saving...
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dayNames.map((dayName, day) => {
            const dayAvailabilities = availabilities.filter(
              (a) => a.day === day,
            );
            const isEnabled = dayAvailabilities.length > 0;

            return (
              <div key={day} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) => toggleDay(day, checked)}
                    />
                    <label className="font-medium">{dayName}</label>
                  </div>
                  {isEnabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addTimeSlot(day)}
                      className="text-primary"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Hours
                    </Button>
                  )}
                </div>

                {isEnabled && (
                  <div className="space-y-2">
                    {dayAvailabilities.map((availability, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Select
                          value={availability.startTime}
                          onValueChange={(value) =>
                            updateTime(day, "startTime", value)
                          }
                          options={timeSlots}
                          className="flex-1"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Select
                          value={availability.endTime}
                          onValueChange={(value) =>
                            updateTime(day, "endTime", value)
                          }
                          options={timeSlots.filter(
                            (slot) => slot.value > availability.startTime,
                          )}
                          className="flex-1"
                        />
                        {dayAvailabilities.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimeSlot(day, index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
