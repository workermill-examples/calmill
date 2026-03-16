"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "warning" | "danger";

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  onClose?: () => void;
  duration?: number;
}

const toastVariants = {
  default: "border bg-background text-foreground",
  success: "border-green-200 bg-green-50 text-green-900",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
  danger: "border-red-200 bg-red-50 text-red-900",
};

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", onClose, duration = 5000, children, ...props }, ref) => {
    React.useEffect(() => {
      if (duration && duration > 0 && onClose) {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-lg border p-4 shadow-lg",
          toastVariants[variant],
          className
        )}
        {...props}
      >
        <div className="flex">
          <div className="flex-1">
            {children}
          </div>
          {onClose && (
            <button
              type="button"
              className="ml-4 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-md opacity-50 hover:opacity-100 focus:opacity-100 focus:outline-none"
              onClick={onClose}
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          )}
        </div>
      </div>
    );
  }
);

Toast.displayName = "Toast";

interface ToastTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const ToastTitle = React.forwardRef<HTMLHeadingElement, ToastTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("mb-1 font-semibold text-sm", className)}
      {...props}
    />
  )
);
ToastTitle.displayName = "ToastTitle";

interface ToastDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const ToastDescription = React.forwardRef<HTMLParagraphElement, ToastDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  )
);
ToastDescription.displayName = "ToastDescription";

// Toast Provider Context for managing toasts globally
interface ToastContextValue {
  toasts: Array<{
    id: string;
    title?: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
  }>;
  addToast: (toast: {
    title?: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
  }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastContextValue["toasts"]>([]);

  const addToast = React.useCallback((toast: Omit<ToastContextValue["toasts"][0], "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, ...toast }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const value = React.useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            variant={toast.variant}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
            className="mb-2 last:mb-0"
          >
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export { Toast, ToastTitle, ToastDescription };