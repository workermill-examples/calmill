"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const toggleVariants = {
  variant: {
    default:
      "bg-transparent hover:bg-muted hover:text-muted-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
    outline:
      "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  },
  size: {
    sm: "h-8 px-2 text-xs",
    md: "h-9 px-2.5 text-sm",
    lg: "h-10 px-3",
  },
};

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof toggleVariants.variant;
  size?: keyof typeof toggleVariants.size;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      pressed,
      onPressedChange,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [isPressed, setIsPressed] = React.useState(pressed ?? false);

    React.useEffect(() => {
      if (pressed !== undefined) {
        setIsPressed(pressed);
      }
    }, [pressed]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      const newPressed = !isPressed;

      if (pressed === undefined) {
        setIsPressed(newPressed);
      }

      onPressedChange?.(newPressed);
      onClick?.(event);
    };

    return (
      <button
        type="button"
        ref={ref}
        aria-pressed={isPressed}
        data-state={isPressed ? "on" : "off"}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          toggleVariants.variant[variant],
          toggleVariants.size[size],
          className,
        )}
        onClick={handleClick}
        {...props}
      />
    );
  },
);

Toggle.displayName = "Toggle";

// Switch component - a styled toggle for boolean values
interface SwitchProps extends Omit<ToggleProps, "children"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
  name?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { className, checked, onCheckedChange, disabled, id, name, ...props },
    ref,
  ) => {
    const [isChecked, setIsChecked] = React.useState(checked ?? false);

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    const handleClick = () => {
      const newChecked = !isChecked;

      if (checked === undefined) {
        setIsChecked(newChecked);
      }

      onCheckedChange?.(newChecked);
    };

    return (
      <button
        type="button"
        role="switch"
        ref={ref}
        id={id}
        aria-checked={isChecked}
        data-state={isChecked ? "checked" : "unchecked"}
        disabled={disabled}
        className={cn(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          isChecked ? "bg-primary" : "bg-input",
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        <div
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
            isChecked ? "translate-x-4" : "translate-x-0",
          )}
        />

        {/* Hidden input for form submissions */}
        <input
          type="checkbox"
          name={name}
          checked={isChecked}
          onChange={() => {}} // Controlled by the button
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      </button>
    );
  },
);

Switch.displayName = "Switch";

export { Toggle, Switch, toggleVariants };
