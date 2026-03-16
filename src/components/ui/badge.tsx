import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  variant: {
    default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    success: "border-transparent bg-success text-success-foreground shadow hover:bg-success/80",
    warning: "border-transparent bg-warning text-warning-foreground shadow hover:bg-warning/80",
    danger: "border-transparent bg-danger text-danger-foreground shadow hover:bg-danger/80",
    outline: "text-foreground border-border",
  },
  size: {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  },
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants.variant;
  size?: keyof typeof badgeVariants.size;
}

function Badge({ className, variant = "default", size = "md", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants.variant[variant],
        badgeVariants.size[size],
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };