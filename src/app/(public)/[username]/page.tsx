interface PublicProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <p className="text-lg text-gray-600 mt-6">
          Loading <span className="font-medium">{username}</span>&apos;s profile...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Event type cards will appear here in CM-3
        </p>
      </div>
    </div>
  );
}