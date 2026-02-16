import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header with CalMill logo */}
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/" className="flex items-center">
              <div className="text-xl font-bold text-primary-600">
                CalMill
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Centered content area */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}