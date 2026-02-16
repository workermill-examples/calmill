export default function AvailabilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
        <p className="mt-2 text-gray-600">
          Set your working hours and manage when people can book time with you.
        </p>
      </div>

      {/* Placeholder content */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <div className="space-y-4">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Manage your availability</h3>
            <p className="text-gray-500 mt-2">
              Configure your working hours, time zones, and block out unavailable periods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}