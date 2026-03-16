"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  Clock,
  Users,
  Settings,
  LayoutDashboard,
  CalendarDays,
  LogOut,
  User,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard" as const,
    icon: LayoutDashboard,
  },
  {
    name: "Event Types",
    href: "/event-types" as const,
    icon: Calendar,
  },
  {
    name: "Bookings",
    href: "/bookings" as const,
    icon: CalendarDays,
  },
  {
    name: "Availability",
    href: "/availability" as const,
    icon: Clock,
  },
  {
    name: "Teams",
    href: "/teams" as const,
    icon: Users,
  },
  {
    name: "Settings",
    href: "/settings" as const,
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col bg-white border-r border-border",
        className,
      )}
      data-testid="sidebar"
    >
      {/* Logo/Brand */}
      <div className="flex h-16 items-center px-4 border-b border-border">
        <Link
          href={"/dashboard" as Route}
          className="flex items-center space-x-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">CalMill</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href as Route}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      {session?.user && (
        <div className="border-t border-border p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-8 w-8">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {session.user.name || session.user.email}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session.user.email}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-1">
            <Link href={"/settings" as Route} className="w-full">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 px-2 text-xs"
              >
                <Settings className="mr-2 h-3 w-3" />
                Settings
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                // In a real app, this would trigger sign out
                window.location.href = "/api/auth/signout";
              }}
            >
              <LogOut className="mr-2 h-3 w-3" />
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* Built by WorkerMill Badge */}
      <div className="border-t border-border p-4">
        <Link
          href="https://workermill.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
        >
          <span className="text-xs text-gray-600 group-hover:text-gray-700">
            Built by <span className="font-semibold">WorkerMill</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
