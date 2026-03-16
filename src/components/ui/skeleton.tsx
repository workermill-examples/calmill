import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-gradient-to-r from-muted via-gray-200 to-muted bg-no-repeat",
        className
      )}
      style={{
        backgroundSize: "200px 100%",
        animation: "shimmer 2s infinite linear",
      }}
      {...props}
    />
  );
}

export { Skeleton };