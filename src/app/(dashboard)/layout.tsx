'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Loading } from '@/components/ui/loading';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Show loading state while checking auth
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  // Don't render layout until authenticated
  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
