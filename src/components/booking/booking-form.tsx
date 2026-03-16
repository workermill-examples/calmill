"use client";

import * as React from "react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar, Clock, MapPin } from "lucide-react";

// Custom question types
export type CustomQuestion = {
  id: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "phone";
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
};

export interface BookingFormData {
  name: string;
  email: string;
  notes?: string;
  timezone: string;
  customResponses?: Record<string, string | string[]>;
}

export interface BookingFormProps {
  /** Custom questions for this event type */
  customQuestions?: CustomQuestion[];
  /** Whether the form is submitting */
  submitting?: boolean;
  /** Submit handler */
  onSubmit: (data: BookingFormData) => void | Promise<void>;
  /** Event details for context */
  eventDetails?: {
    title: string;
    duration: number;
    date: string;
    time: string;
    timezone: string;
  };
  /** Initial timezone */
  timezone: string;
  /** Additional CSS classes */
  className?: string;
}

// Form validation
function validateFormData(data: BookingFormData, customQuestions: CustomQuestion[]): string[] {
  const errors: string[] = [];

  if (!data.name?.trim()) errors.push("Name is required");
  if (!data.email?.trim()) errors.push("Email is required");
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Valid email is required");
  }
  if (!data.timezone?.trim()) errors.push("Timezone is required");

  // Validate custom questions
  customQuestions.forEach(question => {
    if (question.required) {
      const response = data.customResponses?.[question.id];
      if (!response || (Array.isArray(response) && response.length === 0) ||
          (typeof response === 'string' && !response.trim())) {
        errors.push(`${question.label} is required`);
      }
    }

    // Validate phone numbers
    if (question.type === 'phone' && data.customResponses?.[question.id]) {
      const phone = data.customResponses[question.id] as string;
      if (phone && !/^[\+]?[1-9]?[0-9]{7,15}$/.test(phone.replace(/\s/g, ''))) {
        errors.push(`${question.label} must be a valid phone number`);
      }
    }
  });

  return errors;
}

export function BookingForm({
  customQuestions = [],
  submitting = false,
  onSubmit,
  eventDetails,
  timezone,
  className,
}: BookingFormProps) {
  // Form state
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    notes: "",
    timezone,
    customResponses: {},
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Handle form submission
  const handleFormSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateFormData(formData, customQuestions);
    setValidationErrors(errors);

    if (errors.length > 0) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  }, [onSubmit, formData, customQuestions]);

  // Handle form field changes
  const handleFieldChange = React.useCallback((field: keyof BookingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [validationErrors.length]);

  // Handle custom question responses
  const handleCustomResponse = React.useCallback((questionId: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      customResponses: {
        ...prev.customResponses,
        [questionId]: value
      }
    }));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [validationErrors.length]);

  // Loading state
  if (submitting && !formData.name) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Event details card */}
      {eventDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{eventDetails.title}</CardTitle>
            <CardDescription>
              Please provide your details to complete the booking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{eventDetails.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{eventDetails.time} ({eventDetails.duration}m)</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{eventDetails.timezone}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Form errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Basic information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="Your full name"
              className="transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              type="email"
              placeholder="your.email@example.com"
              className="transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional notes</label>
            <textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              placeholder="Any additional notes or requests (optional)"
              rows={3}
              className="resize-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Custom questions */}
        {customQuestions.length > 0 && (
          <div className="space-y-4">
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-foreground mb-4">
                Additional Information
              </h3>
              <div className="space-y-4">
                {customQuestions.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {question.label}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {question.type === "text" && (
                      <>
                        {(() => {
                          const response = (formData.customResponses?.[question.id] as string) || "";
                          return (
                            <Input
                              value={response}
                              onChange={(e) => handleCustomResponse(question.id, e.target.value)}
                              placeholder={`Enter ${question.label.toLowerCase()}`}
                              className="transition-colors"
                              required={question.required}
                            />
                          );
                        })()}
                      </>
                    )}

                    {question.type === "textarea" && (
                      <>
                        {(() => {
                          const response = (formData.customResponses?.[question.id] as string) || "";
                          return (
                            <textarea
                              value={response}
                              onChange={(e) => handleCustomResponse(question.id, e.target.value)}
                              placeholder={`Enter ${question.label.toLowerCase()}`}
                              rows={3}
                              className="resize-none transition-colors w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required={question.required}
                            />
                          );
                        })()}
                      </>
                    )}

                    {question.type === "select" && question.options && (
                      <>
                        {(() => {
                          const response = (formData.customResponses?.[question.id] as string) || "";
                          return (
                            <select
                              value={response}
                              onChange={(e) => handleCustomResponse(question.id, e.target.value)}
                              className="transition-colors w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required={question.required}
                            >
                              <option value="">Select an option</option>
                              {question.options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          );
                        })()}
                      </>
                    )}

                    {question.type === "radio" && question.options && (
                      <>
                        {(() => {
                          const selectedValue = (formData.customResponses?.[question.id] as string) || "";
                          return (
                            <div className="space-y-2">
                              {question.options.map((option) => (
                                <label key={option} className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name={question.id}
                                    value={option}
                                    checked={selectedValue === option}
                                    onChange={(e) => handleCustomResponse(question.id, e.target.value)}
                                    required={question.required}
                                    className="text-blue-600"
                                  />
                                  <span className="text-sm">{option}</span>
                                </label>
                              ))}
                            </div>
                          );
                        })()}
                      </>
                    )}

                    {question.type === "checkbox" && question.options && (
                      <>
                        {(() => {
                          const selectedValues = (formData.customResponses?.[question.id] as string[]) || [];
                          return (
                            <div className="space-y-2">
                              {question.options.map((option) => (
                                <label key={option} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    value={option}
                                    checked={selectedValues.includes(option)}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      const newSelection = isChecked
                                        ? [...selectedValues, option]
                                        : selectedValues.filter(v => v !== option);
                                      handleCustomResponse(question.id, newSelection);
                                    }}
                                    className="text-blue-600"
                                  />
                                  <span className="text-sm">{option}</span>
                                </label>
                              ))}
                            </div>
                          );
                        })()}
                      </>
                    )}

                    {question.type === "phone" && (
                      <>
                        {(() => {
                          const response = (formData.customResponses?.[question.id] as string) || "";
                          return (
                            <Input
                              type="tel"
                              value={response}
                              onChange={(e) => handleCustomResponse(question.id, e.target.value)}
                              placeholder="+1 (555) 123-4567"
                              className="transition-colors"
                              required={question.required}
                            />
                          );
                        })()}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="pt-4">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={submitting}
            disabled={submitting}
          >
            {submitting ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;