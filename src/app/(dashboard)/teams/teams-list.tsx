'use client';

import { useState, useId, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, generateSlug } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamCardData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  bio: string | null;
  memberCount: number;
  eventTypeCount: number;
  userRole: 'OWNER' | 'ADMIN' | 'MEMBER';
  accepted: boolean;
}

interface PendingInvitation {
  id: string;
  teamName: string;
  teamSlug: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

interface TeamsListClientProps {
  initialTeams: TeamCardData[];
  pendingInvitations: PendingInvitation[];
}

// ─── Invitation Banner ─────────────────────────────────────────────────────────

function InvitationBanner({ invitations }: { invitations: PendingInvitation[] }) {
  const router = useRouter();
  const [responding, setResponding] = useState<string | null>(null);

  if (invitations.length === 0) return null;

  async function handleAccept(memberId: string) {
    setResponding(memberId);
    try {
      const res = await fetch(`/api/teams/invitations/${memberId}/accept`, { method: 'POST' });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error ?? 'Failed to accept invitation');
      }
    } catch {
      alert('Failed to accept invitation');
    } finally {
      setResponding(null);
    }
  }

  async function handleReject(memberId: string) {
    setResponding(memberId);
    try {
      const res = await fetch(`/api/teams/invitations/${memberId}/reject`, { method: 'POST' });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error ?? 'Failed to decline invitation');
      }
    } catch {
      alert('Failed to decline invitation');
    } finally {
      setResponding(null);
    }
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <h3 className="text-sm font-semibold text-blue-900 mb-3">
        Pending Team Invitation{invitations.length !== 1 ? 's' : ''}
      </h3>
      <div className="space-y-2">
        {invitations.map((inv) => (
          <div key={inv.id} className="flex items-center justify-between gap-4">
            <div>
              <span className="text-sm font-medium text-blue-900">{inv.teamName}</span>
              <span className="ml-2 text-xs text-blue-700">as {inv.role.toLowerCase()}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                loading={responding === inv.id}
                onClick={() => handleAccept(inv.id)}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={responding === inv.id}
                onClick={() => handleReject(inv.id)}
              >
                Decline
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Role Badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: 'OWNER' | 'ADMIN' | 'MEMBER' }) {
  const config = {
    OWNER: 'bg-amber-50 text-amber-700 border border-amber-200',
    ADMIN: 'bg-blue-50 text-blue-700 border border-blue-200',
    MEMBER: 'bg-gray-100 text-gray-600 border border-gray-200',
  };
  const label = { OWNER: 'Owner', ADMIN: 'Admin', MEMBER: 'Member' };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        config[role]
      )}
    >
      {label[role]}
    </span>
  );
}

// ─── Team Card ────────────────────────────────────────────────────────────────

function TeamCard({ team }: { team: TeamCardData }) {
  return (
    <Link
      href={`/teams/${team.slug}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        {/* Team logo or initial */}
        <div className="shrink-0">
          {team.logoUrl ? (
            <img src={team.logoUrl} alt={team.name} className="h-12 w-12 rounded-lg object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600 text-white text-lg font-bold">
              {team.name[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 truncate">{team.name}</h3>
            <RoleBadge role={team.userRole} />
          </div>
          <p className="mt-0.5 text-xs text-gray-500">/{team.slug}</p>
          {team.bio && <p className="mt-1.5 text-sm text-gray-600 line-clamp-2">{team.bio}</p>}
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            <span>
              {team.memberCount} member{team.memberCount !== 1 ? 's' : ''}
            </span>
            <span>
              {team.eventTypeCount} event type{team.eventTypeCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Create Team Dialog ───────────────────────────────────────────────────────

function CreateTeamDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const titleId = useId();
  const firstFocusRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [slugPreview, setSlugPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; general?: string }>({});

  useEffect(() => {
    setSlugPreview(name ? generateSlug(name) : '');
  }, [name]);

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
    setName('');
    setSlugPreview('');
    setErrors({});
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setErrors({ name: 'Team name is required' });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });

      if (res.ok) {
        const data = await res.json();
        handleClose();
        router.push(`/teams/${data.data.slug}`);
      } else {
        const data = await res.json();
        if (data.details) {
          const fieldErrors: typeof errors = {};
          for (const detail of data.details) {
            if (detail.field === 'name') fieldErrors.name = detail.message;
          }
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
          } else {
            setErrors({ general: data.error ?? 'Failed to create team' });
          }
        } else {
          setErrors({ general: data.error ?? 'Failed to create team' });
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
            Create Team
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
            <Input
              ref={firstFocusRef}
              label="Team name"
              id="create-team-name"
              placeholder="e.g. Marketing Team"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={errors.name}
              helperText={slugPreview ? `URL: /team/${slugPreview}` : undefined}
              required
              maxLength={100}
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Create Team
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
      <div className="mx-auto max-w-md">
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No teams yet</h3>
        <p className="mt-2 text-sm text-gray-600">
          Create a team to schedule events with multiple people using round-robin or collective
          booking.
        </p>
        <div className="mt-6">
          <Button variant="primary" onClick={onCreateClick}>
            Create your first team
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TeamsListClient({ initialTeams, pendingInvitations }: TeamsListClientProps) {
  const [createOpen, setCreateOpen] = useState(false);

  const acceptedTeams = initialTeams.filter((t) => t.accepted);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Teams</h2>
          <p className="mt-1 text-sm text-gray-600">
            Collaborate with others using round-robin or collective scheduling
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          Create Team
        </Button>
      </div>

      {/* Pending invitations banner */}
      <InvitationBanner invitations={pendingInvitations} />

      {/* Team list or empty state */}
      {acceptedTeams.length === 0 ? (
        <EmptyState onCreateClick={() => setCreateOpen(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {acceptedTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}

      {/* Create dialog */}
      <CreateTeamDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
