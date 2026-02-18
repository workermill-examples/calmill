'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type EmbedType = 'inline' | 'popup' | 'element';
type ThemeOption = 'light' | 'dark';

interface EventTypeInfo {
  id: string;
  title: string;
  slug: string;
  duration: number;
}

interface EmbedCodeGeneratorClientProps {
  eventType: EventTypeInfo;
  username: string;
  appUrl: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildEmbedUrl(
  appUrl: string,
  username: string,
  slug: string,
  theme: ThemeOption,
  hideDetails: boolean,
  timezone: string
): string {
  const base = `${appUrl}/embed/${username}/${slug}`;
  const params = new URLSearchParams();
  if (theme !== 'light') params.set('theme', theme);
  if (hideDetails) params.set('hideEventDetails', 'true');
  if (timezone) params.set('timezone', timezone);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function buildScriptTag(appUrl: string): string {
  return `<script src="${appUrl}/embed/calmill-embed.js" async></script>`;
}

function buildInlineCode(
  appUrl: string,
  username: string,
  slug: string,
  theme: ThemeOption,
  hideDetails: boolean
): string {
  const themeAttr = theme !== 'light' ? ` data-calmill-theme="${theme}"` : '';
  const hideAttr = hideDetails ? ` data-calmill-hide-event-details="true"` : '';
  return `<!-- CalMill Inline Embed -->\n<div data-calmill-embed="${username}/${slug}"${themeAttr}${hideAttr}></div>\n${buildScriptTag(appUrl)}`;
}

function buildPopupCode(
  appUrl: string,
  username: string,
  slug: string,
  theme: ThemeOption
): string {
  const themeAttr = theme !== 'light' ? ` data-calmill-theme="${theme}"` : '';
  return `<!-- CalMill Popup Embed -->\n<button data-calmill-popup="${username}/${slug}"${themeAttr}>\n  Book a Meeting\n</button>\n${buildScriptTag(appUrl)}`;
}

function buildElementCode(
  appUrl: string,
  username: string,
  slug: string,
  theme: ThemeOption
): string {
  const themeAttr = theme !== 'light' ? ` data-calmill-theme="${theme}"` : '';
  return `<!-- CalMill Element Click Embed -->\n<a href="#" data-calmill-popup="${username}/${slug}"${themeAttr}>\n  Schedule a call with us\n</a>\n${buildScriptTag(appUrl)}`;
}

// ─── Tab Bar ─────────────────────────────────────────────────────────────────

const EMBED_TABS: { id: EmbedType; label: string; description: string }[] = [
  {
    id: 'inline',
    label: 'Inline',
    description: 'Renders the booking form directly on your page inside an iframe.',
  },
  {
    id: 'popup',
    label: 'Popup (Button)',
    description: 'A button that opens the booking form as a modal overlay.',
  },
  {
    id: 'element',
    label: 'Element Click',
    description: 'Any link or element that triggers the booking overlay on click.',
  },
];

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-ring',
        copied
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200',
        className
      )}
      aria-label={copied ? 'Copied!' : 'Copy code to clipboard'}
    >
      {copied ? (
        <>
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy Code
        </>
      )}
    </button>
  );
}

// ─── Live Preview ─────────────────────────────────────────────────────────────

interface LivePreviewProps {
  embedType: EmbedType;
  previewUrl: string;
}

