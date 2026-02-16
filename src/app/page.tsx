'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const handleTryDemo = async () => {
    try {
      await signIn('credentials', {
        email: 'demo@workermill.com',
        password: 'demo1234',
        callbackUrl: '/event-types',
      });
    } catch (error) {
      console.error('Demo sign-in failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 pt-20 pb-20 sm:pt-24 sm:pb-24 lg:pt-32 lg:pb-32">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Open Scheduling
                <span className="block text-primary-600">for Everyone</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
                Create booking pages, manage availability, and let people schedule time with you —
                no back-and-forth emails.
              </p>
              <div className="mt-10 flex items-center justify-center gap-6">
                <Link href="/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleTryDemo}
                  type="button"
                >
                  Try the Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <svg
            className="absolute left-1/2 top-0 -ml-3 lg:-ml-8 xl:-ml-16"
            width="404"
            height="392"
            fill="none"
            viewBox="0 0 404 392"
          >
            <defs>
              <pattern
                id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" className="text-primary-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="392" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to schedule smarter
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful scheduling features that work the way you do.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Event Types Feature */}
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
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
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Event Types</h3>
              <p className="mt-2 text-gray-600">
                Create different meeting types with custom durations, locations, and questions.
                Perfect for consultations, interviews, or casual coffee chats.
              </p>
            </div>

            {/* Smart Scheduling Feature */}
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
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
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Smart Scheduling</h3>
              <p className="mt-2 text-gray-600">
                Timezone-aware availability with calendar conflict detection.
                Your schedule adapts automatically, so you never have to worry about double-booking.
              </p>
            </div>

            {/* Team Booking Feature */}
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Team Booking</h3>
              <p className="mt-2 text-gray-600">
                Round-robin and collective scheduling for your team.
                Let customers book with the right person at the right time, automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Join thousands of professionals who trust CalMill for their scheduling needs.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button variant="secondary" size="lg">Create Your Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-600">
                <span className="text-sm font-bold text-white">C</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">CalMill</span>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>Built by</span>
              <a
                href="https://workermill.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
              >
                WorkerMill
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2024 CalMill. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}