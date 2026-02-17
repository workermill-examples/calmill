export default function AvailabilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Availability</h2>
        <p className="mt-2 text-sm text-gray-600">
          Set your weekly schedule and manage your availability
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">Manage your availability</h3>
          <p className="mt-2 text-sm text-gray-600">
            Configure your weekly hours and set date overrides to control when people can book time
            with you.
          </p>
        </div>
      </div>
    </div>
  );
}
