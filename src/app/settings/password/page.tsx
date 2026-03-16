"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Save } from "lucide-react";

interface PasswordRequirement {
  id: string;
  text: string;
  met: boolean;
}

export default function PasswordSettingsPage() {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Show/hide password states
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Password requirements
  const getPasswordRequirements = (password: string): PasswordRequirement[] => [
    {
      id: "length",
      text: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      id: "uppercase",
      text: "At least one uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      text: "At least one lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      id: "number",
      text: "At least one number",
      met: /\d/.test(password),
    },
  ];

  const passwordRequirements = getPasswordRequirements(formData.newPassword);
  const isNewPasswordValid = passwordRequirements.every(req => req.met);
  const doPasswordsMatch = formData.newPassword === formData.confirmPassword;

  // Save password changes
  const savePassword = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Client-side validation
      if (!formData.currentPassword) {
        throw new Error("Current password is required");
      }
      if (!isNewPasswordValid) {
        throw new Error("New password does not meet requirements");
      }
      if (!doPasswordsMatch) {
        throw new Error("New passwords do not match");
      }

      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
      }

      // Success - clear form and show success message
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccess(true);
      addToast({
        title: "Success",
        description: "Password updated successfully",
      });
    } catch (error) {
      console.error("Error saving password:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save password";
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
    setError(null);
    setSuccess(false);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const canSubmit =
    formData.currentPassword &&
    formData.newPassword &&
    formData.confirmPassword &&
    isNewPasswordValid &&
    doPasswordsMatch;

  return (
    <div className="p-6">
      <div className="space-y-6 max-w-md">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Password</h2>
          <p className="text-muted-foreground">
            Change your password to keep your account secure.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="h-4 w-4 text-destructive mr-2" />
              <div className="text-sm text-destructive">{error}</div>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <div className="text-sm text-green-700">
                Password updated successfully!
              </div>
            </div>
          </div>
        )}

        {/* Password Form */}
        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label htmlFor="current-password" className="text-sm font-medium text-foreground mb-2 block">
              Current Password
            </label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                placeholder="Enter your current password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="new-password" className="text-sm font-medium text-foreground mb-2 block">
              New Password
            </label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                placeholder="Enter your new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password Requirements */}
            {formData.newPassword && (
              <div className="mt-3 space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  Password requirements:
                </div>
                {passwordRequirements.map((requirement) => (
                  <div key={requirement.id} className="flex items-center gap-2">
                    {requirement.met ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500" />
                    )}
                    <div className={`text-xs ${requirement.met ? 'text-green-600' : 'text-red-600'}`}>
                      {requirement.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-password" className="text-sm font-medium text-foreground mb-2 block">
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Confirm your new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="flex items-center gap-2 mt-2">
                {doPasswordsMatch ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <div className="text-xs text-green-600">Passwords match</div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 text-red-500" />
                    <div className="text-xs text-red-600">Passwords do not match</div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-border">
          <Button
            onClick={savePassword}
            disabled={saving || !canSubmit}
            className="w-full"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating Password...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Password
              </>
            )}
          </Button>
        </div>

        {/* Security Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Lock className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <div className="font-medium mb-1">Security Tips:</div>
              <ul className="space-y-1 text-xs">
                <li>• Use a unique password that you don&apos;t use anywhere else</li>
                <li>• Include a mix of letters, numbers, and symbols</li>
                <li>• Avoid common words or personal information</li>
                <li>• Consider using a password manager</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}