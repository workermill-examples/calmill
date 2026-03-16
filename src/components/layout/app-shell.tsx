"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Sidebar } from "./sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

function AppShellContent({ children }: AppShellProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Determine if we should show the sidebar
  const shouldShowSidebar = useMemo(() => {
    // Don't show sidebar if user is not authenticated
    if (!session) return false;

    // Don't show sidebar for public pages
    if (pathname === "/" || pathname === "/login" || pathname === "/signup")
      return false;

    // Don't show sidebar for public booking pages
    if (pathname.startsWith("/booking/")) return false;

    // Don't show sidebar for public user/team profiles
    if (pathname.match(/^\/[^\/]+$/) || pathname.match(/^\/[^\/]+\/[^\/]+$/)) {
      // Check if it's not a known authenticated route
      const authenticatedRoutes = [
        "/dashboard",
        "/event-types",
        "/bookings",
        "/availability",
        "/teams",
        "/settings",
      ];
      if (!authenticatedRoutes.some((route) => pathname.startsWith(route))) {
        return false;
      }
    }

    // Don't show sidebar for team public pages
    if (pathname.startsWith("/team/")) return false;

    // Don't show sidebar for embed pages
    if (pathname.startsWith("/embed/")) return false;

    // Show sidebar for all other authenticated pages
    return true;
  }, [session, pathname]);

  if (shouldShowSidebar) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="h-full">{children}</div>
        </main>
      </div>
    );
  }

  // No sidebar layout for public pages, auth pages, and embed pages
  return <div className="min-h-screen bg-background">{children}</div>;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      }
    >
      <AppShellContent>{children}</AppShellContent>
    </Suspense>
  );
}
