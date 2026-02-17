import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { DashboardShell } from '@/components/dashboard-shell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login');
  }

  return <DashboardShell>{children}</DashboardShell>;
}
