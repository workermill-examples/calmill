'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn, getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { InviteDialog } from './invite-dialog';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TeamMemberData {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  accepted: boolean;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
    timezone: string;
  };
}

interface MemberListProps {
  members: TeamMemberData[];
  teamSlug: string;
  currentUserId: string;
  currentUserRole: 'OWNER' | 'ADMIN' | 'MEMBER';
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

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({
  name,
  email,
  avatarUrl,
}: {
  name: string | null;
  email: string;
  avatarUrl: string | null;
}) {
  const initials = getInitials(name ?? email);
  if (avatarUrl) {
    return (
      <img src={avatarUrl} alt={name ?? email} className="h-9 w-9 rounded-full object-cover" />
    );
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white text-sm font-medium">
      {initials}
    </div>
  );
}

// ─── Confirm Remove Dialog ────────────────────────────────────────────────────

function ConfirmRemoveDialog({
  memberName,
  isSelf,
  onConfirm,
  onCancel,
  loading,
}: {
  memberName: string;
  isSelf: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-remove-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 id="confirm-remove-title" className="text-base font-semibold text-gray-900">
          {isSelf ? 'Leave team?' : `Remove ${memberName}?`}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {isSelf
            ? 'You will lose access to this team and its event types.'
            : `${memberName} will lose access to this team and its event types.`}
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-ring disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus-ring disabled:opacity-50"
          >
            {loading ? 'Removing…' : isSelf ? 'Leave' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Role Change Select ────────────────────────────────────────────────────────

function RoleSelect({
  memberId,
  currentRole,
  teamSlug,
  disabled,
}: {
  memberId: string;
  currentRole: 'OWNER' | 'ADMIN' | 'MEMBER';
  teamSlug: string;
  disabled: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(currentRole);
  const [loading, setLoading] = useState(false);

  async function handleChange(newRole: 'OWNER' | 'ADMIN' | 'MEMBER') {
    if (newRole === value) return;
    setLoading(true);
    const previous = value;
    setValue(newRole);
    try {
      const res = await fetch(`/api/teams/${teamSlug}/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error ?? 'Failed to update role');
        setValue(previous);
      }
    } catch {
      alert('Failed to update role');
      setValue(previous);
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value as 'OWNER' | 'ADMIN' | 'MEMBER')}
      disabled={disabled || loading}
      aria-label="Change member role"
      className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="MEMBER">Member</option>
      <option value="ADMIN">Admin</option>
      <option value="OWNER">Owner</option>
    </select>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MemberList({ members, teamSlug, currentUserId, currentUserRole }: MemberListProps) {
  const router = useRouter();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<TeamMemberData | null>(null);

  const canInvite = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';
  const isOwner = currentUserRole === 'OWNER';

  const accepted = members.filter((m) => m.accepted);
  const pending = members.filter((m) => !m.accepted);

  async function handleRemove(member: TeamMemberData) {
    setRemoving(member.id);
    try {
      const res = await fetch(`/api/teams/${teamSlug}/members/${member.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setRemoveTarget(null);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error ?? 'Failed to remove member');
      }
    } catch {
      alert('Failed to remove member');
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Team Members</h3>
          <p className="mt-0.5 text-sm text-gray-600">
            {accepted.length} member{accepted.length !== 1 ? 's' : ''}
            {pending.length > 0 && `, ${pending.length} pending`}
          </p>
        </div>
        {canInvite && (
          <Button variant="primary" size="sm" onClick={() => setInviteOpen(true)}>
            Invite Member
          </Button>
        )}
      </div>

      {/* Accepted members */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        {accepted.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No members yet.</div>
        ) : (
          <ul role="list" className="divide-y divide-gray-100">
            {accepted.map((member) => {
              const isSelf = member.user.id === currentUserId;
              const canChangeRole = isOwner && !isSelf;
              const canRemove = isOwner || (currentUserRole === 'ADMIN' && !isSelf) || isSelf;

              return (
                <li key={member.id} className="flex items-center gap-4 px-4 py-3">
                  <Avatar
                    name={member.user.name}
                    email={member.user.email}
                    avatarUrl={member.user.avatarUrl}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {member.user.name ?? member.user.email}
                      </span>
                      {isSelf && <span className="text-xs text-gray-400">(you)</span>}
                      <RoleBadge role={member.role} />
                    </div>
                    <p className="text-xs text-gray-500 truncate">{member.user.email}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {canChangeRole ? (
                      <RoleSelect
                        memberId={member.id}
                        currentRole={member.role}
                        teamSlug={teamSlug}
                        disabled={false}
                      />
                    ) : null}

                    {canRemove && (
                      <button
                        type="button"
                        onClick={() => setRemoveTarget(member)}
                        disabled={removing === member.id}
                        aria-label={
                          isSelf ? 'Leave team' : `Remove ${member.user.name ?? member.user.email}`
                        }
                        className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-danger focus-ring transition-colors disabled:opacity-50"
                      >
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
                            d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Pending invitations */}
      {pending.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-700">Pending Invitations</h4>
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <ul role="list" className="divide-y divide-gray-100">
              {pending.map((member) => {
                const canCancel = isOwner || currentUserRole === 'ADMIN';

                return (
                  <li key={member.id} className="flex items-center gap-4 px-4 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
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
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {member.user.email}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-yellow-50 border border-yellow-200 px-2 py-0.5 text-xs font-medium text-yellow-700">
                          Pending
                        </span>
                        <RoleBadge role={member.role} />
                      </div>
                      <p className="text-xs text-gray-500">Invitation sent</p>
                    </div>

                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => setRemoveTarget(member)}
                        disabled={removing === member.id}
                        aria-label={`Cancel invitation for ${member.user.email}`}
                        className="text-xs text-gray-500 hover:text-danger focus-ring rounded px-2 py-1 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Invite dialog */}
      <InviteDialog open={inviteOpen} onClose={() => setInviteOpen(false)} teamSlug={teamSlug} />

      {/* Confirm remove dialog */}
      {removeTarget && (
        <ConfirmRemoveDialog
          memberName={removeTarget.user.name ?? removeTarget.user.email}
          isSelf={removeTarget.user.id === currentUserId}
          onConfirm={() => handleRemove(removeTarget)}
          onCancel={() => setRemoveTarget(null)}
          loading={removing === removeTarget.id}
        />
      )}
    </div>
  );
}
