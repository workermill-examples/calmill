interface BookingPageProps {
  params: Promise<{
    username: string;
    slug: string;
  }>;
}

export default async function BookingPage({
  params,
}: BookingPageProps) {
  const { username, slug } = await params;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <p className="text-lg text-gray-600 mt-6">
          Loading booking page...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Calendar and slot picker will appear here in CM-3
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left side - Event info placeholder */}
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>

        {/* Right side - Calendar placeholder */}
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-400">
        <p>
          Booking for <span className="font-mono">{username}</span> · {' '}
          <span className="font-mono">{slug}</span>
        </p>
      </div>
    </div>
  );
}