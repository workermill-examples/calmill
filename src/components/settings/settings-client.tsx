'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { debounce } from '@/lib/utils';
import { ProfileForm } from './profile-form';
import { PreferencesForm } from './preferences-form';
import { DangerZone } from './danger-zone';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserData {
  id: string;
  name: string | null;
  email: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  timezone: string;
  weekStart: number;
  theme: string;
  hasPassword: boolean;
  defaultSchedule: { id: string; name: string } | null;
  accounts: { provider: string }[];
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// ─── SaveIndicator ────────────────────────────────────────────────────────────

export function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'idle') return null;
  if (status === 'saving') {
    return (
      <span className="flex items-center gap-1.5 text-sm text-gray-500">
        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        Saving…
      </span>
    );
  }
  if (status === 'saved') {
    return (
      <span className="flex items-center gap-1.5 text-sm text-success">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Saved
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-sm text-danger">
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      Save failed
    </span>
  );
}

// ─── PasswordForm ─────────────────────────────────────────────────────────────

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      if (res.ok) {
        setSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error ?? 'Failed to update password');
      }
    } catch {
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-base font-semibold text-gray-900">Password</h2>
      <p className="mt-1 text-sm text-gray-500">Update your account password.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="current-password"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Current password
          </label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1.5">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
          <p className="mt-1.5 text-sm text-gray-500">Minimum 8 characters.</p>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
              confirmPassword && newPassword !== confirmPassword
                ? 'border-danger focus:ring-danger'
                : 'border-gray-300 focus:ring-primary-500'
            }`}
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="mt-1.5 text-sm text-danger">Passwords do not match</p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            Password updated successfully.
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Updating…' : 'Update password'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface SettingsClientProps {
  user: UserData;
  appUrl: string;
}

export function SettingsClient({ user, appUrl }: SettingsClientProps) {
  const { update: updateSession } = useSession();
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const save = useCallback(
    async (fields: Partial<UserData>) => {
      setSaveStatus('saving');
      try {
        const res = await fetch('/api/user', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fields),
        });
        if (res.ok) {
          const data = await res.json();
          // Sync session JWT with updated profile data
          await updateSession({
            name: data.data?.name,
            username: data.data?.username,
            timezone: data.data?.timezone,
          });
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        } else {
          const data = await res.json();
          setSaveStatus('error');
          setTimeout(() => setSaveStatus('idle'), 3000);
          return data.error as string | undefined;
        }
      } catch {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    },
    [updateSession]
  );

  const debouncedSave = useMemo(() => debounce(save, 500), [save]);

  const profileUrl = `${appUrl}/${user.username}`;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences.
          </p>
        </div>
        <SaveIndicator status={saveStatus} />
      </div>

      {/* Profile section */}
      <ProfileForm
        user={user}
        onSave={debouncedSave}
        onSyncSession={updateSession}
        profileUrl={profileUrl}
      />

      {/* Preferences section */}
      <PreferencesForm user={user} onSave={save} />

      {/* Password section — only for credentials auth */}
      {user.hasPassword && <PasswordForm />}

      {/* Integrations section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900">Integrations</h2>
        <p className="mt-1 text-sm text-gray-500">
          Connect external services to enhance your scheduling.
        </p>
        <div className="mt-4">
          <Link
            href="/settings/calendars"
            className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 group-hover:bg-white transition-colors border border-gray-200">
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Calendar Integrations</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Connect Google Calendar to check availability and sync bookings
                </p>
              </div>
            </div>
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Danger zone */}
      <DangerZone username={user.username} onDeleted={() => router.push('/login')} />
    </div>
  );
}
