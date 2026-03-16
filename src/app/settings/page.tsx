"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useToast } from "@/components/ui/toast";
import { User, Save, Camera } from "lucide-react";
import Image from "next/image";

interface UserProfile {
  id: string;
  email: string;
  username: string;
  name: string;
  image: string | null;
  bio: string | null;
  timezone: string;
  weekStart: number;
  theme: string;
}

export default function ProfileSettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    image: "",
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/user", {
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch profile");
      }

      const { user } = await response.json();
      setProfile(user);

      // Update form data
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        image: user.image || "",
      });

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error instanceof Error ? error.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Save profile changes
  const saveProfile = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          bio: formData.bio,
          image: formData.image,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const { user } = await response.json();
      setProfile(user);
      setHasUnsavedChanges(false);

      // Update session data to reflect changes
      await updateSession({
        name: user.name,
        image: user.image,
      });

      addToast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save profile";
      setError(errorMessage);
      addToast({
        title: "Error",
        description: errorMessage,
        variant: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle form field changes
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to load profile"
          description={error}
          onRetry={fetchProfile}
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <ErrorState
          title="Profile not found"
          description="Unable to load your profile data."
          onRetry={fetchProfile}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Profile</h2>
          <p className="text-muted-foreground">
            Update your profile information and avatar.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-sm text-destructive">{error}</div>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="space-y-6">
          {/* Avatar Section */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Profile Photo
            </label>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                {formData.image ? (
                  <Image
                    src={formData.image}
                    alt={formData.name || "Profile"}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
                <input
                  id="avatar-input"
                  type="url"
                  placeholder="Enter image URL"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  className="sr-only"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG or GIF. Max 5MB.
                </p>
              </div>
            </div>
            {/* Image URL Input */}
            <div className="mt-3">
              <Input
                placeholder="Or enter image URL..."
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="text-sm font-medium text-foreground mb-2 block">
              Username
            </label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Enter your username"
                className="pl-20"
              />
              <div className="absolute left-3 top-2.5 text-sm text-muted-foreground">
                calmill.com/
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your public booking page URL
            </p>
          </div>

          {/* Email (readonly) */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="text-sm font-medium text-foreground mb-2 block">
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell visitors a bit about yourself..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.bio.length}/500 characters
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            {hasUnsavedChanges && (
              <p className="text-sm text-muted-foreground">
                You have unsaved changes
              </p>
            )}
          </div>
          <Button
            onClick={saveProfile}
            disabled={saving || !hasUnsavedChanges}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}