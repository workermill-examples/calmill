'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { UserData } from './settings-client';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileFormProps {
  user: UserData;
  onSave: (fields: Partial<UserData>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSyncSession: (data: any) => Promise<any>;
  profileUrl: string;
}

// ─── Username availability state ──────────────────────────────────────────────

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

// ─── Component ────────────────────────────────────────────────────────────────

export function ProfileForm({ user, onSave, onSyncSession, profileUrl }: ProfileFormProps) {
  const [name, setName] = useState(user.name ?? '');
  const [username, setUsername] = useState(user.username);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? '');
  // Only update preview on blur (not on every keystroke) to avoid request-per-keystroke
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(user.avatarUrl ?? '');
  const [bio, setBio] = useState(user.bio ?? '');
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const usernameAbortRef = useRef<AbortController | null>(null);

  function handleNameBlur() {
    const trimmed = name.trim();
    // name must be non-empty (API requires min 1 char)
    if (!trimmed || trimmed === (user.name ?? '')) return;
    onSave({ name: trimmed });
  }

  function handleBioBlur() {
    const trimmed = bio.trim();
    if (trimmed === (user.bio ?? '')) return;
    onSave({ bio: trimmed || null });
  }

  function handleAvatarUrlBlur() {
    const trimmed = avatarUrl.trim();
    setAvatarPreviewUrl(trimmed);
    if (trimmed === (user.avatarUrl ?? '')) return;
    onSave({ avatarUrl: trimmed || null });
  }

  async function checkUsernameAvailability(value: string) {
    const usernameRegex = /^[a-z0-9_-]+$/;
    if (!value || value.length < 3 || !usernameRegex.test(value)) {
      setUsernameStatus(value.length > 0 ? 'invalid' : 'idle');
      return;
    }
    if (value === user.username) {
      setUsernameStatus('idle');
      return;
    }

    // Cancel any in-flight request before starting a new one
    if (usernameAbortRef.current) {
      usernameAbortRef.current.abort();
    }
    const abortController = new AbortController();
    usernameAbortRef.current = abortController;

    setUsernameStatus('checking');
    try {
      // PATCH with just the username — the API returns 409 if taken, 200 if saved
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: value }),
        signal: abortController.signal,
      });

      if (res.status === 409) {
        setUsernameStatus('taken');
      } else if (res.ok) {
        setUsernameStatus('available');
        // Sync session JWT so navigation username updates immediately
        await onSyncSession({ username: value });
      } else {
        setUsernameStatus('invalid');
      }
    } catch (err: unknown) {
      // Ignore abort errors — a newer request took over
      if (err instanceof Error && err.name !== 'AbortError') {
        setUsernameStatus('idle');
      }
    }
  }

  function handleUsernameChange(value: string) {
    const lower = value.toLowerCase();
    setUsername(lower);
    setUsernameStatus('idle');
  }

  function handleUsernameBlur() {
    if (username === user.username) return;
    checkUsernameAvailability(username);
  }

  const usernameError =
    usernameStatus === 'taken'
      ? 'This username is already taken'
      : usernameStatus === 'invalid'
        ? 'Username must be at least 3 characters and contain only lowercase letters, numbers, hyphens, or underscores'
        : undefined;

  const bioCharCount = bio.length;
  const bioMax = 300;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-base font-semibold text-gray-900">Profile</h2>
      <p className="mt-1 text-sm text-gray-500">
        This information is displayed on your public profile page.
      </p>

      <div className="mt-6 space-y-5">
        {/* Name */}
        <Input
          label="Full name"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleNameBlur}
          placeholder="Your display name"
        />

        {/* Username */}
        <div className="w-full">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
            Username
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-sm text-gray-500 select-none pointer-events-none">
              /
            </span>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              onBlur={handleUsernameBlur}
              className={cn(
                'flex h-10 w-full rounded-md border bg-white pl-6 pr-10 py-2 text-sm',
                'placeholder:text-gray-400',
                'focus:outline-none focus:ring-2 focus:border-transparent transition-colors',
                usernameError
                  ? 'border-danger focus:ring-danger'
                  : usernameStatus === 'available'
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-primary-500'
              )}
              placeholder="username"
            />
            {/* Status indicator inside input */}
            <div className="absolute right-3 flex items-center">
              {usernameStatus === 'checking' && (
                <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
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
              )}
              {usernameStatus === 'available' && (
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {usernameStatus === 'taken' && (
                <svg
                  className="h-4 w-4 text-danger"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>
          </div>
          {usernameError ? (
            <p className="mt-1.5 text-sm text-danger">{usernameError}</p>
          ) : usernameStatus === 'available' ? (
            <p className="mt-1.5 text-sm text-green-600">Username is available</p>
          ) : (
            <p className="mt-1.5 text-sm text-gray-500">
              This will be your public profile URL:{' '}
              <span className="font-mono">
                {profileUrl.replace(user.username, username || user.username)}
              </span>
            </p>
          )}
        </div>

        {/* Email (read-only) */}
        <div className="w-full">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
          />
          <p className="mt-1.5 text-sm text-gray-500">
            {user.accounts.some((a) => a.provider !== 'credentials')
              ? 'Email is managed by your OAuth provider.'
              : 'Contact support to change your email address.'}
          </p>
        </div>

        {/* Avatar URL */}
        <Input
          label="Avatar URL"
          id="avatar-url"
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          onBlur={handleAvatarUrlBlur}
          placeholder="https://example.com/avatar.jpg"
          helperText="Link to a publicly accessible image."
        />

        {/* Avatar preview — only shows committed URL (updated on blur) */}
        {avatarPreviewUrl && (
          <div className="flex items-center gap-3">
            <img
              src={avatarPreviewUrl}
              alt="Avatar preview"
              className="h-12 w-12 rounded-full object-cover border border-gray-200"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-sm text-gray-500">Avatar preview</span>
          </div>
        )}

        {/* Bio */}
        <div className="w-full">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1.5">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            onBlur={handleBioBlur}
            maxLength={bioMax}
            rows={3}
            placeholder="Tell people a little about yourself…"
            className={cn(
              'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
              'placeholder:text-gray-400 resize-none',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors'
            )}
          />
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-sm text-gray-500">Shown on your public profile page.</p>
            <span
              className={cn(
                'text-xs',
                bioCharCount > bioMax * 0.9 ? 'text-warning' : 'text-gray-400'
              )}
            >
              {bioCharCount}/{bioMax}
            </span>
          </div>
        </div>

        {/* Public profile link */}
        <div className="flex items-center gap-3 pt-1">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 hover:underline"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            View public profile
          </a>
        </div>
      </div>
    </div>
  );
}
