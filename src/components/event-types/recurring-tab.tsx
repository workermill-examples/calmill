'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { EditorEventType, EventTypeFields } from './editor';

// ─── Types ───────────────────────────────────────────────────────────────────

type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly';

const FREQUENCY_OPTIONS: { value: RecurringFrequency; label: string; description: string }[] = [
  { value: 'weekly', label: 'Weekly', description: 'Repeats every week' },
  { value: 'biweekly', label: 'Biweekly', description: 'Repeats every two weeks' },
  { value: 'monthly', label: 'Monthly', description: 'Repeats every month' },
];

// ─── Props ───────────────────────────────────────────────────────────────────

interface RecurringTabProps {
  eventType: EditorEventType;
  onSave: (fields: EventTypeFields) => void;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function RecurringTab({ eventType, onSave }: RecurringTabProps) {
  const [enabled, setEnabled] = useState(eventType.recurringEnabled);
  const [frequency, setFrequency] = useState<RecurringFrequency>(
    (eventType.recurringFrequency as RecurringFrequency | null) ?? 'weekly'
  );
  const [maxOccurrences, setMaxOccurrences] = useState<number>(
    eventType.recurringMaxOccurrences ?? 4
  );

  function handleToggle() {
    const next = !enabled;
    setEnabled(next);
    onSave({
      recurringEnabled: next,
      ...(next
        ? {
            recurringFrequency: frequency,
            recurringMaxOccurrences: maxOccurrences,
          }
        : {}),
    });
  }

  function handleFrequencyChange(freq: RecurringFrequency) {
    setFrequency(freq);
    if (enabled) {
      onSave({ recurringFrequency: freq });
    }
  }

  function handleMaxOccurrencesBlur() {
    if (enabled && maxOccurrences >= 2 && maxOccurrences <= 52) {
      onSave({ recurringMaxOccurrences: maxOccurrences });
    }
  }

  return (
    <div className="space-y-6">
      {/* Enable toggle */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Enable Recurring Bookings</h2>
            <p className="mt-1 text-sm text-gray-500">
              Allow attendees to book this event as a recurring series.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label="Enable recurring bookings"
            onClick={handleToggle}
            className={cn(
              'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-ring mt-0.5',
              enabled ? 'bg-primary-600' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                enabled ? 'translate-x-4' : 'translate-x-0.5'
              )}
            />
          </button>
        </div>
      </section>

      {/* Recurring options (only shown when enabled) */}
      {enabled && (
        <>
          {/* Frequency */}
          <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Frequency
            </h2>
            <p className="text-sm text-gray-500">How often does this event recur?</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {FREQUENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleFrequencyChange(opt.value)}
                  className={cn(
                    'rounded-lg border-2 px-4 py-3 text-left transition-all focus-ring',
                    frequency === opt.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  )}
                >
                  <div
                    className={cn(
                      'text-sm font-medium',
                      frequency === opt.value ? 'text-primary-700' : 'text-gray-900'
                    )}
                  >
                    {opt.label}
                  </div>
                  <div
                    className={cn(
                      'text-xs mt-0.5',
                      frequency === opt.value ? 'text-primary-600' : 'text-gray-500'
                    )}
                  >
                    {opt.description}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Max occurrences */}
          <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Maximum Occurrences
            </h2>
            <p className="text-sm text-gray-500">How many times can this event repeat? (2–52)</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={2}
                max={52}
                value={maxOccurrences}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) setMaxOccurrences(val);
                }}
                onBlur={handleMaxOccurrencesBlur}
                className="w-24 h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                aria-label="Maximum occurrences"
              />
              <span className="text-sm text-gray-500">occurrences</span>
            </div>

            {/* Preview */}
            <div className="rounded-md bg-gray-50 border border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-600">
                Attendees can book up to <strong>{maxOccurrences}</strong>{' '}
                {frequency === 'weekly'
                  ? 'weekly'
                  : frequency === 'biweekly'
                    ? 'biweekly'
                    : 'monthly'}{' '}
                session{maxOccurrences !== 1 ? 's' : ''}.
              </p>
            </div>
          </section>
        </>
      )}

      {!enabled && (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
          <svg
            className="mx-auto h-8 w-8 text-gray-300 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <p className="text-sm font-medium text-gray-500">Recurring bookings are disabled</p>
          <p className="mt-1 text-xs text-gray-400">
            Toggle the switch above to allow attendees to book recurring sessions.
          </p>
        </div>
      )}
    </div>
  );
}
