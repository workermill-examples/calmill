export default function EventTypesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Event Types</h1>
        <p className="mt-2 text-gray-600">
          Manage your event types and booking configurations.
        </p>
      </div>

      {/* Placeholder content */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <div className="space-y-4">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Your event types will appear here</h3>
            <p className="text-gray-500 mt-2">
              Create different meeting types with custom durations, locations, and questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}