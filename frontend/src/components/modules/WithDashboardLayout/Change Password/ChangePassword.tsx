"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { changePassword } from "@/services/AuthService";

const ChangePassword = () => {
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-white text-black";

  const focusRing = "focus:outline-none focus:ring-2 focus:ring-blue-500";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // client-side guards
    if (!oldPassword || !newPassword) {
      toast.error("Please fill in both passwords.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNew) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    if (newPassword === oldPassword) {
      toast.error("New password must be different from the old password.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await changePassword({
        oldPassword,
        newPassword,
      });

      if (res?.success) {
        toast.success("Password changed successfully.");
        // Clear fields
        setOldPassword("");
        setNewPassword("");
        setConfirmNew("");
      } else {
        // If server returns { success: false } but 200 OK
        toast.error(res?.message || "Failed to change password.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.message || "Failed to change password.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black px-6 py-10">
        <Skeleton className="h-10 w-3/4 mx-auto rounded-md mb-6" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 py-10 sm:px-10 ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Change Password</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Keep your account secure by using a strong, unique password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`rounded-xl p-6 border shadow-xl transition-all duration-300 backdrop-blur-lg ${
            isDark
              ? "bg-black/20 border-neutral-700"
              : "bg-white/80 border-neutral-200"
          }`}
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Old Password */}
            <div>
              <Label className="mb-2">Old Password</Label>
              <div className="relative mt-1">
                <Input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={`${focusRing} pr-10`}
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOld((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10"
                  aria-label={showOld ? "Hide password" : "Show password"}
                >
                  {showOld ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <Label className="mb-2">New Password</Label>
              <div className="relative mt-1">
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`${focusRing} pr-10`}
                  placeholder="At least 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg.black/10 dark:hover:bg-white/10"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <Label className="mb-2">Confirm New Password</Label>
              <div className="relative mt-1">
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={confirmNew}
                  onChange={(e) => setConfirmNew(e.target.value)}
                  className={`${focusRing} pr-10`}
                  placeholder="Re-enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Hint */}
          <p className="text-xs text-muted-foreground mt-4">
            Tip: Use a mix of letters, numbers, and symbols. Don’t reuse
            passwords.
          </p>

          <Button
            type="submit"
            className="w-full mt-6  text-md"
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
