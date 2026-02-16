import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default async function GettingStartedPage() {
  // Check if user is authenticated
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-primary-600">
              <span className="text-xl font-bold text-white">C</span>
            </div>
            <span className="text-3xl font-semibold text-gray-900">CalMill</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Welcome to CalMill, {session.user.name || session.user.username}!
          </h1>

          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            You're all set up! Let's get your availability configured so people can start booking time with you.
          </p>

          <div className="mt-10 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link href="/availability">
              <Button size="lg">Set Up Your Availability</Button>
            </Link>
            <Link href="/event-types">
              <Button variant="secondary" size="lg">Create Event Types</Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 mb-4">
              <svg
                className="h-6 w-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">1. Set Your Availability</h3>
            <p className="text-gray-600">
              Configure when you're available to meet. Set your working hours, timezone, and days off.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 mb-4">
              <svg
                className="h-6 w-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">2. Create Event Types</h3>
            <p className="text-gray-600">
              Define different types of meetings with custom durations, questions, and settings.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sm:col-span-2 lg:col-span-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 mb-4">
              <svg
                className="h-6 w-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">3. Share Your Link</h3>
            <p className="text-gray-600">
              Once you're set up, share your personal booking link and start receiving bookings.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-primary-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your booking page will be:</h3>
            <p className="text-primary-600 font-mono text-lg">
              calmill.workermill.com/{session.user.username}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              You can customize this in your settings later
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/event-types"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip setup and go to dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}