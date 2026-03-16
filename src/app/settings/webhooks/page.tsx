"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import {
  Webhook,
  Plus,
  Edit3,
  Trash2,
  TestTube,
  Copy,
  AlertCircle,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";

// Webhook event types based on the API schema
const WEBHOOK_EVENTS = [
  {
    value: "BOOKING_CREATED",
    label: "Booking Created",
    description: "When a new booking is made",
  },
  {
    value: "BOOKING_ACCEPTED",
    label: "Booking Accepted",
    description: "When you accept a pending booking",
  },
  {
    value: "BOOKING_REJECTED",
    label: "Booking Rejected",
    description: "When you reject a pending booking",
  },
  {
    value: "BOOKING_CANCELLED",
    label: "Booking Cancelled",
    description: "When a booking is cancelled",
  },
  {
    value: "BOOKING_RESCHEDULED",
    label: "Booking Rescheduled",
    description: "When a booking is moved to a different time",
  },
];

interface WebhookDelivery {
  id: string;
  event: string;
  statusCode: number;
  error: string | null;
  createdAt: string;
}

interface Webhook {
  id: string;
  url: string;
  eventTriggers: string[];
  active: boolean;
  secret: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    deliveries: number;
  };
  deliveries?: WebhookDelivery[];
}

interface WebhookFormData {
  url: string;
  eventTriggers: string[];
  active: boolean;
}

