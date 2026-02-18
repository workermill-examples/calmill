'use client';

import { useState, useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DangerZoneProps {
  username: string;
  onDeleted: () => void;
}

// ─── DeleteAccountDialog ──────────────────────────────────────────────────────

function DeleteAccountDialog({
  username,
  onConfirm,
  onCancel,
}: {
  username: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}) {
  const [confirmInput, setConfirmInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input and handle Escape key
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  async function handleConfirm() {
    if (confirmInput !== username) return;
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
    } catch {
      setError('Failed to delete account. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden="true" />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-5 w-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 id="delete-dialog-title" className="text-base font-semibold text-gray-900">
            Delete account
          </h3>
        </div>

        <p className="mt-3 text-sm text-gray-600">
          This action is <strong>permanent and irreversible</strong>. All your event types,
          bookings, schedules, and profile data will be permanently deleted.
        </p>

        <div className="mt-4">
          <label
            htmlFor="confirm-username"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Type <span className="font-mono font-semibold text-gray-900">{username}</span> to
            confirm
          </label>
          <input
            ref={inputRef}
            id="confirm-username"
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder={username}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-danger focus:border-transparent transition-colors"
          />
        </div>

        {error && (
          <div className="mt-3 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={confirmInput !== username || loading}
            className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Deleting…' : 'Delete my account'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function DangerZone({ username, onDeleted }: DangerZoneProps) {
  const [showDialog, setShowDialog] = useState(false);

  async function handleDeleteAccount() {
    const res = await fetch('/api/user', { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? 'Failed to delete account');
    }
    // Sign out and redirect
    await signOut({ redirect: false });
    onDeleted();
  }

  return (
    <>
      <div className="rounded-lg border border-red-200 bg-white p-6">
        <h2 className="text-base font-semibold text-red-700">Danger zone</h2>
        <p className="mt-1 text-sm text-gray-500">
          Irreversible actions that affect your account permanently.
        </p>

        <div className="mt-6 flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Delete account</p>
            <p className="mt-0.5 text-sm text-gray-500">
              Permanently delete your account and all associated data.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDialog(true)}
            className="ml-4 flex-shrink-0 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 transition-colors"
          >
            Delete account
          </button>
        </div>
      </div>

      {showDialog && (
        <DeleteAccountDialog
          username={username}
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDialog(false)}
        />
      )}
    </>
  );
}
