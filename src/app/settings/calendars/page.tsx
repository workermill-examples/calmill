"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { Calendar, Link as LinkIcon, Unlink, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";

interface CalendarConnection {
  id: string;
  provider: string;
  email: string;
  isPrimary: boolean;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
  accessRole: string;
  backgroundColor?: string;
}

export default function CalendarSettingsPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<CalendarConnection | null>(null);
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);
  const [calendarsLoading, setCalendarsLoading] = useState(false);

  // Check if Google OAuth is configured
  const [googleConfigured, setGoogleConfigured] = useState(false);

  // Load calendar connection status
  const loadConnection = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check for existing Google Calendar connection
      const response = await fetch("/api/integrations/google/calendars", {
        credentials: "include",
      });

      if (response.ok) {
        const { calendars } = await response.json();
        // If calendars endpoint works, we have a connection
        setConnection({} as CalendarConnection); // Simplified since we don't expose all connection details
        setCalendars(calendars || []);
        setGoogleConfigured(true);
      } else if (response.status === 404) {
        // No connection found
        setConnection(null);
        setCalendars([]);
        // Check if Google is configured by trying to get connect URL
        await checkGoogleConfiguration();
      } else if (response.status === 503) {
        // Google not configured
        setGoogleConfigured(false);
        setConnection(null);
        setCalendars([]);
      } else {
        throw new Error("Failed to check calendar connection");
      }
    } catch (error) {
      console.error("Error loading calendar connection:", error);
      setError(error instanceof Error ? error.message : "Failed to load calendar settings");
      // Try to check Google config even if there's an error
      await checkGoogleConfiguration();
    } finally {
      setLoading(false);
    }
  };

  // Check if Google OAuth is properly configured
  const checkGoogleConfiguration = async () => {
    try {
      const response = await fetch("/api/integrations/google/connect", {
        credentials: "include",
      });

      if (response.status === 503) {
        setGoogleConfigured(false);
      } else {
        setGoogleConfigured(true);
      }
    } catch (error) {
      console.error("Error checking Google configuration:", error);
      setGoogleConfigured(false);
    }
  };

  // Connect to Google Calendar
  const connectGoogle = async () => {
    if (!googleConfigured) {
      addToast({
        title: "Google Calendar Not Available",
        description: "Google Calendar integration is not configured on this server.",
        variant: "danger",
      });
      return;
    }

    try {
      setConnecting(true);
      setError(null);

      const response = await fetch("/api/integrations/google/connect", {
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to initiate Google connection");
      }

      const { authUrl } = await response.json();

      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error connecting to Google:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to connect to Google Calendar";
      setError(errorMessage);
      addToast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "danger",
      });
      setConnecting(false);
    }
  };

  // Disconnect from Google Calendar
  const disconnectGoogle = async () => {
    try {
      setDisconnecting(true);
      setError(null);

      const response = await fetch("/api/integrations/google/disconnect", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to disconnect from Google Calendar");
      }

      setConnection(null);
      setCalendars([]);

      addToast({
        title: "Disconnected",
        description: "Successfully disconnected from Google Calendar",
      });
    } catch (error) {
      console.error("Error disconnecting from Google:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to disconnect from Google Calendar";
      setError(errorMessage);
      addToast({
        title: "Disconnection Failed",
        description: errorMessage,
        variant: "danger",
      });
    } finally {
      setDisconnecting(false);
    }
  };

  // Refresh calendars list
  const refreshCalendars = async () => {
    if (!connection) return;

    try {
      setCalendarsLoading(true);
      setError(null);

      const response = await fetch("/api/integrations/google/calendars", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to refresh calendars");
      }

      const { calendars } = await response.json();
      setCalendars(calendars || []);
    } catch (error) {
      console.error("Error refreshing calendars:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to refresh calendars";
      setError(errorMessage);
      addToast({
        title: "Refresh Failed",
        description: errorMessage,
        variant: "danger",
      });
    } finally {
      setCalendarsLoading(false);
    }
  };

  useEffect(() => {
    loadConnection();
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (code) {
      // OAuth success - reload the page to refresh connection status
      addToast({
        title: "Connected",
        description: "Successfully connected to Google Calendar",
      });
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      // Reload connection
      loadConnection();
    } else if (error) {
      // OAuth error
      addToast({
        title: "Connection Failed",
        description: "Failed to connect to Google Calendar",
        variant: "danger",
      });
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [addToast]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Calendar Connections</h2>
          <p className="text-muted-foreground">
            Connect your calendar accounts to enable scheduling conflicts detection and automatic event creation.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <div className="text-sm text-destructive">{error}</div>
            </div>
          </div>
        )}

        {/* Google Calendar Configuration Warning */}
        {!googleConfigured && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Google Calendar Integration Not Configured
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  The server administrator needs to configure Google Calendar API credentials to enable this feature.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Google Calendar Section */}
        <div className="border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">Google Calendar</h3>
              <p className="text-sm text-muted-foreground">
                Connect your Google Calendar to prevent double bookings and sync events.
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="mb-4">
            {connection ? (
              <div className="flex items-center gap-2">
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Connected
                </Badge>
                <span className="text-sm text-muted-foreground">
                  • Calendar sync enabled
                </span>
              </div>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                <AlertCircle className="h-3 w-3" />
                Not Connected
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {connection ? (
              <>
                <Button
                  variant="outline"
                  onClick={refreshCalendars}
                  disabled={calendarsLoading}
                >
                  {calendarsLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Refreshing...
                    </>
                  ) : (
                    "Refresh Calendars"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={disconnectGoogle}
                  disabled={disconnecting}
                  className="text-destructive hover:text-destructive"
                >
                  {disconnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Disconnecting...
                    </>
                  ) : (
                    <>
                      <Unlink className="h-4 w-4 mr-2" />
                      Disconnect
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                onClick={connectGoogle}
                disabled={connecting || !googleConfigured}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {connecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Connect Google Calendar
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Connected Calendars List */}
          {connection && (
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-md font-medium text-foreground mb-3">Available Calendars</h4>

              {calendarsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : calendars.length > 0 ? (
                <div className="space-y-2">
                  {calendars.map((calendar) => (
                    <div
                      key={calendar.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: calendar.backgroundColor || '#4285f4' }}
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {calendar.summary}
                          </p>
                          {calendar.description && (
                            <p className="text-xs text-muted-foreground">
                              {calendar.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {calendar.primary && (
                          <Badge variant="outline" size="sm">
                            Primary
                          </Badge>
                        )}
                        <Badge variant="secondary" size="sm">
                          {calendar.accessRole}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="No Calendars Found"
                  description="No calendars were found in your Google account or you may not have the necessary permissions."
                  action={
                    <Button variant="outline" onClick={refreshCalendars} size="sm">
                      Refresh Calendars
                    </Button>
                  }
                />
              )}
            </div>
          )}

          {/* Help Text */}
          {connection && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> CalMill will automatically check for conflicts across all your connected calendars
                when someone tries to book a meeting with you. Events will be created in your primary calendar.
              </p>
            </div>
          )}
        </div>

        {/* Future Integrations */}
        <div className="border border-border rounded-lg p-6 opacity-60">
          <h3 className="text-lg font-medium text-foreground mb-4">Other Calendar Providers</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Outlook Calendar</p>
                  <p className="text-xs text-muted-foreground">Microsoft Exchange integration</p>
                </div>
              </div>
              <Badge variant="secondary" size="sm">Coming Soon</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Apple Calendar</p>
                  <p className="text-xs text-muted-foreground">iCloud calendar sync</p>
                </div>
              </div>
              <Badge variant="secondary" size="sm">Coming Soon</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}