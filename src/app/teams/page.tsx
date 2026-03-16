"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, Users, Settings, Calendar, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/ui/dropdown";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Team {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  bio?: string | null;
  userRole: string;
  memberCount: number;
  eventTypeCount: number;
  members: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      username: string | null;
    };
  }>;
  eventTypes: Array<{
    id: string;
    title: string;
    slug: string;
    duration: number;
    isActive: boolean;
    schedulingType: string;
  }>;
}

function CreateTeamModal({ onTeamCreated }: { onTeamCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logoUrl: "",
    bio: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          logoUrl: formData.logoUrl || undefined,
          bio: formData.bio || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create team");
      }

      // Reset form and close modal
      setFormData({ name: "", slug: "", logoUrl: "", bio: "" });
      setIsOpen(false);
      onTeamCreated();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create team");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="team-name" className="block text-sm font-medium mb-1">
              Team Name
            </label>
            <Input
              id="team-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Engineering Team"
              required
            />
          </div>

          <div>
            <label htmlFor="team-slug" className="block text-sm font-medium mb-1">
              URL Slug
            </label>
            <Input
              id="team-slug"
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="engineering-team"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              This will be your team&apos;s URL: /team/{formData.slug}
            </p>
          </div>

          <div>
            <label htmlFor="team-logo" className="block text-sm font-medium mb-1">
              Logo URL (optional)
            </label>
            <Input
              id="team-logo"
              type="url"
              value={formData.logoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label htmlFor="team-bio" className="block text-sm font-medium mb-1">
              Description (optional)
            </label>
            <textarea
              id="team-bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Brief description of your team..."
              className="w-full px-3 py-2 border rounded-md resize-none h-20"
              maxLength={1000}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name || !formData.slug}>
              {isLoading ? "Creating..." : "Create Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TeamCard({ team }: { team: Team }) {
  const roleColor = {
    OWNER: "danger",
    ADMIN: "default",
    MEMBER: "secondary",
  } as const;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Avatar size="md">
            {team.logoUrl && <AvatarImage src={team.logoUrl} alt={team.name} />}
            <AvatarFallback>{team.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-lg">{team.name}</h3>
              <Badge variant={roleColor[team.userRole as keyof typeof roleColor] || "secondary"}>
                {team.userRole}
              </Badge>
            </div>
            {team.bio && (
              <p className="text-muted-foreground text-sm mb-3">{team.bio}</p>
            )}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{team.memberCount} member{team.memberCount !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{team.eventTypeCount} event type{team.eventTypeCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
        <Dropdown>
          <DropdownTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownTrigger>
          <DropdownContent align="end">
            <DropdownItem>
              <Link href={`/teams/${team.slug}`}>
                <Settings className="h-4 w-4 mr-2" />
                Manage Team
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link href={`/team/${team.slug}`} target="_blank">
                View Public Page
              </Link>
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>

      <div className="mt-4 flex justify-end">
        <Link href={`/teams/${team.slug}`}>
          <Button variant="outline" size="sm">
            Manage Team
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function TeamsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Skeleton className="h-8 w-24" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function TeamsPage() {
  const { data: session } = useSession();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/teams");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch teams");
      }

      setTeams(result.teams || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  // Fetch teams on component mount
  useEffect(() => {
    if (session?.user) {
      fetchTeams();
    }
  }, [session?.user]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <TeamsPageSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Failed to Load Teams"
          description={error}
          onRetry={fetchTeams}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground mt-1">
            Manage your teams and collaborate with others
          </p>
        </div>
        <CreateTeamModal onTeamCreated={fetchTeams} />
      </div>

      {teams.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="No teams yet"
          description="Create your first team to start collaborating with others."
        >
          <CreateTeamModal onTeamCreated={fetchTeams} />
        </EmptyState>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}