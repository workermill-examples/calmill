'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { UserData } from './settings-client';

// ─── Constants ────────────────────────────────────────────────────────────────

const COMMON_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'America/Honolulu',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Africa/Cairo',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland',
  'UTC',
];

const WEEK_DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface PreferencesFormProps {
  user: UserData;
  onSave: (fields: Partial<UserData>) => void;
}

type ThemeOption = 'light' | 'dark';

// ─── Component ────────────────────────────────────────────────────────────────

export function PreferencesForm({ user, onSave }: PreferencesFormProps) {
  const [timezone, setTimezone] = useState(user.timezone);
  const [weekStart, setWeekStart] = useState(user.weekStart);
  const [theme, setTheme] = useState<ThemeOption>(user.theme === 'dark' ? 'dark' : 'light');

  function handleTimezoneChange(value: string) {
    setTimezone(value);
    onSave({ timezone: value });
  }

  function handleWeekStartChange(value: number) {
    setWeekStart(value);
    onSave({ weekStart: value });
  }

  function handleThemeChange(value: ThemeOption) {
    setTheme(value);
    onSave({ theme: value });
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-base font-semibold text-gray-900">Preferences</h2>
      <p className="mt-1 text-sm text-gray-500">Customize your scheduling experience.</p>

      <div className="mt-6 space-y-6">
        {/* Timezone */}
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1.5">
            Timezone
          </label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => handleTimezoneChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          >
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-sm text-gray-500">
            Used to display times in your dashboard and booking confirmations.
          </p>
        </div>

        {/* Week start */}
        <div>
          <label htmlFor="week-start" className="block text-sm font-medium text-gray-700 mb-1.5">
            Week starts on
          </label>
          <select
            id="week-start"
            value={weekStart}
            onChange={(e) => handleWeekStartChange(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          >
            {WEEK_DAYS.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-sm text-gray-500">
            Affects how calendars and availability grids are displayed.
          </p>
        </div>

        {/* Theme */}
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-3">Theme</span>
          <div className="flex gap-3">
            {(['light', 'dark'] as ThemeOption[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleThemeChange(option)}
                className={cn(
                  'flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors',
                  theme === option
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                )}
              >
                {option === 'light' ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Note: theme switching is saved to your profile but may require a page refresh to take
            effect.
          </p>
        </div>
      </div>
    </div>
  );
}
