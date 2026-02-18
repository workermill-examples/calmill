'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type EventTrigger =
  | 'BOOKING_CREATED'
  | 'BOOKING_CANCELLED'
  | 'BOOKING_RESCHEDULED'
  | 'BOOKING_ACCEPTED'
  | 'BOOKING_REJECTED';

const ALL_TRIGGERS: EventTrigger[] = [
  'BOOKING_CREATED',
  'BOOKING_CANCELLED',
  'BOOKING_RESCHEDULED',
  'BOOKING_ACCEPTED',
  'BOOKING_REJECTED',
];

const TRIGGER_LABELS: Record<EventTrigger, string> = {
  BOOKING_CREATED: 'Booking Created',
  BOOKING_CANCELLED: 'Booking Cancelled',
  BOOKING_RESCHEDULED: 'Booking Rescheduled',
  BOOKING_ACCEPTED: 'Booking Accepted',
  BOOKING_REJECTED: 'Booking Rejected',
};

interface WebhookDelivery {
  id: string;
  eventType: string;
  statusCode: number | null;
  success: boolean;
  error: string | null;
  deliveryId: string;
  createdAt: string;
}

interface Webhook {
  id: string;
  url: string;
  eventTriggers: EventTrigger[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastDelivery?: {
    success: boolean;
    statusCode: number | null;
    createdAt: string;
  } | null;
  deliveries?: WebhookDelivery[];
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function WebhookIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

// ─── Status Dot ───────────────────────────────────────────────────────────────

function StatusDot({ success, noDelivery }: { success?: boolean; noDelivery?: boolean }) {
  if (noDelivery) {
    return (
      <span
        className="inline-block h-2 w-2 rounded-full bg-gray-300"
        title="No deliveries yet"
        aria-label="No deliveries yet"
      />
    );
  }
  return (
    <span
      className={cn('inline-block h-2 w-2 rounded-full', success ? 'bg-green-500' : 'bg-red-500')}
      title={success ? 'Last delivery succeeded' : 'Last delivery failed'}
      aria-label={success ? 'Last delivery succeeded' : 'Last delivery failed'}
    />
  );
}

// ─── Trigger Badges ───────────────────────────────────────────────────────────

function TriggerBadge({ trigger }: { trigger: EventTrigger }) {
  const colorMap: Record<EventTrigger, string> = {
    BOOKING_CREATED: 'bg-green-100 text-green-800',
    BOOKING_CANCELLED: 'bg-red-100 text-red-800',
    BOOKING_RESCHEDULED: 'bg-blue-100 text-blue-800',
    BOOKING_ACCEPTED: 'bg-emerald-100 text-emerald-800',
    BOOKING_REJECTED: 'bg-orange-100 text-orange-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        colorMap[trigger]
      )}
    >
      {TRIGGER_LABELS[trigger]}
    </span>
  );
}

// ─── Secret Display ───────────────────────────────────────────────────────────

function SecretBanner({ secret, onDismiss }: { secret: string; onDismiss: () => void }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(secret).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <svg
          className="h-5 w-5 text-amber-600 mt-0.5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-800">Save your webhook secret</p>
          <p className="mt-0.5 text-sm text-amber-700">
            This secret is shown only once. Copy it now — you won&apos;t be able to see it again.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <code className="flex-1 min-w-0 rounded-md border border-amber-300 bg-white px-3 py-2 font-mono text-xs text-gray-900 break-all">
              {secret}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded-md border border-amber-300 bg-white px-3 py-2 text-xs font-medium text-amber-800 hover:bg-amber-100 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-amber-500 hover:text-amber-700"
          aria-label="Dismiss"
        >
          <XIcon />
        </button>
      </div>
    </div>
  );
}

// ─── Add Webhook Dialog ───────────────────────────────────────────────────────

interface AddWebhookDialogProps {
  onClose: () => void;
  onCreated: (webhook: Webhook, secret: string) => void;
}

