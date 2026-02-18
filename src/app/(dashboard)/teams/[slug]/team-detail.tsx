'use client';

import { useState, useId, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn, generateSlug } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MemberList, type TeamMemberData } from '@/components/teams/member-list';
import {
  TeamEventTypeCard,
  type TeamEventTypeCardData,
} from '@/components/teams/team-event-type-card';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  bio: string | null;
  memberCount: number;
}

interface TeamDetailClientProps {
  team: TeamData;
  members: TeamMemberData[];
  eventTypes: TeamEventTypeCardData[];
  currentUserId: string;
  currentUserRole: 'OWNER' | 'ADMIN' | 'MEMBER';
  appUrl: string;
}

type TabId = 'members' | 'event-types' | 'settings';

// ─── Create Team Event Type Dialog ────────────────────────────────────────────

function CreateEventTypeDialog({
  open,
  onClose,
  teamSlug,
}: {
  open: boolean;
  onClose: () => void;
  teamSlug: string;
}) {
  const router = useRouter();
  const titleId = useId();
  const firstFocusRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [schedulingType, setSchedulingType] = useState<'ROUND_ROBIN' | 'COLLECTIVE'>('ROUND_ROBIN');
  const [slugPreview, setSlugPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; general?: string }>({});

  const DURATION_OPTIONS = [15, 30, 45, 60] as const;

  useEffect(() => {
    setSlugPreview(title ? generateSlug(title) : '');
  }, [title]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => firstFocusRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function resetForm() {
    setTitle('');
    setDuration(30);
    setSchedulingType('ROUND_ROBIN');
    setSlugPreview('');
    setErrors({});
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setErrors({ title: 'Title is required' });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch(`/api/teams/${teamSlug}/event-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed, duration, schedulingType }),
      });

      if (res.ok) {
        handleClose();
        router.refresh();
      } else {
        const data = await res.json();
        if (data.details) {
          const fieldErrors: typeof errors = {};
          for (const detail of data.details) {
            if (detail.field === 'title') fieldErrors.title = detail.message;
          }
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
          } else {
            setErrors({ general: data.error ?? 'Failed to create event type' });
          }
        } else {
          setErrors({ general: data.error ?? 'Failed to create event type' });
        }
      }
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900">
            New Team Event Type
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus-ring transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 px-6 py-5">
            {errors.general && (
              <div
                role="alert"
                className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-danger"
              >
                {errors.general}
              </div>
            )}

            {/* Title */}
            <Input
              ref={firstFocusRef}
              label="Title"
              id="create-team-et-title"
              placeholder="e.g. Team Standup"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              error={errors.title}
              helperText={slugPreview ? `URL: /team/${teamSlug}/${slugPreview}` : undefined}
              required
              maxLength={100}
            />

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Duration <span className="text-danger ml-1">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-ring',
                      duration === d
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            {/* Scheduling type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduling Type <span className="text-danger ml-1">*</span>
              </label>
              <div className="space-y-2">
                <label
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                    schedulingType === 'ROUND_ROBIN'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  )}
                >
                  <input
                    type="radio"
                    name="schedulingType"
                    value="ROUND_ROBIN"
                    checked={schedulingType === 'ROUND_ROBIN'}
                    onChange={() => setSchedulingType('ROUND_ROBIN')}
                    className="mt-0.5 text-primary-600 focus-ring"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Round Robin</div>
                    <div className="text-xs text-gray-500">
                      Distribute bookings evenly across available team members
                    </div>
                  </div>
                </label>
                <label
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                    schedulingType === 'COLLECTIVE'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  )}
                >
                  <input
                    type="radio"
                    name="schedulingType"
                    value="COLLECTIVE"
                    checked={schedulingType === 'COLLECTIVE'}
                    onChange={() => setSchedulingType('COLLECTIVE')}
                    className="mt-0.5 text-primary-600 focus-ring"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Collective</div>
                    <div className="text-xs text-gray-500">
                      Require all team members to be available at the same time
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Create Event Type
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({
  team,
  currentUserRole,
}: {
  team: TeamData;
  currentUserRole: 'OWNER' | 'ADMIN' | 'MEMBER';
}) {
  const router = useRouter();
  const [name, setName] = useState(team.name);
  const [slug, setSlug] = useState(team.slug);
  const [logoUrl, setLogoUrl] = useState(team.logoUrl ?? '');
  const [bio, setBio] = useState(team.bio ?? '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Delete state
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const isOwner = currentUserRole === 'OWNER';
  const canEdit = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/teams/${team.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || undefined,
          slug: slug.trim() || undefined,
          logoUrl: logoUrl.trim() || null,
          bio: bio.trim() || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        // If slug changed, navigate to new URL
        if (data.data.slug !== team.slug) {
          router.push(`/teams/${data.data.slug}`);
        } else {
          router.refresh();
        }
      } else {
        const data = await res.json();
        setSaveError(data.error ?? 'Failed to save settings');
      }
    } catch {
      setSaveError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (deleteConfirmText !== team.name) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/teams/${team.slug}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/teams');
      } else {
        const data = await res.json();
        alert(data.error ?? 'Failed to delete team');
      }
    } catch {
      alert('Failed to delete team');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Team settings form */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-base font-semibold text-gray-900">Team Settings</h3>
          <p className="mt-0.5 text-sm text-gray-600">
            Update your team&apos;s profile information
          </p>
        </div>
        <form onSubmit={handleSave} className="px-6 py-5 space-y-5">
          {saveError && (
            <div
              role="alert"
              className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-danger"
            >
              {saveError}
            </div>
          )}
          {saveSuccess && (
            <div
              role="status"
              className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700"
            >
              Settings saved successfully.
            </div>
          )}

          <Input
            label="Team name"
            id="settings-team-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!canEdit}
            maxLength={100}
          />

          <Input
            label="Slug"
            id="settings-team-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={!canEdit}
            helperText="Used in public team URL: /team/{slug}"
          />

          <Input
            label="Logo URL"
            id="settings-team-logo"
            type="url"
            placeholder="https://example.com/logo.png"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            disabled={!canEdit}
          />

          <div>
            <label
              htmlFor="settings-team-bio"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Bio
            </label>
            <textarea
              id="settings-team-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!canEdit}
              rows={3}
              maxLength={500}
              placeholder="A short description of your team..."
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          {canEdit && (
            <div className="flex justify-end">
              <Button type="submit" variant="primary" loading={saving}>
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </div>

      {/* Danger zone — OWNER only */}
      {isOwner && (
        <div className="rounded-lg border border-red-200 bg-white">
          <div className="border-b border-red-200 px-6 py-4">
            <h3 className="text-base font-semibold text-danger">Danger Zone</h3>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Delete this team</p>
              <p className="mt-1 text-sm text-gray-600">
                Permanently delete the team, all its members, and event types. This action cannot be
                undone.
              </p>
            </div>
            <div>
              <label
                htmlFor="delete-confirm"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Type <strong>{team.name}</strong> to confirm
              </label>
              <input
                id="delete-confirm"
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={team.name}
                className="flex h-10 w-full max-w-xs rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-danger focus:border-transparent transition-colors"
              />
            </div>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleting}
              disabled={deleteConfirmText !== team.name}
            >
              Delete Team
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Event Types Tab ──────────────────────────────────────────────────────────

function EventTypesTab({
  eventTypes,
  teamSlug,
  appUrl,
  canCreate,
}: {
  eventTypes: TeamEventTypeCardData[];
  teamSlug: string;
  appUrl: string;
  canCreate: boolean;
}) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Team Event Types</h3>
          <p className="mt-0.5 text-sm text-gray-600">
            {eventTypes.length} event type{eventTypes.length !== 1 ? 's' : ''}
          </p>
        </div>
        {canCreate && (
          <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
            New Team Event Type
          </Button>
        )}
      </div>

      {eventTypes.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto max-w-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
              <svg
                className="h-6 w-6 text-primary-600"
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
            <h4 className="mt-4 text-lg font-medium text-gray-900">No team event types yet</h4>
            <p className="mt-2 text-sm text-gray-600">
              Create round-robin or collective event types for your team.
            </p>
            {canCreate && (
              <div className="mt-6">
                <Button variant="primary" onClick={() => setCreateOpen(true)}>
                  Create your first team event type
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {eventTypes.map((et) => (
            <TeamEventTypeCard key={et.id} eventType={et} teamSlug={teamSlug} appUrl={appUrl} />
          ))}
        </div>
      )}

      <CreateEventTypeDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        teamSlug={teamSlug}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TeamDetailClient({
  team,
  members,
  eventTypes,
  currentUserId,
  currentUserRole,
  appUrl,
}: TeamDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>('members');

  const canManageEventTypes = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  const tabs: { id: TabId; label: string }[] = [
    { id: 'members', label: 'Members' },
    { id: 'event-types', label: 'Event Types' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start gap-4">
        {/* Team logo */}
        <div className="shrink-0">
          {team.logoUrl ? (
            <img src={team.logoUrl} alt={team.name} className="h-14 w-14 rounded-xl object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-600 text-white text-xl font-bold">
              {team.name[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold text-gray-900 truncate">{team.name}</h2>
          <p className="mt-0.5 text-sm text-gray-500">/{team.slug}</p>
          {team.bio && <p className="mt-1 text-sm text-gray-600 line-clamp-2">{team.bio}</p>}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6" role="tablist" aria-label="Team settings tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'border-b-2 pb-3 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab panels */}
      <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        {activeTab === 'members' && (
          <MemberList
            members={members}
            teamSlug={team.slug}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
          />
        )}
        {activeTab === 'event-types' && (
          <EventTypesTab
            eventTypes={eventTypes}
            teamSlug={team.slug}
            appUrl={appUrl}
            canCreate={canManageEventTypes}
          />
        )}
        {activeTab === 'settings' && <SettingsTab team={team} currentUserRole={currentUserRole} />}
      </div>
    </div>
  );
}
