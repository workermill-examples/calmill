'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { BookingStatus } from '@/generated/prisma/client';

// ─── Reason Dialog ────────────────────────────────────────────────────────────

function ReasonDialog({
  action,
  onConfirm,
  onCancel,
  loading,
}: {
  action: 'reject' | 'cancel';
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = setTimeout(() => textareaRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !loading) onCancel();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [loading, onCancel]);

  const isReject = action === 'reject';
  const title = isReject ? 'Reject booking?' : 'Cancel booking?';
  const description = isReject
    ? 'Provide an optional reason for rejecting this booking.'
    : 'Provide an optional reason for cancelling this booking.';
  const confirmLabel = isReject ? 'Reject' : 'Cancel Booking';
  const confirmLoadingLabel = isReject ? 'Rejecting…' : 'Cancelling…';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reason-dialog-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 id="reason-dialog-title" className="text-base font-semibold text-gray-900">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
        <textarea
          ref={textareaRef}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          rows={3}
          maxLength={500}
          className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
        />
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-ring disabled:opacity-50"
          >
            Go back
          </button>
          <button
            type="button"
            onClick={() => onConfirm(reason)}
            disabled={loading}
            className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus-ring disabled:opacity-50"
          >
            {loading ? confirmLoadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface BookingActionsProps {
  uid: string;
  status: BookingStatus;
  rebookUsername?: string | null;
  rebookEventTypeSlug?: string | null;
}

export function BookingActions({
  uid,
  status,
  rebookUsername,
  rebookEventTypeSlug,
}: BookingActionsProps) {
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showReasonDialog, setShowReasonDialog] = useState<'reject' | 'cancel' | null>(null);
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(status);

  async function performAction(action: 'accept' | 'reject' | 'cancel', reason?: string) {
    setActionLoading(action);
    try {
      const res = await fetch(`/api/bookings/${uid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...(reason ? { reason } : {}) }),
      });

      if (res.ok) {
        const data = await res.json();
        const newStatus = data.data?.status as BookingStatus | undefined;
        if (newStatus) {
          setCurrentStatus(newStatus);
        }
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? `Failed to ${action} booking`);
      }
    } catch {
      alert(`Failed to ${action} booking`);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleAccept() {
    await performAction('accept');
  }

  async function handleRejectConfirm(reason: string) {
    await performAction('reject', reason);
    setShowReasonDialog(null);
  }

  async function handleCancelConfirm(reason: string) {
    await performAction('cancel', reason);
    setShowReasonDialog(null);
  }

  const rebookHref =
    rebookUsername && rebookEventTypeSlug
      ? `/${rebookUsername}/${rebookEventTypeSlug}`
      : rebookUsername
        ? `/${rebookUsername}`
        : null;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {currentStatus === 'PENDING' && (
          <>
            <button
              type="button"
              onClick={handleAccept}
              disabled={actionLoading !== null}
              className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus-ring disabled:opacity-50 transition-colors"
            >
              {actionLoading === 'accept' ? 'Accepting…' : 'Accept'}
            </button>
            <button
              type="button"
              onClick={() => setShowReasonDialog('reject')}
              disabled={actionLoading !== null}
              className="inline-flex items-center rounded-md bg-danger px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus-ring disabled:opacity-50 transition-colors"
            >
              Reject
            </button>
          </>
        )}

        {currentStatus === 'ACCEPTED' && (
          <button
            type="button"
            onClick={() => setShowReasonDialog('cancel')}
            disabled={actionLoading !== null}
            className="inline-flex items-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 focus-ring disabled:opacity-50 transition-colors"
          >
            Cancel Booking
          </button>
        )}

        {(currentStatus === 'CANCELLED' || currentStatus === 'REJECTED') && rebookHref && (
          <Link
            href={rebookHref}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-ring transition-colors"
          >
            Rebook
          </Link>
        )}

        {/* Back to bookings list */}
        <Link
          href="/bookings"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-ring transition-colors"
        >
          ← Back to Bookings
        </Link>
      </div>

      {/* Reason dialogs */}
      {showReasonDialog === 'reject' && (
        <ReasonDialog
          action="reject"
          onConfirm={handleRejectConfirm}
          onCancel={() => setShowReasonDialog(null)}
          loading={actionLoading === 'reject'}
        />
      )}
      {showReasonDialog === 'cancel' && (
        <ReasonDialog
          action="cancel"
          onConfirm={handleCancelConfirm}
          onCancel={() => setShowReasonDialog(null)}
          loading={actionLoading === 'cancel'}
        />
      )}
    </>
  );
}
