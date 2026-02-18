import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'CalMill — Open Scheduling',
  description:
    'Create booking pages, manage availability, and let people schedule time with you — no back-and-forth emails.',
  keywords: ['scheduling', 'calendar', 'booking', 'appointments', 'meetings'],
  authors: [{ name: 'WorkerMill', url: 'https://workermill.com' }],
  openGraph: {
    title: 'CalMill — Open Scheduling',
    description:
      'Create booking pages, manage availability, and let people schedule time with you.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