export default function WebhooksPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);

  // Form states
  const [formData, setFormData] = useState<WebhookFormData>({
    url: "",
    eventTriggers: [],
    active: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Testing states
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);

  // Secret visibility
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());

  // Load webhooks
  const loadWebhooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/webhooks", {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to manage webhooks");
        }
        throw new Error("Failed to load webhooks");
      }

      const webhooksData = await response.json();
      setWebhooks(Array.isArray(webhooksData) ? webhooksData : []);
    } catch (error) {
      console.error("Error loading webhooks:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load webhooks",
      );
    } finally {
      setLoading(false);
    }
  };

  // Create webhook
  const createWebhook = async () => {
    if (!validateForm()) return;

    try {
      setFormSubmitting(true);

      const response = await fetch("/api/webhooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.details) {
          // Validation errors from server
          const newFormErrors: Record<string, string> = {};
          data.details.forEach((error: any) => {
            newFormErrors[error.path?.[0] || "form"] = error.message;
          });
          setFormErrors(newFormErrors);
          return;
        }
        throw new Error(data.error || "Failed to create webhook");
      }

      const newWebhook = await response.json();
      setWebhooks((prev) => [newWebhook, ...prev]);
      setIsCreateModalOpen(false);
      resetForm();

      addToast({
        title: "Webhook Created",
        description: "Your webhook has been created successfully",
      });
    } catch (error) {
      console.error("Error creating webhook:", error);
      addToast({
        title: "Creation Failed",
        description:
          error instanceof Error ? error.message : "Failed to create webhook",
        variant: "danger",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Update webhook
  const updateWebhook = async () => {
    if (!editingWebhook || !validateForm()) return;

    try {
      setFormSubmitting(true);

      const response = await fetch(`/api/webhooks/${editingWebhook.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.details) {
          // Validation errors from server
          const newFormErrors: Record<string, string> = {};
          data.details.forEach((error: any) => {
            newFormErrors[error.path?.[0] || "form"] = error.message;
          });
          setFormErrors(newFormErrors);
          return;
        }
        throw new Error(data.error || "Failed to update webhook");
      }

      const updatedWebhook = await response.json();
      setWebhooks((prev) =>
        prev.map((w) => (w.id === updatedWebhook.id ? updatedWebhook : w)),
      );
      setIsEditModalOpen(false);
      setEditingWebhook(null);
      resetForm();

      addToast({
        title: "Webhook Updated",
        description: "Your webhook has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating webhook:", error);
      addToast({
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "Failed to update webhook",
        variant: "danger",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete webhook
  const deleteWebhook = async (webhook: Webhook) => {
    if (
      !confirm(
        `Are you sure you want to delete this webhook?\n\n${webhook.url}`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/webhooks/${webhook.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete webhook");
      }

      setWebhooks((prev) => prev.filter((w) => w.id !== webhook.id));

      addToast({
        title: "Webhook Deleted",
        description: "Your webhook has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting webhook:", error);
      addToast({
        title: "Deletion Failed",
        description:
          error instanceof Error ? error.message : "Failed to delete webhook",
        variant: "danger",
      });
    }
  };

  // Test webhook
  const testWebhook = async (webhookId: string) => {
    try {
      setTestingWebhook(webhookId);

      const response = await fetch(`/api/webhooks/${webhookId}/test`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test delivery failed");
      }

      addToast({
        title: "Test Successful",
        description: `Webhook test delivered successfully (Status: ${data.statusCode})`,
      });
    } catch (error) {
      console.error("Error testing webhook:", error);
      addToast({
        title: "Test Failed",
        description:
          error instanceof Error ? error.message : "Failed to test webhook",
        variant: "danger",
      });
    } finally {
      setTestingWebhook(null);
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.url.trim()) {
      errors.url = "URL is required";
    } else {
      try {
        new URL(formData.url);
      } catch {
        errors.url = "Please enter a valid URL";
      }
    }

    if (formData.eventTriggers.length === 0) {
      errors.eventTriggers = "Please select at least one event";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      url: "",
      eventTriggers: [],
      active: true,
    });
    setFormErrors({});
  };

  // Start editing
  const startEditing = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setFormData({
      url: webhook.url,
      eventTriggers: webhook.eventTriggers,
      active: webhook.active,
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Handle event trigger toggle
  const handleEventTriggerToggle = (eventType: string) => {
    setFormData((prev) => ({
      ...prev,
      eventTriggers: prev.eventTriggers.includes(eventType)
        ? prev.eventTriggers.filter((e) => e !== eventType)
        : [...prev.eventTriggers, eventType],
    }));
  };

  // Copy secret to clipboard
  const copySecret = async (secret: string) => {
    try {
      await navigator.clipboard.writeText(secret);
      addToast({
        title: "Copied",
        description: "Webhook secret copied to clipboard",
      });
    } catch (error) {
      addToast({
        title: "Copy Failed",
        description: "Failed to copy secret to clipboard",
        variant: "danger",
      });
    }
  };

  // Toggle secret visibility
  const toggleSecretVisibility = (webhookId: string) => {
    setVisibleSecrets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(webhookId)) {
        newSet.delete(webhookId);
      } else {
        newSet.add(webhookId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    loadWebhooks();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Webhooks
            </h2>
            <p className="text-muted-foreground">
              Receive real-time notifications when booking events occur.
            </p>
          </div>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Webhook</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* URL Input */}
                <div>
                  <label
                    htmlFor="webhook-url"
                    className="text-sm font-medium text-foreground mb-2 block"
                  >
                    Endpoint URL
                  </label>
                  <Input
                    id="webhook-url"
                    type="url"
                    placeholder="https://your-app.com/webhooks/calmill"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, url: e.target.value }))
                    }
                    className={formErrors.url ? "border-destructive" : ""}
                  />
                  {formErrors.url && (
                    <p className="text-sm text-destructive mt-1">
                      {formErrors.url}
                    </p>
                  )}
                </div>

                {/* Event Types */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Events to Subscribe
                  </label>
                  {formErrors.eventTriggers && (
                    <p className="text-sm text-destructive mb-2">
                      {formErrors.eventTriggers}
                    </p>
                  )}
                  <div className="space-y-3">
                    {WEBHOOK_EVENTS.map((event) => (
                      <div
                        key={event.value}
                        className="flex items-start gap-3 p-3 border border-border rounded-lg"
                      >
                        <input
                          type="checkbox"
                          id={`create-event-${event.value}`}
                          checked={formData.eventTriggers.includes(event.value)}
                          onChange={() => handleEventTriggerToggle(event.value)}
                          className="mt-0.5"
                        />
                        <label
                          htmlFor={`create-event-${event.value}`}
                          className="cursor-pointer flex-1"
                        >
                          <div className="font-medium text-sm text-foreground">
                            {event.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {event.description}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3">
                  <Toggle
                    pressed={formData.active}
                    onPressedChange={(active) =>
                      setFormData((prev) => ({ ...prev, active }))
                    }
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Active
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Enable this webhook to receive events
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={formSubmitting}
                >
                  Cancel
                </Button>
                <Button onClick={createWebhook} disabled={formSubmitting}>
                  {formSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Webhook"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Error Alert */}
        {error && !loading && (
          <ErrorState
            title="Failed to load webhooks"
            description={error}
            onRetry={loadWebhooks}
          />
        )}

        {/* Webhooks List */}
        {!error && (
          <>
            {webhooks.length === 0 ? (
              <EmptyState
                icon={<Webhook />}
                title="No webhooks configured"
                description="Create your first webhook to receive real-time notifications when booking events occur."
                action={{
                  text: "Add Your First Webhook",
                  onClick: () => {
                    resetForm();
                    setIsCreateModalOpen(true);
                  }
                }}
              />
            ) : (
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className="border border-border rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {webhook.url}
                          </p>
                          {webhook.active ? (
                            <Badge variant="success" size="sm">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" size="sm">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {webhook.eventTriggers.map((event) => (
                            <Badge key={event} variant="outline" size="sm">
                              {WEBHOOK_EVENTS.find((e) => e.value === event)
                                ?.label || event}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Created{" "}
                          {new Date(webhook.createdAt).toLocaleDateString()} •{" "}
                          {webhook._count.deliveries} deliveries
                        </p>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testWebhook(webhook.id)}
                          disabled={testingWebhook === webhook.id}
                        >
                          {testingWebhook === webhook.id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1.5"></div>
                              Testing...
                            </>
                          ) : (
                            <>
                              <TestTube className="h-3 w-3 mr-1.5" />
                              Test
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditing(webhook)}
                        >
                          <Edit3 className="h-3 w-3 mr-1.5" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteWebhook(webhook)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3 mr-1.5" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* Secret */}
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-foreground">
                          Signing Secret
                        </label>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSecretVisibility(webhook.id)}
                            className="h-6 px-2"
                          >
                            {visibleSecrets.has(webhook.id) ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copySecret(webhook.secret)}
                            className="h-6 px-2"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <code className="text-xs font-mono text-foreground">
                        {visibleSecrets.has(webhook.id)
                          ? webhook.secret
                          : "•".repeat(32)}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Webhook</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* URL Input */}
              <div>
                <label
                  htmlFor="edit-webhook-url"
                  className="text-sm font-medium text-foreground mb-2 block"
                >
                  Endpoint URL
                </label>
                <Input
                  id="edit-webhook-url"
                  type="url"
                  placeholder="https://your-app.com/webhooks/calmill"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className={formErrors.url ? "border-destructive" : ""}
                />
                {formErrors.url && (
                  <p className="text-sm text-destructive mt-1">
                    {formErrors.url}
                  </p>
                )}
              </div>

              {/* Event Types */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Events to Subscribe
                </label>
                {formErrors.eventTriggers && (
                  <p className="text-sm text-destructive mb-2">
                    {formErrors.eventTriggers}
                  </p>
                )}
                <div className="space-y-3">
                  {WEBHOOK_EVENTS.map((event) => (
                    <div
                      key={event.value}
                      className="flex items-start gap-3 p-3 border border-border rounded-lg"
                    >
                      <input
                        type="checkbox"
                        id={`edit-event-${event.value}`}
                        checked={formData.eventTriggers.includes(event.value)}
                        onChange={() => handleEventTriggerToggle(event.value)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={`edit-event-${event.value}`}
                        className="cursor-pointer flex-1"
                      >
                        <div className="font-medium text-sm text-foreground">
                          {event.label}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {event.description}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <Toggle
                  pressed={formData.active}
                  onPressedChange={(active) =>
                    setFormData((prev) => ({ ...prev, active }))
                  }
                />
                <div>
                  <p className="text-sm font-medium text-foreground">Active</p>
                  <p className="text-xs text-muted-foreground">
                    Enable this webhook to receive events
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={formSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={updateWebhook} disabled={formSubmitting}>
                {formSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Update Webhook"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Information */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Webhook Security
          </h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              • All webhook payloads are signed with HMAC-SHA256 using your
              webhook secret
            </p>
            <p>• Verify the signature using the X-CalMill-Signature header</p>
            <p>
              • Events are delivered with a 10-second timeout and are
              fire-and-forget
            </p>
            <p>• Check the X-CalMill-Event header to identify the event type</p>
          </div>
        </div>
      </div>
    </div>
  );
}
