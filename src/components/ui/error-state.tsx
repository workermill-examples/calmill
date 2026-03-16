import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const DefaultErrorIcon = () => (
  <svg
    className="h-12 w-12 text-red-400"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
);

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "We're sorry, but something unexpected happened. Please try again.",
  onRetry,
  retryText = "Try again",
  className,
  icon,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4 text-center p-8",
        className,
      )}
    >
      {icon || <DefaultErrorIcon />}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 max-w-md">{description}</p>
      </div>

      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          {retryText}
        </Button>
      )}

      {children}
    </div>
  );
};

// Specialized error states
interface NetworkErrorProps {
  onRetry?: () => void;
  className?: string;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({
  onRetry,
  className,
}) => (
  <ErrorState
    title="Connection failed"
    description="Unable to connect to the server. Please check your internet connection and try again."
    onRetry={onRetry}
    retryText="Retry connection"
    className={className}
    icon={
      <svg
        className="h-12 w-12 text-red-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
        />
      </svg>
    }
  />
);

interface NotFoundErrorProps {
  title?: string;
  description?: string;
  onGoBack?: () => void;
  className?: string;
}

export const NotFoundError: React.FC<NotFoundErrorProps> = ({
  title = "Page not found",
  description = "The page you're looking for doesn't exist or has been moved.",
  onGoBack,
  className,
}) => (
  <ErrorState
    title={title}
    description={description}
    onRetry={onGoBack}
    retryText="Go back"
    className={className}
    icon={
      <svg
        className="h-12 w-12 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.462-.806-6.156-2.151C5.084 13.439 4.74 14.115 4.74 15c0 .396.127.764.338 1.061C5.323 16.547 5.674 17 6.25 17h11.5c.576 0 .927-.453 1.172-.939.211-.297.338-.665.338-1.061 0-.885-.344-1.561-1.104-2.151C16.462 14.194 14.34 15 12 15z"
        />
      </svg>
    }
  />
);

interface UnauthorizedErrorProps {
  onLogin?: () => void;
  className?: string;
}

export const UnauthorizedError: React.FC<UnauthorizedErrorProps> = ({
  onLogin,
  className,
}) => (
  <ErrorState
    title="Access denied"
    description="You don't have permission to view this page. Please sign in to continue."
    onRetry={onLogin}
    retryText="Sign in"
    className={className}
    icon={
      <svg
        className="h-12 w-12 text-yellow-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    }
  />
);

interface ServerErrorProps {
  onRetry?: () => void;
  className?: string;
}

export const ServerError: React.FC<ServerErrorProps> = ({
  onRetry,
  className,
}) => (
  <ErrorState
    title="Server error"
    description="Our servers are experiencing issues. Please wait a moment and try again."
    onRetry={onRetry}
    retryText="Retry request"
    className={className}
    icon={
      <svg
        className="h-12 w-12 text-red-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
        />
      </svg>
    }
  />
);

// Error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  fallback?: React.ComponentType<{ error?: Error; onRetry?: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;

      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            onRetry={this.handleRetry}
          />
        );
      }

      return (
        <ErrorState
          title="Something went wrong"
          description="An unexpected error occurred. The error has been logged and we're looking into it."
          onRetry={this.handleRetry}
          retryText="Try again"
        />
      );
    }

    return this.props.children;
  }
}
