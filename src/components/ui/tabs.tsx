"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
  children: React.ReactNode;
}

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  orientation: "horizontal" | "vertical";
}

const TabsContext = React.createContext<TabsContextValue | undefined>(
  undefined,
);

const useTabs = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a Tabs component");
  }
  return context;
};

const Tabs: React.FC<TabsProps> = ({
  defaultValue = "",
  value,
  onValueChange,
  orientation = "horizontal",
  className,
  children,
}) => {
  const [internalValue, setInternalValue] = React.useState(
    value ?? defaultValue,
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [value, onValueChange],
  );

  const contextValue = React.useMemo(
    () => ({
      value: internalValue,
      onValueChange: handleValueChange,
      orientation,
    }),
    [internalValue, handleValueChange, orientation],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        className={cn(
          "w-full",
          orientation === "vertical" && "flex gap-4",
          className,
        )}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  const { orientation } = useTabs();

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        orientation === "vertical" && "flex-col space-y-1 space-x-0",
        orientation === "horizontal" && "h-9 space-x-1",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value: triggerValue,
  disabled,
  className,
  children,
}) => {
  const { value, onValueChange } = useTabs();
  const isSelected = value === triggerValue;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-controls={`content-${triggerValue}`}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected
          ? "bg-background text-foreground shadow"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      onClick={() => !disabled && onValueChange(triggerValue)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const TabsContent: React.FC<TabsContentProps> = ({
  value: contentValue,
  className,
  children,
}) => {
  const { value } = useTabs();
  const isSelected = value === contentValue;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      id={`content-${contentValue}`}
      aria-labelledby={`trigger-${contentValue}`}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
