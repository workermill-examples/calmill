import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";

export default async function GettingStartedPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <svg
              className="h-8 w-8 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to CalMill, {session.user.name}!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Your account is ready. Let&apos;s get you set up.
          </p>
        </div>

        {/* Onboarding Steps */}
        <div className="mt-12">
          <div className="rounded-lg bg-white px-8 py-10 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Next steps</h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Set up your availability</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Configure when you&apos;re available for meetings. We&apos;ve created a default
                    Monday-Friday 9-5 schedule to get you started.
                  </p>
                  <Link href="/availability" className="mt-2 inline-block">
                    <Button variant="ghost" size="sm">
                      Manage Availability →
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Create event types</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    We&apos;ve created two sample event types (30min and 60min). Customize them or
                    create new ones.
                  </p>
                  <Link href="/event-types" className="mt-2 inline-block">
                    <Button variant="ghost" size="sm">
                      View Event Types →
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Share your booking link</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Your public booking page is available at:
                  </p>
                  <div className="mt-2 flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2 border border-gray-200">
                    <code className="text-sm text-gray-700 flex-1">
                      {process.env.NEXT_PUBLIC_APP_URL || "https://calmill.workermill.com"}/
                      {session.user.username}
                    </code>
                    <CopyButton
                      text={`${process.env.NEXT_PUBLIC_APP_URL || "https://calmill.workermill.com"}/${session.user.username}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link href="/event-types">
                <Button variant="primary" size="lg" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
