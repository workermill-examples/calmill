import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";
import { Card, CardContent, CardHeader } from "./card";

interface LoadingSkeletonProps {
  className?: string;
}

// Generic skeleton components for common UI patterns
export const TableSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
}) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    ))}
  </div>
);

export const CardSkeleton: React.FC<LoadingSkeletonProps> = ({ className }) => (
  <Card className={className}>
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
);

export const ListSkeleton: React.FC<LoadingSkeletonProps> = ({ className }) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export const FormSkeleton: React.FC<LoadingSkeletonProps> = ({ className }) => (
  <div className={cn("space-y-6", className)}>
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-9 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-20 w-full" />
    </div>
    <div className="flex justify-end space-x-2">
      <Skeleton className="h-9 w-20" />
      <Skeleton className="h-9 w-24" />
    </div>
  </div>
);

export const DashboardSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
}) => (
  <div className={cn("space-y-6", className)}>
    {/* Stats cards */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Chart section */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="ml-4 space-y-1 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export const CalendarSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
}) => (
  <div className={cn("space-y-4", className)}>
    {/* Header */}
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-8" />
    </div>

    {/* Weekday headers */}
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>

    {/* Calendar days */}
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 42 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  </div>
);

export const BookingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
}) => (
  <div className={cn("space-y-6", className)}>
    {/* Booking header */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-48" />
    </div>

    {/* Date and time selection */}
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <CalendarSkeleton />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const EventTypeSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
}) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: 4 }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-4 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Simple skeleton component for backwards compatibility
export const LoadingSkeleton: React.FC<React.ComponentProps<typeof Skeleton>> =
  Skeleton;

export { Skeleton };
