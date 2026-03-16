import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  variant: {
    primary: "bg-primary text-primary-foreground hover:bg-blue-700 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-gray-200",
    outline:
      "border border-input bg-background hover:bg-secondary hover:text-secondary-foreground",
    ghost: "hover:bg-secondary hover:text-secondary-foreground",
    danger: "bg-danger text-danger-foreground hover:bg-red-700 shadow-sm",
    success: "bg-success text-success-foreground hover:bg-green-700 shadow-sm",
  },
  size: {
    sm: "h-8 rounded-md px-3 text-sm",
    md: "h-9 px-4 py-2 text-sm",
    lg: "h-10 rounded-md px-8 text-base",
    xl: "h-11 rounded-md px-8 text-base",
  },
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          loading && "cursor-not-allowed opacity-75",
          className,
        )}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
