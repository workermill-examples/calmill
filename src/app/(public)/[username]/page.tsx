interface PublicProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;

  return (
    <div className="space-y-8">
      {/* User profile header */}
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
          <span className="text-2xl font-semibold text-primary-600">
            {username.charAt(0).toUpperCase()}
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">@{username}</h1>
        <p className="mt-2 text-gray-600">Loading {username}&apos;s profile...</p>
      </div>

      {/* Event types placeholder */}
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-6 w-6 text-gray-400"
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
          <p className="mt-4 text-sm text-gray-600">
            Event type cards will appear here in CM-3
          </p>
        </div>
      </div>
    </div>
  );
}
