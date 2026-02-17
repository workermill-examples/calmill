"use client";

import { useState } from "react";
import type { EditorEventType, EventTypeFields } from "./editor";

// ─── Props ───────────────────────────────────────────────────────────────────

interface LimitsTabProps {
  eventType: EditorEventType;
  onSave: (fields: EventTypeFields) => void;
}

// ─── Number Field ────────────────────────────────────────────────────────────

function NumberField({
  id,
  label,
  helperText,
  value,
  onChange,
  onBlur,
  min,
  max,
  placeholder,
  suffix,
  optional,
}: {
  id: string;
  label: string;
  helperText?: string;
  value: number | null | undefined;
  onChange: (val: number | null) => void;
  onBlur: () => void;
  min?: number;
  max?: number;
  placeholder?: string;
  suffix?: string;
  optional?: boolean;
}) {
  const displayValue = value === null || value === undefined ? "" : String(value);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {optional && <span className="ml-1 text-xs text-gray-400">(optional)</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          value={displayValue}
          placeholder={placeholder}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") {
              onChange(null);
            } else {
              const num = parseInt(val, 10);
              if (!isNaN(num)) onChange(num);
            }
          }}
          onBlur={onBlur}
          className="w-28 h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
        {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
      </div>
      {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function LimitsTab({ eventType, onSave }: LimitsTabProps) {
  const [minimumNotice, setMinimumNotice] = useState(eventType.minimumNotice);
  const [minimumNoticeUnit, setMinimumNoticeUnit] = useState<"minutes" | "hours" | "days">(() => {
    const n = eventType.minimumNotice;
    if (n >= 1440) return "days";
    if (n >= 60) return "hours";
    return "minutes";
  });

  const [beforeBuffer, setBeforeBuffer] = useState(eventType.beforeBuffer);
  const [afterBuffer, setAfterBuffer] = useState(eventType.afterBuffer);
  const [slotInterval, setSlotInterval] = useState<number | null>(eventType.slotInterval ?? null);
  const [maxPerDay, setMaxPerDay] = useState<number | null>(eventType.maxBookingsPerDay ?? null);
  const [maxPerWeek, setMaxPerWeek] = useState<number | null>(eventType.maxBookingsPerWeek ?? null);
  const [futureLimit, setFutureLimit] = useState(eventType.futureLimit);

  // Derived display values for minimum notice
  function getDisplayNotice(): number {
    if (minimumNoticeUnit === "days") return Math.round(minimumNotice / 1440);
    if (minimumNoticeUnit === "hours") return Math.round(minimumNotice / 60);
    return minimumNotice;
  }

  function setDisplayNotice(val: number | null) {
    if (val === null) return;
    let minutes = val;
    if (minimumNoticeUnit === "days") minutes = val * 1440;
    else if (minimumNoticeUnit === "hours") minutes = val * 60;
    setMinimumNotice(minutes);
  }

  function handleMinimumNoticeUnitChange(unit: "minutes" | "hours" | "days") {
    // Convert current minutes to new unit display, then save
    const current = getDisplayNotice();
    setMinimumNoticeUnit(unit);
    let newMinutes = current;
    if (unit === "days") newMinutes = current * 1440;
    else if (unit === "hours") newMinutes = current * 60;
    else newMinutes = current;
    setMinimumNotice(newMinutes);
    onSave({ minimumNotice: newMinutes });
  }

  return (
    <div className="space-y-6">
      {/* Notice & Buffers */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Notice & Buffers</h2>

        {/* Minimum notice */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Minimum Notice
          </label>
          <p className="text-xs text-gray-500 mb-2">
            How far in advance must someone book this event?
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={getDisplayNotice()}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 0) setDisplayNotice(val);
              }}
              onBlur={() => onSave({ minimumNotice })}
              className="w-24 h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              aria-label="Minimum notice amount"
            />
            <select
              value={minimumNoticeUnit}
              onChange={(e) => handleMinimumNoticeUnitChange(e.target.value as "minutes" | "hours" | "days")}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              aria-label="Minimum notice unit"
            >
              <option value="minutes">minutes</option>
              <option value="hours">hours</option>
              <option value="days">days</option>
            </select>
          </div>
        </div>

        {/* Buffer before */}
        <NumberField
          id="et-buffer-before"
          label="Buffer Before Event"
          helperText="Block time before this event starts (e.g. for preparation)"
          value={beforeBuffer}
          onChange={(v) => setBeforeBuffer(v ?? 0)}
          onBlur={() => onSave({ beforeBuffer })}
          min={0}
          max={120}
          suffix="minutes"
        />

        {/* Buffer after */}
        <NumberField
          id="et-buffer-after"
          label="Buffer After Event"
          helperText="Block time after this event ends (e.g. for wrap-up)"
          value={afterBuffer}
          onChange={(v) => setAfterBuffer(v ?? 0)}
          onBlur={() => onSave({ afterBuffer })}
          min={0}
          max={120}
          suffix="minutes"
        />

        {/* Slot interval */}
        <NumberField
          id="et-slot-interval"
          label="Slot Interval"
          helperText="How often booking slots are shown. Defaults to event duration if not set."
          value={slotInterval}
          onChange={(v) => setSlotInterval(v)}
          onBlur={() => onSave({ slotInterval })}
          min={5}
          max={120}
          suffix="minutes"
          optional
          placeholder="e.g. 15"
        />
      </section>

      {/* Booking limits */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Booking Limits</h2>

        <NumberField
          id="et-max-per-day"
          label="Max Bookings Per Day"
          helperText="Maximum number of bookings allowed on a single day."
          value={maxPerDay}
          onChange={(v) => setMaxPerDay(v)}
          onBlur={() => onSave({ maxBookingsPerDay: maxPerDay })}
          min={1}
          suffix="per day"
          optional
          placeholder="No limit"
        />

        <NumberField
          id="et-max-per-week"
          label="Max Bookings Per Week"
          helperText="Maximum number of bookings allowed in a single week."
          value={maxPerWeek}
          onChange={(v) => setMaxPerWeek(v)}
          onBlur={() => onSave({ maxBookingsPerWeek: maxPerWeek })}
          min={1}
          suffix="per week"
          optional
          placeholder="No limit"
        />

        <NumberField
          id="et-future-limit"
          label="Future Booking Limit"
          helperText="How far into the future people can book this event."
          value={futureLimit}
          onChange={(v) => setFutureLimit(v ?? 60)}
          onBlur={() => onSave({ futureLimit })}
          min={1}
          max={365}
          suffix="days"
        />
      </section>
    </div>
  );
}
