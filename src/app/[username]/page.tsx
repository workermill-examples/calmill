import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

interface PageProps {
  params: Promise<{ username: string }>;
}

interface UserProfile {
  id: string;
  username: string;
  name: string;
  image?: string;
  bio?: string;
  timezone: string;
  createdAt: string;
  stats: {
    eventTypes: number;
  };
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
  bookingCount: number;
}

async function fetchUserProfile(username: string): Promise<UserProfile | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/users/${username}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

async function fetchUserEventTypes(username: string): Promise<EventType[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/users/${username}/event-types`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event types: ${response.status}`);
    }

    const data = await response.json();
    return data.eventTypes || [];
  } catch (error) {
    console.error("Error fetching event types:", error);
    return [];
  }
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="text-center space-y-4">
          <LoadingSkeleton className="w-24 h-24 rounded-full mx-auto" />
          <LoadingSkeleton className="w-48 h-8 mx-auto" />
          <LoadingSkeleton className="w-64 h-4 mx-auto" />
          <LoadingSkeleton className="w-32 h-4 mx-auto" />
        </div>

        {/* Event types skeleton */}
        <div className="space-y-4">
          <LoadingSkeleton className="w-48 h-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <LoadingSkeleton className="w-4 h-12 rounded" />
                    <div className="flex-1 space-y-2">
                      <LoadingSkeleton className="w-32 h-5" />
                      <LoadingSkeleton className="w-24 h-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <LoadingSkeleton className="w-full h-4" />
                    <LoadingSkeleton className="w-3/4 h-4" />
                    <div className="flex justify-between items-center pt-2">
                      <LoadingSkeleton className="w-16 h-4" />
                      <LoadingSkeleton className="w-20 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
}

function formatPrice(price: number | undefined, currency: string | undefined): string {
  if (!price || price === 0) return "Free";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  });
  return formatter.format(price / 100); // Assuming price is stored in cents
}

async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;

  // Fetch user profile and event types in parallel
  const [userProfile, eventTypes] = await Promise.all([
    fetchUserProfile(username),
    fetchUserEventTypes(username),
  ]);

  if (!userProfile) {
    notFound();
  }

  const hasEventTypes = eventTypes.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* User Profile Header */}
          <div className="text-center space-y-4">
            <Avatar className="w-24 h-24 mx-auto">
              {userProfile.image ? (
                <Image
                  src={userProfile.image}
                  alt={userProfile.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </Avatar>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                {userProfile.name}
              </h1>
              <p className="text-muted-foreground">@{userProfile.username}</p>

              {userProfile.bio && (
                <p className="text-foreground max-w-2xl mx-auto">
                  {userProfile.bio}
                </p>
              )}

              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <span>📍 {userProfile.timezone}</span>
                <span>📅 {userProfile.stats.eventTypes} event type{userProfile.stats.eventTypes !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Event Types Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Available Event Types
              </h2>
              <p className="text-muted-foreground">
                Choose a meeting type that works best for you
              </p>
            </div>

            {!hasEventTypes ? (
              <EmptyState
                title="No event types available"
                description="This user hasn't set up any public event types yet."
                action={undefined}
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {eventTypes.map((eventType) => (
                  <Link
                    key={eventType.id}
                    href={`/${username}/${eventType.slug}`}
                    className="group"
                  >
                    <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-l-4 group-hover:border-l-blue-500" style={{ borderLeftColor: eventType.color || "#3b82f6" }}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start space-x-3">
                          <div
                            className="w-4 h-12 rounded flex-shrink-0"
                            style={{ backgroundColor: eventType.color || "#3b82f6" }}
                          />
                          <div className="flex-1 space-y-1">
                            <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                              {eventType.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{formatDuration(eventType.duration)}</span>
                              {eventType.price && eventType.price > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{formatPrice(eventType.price, eventType.currency)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-3">
                          {eventType.description && (
                            <CardDescription className="text-sm leading-relaxed">
                              {eventType.description}
                            </CardDescription>
                          )}

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-2">
                              {eventType.requiresConfirmation && (
                                <Badge variant="secondary" className="text-xs">
                                  Requires confirmation
                                </Badge>
                              )}
                              {eventType.price === 0 && (
                                <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                                  Free
                                </Badge>
                              )}
                            </div>

                            <span className="text-xs text-muted-foreground">
                              {eventType.bookingCount} booking{eventType.bookingCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Powered by{" "}
              <a
                href="https://workermill.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                WorkerMill
              </a>{" "}
              • Built autonomously by AI agents
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfilePage params={params} />
    </Suspense>
  );
}

// Metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const userProfile = await fetchUserProfile(username);

  if (!userProfile) {
    return {
      title: "User Not Found - CalMill",
      description: "The requested user profile could not be found.",
    };
  }

  return {
    title: `${userProfile.name} (@${userProfile.username}) - CalMill`,
    description: userProfile.bio || `Book a meeting with ${userProfile.name} using CalMill. Choose from ${userProfile.stats.eventTypes} available event types.`,
    openGraph: {
      title: `${userProfile.name} - CalMill`,
      description: userProfile.bio || `Book a meeting with ${userProfile.name}`,
      images: userProfile.image ? [{ url: userProfile.image }] : [],
    },
  };
}