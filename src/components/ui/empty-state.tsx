import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    text: string;
    onClick: () => void;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const DefaultEmptyIcon = () => (
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
      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
    />
  </svg>
);

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  secondaryAction,
  className,
  icon,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-6 text-center p-8",
        className,
      )}
    >
      {icon || <DefaultEmptyIcon />}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 max-w-md">{description}</p>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button onClick={action.onClick} variant="primary">
              {action.text}
            </Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction.onClick} variant="outline">
              {secondaryAction.text}
            </Button>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

// Specialized empty states
interface NoEventTypesProps {
  onCreateEventType: () => void;
  className?: string;
}

export const NoEventTypes: React.FC<NoEventTypesProps> = ({
  onCreateEventType,
  className,
}) => (
  <EmptyState
    title="No event types yet"
    description="Create your first event type to start accepting bookings. Event types define the duration, availability, and booking details."
    action={{
      text: "Create Event Type",
      onClick: onCreateEventType,
    }}
    className={className}
    icon={
      <svg
        className="h-12 w-12 text-blue-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    }
  />
);

interface NoBookingsProps {
  onViewEventTypes?: () => void;
  className?: string;
}

export const NoBookings: React.FC<NoBookingsProps> = ({
  onViewEventTypes,
  className,
}) => (
  <EmptyState
    title="No bookings yet"
    description="Once people start booking time with you, their appointments will appear here."
    action={
      onViewEventTypes
        ? {
            text: "View Event Types",
            onClick: onViewEventTypes,
          }
        : undefined
    }
    className={className}
    icon={
      <svg
        className="h-12 w-12 text-green-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    }
  />
);

interface NoTeamsProps {
  onCreateTeam: () => void;
  className?: string;
}

export const NoTeams: React.FC<NoTeamsProps> = ({
  onCreateTeam,
  className,
}) => (
  <EmptyState
    title="No teams yet"
    description="Create a team to collaborate with others and manage shared event types and bookings."
    action={{
      text: "Create Team",
      onClick: onCreateTeam,
    }}
    className={className}
    icon={
      <svg
        className="h-12 w-12 text-purple-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    }
  />
);

interface NoSchedulesProps {
  onCreateSchedule: () => void;
  className?: string;
}

export const NoSchedules: React.FC<NoSchedulesProps> = ({
  onCreateSchedule,
  className,
}) => (
  <EmptyState
    title="No schedules yet"
    description="Create your availability schedule to define when people can book time with you."
    action={{
      text: "Create Schedule",
      onClick: onCreateSchedule,
    }}
    className={className}
    icon={
      <svg
        className="h-12 w-12 text-orange-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    }
  />
);

interface NoWebhooksProps {
  onCreateWebhook: () => void;
  className?: string;
}

export const NoWebhooks: React.FC<NoWebhooksProps> = ({
  onCreateWebhook,
  className,
}) => (
  <EmptyState
    title="No webhooks configured"
    description="Set up webhooks to receive real-time notifications when bookings are created, updated, or cancelled."
    action={{
      text: "Add Webhook",
      onClick: onCreateWebhook,
    }}
    className={className}
    icon={
      <svg
        className="h-12 w-12 text-indigo-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    }
  />
);

interface SearchEmptyProps {
  query: string;
  onClearSearch?: () => void;
  className?: string;
}

export const SearchEmpty: React.FC<SearchEmptyProps> = ({
  query,
  onClearSearch,
  className,
}) => (
  <EmptyState
    title="No results found"
    description={`No items match "${query}". Try adjusting your search terms.`}
    action={
      onClearSearch
        ? {
            text: "Clear search",
            onClick: onClearSearch,
          }
        : undefined
    }
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    }
  />
);
