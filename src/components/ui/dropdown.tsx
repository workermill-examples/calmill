"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownContextValue {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DropdownContext = React.createContext<DropdownContextValue | undefined>(undefined);

const useDropdown = () => {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error("useDropdown must be used within a Dropdown component");
  }
  return context;
};

interface DropdownProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = React.useState(open ?? false);

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  }, [onOpenChange]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleOpenChange]);

  return (
    <DropdownContext.Provider value={{ isOpen, onOpenChange: handleOpenChange }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

interface DropdownTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

const DropdownTrigger: React.FC<DropdownTriggerProps> = ({
  asChild,
  children,
  className,
}) => {
  const { isOpen, onOpenChange } = useDropdown();

  if (asChild) {
    return React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement<any>, {
          "aria-expanded": isOpen,
          "aria-haspopup": "menu",
          onClick: (event: React.MouseEvent) => {
            (children as React.ReactElement<any>).props.onClick?.(event);
            onOpenChange(!isOpen);
          },
        })
      : children;
  }

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      onClick={() => onOpenChange(!isOpen)}
    >
      {children}
    </button>
  );
};

interface DropdownContentProps {
  className?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
}

const DropdownContent: React.FC<DropdownContentProps> = ({
  className,
  align = "center",
  side = "bottom",
  children,
}) => {
  const { isOpen, onOpenChange } = useDropdown();
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Position classes based on align and side props
  const getPositionClasses = () => {
    const classes = [];

    // Side positioning
    if (side === "top") classes.push("bottom-full mb-1");
    if (side === "bottom") classes.push("top-full mt-1");
    if (side === "left") classes.push("right-full mr-1 top-0");
    if (side === "right") classes.push("left-full ml-1 top-0");

    // Alignment
    if (align === "start") {
      if (side === "top" || side === "bottom") classes.push("left-0");
      if (side === "left" || side === "right") classes.push("top-0");
    }
    if (align === "center") {
      if (side === "top" || side === "bottom") classes.push("left-1/2 -translate-x-1/2");
      if (side === "left" || side === "right") classes.push("top-1/2 -translate-y-1/2");
    }
    if (align === "end") {
      if (side === "top" || side === "bottom") classes.push("right-0");
      if (side === "left" || side === "right") classes.push("bottom-0");
    }

    return classes.join(" ");
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        ref={contentRef}
        role="menu"
        className={cn(
          "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          getPositionClasses(),
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>
  );
};

interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  children: React.ReactNode;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  className,
  disabled,
  onClick,
  children,
  ...props
}) => {
  const { onOpenChange } = useDropdown();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      onClick?.(event);
      onOpenChange(false);
    }
  };

  return (
    <div
      role="menuitem"
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
        disabled
          ? "pointer-events-none opacity-50"
          : "hover:bg-accent hover:text-accent-foreground cursor-pointer",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownSeparator: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
);

const DropdownLabel: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>
    {children}
  </div>
);

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
};