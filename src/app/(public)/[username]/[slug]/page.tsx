interface BookingPageProps {
  params: Promise<{ username: string; slug: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { username, slug } = await params;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left column - Event details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                <span className="text-sm font-semibold text-primary-600">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">@{username}</p>
                <h1 className="text-xl font-semibold text-gray-900 capitalize">
                  {slug.replace(/-/g, ' ')}
                </h1>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 text-gray-400"
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
                <span className="text-sm text-gray-600">Duration loading...</span>
              </div>

              <div className="flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-gray-600">Event details loading...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Calendar placeholder */}
        <div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="h-8 w-8 text-gray-400"
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
              <p className="mt-4 text-sm font-medium text-gray-900">Loading booking page...</p>
              <p className="mt-2 text-xs text-gray-600">
                Calendar and slot picker will appear here in CM-3
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
