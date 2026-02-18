'use client';

import { useState, useEffect, useRef, useId } from 'react';
import { useRouter } from 'next/navigation';
import { cn, generateSlug } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
}

type LocationType = 'link' | 'inPerson' | 'phone';

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120] as const;

const LOCATION_LABELS: Record<LocationType, string> = {
  link: 'Video call',
  inPerson: 'In-person meeting',
  phone: 'Phone call',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateDialog({ open, onClose }: CreateDialogProps) {
  const router = useRouter();
  const titleId = useId();
  const firstFocusRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [locationType, setLocationType] = useState<LocationType>('link');
  const [slugPreview, setSlugPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; duration?: string; general?: string }>({});

  // Update slug preview as title changes
  useEffect(() => {
    setSlugPreview(title ? generateSlug(title) : '');
  }, [title]);

  // Focus first input when dialog opens
  useEffect(() => {
    if (open) {
      // Slight delay to let the DOM render
      const t = setTimeout(() => firstFocusRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when dialog is open
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
    setLocationType('link');
    setSlugPreview('');
    setErrors({});
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }
    if (!duration || duration < 5 || duration > 720) {
      newErrors.duration = 'Duration must be between 5 and 720 minutes';
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
      const res = await fetch('/api/event-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          duration,
          locations: [{ type: locationType, value: '' }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        handleClose();
        // Navigate to the editor for the new event type
        router.push(`/event-types/${data.data.id}`);
      } else {
        const data = await res.json();
        if (data.details) {
          // Map validation details to field errors
          const fieldErrors: typeof errors = {};
          for (const detail of data.details) {
            if (detail.field === 'title') fieldErrors.title = detail.message;
            else if (detail.field === 'duration') fieldErrors.duration = detail.message;
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div ref={dialogRef} className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900">
            New Event Type
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

            {/* Title */}
            <Input
              ref={firstFocusRef}
              label="Title"
              id="create-et-title"
              placeholder="e.g. 30 Minute Meeting"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              error={errors.title}
              helperText={slugPreview ? `URL: /${slugPreview}` : undefined}
              required
              maxLength={100}
            />

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Duration <span className="text-danger ml-1">*</span>
              </label>
              {/* Quick-select buttons */}
              <div className="flex flex-wrap gap-2 mb-2">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDuration(d);
                      if (errors.duration) setErrors((prev) => ({ ...prev, duration: undefined }));
                    }}
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
              {/* Custom input */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="create-et-duration"
                  min={5}
                  max={720}
                  value={duration}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) {
                      setDuration(val);
                      if (errors.duration) setErrors((prev) => ({ ...prev, duration: undefined }));
                    }
                  }}
                  className={cn(
                    'w-24 h-9 rounded-md border border-gray-300 bg-white px-3 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    errors.duration && 'border-danger focus:ring-danger'
                  )}
                  aria-label="Custom duration in minutes"
                  aria-describedby={errors.duration ? 'create-et-duration-error' : undefined}
                />
                <span className="text-sm text-gray-500">minutes</span>
              </div>
              {errors.duration && (
                <p id="create-et-duration-error" className="mt-1.5 text-sm text-danger">
                  {errors.duration}
                </p>
              )}
            </div>

            {/* Location type */}
            <div>
              <label
                htmlFor="create-et-location"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Location
              </label>
              <select
                id="create-et-location"
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as LocationType)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              >
                {(Object.keys(LOCATION_LABELS) as LocationType[]).map((type) => (
                  <option key={type} value={type}>
                    {LOCATION_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
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
