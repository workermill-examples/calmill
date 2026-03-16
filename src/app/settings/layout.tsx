"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/loading-skeleton";
import {
  User,
  Settings,
  Lock,
  Calendar,
  Webhook,
  AlertTriangle,
} from "lucide-react";

const settingsNavigation = [
  {
    name: "Profile",
    href: "/settings" as const,
    icon: User,
    description: "Manage your profile information",
  },
  {
    name: "Preferences",
    href: "/settings/preferences" as const,
    icon: Settings,
    description: "Configure your preferences",
  },
  {
    name: "Password",
    href: "/settings/password" as const,
    icon: Lock,
    description: "Change your password",
  },
  {
    name: "Calendars",
    href: "/settings/calendars" as const,
    icon: Calendar,
    description: "Connect your calendar accounts",
  },
  {
    name: "Webhooks",
    href: "/settings/webhooks" as const,
    icon: Webhook,
    description: "Manage webhook endpoints",
  },
  {
    name: "Danger Zone",
    href: "/settings/danger" as const,
    icon: AlertTriangle,
    description: "Delete your account",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

function SettingsLayoutContent({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Settings Navigation Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {settingsNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href as Route}
                    className={cn(
                      "group flex items-start px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mt-0.5 mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "text-sm font-medium",
                          isActive ? "text-primary" : "text-foreground"
                        )}
                      >
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-card rounded-lg border border-border shadow-sm">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <Suspense fallback={
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    }>
      <SettingsLayoutContent>{children}</SettingsLayoutContent>
    </Suspense>
  );
}