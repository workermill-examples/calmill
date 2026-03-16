"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { AlertTriangle, Trash2, Eye, EyeOff, XCircle } from "lucide-react";

export default function DangerZoneSettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields for account deletion
  const [deleteForm, setDeleteForm] = useState({
    password: "",
    confirmation: "",
  });

  // Handle delete account
  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      setError(null);

      // Client-side validation
      if (!deleteForm.password) {
        throw new Error("Password is required");
      }
      if (deleteForm.confirmation !== "DELETE") {
        throw new Error('You must type "DELETE" to confirm');
      }

      const response = await fetch("/api/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          password: deleteForm.password,
          confirmation: deleteForm.confirmation,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete account");
      }

      // Success - sign out and redirect
      addToast({
        title: "Account Deleted",
        description: "Account deleted successfully",
      });
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete account";
      setError(errorMessage);
      addToast({
        title: "Error",
        description: errorMessage,
        variant: "danger",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Handle form field changes
  const handleInputChange = (field: keyof typeof deleteForm, value: string) => {
    setDeleteForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  // Reset dialog state when closing
  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setDeleteForm({
      password: "",
      confirmation: "",
    });
    setError(null);
    setShowPassword(false);
  };

  const canDelete = deleteForm.password && deleteForm.confirmation === "DELETE";

  return (
    <div className="p-6">
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Danger Zone
          </h2>
          <p className="text-muted-foreground">
            Irreversible and destructive actions for your account.
          </p>
        </div>

        {/* Warning Section */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-orange-800 mb-2">
                Proceed with Caution
              </h3>
              <p className="text-sm text-orange-700 mb-4">
                The actions in this section are permanent and cannot be undone.
                Make sure you understand the consequences before proceeding.
              </p>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• All your data will be permanently deleted</li>
                <li>• Your booking page will become unavailable</li>
                <li>• Active bookings will be cancelled</li>
                <li>• This action cannot be reversed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="border border-red-200 rounded-lg overflow-hidden">
          <div className="bg-red-50 px-6 py-4 border-b border-red-200">
            <h3 className="text-lg font-medium text-red-800 flex items-center">
              <Trash2 className="h-5 w-5 mr-2" />
              Delete Account
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. This will
                permanently delete your account, all your event types, bookings,
                availability settings, and remove all data from our servers.
              </p>

              <div className="bg-red-50 border border-red-200 rounded p-4">
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  What will be deleted:
                </h4>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Your profile and account information</li>
                  <li>• All event types and scheduling settings</li>
                  <li>• Booking history and upcoming bookings</li>
                  <li>• Availability and schedule configurations</li>
                  <li>• Calendar connections and integrations</li>
                  <li>• Webhook configurations</li>
                  <li>
                    • Team memberships (you&apos;ll be removed from teams)
                  </li>
                </ul>
              </div>

              <Button
                variant="danger"
                onClick={() => setShowDeleteDialog(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        {/* Export Data Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-sm text-blue-700">
              <div className="font-medium mb-1">
                Before you delete your account:
              </div>
              <p>
                Consider exporting your data first. You can download your
                booking history and event type configurations from the
                dashboard. Once your account is deleted, this data will no
                longer be available.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Delete Account
                </h3>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                This action cannot be undone. This will permanently delete your
                account
                <strong> {session?.user?.email}</strong> and remove all
                associated data.
              </p>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Password Confirmation */}
                <div>
                  <label
                    htmlFor="delete-password"
                    className="text-sm font-medium text-foreground mb-2 block"
                  >
                    Enter your password to confirm
                  </label>
                  <div className="relative">
                    <Input
                      id="delete-password"
                      type={showPassword ? "text" : "password"}
                      value={deleteForm.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Enter your password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Deletion Confirmation */}
                <div>
                  <label
                    htmlFor="delete-confirmation"
                    className="text-sm font-medium text-foreground mb-2 block"
                  >
                    Type <strong>DELETE</strong> to confirm
                  </label>
                  <Input
                    id="delete-confirmation"
                    type="text"
                    value={deleteForm.confirmation}
                    onChange={(e) =>
                      handleInputChange("confirmation", e.target.value)
                    }
                    placeholder="Type DELETE to confirm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={closeDeleteDialog}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteAccount}
                  disabled={deleting || !canDelete}
                  className="bg-red-600 hover:bg-red-700 min-w-[120px]"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
