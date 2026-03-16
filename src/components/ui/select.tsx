"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
  className?: string;
  name?: string;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      className,
      options,
      placeholder,
      value,
      onValueChange,
      disabled,
      name,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value || "");

    const selectedOption = options.find(
      (option) => option.value === selectedValue,
    );

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      onValueChange?.(optionValue);
      setIsOpen(false);
    };

    return (
      <div className="relative">
        <button
          type="button"
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          ref={ref}
          {...props}
        >
          <span
            className={
              selectedOption ? "text-foreground" : "text-muted-foreground"
            }
          >
            {selectedOption?.label || placeholder || "Select an option"}
          </span>
          <svg
            className={cn(
              "h-4 w-4 opacity-50 transition-transform",
              isOpen && "rotate-180",
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
              <div className="max-h-60 overflow-auto p-1">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    onClick={() => handleSelect(option.value)}
                  >
                    <span>{option.label}</span>
                    {selectedValue === option.value && (
                      <span className="absolute right-2 h-3.5 w-3.5">
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Hidden select for form submissions */}
        <select
          name={name}
          value={selectedValue}
          onChange={() => {}} // Controlled by the custom dropdown
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select };
export type { Option };
