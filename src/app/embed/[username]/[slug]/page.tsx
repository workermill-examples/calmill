import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EmbedBookingPage } from "./embed-booking-client";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

interface PageProps {
  params: Promise<{ username: string; slug: string }>;
  searchParams: Promise<{ date?: string; time?: string; timezone?: string }>;
}

interface User {
  id: string;
  username: string;
  name: string;
  image?: string;
  timezone: string;
}

interface EventType {
  id: string;
  title: string;
  slug: string;
  description?: string;
  duration: number;
  price?: number;
  currency?: string;
  color?: string;
  requiresConfirmation: boolean;
  minimumNotice?: number;
  beforeBuffer?: number;
  afterBuffer?: number;
  slotInterval?: number;
  maxBookingsPerDay?: number;
  maxBookingsPerWeek?: number;
  futureLimit?: number;
  customQuestions: Array<{
    id: string;
    type: "text" | "textarea" | "select" | "radio" | "checkbox" | "phone";
    label: string;
    required?: boolean;
    placeholder?: string;
    options?: string[];
  }>;
  recurringEnabled: boolean;
  recurringFrequency?: "weekly" | "biweekly" | "monthly";
  user: User;
  schedule?: {
    id: string;
    name: string;
    timezone: string;
  };
}

async function fetchUserEventType(username: string, slug: string): Promise<EventType | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // First get the user's event types
    const response = await fetch(`${baseUrl}/api/users/${username}/event-types`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch event types: ${response.status}`);
    }

    const data = await response.json();
    const eventTypes = data.eventTypes || [];

    // Find the matching slug
    const eventType = eventTypes.find((et: any) => et.slug === slug);
    if (!eventType) return null;

    // Get user info
    const userResponse = await fetch(`${baseUrl}/api/users/${username}`, {
      next: { revalidate: 300 },
    });

    if (!userResponse.ok) return null;

    const userData = await userResponse.json();
    const user = userData.user;

    return {
      ...eventType,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        image: user.image,
        timezone: user.timezone,
      },
    };
  } catch (error) {
    console.error("Error fetching event type:", error);
    return null;
  }
}

function EmbedBookingPageSkeleton() {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column - Event info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <LoadingSkeleton className="w-6 h-6 rounded-full" />
              <LoadingSkeleton className="w-40 h-6" />
              <LoadingSkeleton className="w-48 h-4" />
            </div>

            <div className="space-y-2">
              <LoadingSkeleton className="w-full h-3" />
              <LoadingSkeleton className="w-3/4 h-3" />
              <LoadingSkeleton className="w-1/2 h-3" />
            </div>

            <div className="space-y-1">
              <LoadingSkeleton className="w-20 h-3" />
              <LoadingSkeleton className="w-24 h-3" />
            </div>
          </div>

          {/* Right column - Booking interface */}
          <div className="space-y-4">
            <LoadingSkeleton className="w-full h-64 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function EmbedBookingPageContent({ params, searchParams }: PageProps) {
  const { username, slug } = await params;
  const query = await searchParams;

  const eventType = await fetchUserEventType(username, slug);

  if (!eventType) {
    notFound();
  }

  return (
    <EmbedBookingPage
      eventType={eventType}
      initialDate={query.date}
      initialTime={query.time}
      initialTimezone={query.timezone}
    />
  );
}

export default function Page(props: PageProps) {
  return (
    <Suspense fallback={<EmbedBookingPageSkeleton />}>
      <EmbedBookingPageContent {...props} />
    </Suspense>
  );
}

// Metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { username, slug } = await params;
  const eventType = await fetchUserEventType(username, slug);

  if (!eventType) {
    return {
      title: "Event Not Found - CalMill",
      description: "The requested event type could not be found.",
    };
  }

  const price = eventType.price && eventType.price > 0
    ? ` - ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: eventType.currency || "USD",
      }).format(eventType.price / 100)}`
    : " - Free";

  return {
    title: `Book ${eventType.title} with ${eventType.user.name} - CalMill`,
    description:
      eventType.description ||
      `Book a ${eventType.duration} minute meeting: ${eventType.title} with ${eventType.user.name}${price}`,
    openGraph: {
      title: `${eventType.title} - ${eventType.user.name}`,
      description: eventType.description || `${eventType.duration} minute meeting${price}`,
      images: eventType.user.image ? [{ url: eventType.user.image }] : [],
    },
  };
}