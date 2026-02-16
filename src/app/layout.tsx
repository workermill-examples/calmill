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
  description: 'Create booking pages, manage availability, and let people schedule time with you — no back-and-forth emails.',
  keywords: ['scheduling', 'calendar', 'booking', 'appointments', 'meetings'],
  authors: [{ name: 'WorkerMill', url: 'https://workermill.com' }],
  creator: 'WorkerMill',
  publisher: 'WorkerMill',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://calmill.workermill.com',
    siteName: 'CalMill',
    title: 'CalMill — Open Scheduling',
    description: 'Create booking pages, manage availability, and let people schedule time with you — no back-and-forth emails.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CalMill - Open Scheduling for Everyone',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalMill — Open Scheduling',
    description: 'Create booking pages, manage availability, and let people schedule time with you — no back-and-forth emails.',
    images: ['/og-image.png'],
    creator: '@workermill',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-token',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}