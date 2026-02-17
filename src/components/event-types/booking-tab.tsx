"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EditorEventType, EventTypeFields } from "./editor";
import type { CustomQuestion } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────────

const QUESTION_TYPES = [
  { value: "text", label: "Short Text" },
  { value: "textarea", label: "Long Text" },
  { value: "select", label: "Dropdown Select" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkbox" },
  { value: "phone", label: "Phone Number" },
] as const;

type QuestionType = CustomQuestion["type"];

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface BookingTabProps {
  eventType: EditorEventType;
  onSave: (fields: EventTypeFields) => void;
}

// ─── Single Question Row ─────────────────────────────────────────────────────

interface QuestionRowProps {
  question: CustomQuestion;
  index: number;
  total: number;
  onChange: (q: CustomQuestion) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function QuestionRow({ question, index, total, onChange, onDelete, onMoveUp, onMoveDown }: QuestionRowProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const hasOptions = question.type === "select" || question.type === "radio";

  function updateField<K extends keyof CustomQuestion>(field: K, value: CustomQuestion[K]) {
    onChange({ ...question, [field]: value });
  }

  function addOption() {
    const opts = [...(question.options ?? []), ""];
    onChange({ ...question, options: opts });
  }

  function updateOption(optIndex: number, value: string) {
    const opts = (question.options ?? []).map((o, i) => (i === optIndex ? value : o));
    onChange({ ...question, options: opts });
  }

  function removeOption(optIndex: number) {
    const opts = (question.options ?? []).filter((_, i) => i !== optIndex);
    onChange({ ...question, options: opts });
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
      {/* Row header: order buttons + delete */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label="Move question up"
            className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus-ring disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            aria-label="Move question down"
            className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus-ring disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <span className="text-xs text-gray-400 ml-1">Question {index + 1}</span>
        </div>
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          aria-label={`Delete question ${index + 1}`}
          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-danger focus-ring transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="rounded-md bg-red-50 border border-red-100 p-3 flex items-center justify-between gap-3">
          <p className="text-sm text-danger">Delete this question?</p>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="text-sm text-gray-600 hover:text-gray-800 focus-ring rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="text-sm font-medium text-danger hover:text-red-700 focus-ring rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Question Label <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          value={question.label}
          onChange={(e) => updateField("label", e.target.value)}
          placeholder="e.g. What's your company name?"
          className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
      </div>

      {/* Type + Required row */}
      <div className="flex items-end gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
          <select
            value={question.type}
            onChange={(e) => {
              const newType = e.target.value as QuestionType;
              const updates: Partial<CustomQuestion> = { type: newType };
              // Clear options when switching away from select/radio
              if (newType !== "select" && newType !== "radio") {
                updates.options = undefined;
              }
              onChange({ ...question, ...updates });
            }}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          >
            {QUESTION_TYPES.map((qt) => (
              <option key={qt.value} value={qt.value}>
                {qt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 pb-0.5">
          <input
            type="checkbox"
            id={`q-required-${question.id}`}
            checked={question.required}
            onChange={(e) => updateField("required", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor={`q-required-${question.id}`} className="text-sm text-gray-700">
            Required
          </label>
        </div>
      </div>

      {/* Options (for select/radio) */}
      {hasOptions && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Options</label>
          {(question.options ?? []).map((option, optIdx) => (
            <div key={optIdx} className="flex items-center gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(optIdx, e.target.value)}
                placeholder={`Option ${optIdx + 1}`}
                className="flex-1 h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
              <button
                type="button"
                onClick={() => removeOption(optIdx)}
                aria-label={`Remove option ${optIdx + 1}`}
                className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus-ring transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="text-sm text-primary-600 hover:text-primary-700 focus-ring rounded"
          >
            + Add option
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function BookingTab({ eventType, onSave }: BookingTabProps) {
  const [requiresConfirmation, setRequiresConfirmation] = useState(
    eventType.requiresConfirmation
  );
  const [questions, setQuestions] = useState<CustomQuestion[]>(
    eventType.customQuestions ?? []
  );
  const [successRedirectUrl, setSuccessRedirectUrl] = useState(
    eventType.successRedirectUrl ?? ""
  );

  function handleConfirmationToggle() {
    const next = !requiresConfirmation;
    setRequiresConfirmation(next);
    onSave({ requiresConfirmation: next });
  }

  function saveQuestions(updated: CustomQuestion[]) {
    setQuestions(updated);
    onSave({ customQuestions: updated });
  }

  function addQuestion() {
    const newQ: CustomQuestion = {
      id: makeId(),
      label: "",
      type: "text",
      required: false,
    };
    saveQuestions([...questions, newQ]);
  }

  function updateQuestion(index: number, q: CustomQuestion) {
    const updated = questions.map((existing, i) => (i === index ? q : existing));
    saveQuestions(updated);
  }

  function deleteQuestion(index: number) {
    saveQuestions(questions.filter((_, i) => i !== index));
  }

  function moveQuestion(index: number, direction: "up" | "down") {
    const next = [...questions];
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= next.length) return;
    [next[index], next[swapWith]] = [next[swapWith]!, next[index]!];
    saveQuestions(next);
  }

  function handleSuccessRedirectBlur() {
    onSave({ successRedirectUrl: successRedirectUrl || null });
  }

  return (
    <div className="space-y-6">
      {/* Confirmation toggle */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Require Confirmation</h2>
            <p className="mt-1 text-sm text-gray-500">
              When enabled, bookings need your manual approval before being confirmed.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={requiresConfirmation}
            aria-label="Require confirmation"
            onClick={handleConfirmationToggle}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-ring mt-0.5",
              requiresConfirmation ? "bg-primary-600" : "bg-gray-200"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                requiresConfirmation ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </button>
        </div>
      </section>

      {/* Custom questions */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Custom Questions</h2>
            <p className="mt-1 text-sm text-gray-500">
              Collect additional information from attendees during booking.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
            + Add Question
          </Button>
        </div>

        {questions.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-400">No custom questions yet.</p>
            <button
              type="button"
              onClick={addQuestion}
              className="mt-2 text-sm text-primary-600 hover:text-primary-700 focus-ring rounded"
            >
              Add your first question
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, index) => (
              <QuestionRow
                key={q.id}
                question={q}
                index={index}
                total={questions.length}
                onChange={(updated) => updateQuestion(index, updated)}
                onDelete={() => deleteQuestion(index)}
                onMoveUp={() => moveQuestion(index, "up")}
                onMoveDown={() => moveQuestion(index, "down")}
              />
            ))}
          </div>
        )}
      </section>

      {/* Success redirect */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Success Redirect</h2>
          <p className="mt-1 text-sm text-gray-500">
            Redirect attendees to a custom URL after they book. Leave blank to show the default confirmation page.
          </p>
        </div>
        <Input
          id="et-success-redirect"
          type="url"
          label="Redirect URL"
          placeholder="https://example.com/thank-you"
          value={successRedirectUrl}
          onChange={(e) => setSuccessRedirectUrl(e.target.value)}
          onBlur={handleSuccessRedirectBlur}
          helperText="Must be a valid URL starting with https://"
        />
      </section>
    </div>
  );
}
