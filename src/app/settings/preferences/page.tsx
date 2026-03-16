"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useToast } from "@/components/ui/toast";
import { Save, Globe, Calendar, Palette } from "lucide-react";

interface UserProfile {
  id: string;
  timezone: string;
  weekStart: number;
  theme: string;
}

// Common timezones list
const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona Time" },
  { value: "America/Anchorage", label: "Alaska Time" },
  { value: "Pacific/Honolulu", label: "Hawaii Time" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Europe/Rome", label: "Rome (CET)" },
  { value: "Europe/Madrid", label: "Madrid (CET)" },
  { value: "Europe/Amsterdam", label: "Amsterdam (CET)" },
  { value: "Europe/Brussels", label: "Brussels (CET)" },
  { value: "Europe/Vienna", label: "Vienna (CET)" },
  { value: "Europe/Zurich", label: "Zurich (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Seoul", label: "Seoul (KST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
  { value: "Australia/Melbourne", label: "Melbourne (AEDT)" },
  { value: "Australia/Perth", label: "Perth (AWST)" },
  { value: "UTC", label: "UTC" },
];

const WEEK_START_OPTIONS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const THEME_OPTIONS = [
  { value: "light", label: "Light", description: "Light mode" },
  { value: "dark", label: "Dark", description: "Dark mode" },
  { value: "system", label: "System", description: "Follow system preference" },
];

export default function PreferencesSettingsPage() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    timezone: "",
    weekStart: 1, // Monday by default
    theme: "system",
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-detect timezone
  const detectTimezone = () => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneOption = TIMEZONES.find(tz => tz.value === detected);
    if (timezoneOption) {
      setFormData(prev => ({
        ...prev,
        timezone: detected,
      }));
      setHasUnsavedChanges(true);
      addToast({
        title: "Timezone Updated",
        description: `Timezone updated to ${timezoneOption.label}`,
      });
    }
  };

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/user", {
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch preferences");
      }

      const { user } = await response.json();
      setProfile(user);

      // Update form data
      setFormData({
        timezone: user.timezone || "America/New_York",
        weekStart: user.weekStart ?? 1,
        theme: user.theme || "system",
      });

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      setError(error instanceof Error ? error.message : "Failed to load preferences");
    } finally {
      setLoading(false);
    }
  };

  // Save preferences
  const savePreferences = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          timezone: formData.timezone,
          weekStart: formData.weekStart,
          theme: formData.theme,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update preferences");
      }

      const { user } = await response.json();
      setProfile(user);
      setHasUnsavedChanges(false);

      addToast({
        title: "Success",
        description: "Preferences updated successfully",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save preferences";
      setError(errorMessage);
      addToast({
        title: "Error",
        description: errorMessage,
        variant: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle form field changes
  const handleInputChange = <T extends keyof typeof formData>(
    field: T,
    value: typeof formData[T]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to load preferences"
          description={error}
          onRetry={fetchProfile}
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <ErrorState
          title="Preferences not found"
          description="Unable to load your preference data."
          onRetry={fetchProfile}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Preferences</h2>
          <p className="text-muted-foreground">
            Configure your timezone, calendar, and interface preferences.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-sm text-destructive">{error}</div>
            </div>
          </div>
        )}

        {/* Preferences Form */}
        <div className="space-y-8">
          {/* Timezone Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium text-foreground">Timezone</h3>
            </div>
            <div className="space-y-4 pl-7">
              <div>
                <label htmlFor="timezone" className="text-sm font-medium text-foreground mb-2 block">
                  Your Timezone
                </label>
                <div className="space-y-2">
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => handleInputChange("timezone", value)}
                    options={TIMEZONES}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={detectTimezone}
                    >
                      Auto-detect
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Current time: {new Date().toLocaleString("en-US", {
                        timeZone: formData.timezone,
                        dateStyle: "short",
                        timeStyle: "medium",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium text-foreground">Calendar</h3>
            </div>
            <div className="space-y-4 pl-7">
              <div>
                <label htmlFor="weekStart" className="text-sm font-medium text-foreground mb-2 block">
                  Week starts on
                </label>
                <Select
                  value={formData.weekStart.toString()}
                  onValueChange={(value) => handleInputChange("weekStart", parseInt(value))}
                  options={WEEK_START_OPTIONS.map(option => ({ value: option.value.toString(), label: option.label }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This affects how calendars and availability are displayed
                </p>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium text-foreground">Appearance</h3>
            </div>
            <div className="space-y-4 pl-7">
              <div>
                <label htmlFor="theme" className="text-sm font-medium text-foreground mb-2 block">
                  Theme
                </label>
                <Select
                  value={formData.theme}
                  onValueChange={(value) => handleInputChange("theme", value)}
                  options={THEME_OPTIONS.map(option => ({ value: option.value, label: `${option.label} - ${option.description}` }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Choose your preferred interface theme
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            {hasUnsavedChanges && (
              <p className="text-sm text-muted-foreground">
                You have unsaved changes
              </p>
            )}
          </div>
          <Button
            onClick={savePreferences}
            disabled={saving || !hasUnsavedChanges}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}