function AddWebhookDialog({ onClose, onCreated }: AddWebhookDialogProps) {
  const [url, setUrl] = useState('');
  const [triggers, setTriggers] = useState<EventTrigger[]>(['BOOKING_CREATED']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleTrigger(trigger: EventTrigger) {
    setTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (triggers.length === 0) {
      setError('Select at least one event trigger.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, eventTriggers: triggers, active: true }),
      });

      const data = await res.json();
      if (!res.ok) {
        const detail = data.details?.[0]?.message ?? data.error ?? 'Failed to create webhook';
        setError(detail);
        return;
      }

      const { secret, ...webhookWithoutSecret } = data.data;
      onCreated(webhookWithoutSecret, secret);
    } catch {
      setError('Failed to create webhook. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-webhook-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 id="add-webhook-title" className="text-lg font-semibold text-gray-900">
            Add Webhook
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md text-gray-400 hover:text-gray-600 focus-ring"
            aria-label="Close dialog"
          >
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* URL */}
          <div>
            <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 mb-1.5">
              Endpoint URL
            </label>
            <input
              id="webhook-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://example.com/webhooks/calmill"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
            <p className="mt-1 text-xs text-gray-500">
              Must use HTTPS (localhost allowed for development).
            </p>
          </div>

          {/* Event Triggers */}
          <div>
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">
                Event Triggers
              </legend>
              <div className="space-y-2">
                {ALL_TRIGGERS.map((trigger) => (
                  <label
                    key={trigger}
                    className="flex items-center gap-3 cursor-pointer rounded-md border border-gray-200 px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={triggers.includes(trigger)}
                      onChange={() => toggleTrigger(trigger)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{TRIGGER_LABELS[trigger]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Create Webhook
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Webhook Dialog ──────────────────────────────────────────────────────

interface EditWebhookDialogProps {
  webhook: Webhook;
  onClose: () => void;
  onSaved: (updated: Webhook) => void;
}

function EditWebhookDialog({ webhook, onClose, onSaved }: EditWebhookDialogProps) {
  const [url, setUrl] = useState(webhook.url);
  const [triggers, setTriggers] = useState<EventTrigger[]>(webhook.eventTriggers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleTrigger(trigger: EventTrigger) {
    setTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (triggers.length === 0) {
      setError('Select at least one event trigger.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/webhooks/${webhook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, eventTriggers: triggers }),
      });

      const data = await res.json();
      if (!res.ok) {
        const detail = data.details?.[0]?.message ?? data.error ?? 'Failed to update webhook';
        setError(detail);
        return;
      }

      onSaved(data.data);
    } catch {
      setError('Failed to update webhook. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-webhook-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 id="edit-webhook-title" className="text-lg font-semibold text-gray-900">
            Edit Webhook
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md text-gray-400 hover:text-gray-600 focus-ring"
            aria-label="Close dialog"
          >
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="edit-webhook-url"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Endpoint URL
            </label>
            <input
              id="edit-webhook-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">
                Event Triggers
              </legend>
              <div className="space-y-2">
                {ALL_TRIGGERS.map((trigger) => (
                  <label
                    key={trigger}
                    className="flex items-center gap-3 cursor-pointer rounded-md border border-gray-200 px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={triggers.includes(trigger)}
                      onChange={() => toggleTrigger(trigger)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{TRIGGER_LABELS[trigger]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delivery History Table ───────────────────────────────────────────────────

function DeliveryHistoryTable({ deliveries }: { deliveries: WebhookDelivery[] }) {
  if (deliveries.length === 0) {
    return <p className="py-6 text-center text-sm text-gray-500">No deliveries yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead>
          <tr>
            <th className="py-3 pr-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Time
            </th>
            <th className="py-3 pr-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Event
            </th>
            <th className="py-3 pr-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Status
            </th>
            <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Result
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {deliveries.map((d) => (
            <tr key={d.id} className="hover:bg-gray-50">
              <td className="py-2.5 pr-4 text-gray-600 whitespace-nowrap">
                {new Date(d.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="py-2.5 pr-4">
                <TriggerBadge trigger={d.eventType as EventTrigger} />
              </td>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{d.statusCode ?? '—'}</td>
              <td className="py-2.5">
                {d.success ? (
                  <span className="flex items-center gap-1 text-green-700">
                    <CheckIcon className="h-3.5 w-3.5" />
                    Success
                  </span>
                ) : (
                  <span
                    className="flex items-center gap-1 text-red-600"
                    title={d.error ?? undefined}
                  >
                    <XIcon className="h-3.5 w-3.5" />
                    Failed
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Webhook Detail Panel ─────────────────────────────────────────────────────

interface WebhookDetailPanelProps {
  webhookId: string;
  onBack: () => void;
  onUpdated: (webhook: Webhook) => void;
  onDeleted: (id: string) => void;
}

function WebhookDetailPanel({ webhookId, onBack, onUpdated, onDeleted }: WebhookDetailPanelProps) {
  const [webhook, setWebhook] = useState<Webhook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/webhooks/${webhookId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to load webhook');
      setWebhook(data.data);
    } catch {
      setError('Failed to load webhook details.');
    } finally {
      setLoading(false);
    }
  }, [webhookId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  async function handleToggleActive() {
    if (!webhook) return;
    try {
      const res = await fetch(`/api/webhooks/${webhook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !webhook.active }),
      });
      const data = await res.json();
      if (res.ok) {
        const updated = { ...webhook, ...data.data };
        setWebhook(updated);
        onUpdated(updated);
      }
    } catch {
      // ignore
    }
  }

  async function handleTest() {
    if (!webhook) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(`/api/webhooks/${webhook.id}/test`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setTestResult({
          success: data.data?.success ?? true,
          message: data.data?.success
            ? `Test delivered (HTTP ${data.data?.statusCode ?? 200})`
            : `Delivery failed (HTTP ${data.data?.statusCode ?? '—'})`,
        });
        // Refresh deliveries
        fetchDetail();
      } else {
        setTestResult({ success: false, message: data.error ?? 'Test failed' });
      }
    } catch {
      setTestResult({ success: false, message: 'Test request failed' });
    } finally {
      setTesting(false);
    }
  }

  async function handleDelete() {
    if (!webhook) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/webhooks/${webhook.id}`, { method: 'DELETE' });
      if (res.ok) {
        onDeleted(webhook.id);
      }
    } catch {
      // ignore
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="h-24 rounded-lg bg-gray-100" />
        <div className="h-48 rounded-lg bg-gray-100" />
      </div>
    );
  }

  if (error || !webhook) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error ?? 'Webhook not found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md text-gray-500 hover:text-gray-700 focus-ring"
          aria-label="Back to webhooks list"
        >
          <svg
            className="h-5 w-5"
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
        </button>
        <h2 className="text-xl font-semibold text-gray-900 truncate">{webhook.url}</h2>
      </div>

      {/* Detail card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
        {/* URL + status */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Endpoint URL
            </p>
            <p className="font-mono text-sm text-gray-900 break-all">{webhook.url}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Active toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={webhook.active}
              onClick={handleToggleActive}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-ring',
                webhook.active ? 'bg-primary-600' : 'bg-gray-200'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 rounded-full bg-white transition-transform shadow',
                  webhook.active ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
            <span className="text-sm text-gray-600">{webhook.active ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        {/* Triggers */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Event Triggers
          </p>
          <div className="flex flex-wrap gap-1.5">
            {webhook.eventTriggers.map((trigger) => (
              <TriggerBadge key={trigger} trigger={trigger} />
            ))}
          </div>
        </div>

        {/* Created */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created</p>
          <p className="text-sm text-gray-700">
            {new Date(webhook.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
          <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
            Edit
          </Button>
          <Button variant="secondary" size="sm" loading={testing} onClick={handleTest}>
            {testing ? 'Sending…' : 'Send Test'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={deleting}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </Button>
        </div>

        {/* Test result */}
        {testResult && (
          <div
            className={cn(
              'rounded-md border px-4 py-3 text-sm flex items-center gap-2',
              testResult.success
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-red-200 bg-red-50 text-red-700'
            )}
          >
            {testResult.success ? <CheckIcon /> : <XIcon />}
            {testResult.message}
          </div>
        )}
      </div>

      {/* Delivery history */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-base font-semibold text-gray-900">Delivery History</h3>
          <p className="mt-0.5 text-xs text-gray-500">Last 10 deliveries</p>
        </div>
        <div className="px-6 py-2">
          <DeliveryHistoryTable deliveries={webhook.deliveries ?? []} />
        </div>
      </div>

      {/* Delete confirm dialog */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-webhook-title"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDeleteConfirm(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 id="delete-webhook-title" className="text-base font-semibold text-gray-900">
              Delete webhook?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              This will permanently delete the webhook and all its delivery history. This action
              cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit dialog */}
      {showEditDialog && (
        <EditWebhookDialog
          webhook={webhook}
          onClose={() => setShowEditDialog(false)}
          onSaved={(updated) => {
            const merged = { ...webhook, ...updated };
            setWebhook(merged);
            onUpdated(merged);
            setShowEditDialog(false);
          }}
        />
      )}
    </div>
  );
}

// ─── Webhook List Row ─────────────────────────────────────────────────────────

interface WebhookRowProps {
  webhook: Webhook;
  onSelect: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

function WebhookRow({ webhook, onSelect, onToggleActive }: WebhookRowProps) {
  const lastDelivery = webhook.lastDelivery;

  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3.5 hover:border-gray-300 hover:bg-gray-50 transition-colors group">
      {/* Status dot */}
      <div className="shrink-0">
        <StatusDot success={lastDelivery?.success} noDelivery={!lastDelivery} />
      </div>

      {/* URL + triggers */}
      <button
        type="button"
        onClick={() => onSelect(webhook.id)}
        className="flex-1 min-w-0 text-left focus-ring rounded"
        aria-label={`View details for ${webhook.url}`}
      >
        <p className="font-medium text-gray-900 truncate text-sm">{webhook.url}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {webhook.eventTriggers.slice(0, 3).map((t) => (
            <TriggerBadge key={t} trigger={t} />
          ))}
          {webhook.eventTriggers.length > 3 && (
            <span className="text-xs text-gray-500">+{webhook.eventTriggers.length - 3} more</span>
          )}
        </div>
      </button>

      {/* Active toggle */}
      <div className="shrink-0 flex items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={webhook.active}
          onClick={(e) => {
            e.stopPropagation();
            onToggleActive(webhook.id, !webhook.active);
          }}
          className={cn(
            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-ring',
            webhook.active ? 'bg-primary-600' : 'bg-gray-200'
          )}
          aria-label={webhook.active ? 'Deactivate webhook' : 'Activate webhook'}
        >
          <span
            className={cn(
              'inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform shadow',
              webhook.active ? 'translate-x-4.5' : 'translate-x-0.5'
            )}
          />
        </button>
      </div>

      {/* Chevron */}
      <button
        type="button"
        onClick={() => onSelect(webhook.id)}
        className="shrink-0 focus-ring rounded"
        aria-hidden="true"
        tabIndex={-1}
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WebhooksSettingsPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [selectedWebhookId, setSelectedWebhookId] = useState<string | null>(null);

  const fetchWebhooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/webhooks');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to load webhooks');
      setWebhooks(data.data);
    } catch {
      setError('Failed to load webhooks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWebhooks();
  }, [fetchWebhooks]);

  async function handleToggleActive(id: string, active: boolean) {
    try {
      const res = await fetch(`/api/webhooks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      });
      const data = await res.json();
      if (res.ok) {
        setWebhooks((prev) => prev.map((w) => (w.id === id ? { ...w, ...data.data } : w)));
      }
    } catch {
      // ignore
    }
  }

  function handleWebhookCreated(webhook: Webhook, secret: string) {
    setWebhooks((prev) => [webhook, ...prev]);
    setShowAddDialog(false);
    setNewSecret(secret);
  }

  function handleWebhookUpdated(updated: Webhook) {
    setWebhooks((prev) => prev.map((w) => (w.id === updated.id ? { ...w, ...updated } : w)));
  }

  function handleWebhookDeleted(id: string) {
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
    setSelectedWebhookId(null);
  }

  // Show detail panel
  if (selectedWebhookId) {
    return (
      <WebhookDetailPanel
        webhookId={selectedWebhookId}
        onBack={() => setSelectedWebhookId(null)}
        onUpdated={handleWebhookUpdated}
        onDeleted={handleWebhookDeleted}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Webhooks</h2>
          <p className="mt-1 text-sm text-gray-500">
            Receive real-time notifications when bookings are created or updated.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowAddDialog(true)}>
          <span className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Webhook
          </span>
        </Button>
      </div>

      {/* New secret banner */}
      {newSecret && <SecretBanner secret={newSecret} onDismiss={() => setNewSecret(null)} />}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Webhooks list */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-2">
          <WebhookIcon />
          <h3 className="text-base font-semibold text-gray-900">Your Webhooks</h3>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : webhooks.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
                <WebhookIcon />
              </div>
              <p className="text-sm font-medium text-gray-900">No webhooks yet</p>
              <p className="mt-1 text-sm text-gray-500 max-w-sm">
                Add a webhook to receive instant notifications when bookings change.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddDialog(true)}
                className="mt-4"
              >
                Add your first webhook
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {webhooks.map((webhook) => (
                <WebhookRow
                  key={webhook.id}
                  webhook={webhook}
                  onSelect={setSelectedWebhookId}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info section */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h3 className="text-sm font-semibold text-gray-900">How webhooks work</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <CheckIcon className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
            CalMill sends an HTTP POST request to your URL when a booking event occurs.
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
            Each request is signed with HMAC-SHA256 using your webhook secret.
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
            Verify the signature via the{' '}
            <code className="rounded bg-gray-200 px-1 py-0.5 font-mono text-xs">
              X-CalMill-Signature
            </code>{' '}
            header.
          </li>
        </ul>
      </div>

      {/* Add dialog */}
      {showAddDialog && (
        <AddWebhookDialog
          onClose={() => setShowAddDialog(false)}
          onCreated={handleWebhookCreated}
        />
      )}
    </div>
  );
}
