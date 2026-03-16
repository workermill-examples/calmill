"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  Settings,
  Plus,
  MoreVertical,
  Mail,
  Crown,
  Shield,
  User,
  Trash2,
  Eye,
  Copy,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Toggle } from "@/components/ui/toggle";
import Link from "next/link";

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
    accepted: boolean;
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
    description?: string | null;
    duration: number;
    isActive: boolean;
    schedulingType: string;
    color?: string | null;
    bookingCount: number;
  }>;
}

function InviteMemberModal({
  teamSlug,
  onMemberInvited,
}: {
  teamSlug: string;
  onMemberInvited: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/teams/${teamSlug}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to invite member");
      }

      setEmail("");
      setRole("MEMBER");
      setIsOpen(false);
      onMemberInvited();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to invite member",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-1">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
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
            <Button type="submit" disabled={isLoading || !email}>
              {isLoading ? "Inviting..." : "Send Invite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MemberCard({
  member,
  teamSlug,
  userRole,
  onMemberUpdated,
}: {
  member: Team["members"][0];
  teamSlug: string;
  userRole: string;
  onMemberUpdated: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const canManageMembers =
    userRole === "OWNER" || (userRole === "ADMIN" && member.role !== "OWNER");

  const handleRoleChange = async (newRole: string) => {
    if (!canManageMembers || newRole === member.role) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/teams/${teamSlug}/members/${member.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        },
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to update member role");
      }

      onMemberUpdated();
    } catch (error) {
      console.error("Error updating member role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!canManageMembers) return;

    if (
      !confirm(
        `Are you sure you want to remove ${member.user.name || member.user.email} from the team?`,
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/teams/${teamSlug}/members/${member.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to remove member");
      }

      onMemberUpdated();
    } catch (error) {
      console.error("Error removing member:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        return "danger";
      case "ADMIN":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar size="sm">
            <AvatarFallback>
              {(member.user.name || member.user.email).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {member.user.name || member.user.email}
            </div>
            <div className="text-sm text-muted-foreground flex items-center space-x-2">
              <Mail className="h-3 w-3" />
              <span>{member.user.email}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={getRoleColor(member.role) as any}
            className="flex items-center space-x-1"
          >
            {getRoleIcon(member.role)}
            <span>{member.role}</span>
          </Badge>
          {!member.accepted && <Badge variant="outline">Pending</Badge>}
          {canManageMembers && member.role !== "OWNER" && (
            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isLoading}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownTrigger>
              <DropdownContent align="end">
                {member.role !== "ADMIN" && (
                  <DropdownItem onClick={() => handleRoleChange("ADMIN")}>
                    <Shield className="h-4 w-4 mr-2" />
                    Make Admin
                  </DropdownItem>
                )}
                {member.role !== "MEMBER" && (
                  <DropdownItem onClick={() => handleRoleChange("MEMBER")}>
                    <User className="h-4 w-4 mr-2" />
                    Make Member
                  </DropdownItem>
                )}
                <DropdownItem
                  onClick={handleRemoveMember}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Member
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          )}
        </div>
      </div>
    </Card>
  );
}

function EventTypeCard({
  eventType,
  teamSlug,
  userRole,
  onEventTypeUpdated,
}: {
  eventType: Team["eventTypes"][0];
  teamSlug: string;
  userRole: string;
  onEventTypeUpdated: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const canManageEventTypes = userRole === "OWNER" || userRole === "ADMIN";

  const handleToggleActive = async () => {
    if (!canManageEventTypes) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/event-types/${eventType.id}/toggle`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to toggle event type");
      }

      onEventTypeUpdated();
    } catch (error) {
      console.error("Error toggling event type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-3 h-8 rounded-full"
            style={{ backgroundColor: eventType.color || "#3b82f6" }}
          />
          <div>
            <div className="font-medium">{eventType.title}</div>
            {eventType.description && (
              <div className="text-sm text-muted-foreground">
                {eventType.description}
              </div>
            )}
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{eventType.duration}m</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {eventType.bookingCount} booking
                  {eventType.bookingCount !== 1 ? "s" : ""}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {eventType.schedulingType}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {canManageEventTypes && (
            <Toggle
              pressed={eventType.isActive}
              onPressedChange={handleToggleActive}
              disabled={isLoading}
              aria-label={
                eventType.isActive
                  ? "Deactivate event type"
                  : "Activate event type"
              }
            />
          )}
          <Dropdown>
            <DropdownTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownTrigger>
            <DropdownContent align="end">
              <DropdownItem>
                <Link
                  href={`/team/${teamSlug}/${eventType.slug}`}
                  target="_blank"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Public Page
                </Link>
              </DropdownItem>
              {canManageEventTypes && (
                <DropdownItem>
                  <Link href={`/event-types/${eventType.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Event Type
                  </Link>
                </DropdownItem>
              )}
              <DropdownItem
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/team/${teamSlug}/${eventType.slug}`,
                  );
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
    </Card>
  );
}

function TeamSettingsTab({
  team,
  onTeamUpdated,
}: {
  team: Team;
  onTeamUpdated: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: team.name,
    slug: team.slug,
    logoUrl: team.logoUrl || "",
    bio: team.bio || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/teams/${team.slug}`, {
        method: "PUT",
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
        throw new Error(result.message || "Failed to update team");
      }

      onTeamUpdated();

      // If slug changed, redirect to new URL
      if (formData.slug !== team.slug) {
        router.push(`/teams/${formData.slug}`);
      }
    } catch (error) {
      console.error("Error updating team:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${team.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleteLoading(true);
    try {
      const response = await fetch(`/api/teams/${team.slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete team");
      }

      router.push("/teams");
    } catch (error) {
      console.error("Error deleting team:", error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Team Settings</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="team-name"
              className="block text-sm font-medium mb-1"
            >
              Team Name
            </label>
            <Input
              id="team-name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label
              htmlFor="team-slug"
              className="block text-sm font-medium mb-1"
            >
              URL Slug
            </label>
            <Input
              id="team-slug"
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Public URL: /team/{formData.slug}
            </p>
          </div>

          <div>
            <label
              htmlFor="team-logo"
              className="block text-sm font-medium mb-1"
            >
              Logo URL (optional)
            </label>
            <Input
              id="team-logo"
              type="url"
              value={formData.logoUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, logoUrl: e.target.value }))
              }
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label
              htmlFor="team-bio"
              className="block text-sm font-medium mb-1"
            >
              Description (optional)
            </label>
            <textarea
              id="team-bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              placeholder="Brief description of your team..."
              className="w-full px-3 py-2 border rounded-md resize-none h-20"
              maxLength={1000}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>

      {team.userRole === "OWNER" && (
        <Card className="p-6 border-destructive/20">
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete a team, there is no going back. Please be certain.
          </p>
          <Button
            variant="danger"
            onClick={handleDeleteTeam}
            disabled={isDeleteLoading}
          >
            {isDeleteLoading ? "Deleting..." : "Delete Team"}
          </Button>
        </Card>
      )}
    </div>
  );
}

export default function TeamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("members");
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(
    null,
  );

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const fetchTeam = useCallback(async () => {
    if (!resolvedParams) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/teams/${resolvedParams.slug}`);
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          router.push("/teams");
          return;
        }
        throw new Error(result.message || "Failed to fetch team");
      }

      setTeam(result.team);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load team");
    } finally {
      setLoading(false);
    }
  }, [resolvedParams, router]);

  useEffect(() => {
    if (session?.user && resolvedParams) {
      fetchTeam();
    }
  }, [session?.user, resolvedParams, fetchTeam]);

  if (!session || !resolvedParams) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Failed to Load Team"
          description={error || "Team not found"}
          onRetry={fetchTeam}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Avatar size="lg">
          {team.logoUrl && <AvatarImage src={team.logoUrl} alt={team.name} />}
          <AvatarFallback>{team.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
          {team.bio && <p className="text-muted-foreground mt-1">{team.bio}</p>}
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="outline">
              {team.memberCount} member{team.memberCount !== 1 ? "s" : ""}
            </Badge>
            <Badge variant="outline">
              {team.eventTypeCount} event type
              {team.eventTypeCount !== 1 ? "s" : ""}
            </Badge>
            <Link href={`/team/${team.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Public Page
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="event-types">
            <Calendar className="h-4 w-4 mr-2" />
            Event Types
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Team Members</h2>
            {(team.userRole === "OWNER" || team.userRole === "ADMIN") && (
              <InviteMemberModal
                teamSlug={team.slug}
                onMemberInvited={fetchTeam}
              />
            )}
          </div>

          <div className="space-y-4">
            {team.members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                teamSlug={team.slug}
                userRole={team.userRole}
                onMemberUpdated={fetchTeam}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="event-types" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Event Types</h2>
            {(team.userRole === "OWNER" || team.userRole === "ADMIN") && (
              <Link href="/event-types/new">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event Type
                </Button>
              </Link>
            )}
          </div>

          {team.eventTypes.length === 0 ? (
            <EmptyState
              icon={<Calendar className="h-12 w-12" />}
              title="No event types yet"
              description="Create your first event type to start taking bookings."
            >
              {(team.userRole === "OWNER" || team.userRole === "ADMIN") && (
                <Link href="/event-types/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event Type
                  </Button>
                </Link>
              )}
            </EmptyState>
          ) : (
            <div className="space-y-4">
              {team.eventTypes.map((eventType) => (
                <EventTypeCard
                  key={eventType.id}
                  eventType={eventType}
                  teamSlug={team.slug}
                  userRole={team.userRole}
                  onEventTypeUpdated={fetchTeam}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings">
          {team.userRole === "OWNER" || team.userRole === "ADMIN" ? (
            <TeamSettingsTab team={team} onTeamUpdated={fetchTeam} />
          ) : (
            <Card className="p-6">
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Access Restricted
                </h3>
                <p className="text-muted-foreground">
                  Only team owners and admins can access team settings.
                </p>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
