"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Users, Crown, Shield, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface PublicTeam {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  bio?: string | null;
  memberCount: number;
  eventTypeCount: number;
  members: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      name: string | null;
      username: string | null;
      image?: string | null;
    };
  }>;
  eventTypes: Array<{
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    duration: number;
    color?: string | null;
    schedulingType: string;
    requiresConfirmation: boolean;
    minimumNotice?: number | null;
    price?: number | null;
    currency?: string | null;
  }>;
}

function EventTypeCard({ eventType, teamSlug }: {
  eventType: PublicTeam['eventTypes'][0];
  teamSlug: string;
}) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price / 100); // Assuming price is in cents
  };

  const formatMinimumNotice = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else if (minutes < 1440) {
      return `${Math.floor(minutes / 60)}h`;
    } else {
      return `${Math.floor(minutes / 1440)}d`;
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div
          className="w-4 h-16 rounded-full flex-shrink-0"
          style={{ backgroundColor: eventType.color || "#3b82f6" }}
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">{eventType.title}</h3>
              {eventType.description && (
                <p className="text-muted-foreground text-sm mb-3">{eventType.description}</p>
              )}

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{eventType.duration} minutes</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{eventType.schedulingType === 'ROUND_ROBIN' ? 'Round Robin' : 'Collective'}</span>
                </div>

                {eventType.minimumNotice && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatMinimumNotice(eventType.minimumNotice)} notice</span>
                  </div>
                )}

                {eventType.requiresConfirmation && (
                  <Badge variant="outline" className="text-xs">
                    Requires Confirmation
                  </Badge>
                )}

                {eventType.price && eventType.price > 0 && eventType.currency && (
                  <div className="flex items-center space-x-1 font-medium text-primary">
                    <span>{formatPrice(eventType.price, eventType.currency)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Link href={`/team/${teamSlug}/${eventType.slug}`}>
              <Button>
                Book Meeting
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

function MemberCard({ member }: { member: PublicTeam['members'][0] }) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER":
        return <Crown className="h-4 w-4" />;
      case "ADMIN":
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "OWNER":
        return "destructive";
      case "ADMIN":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-3">
        <Avatar size="md">
          {member.user.image && <AvatarImage src={member.user.image} alt={member.user.name || "Team member"} />}
          <AvatarFallback>{(member.user.name || "U").charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-medium">{member.user.name || "Anonymous"}</div>
          {member.user.username && (
            <div className="text-sm text-muted-foreground">@{member.user.username}</div>
          )}
        </div>
        <Badge variant={getRoleColor(member.role) as any} className="flex items-center space-x-1">
          {getRoleIcon(member.role)}
          <span>{member.role}</span>
        </Badge>
      </div>
    </Card>
  );
}

function PublicTeamPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
        <div className="flex justify-center space-x-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>

      {/* Event types skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start space-x-4">
              <Skeleton className="w-4 h-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
                <div className="flex space-x-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-10 w-28" />
            </div>
          </Card>
        ))}
      </div>

      {/* Members skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PublicTeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const [team, setTeam] = useState<PublicTeam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const fetchTeam = useCallback(async () => {
    if (!resolvedParams) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/teams/${resolvedParams.slug}/public`);
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setError("Team not found");
        } else {
          throw new Error(result.message || "Failed to fetch team");
        }
        return;
      }

      setTeam(result.team);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load team");
    } finally {
      setLoading(false);
    }
  }, [resolvedParams]);

  useEffect(() => {
    if (resolvedParams) {
      fetchTeam();
    }
  }, [resolvedParams, fetchTeam]);

  if (!resolvedParams) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <PublicTeamPageSkeleton />
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Team Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The team you&apos;re looking for doesn&apos;t exist or is not publicly available.
            </p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Team Header */}
        <div className="text-center mb-12">
          <Avatar size="xl" className="mx-auto mb-6">
            {team.logoUrl && <AvatarImage src={team.logoUrl} alt={team.name} />}
            <AvatarFallback>{team.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-bold tracking-tight mb-4">{team.name}</h1>
          {team.bio && (
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              {team.bio}
            </p>
          )}
          <div className="flex justify-center items-center space-x-4">
            <Badge variant="outline" className="text-sm">
              {team.memberCount} member{team.memberCount !== 1 ? 's' : ''}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {team.eventTypeCount} event type{team.eventTypeCount !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        {/* Event Types Section */}
        {team.eventTypes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Book a Meeting</h2>
            <div className="space-y-4">
              {team.eventTypes.map((eventType) => (
                <EventTypeCard
                  key={eventType.id}
                  eventType={eventType}
                  teamSlug={team.slug}
                />
              ))}
            </div>
          </div>
        )}

        {/* Team Members Section */}
        {team.members.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Our Team</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {team.members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state if no event types */}
        {team.eventTypes.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Events Available</h3>
            <p className="text-muted-foreground">
              This team hasn&apos;t set up any public event types yet.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <Link
              href="https://calmill.workermill.com"
              className="text-primary hover:underline"
              target="_blank"
            >
              CalMill
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}