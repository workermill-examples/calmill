import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | CalMill",
    default: "CalMill - Open Scheduling for Everyone",
  },
  description:
    "Open scheduling platform with Google Calendar sync, team scheduling, embeddable widgets, and webhooks. Built by WorkerMill to showcase AI-powered development.",
  keywords: [
    "scheduling",
    "calendar",
    "booking",
    "appointments",
    "meetings",
    "workermill",
    "ai",
  ],
  authors: [{ name: "WorkerMill", url: "https://workermill.com" }],
  creator: "WorkerMill",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    title: "CalMill - Open Scheduling for Everyone",
    description:
      "Open scheduling platform with Google Calendar sync, team scheduling, embeddable widgets, and webhooks. Built by WorkerMill to showcase AI-powered development.",
    url: "/",
    siteName: "CalMill",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CalMill - Open Scheduling for Everyone",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CalMill - Open Scheduling for Everyone",
    description:
      "Open scheduling platform with Google Calendar sync, team scheduling, embeddable widgets, and webhooks. Built by WorkerMill to showcase AI-powered development.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
