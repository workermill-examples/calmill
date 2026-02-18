'use client';

import { useState, useEffect, useRef, useId } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InviteDialogProps {
  open: boolean;
  onClose: () => void;
  teamSlug: string;
}

export function InviteDialog({ open, onClose, teamSlug }: InviteDialogProps) {
  const router = useRouter();
  const titleId = useId();
  const firstFocusRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});

  // Focus first input when dialog opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => firstFocusRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prevent body scroll
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
    setEmail('');
    setRole('MEMBER');
    setErrors({});
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function validate(): boolean {
    const newErrors: typeof errors = {};
    const trimmed = email.trim();
    if (!trimmed) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      newErrors.email = 'Enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch(`/api/teams/${teamSlug}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), role }),
      });

      if (res.ok) {
        handleClose();
        router.refresh();
      } else {
        const data = await res.json();
        if (data.details) {
          const fieldErrors: typeof errors = {};
          for (const detail of data.details) {
            if (detail.field === 'email') fieldErrors.email = detail.message;
          }
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
          } else {
            setErrors({ general: data.error ?? 'Failed to send invitation' });
          }
        } else {
          setErrors({ general: data.error ?? 'Failed to send invitation' });
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900">
            Invite Team Member
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
            {/* General error */}
            {errors.general && (
              <div
                role="alert"
                className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-danger"
              >
                {errors.general}
              </div>
            )}

            {/* Email */}
            <Input
              ref={firstFocusRef}
              label="Email address"
              id="invite-member-email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
              required
            />

            {/* Role */}
            <div>
              <label
                htmlFor="invite-member-role"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Role
              </label>
              <select
                id="invite-member-role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'MEMBER' | 'ADMIN')}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              >
                <option value="MEMBER">Member — Can view team and be assigned bookings</option>
                <option value="ADMIN">Admin — Can manage members and event types</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Send Invitation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