function LivePreview({ embedType, previewUrl }: LivePreviewProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  if (embedType === 'inline') {
    return (
      <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
        <div className="border-b border-gray-200 px-4 py-2 flex items-center gap-2 bg-white">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-gray-400 ml-2 truncate">{previewUrl}</span>
        </div>
        <iframe
          src={previewUrl}
          title="Embed preview"
          className="w-full"
          style={{ height: '500px', border: 'none' }}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    );
  }

  // Popup / element click preview
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 flex flex-col items-center justify-center gap-4 min-h-48">
      <p className="text-sm text-gray-500">Click the button below to preview the popup.</p>
      <button
        type="button"
        onClick={() => setPreviewOpen(true)}
        className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus-ring transition-colors"
      >
        {embedType === 'element' ? 'Schedule a call with us' : 'Book a Meeting'}
      </button>

      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Embed popup preview"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setPreviewOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-2xl rounded-xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <span className="text-sm font-medium text-gray-700">Booking Preview</span>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-md text-gray-400 hover:text-gray-600 focus-ring"
                aria-label="Close preview"
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
            <iframe
              src={previewUrl}
              title="Popup preview"
              className="w-full"
              style={{ height: '500px', border: 'none' }}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Common Timezones ─────────────────────────────────────────────────────────

const COMMON_TIMEZONES = [
  '',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Vancouver',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Madrid',
  'Europe/Rome',
  'Europe/Amsterdam',
  'Europe/Zurich',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Seoul',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland',
];

const TIMEZONE_LABELS: Record<string, string> = {
  '': "Visitor's local timezone (default)",
  'America/New_York': 'Eastern Time (ET)',
  'America/Chicago': 'Central Time (CT)',
  'America/Denver': 'Mountain Time (MT)',
  'America/Los_Angeles': 'Pacific Time (PT)',
  'America/Toronto': 'Toronto',
  'America/Vancouver': 'Vancouver',
  'America/Sao_Paulo': 'São Paulo',
  'Europe/London': 'London',
  'Europe/Paris': 'Paris',
  'Europe/Berlin': 'Berlin',
  'Europe/Madrid': 'Madrid',
  'Europe/Rome': 'Rome',
  'Europe/Amsterdam': 'Amsterdam',
  'Europe/Zurich': 'Zurich',
  'Asia/Dubai': 'Dubai',
  'Asia/Kolkata': 'India (IST)',
  'Asia/Singapore': 'Singapore',
  'Asia/Tokyo': 'Tokyo',
  'Asia/Shanghai': 'Shanghai',
  'Asia/Seoul': 'Seoul',
  'Australia/Sydney': 'Sydney',
  'Australia/Melbourne': 'Melbourne',
  'Pacific/Auckland': 'Auckland',
};

// ─── Main Client Component ─────────────────────────────────────────────────

export function EmbedCodeGeneratorClient({
  eventType,
  username,
  appUrl,
}: EmbedCodeGeneratorClientProps) {
  const [activeTab, setActiveTab] = useState<EmbedType>('inline');
  const [theme, setTheme] = useState<ThemeOption>('light');
  const [hideDetails, setHideDetails] = useState(false);
  const [timezone, setTimezone] = useState('');

  const previewUrl = buildEmbedUrl(appUrl, username, eventType.slug, theme, hideDetails, timezone);

  const getCode = useCallback((): string => {
    switch (activeTab) {
      case 'inline':
        return buildInlineCode(appUrl, username, eventType.slug, theme, hideDetails);
      case 'popup':
        return buildPopupCode(appUrl, username, eventType.slug, theme);
      case 'element':
        return buildElementCode(appUrl, username, eventType.slug, theme);
    }
  }, [activeTab, appUrl, username, eventType.slug, theme, hideDetails]);

  const code = getCode();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/event-types/${eventType.id}`}
          className="rounded-md text-gray-500 hover:text-gray-700 focus-ring"
          aria-label="Back to event type editor"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Embed Code</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Add <strong className="font-medium text-gray-700">{eventType.title}</strong> (
            {eventType.duration} min) to any website.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Configuration */}
        <div className="space-y-6">
          {/* Embed type tabs */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Embed Type</h3>

            <div role="tablist" aria-label="Embed type" className="space-y-2">
              {EMBED_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full text-left rounded-lg border px-4 py-3 transition-colors focus-ring',
                    activeTab === tab.id
                      ? 'border-primary-300 bg-primary-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  )}
                >
                  <p
                    className={cn(
                      'text-sm font-medium',
                      activeTab === tab.id ? 'text-primary-700' : 'text-gray-900'
                    )}
                  >
                    {tab.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{tab.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
            <h3 className="text-base font-semibold text-gray-900">Options</h3>

            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div className="flex gap-3">
                {(['light', 'dark'] as ThemeOption[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={cn(
                      'flex-1 rounded-md border py-2 text-sm font-medium transition-colors focus-ring capitalize',
                      theme === t
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    )}
                    aria-pressed={theme === t}
                  >
                    {t === 'light' ? '☀️ Light' : '🌙 Dark'}
                  </button>
                ))}
              </div>
            </div>

            {/* Hide event details (inline only) */}
            {activeTab === 'inline' && (
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hideDetails}
                    onChange={(e) => setHideDetails(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="block text-sm font-medium text-gray-700">
                      Hide event details
                    </span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                      Only show the time picker, not event title and description.
                    </span>
                  </div>
                </label>
              </div>
            )}

            {/* Timezone */}
            <div>
              <label
                htmlFor="embed-timezone"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Pre-set timezone
              </label>
              <select
                id="embed-timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              >
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {TIMEZONE_LABELS[tz] ?? tz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generated code */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Generated Code</h3>
              <CopyButton text={code} />
            </div>
            <div className="relative rounded-lg bg-gray-900 overflow-hidden">
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-gray-100 whitespace-pre-wrap break-all">
                <code>{code}</code>
              </pre>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Paste this snippet anywhere in your HTML. The script tag can be included once per
              page.
            </p>
          </div>
        </div>

        {/* Right: Live preview */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Live Preview</h3>
            <p className="text-xs text-gray-500 mb-4">
              This preview shows how the embed will look when rendered on an external site.
              {activeTab !== 'inline' && ' Click the button to open the popup.'}
            </p>
            <LivePreview embedType={activeTab} previewUrl={previewUrl} />
          </div>

          {/* Embed URL reference */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-700 mb-1">Embed URL</p>
            <p className="font-mono text-xs text-gray-600 break-all">{previewUrl}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
