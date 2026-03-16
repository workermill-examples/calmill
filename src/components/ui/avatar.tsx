"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const avatarSizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof avatarSizes;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        avatarSizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Avatar.displayName = "Avatar";

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoadingStatusChange?: (
    status: "idle" | "loading" | "loaded" | "error",
  ) => void;
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, onLoadingStatusChange, ...props }, ref) => {
    const [loadingStatus, setLoadingStatus] = React.useState<
      "idle" | "loading" | "loaded" | "error"
    >("idle");

    React.useEffect(() => {
      if (!props.src) {
        setLoadingStatus("error");
        return;
      }

      const image = new Image();
      setLoadingStatus("loading");

      image.onload = () => {
        setLoadingStatus("loaded");
      };

      image.onerror = () => {
        setLoadingStatus("error");
      };

      image.src = typeof props.src === "string" ? props.src : "";

      return () => {
        image.onload = null;
        image.onerror = null;
      };
    }, [props.src]);

    React.useEffect(() => {
      onLoadingStatusChange?.(loadingStatus);
    }, [loadingStatus, onLoadingStatusChange]);

    return loadingStatus === "loaded" ? (
      <img
        ref={ref}
        className={cn("aspect-square h-full w-full object-cover", className)}
        alt=""
        {...props}
      />
    ) : null;
  },
);
AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  delayMs?: number;
}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, delayMs, children, ...props }, ref) => {
    const [canRender, setCanRender] = React.useState(delayMs === undefined);

    React.useEffect(() => {
      if (delayMs !== undefined) {
        const timer = window.setTimeout(() => setCanRender(true), delayMs);
        return () => window.clearTimeout(timer);
      }
    }, [delayMs]);

    return canRender ? (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-muted font-medium",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    ) : null;
  },
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
