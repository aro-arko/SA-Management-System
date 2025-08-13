/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import clsx from "clsx";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s.trim());

export default function SignOut() {
  const params = useParams() as {
    taskId?: string | string[];
    attendanceId?: string | string[];
  };
  const router = useRouter();

  const taskId = useMemo(
    () =>
      (Array.isArray(params?.taskId) ? params.taskId[0] : params?.taskId) ?? "",
    [params?.taskId]
  );
  const attendanceId = useMemo(
    () =>
      (Array.isArray(params?.attendanceId)
        ? params.attendanceId[0]
        : params?.attendanceId) ?? "",
    [params?.attendanceId]
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e?: any) => {
    e?.preventDefault();

    if (!taskId || !attendanceId) {
      toast.error("Invalid or missing Sign-Out link.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      toast.warning("Email and password are required.");
      return;
    }
    if (!isEmail(email)) {
      toast.warning("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/signout-data/signout/${taskId}/${attendanceId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          cache: "no-store",
        }
      );

      const json = await res.json().catch(() => ({}));
      if (res.ok && (json?.success ?? true)) {
        toast.success(json?.message || "Signed out successfully.");
        setTimeout(() => router.back(), 600);
      } else {
        toast.error(json?.message || "Failed to sign out.");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to sign out.");
    } finally {
      setSubmitting(false);
    }
  };

  const linkInvalid = !taskId || !attendanceId;

  return (
    <div
      className={clsx(
        "min-h-screen w-full px-4 py-10 flex items-center justify-center transition-colors",
        "bg-white text-black dark:bg-gradient-to-b dark:from-[#000000] dark:to-[#170303] dark:text-white"
      )}
    >
      <div
        className={clsx(
          "w-full max-w-md rounded-xl p-6 border space-y-5",
          "bg-white/80 border-neutral-200 text-neutral-900",
          "dark:bg-black/30 dark:border-[#333] dark:text-neutral-100"
        )}
      >
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold">Event Attendance Sign-Out</h1>
          <p className="text-sm opacity-80">
            Please enter your account credentials to record your attendance.
          </p>
        </div>

        {linkInvalid && (
          <p
            className={clsx(
              "text-xs mb-2 rounded-md border px-3 py-2",
              "bg-yellow-50 text-yellow-800 border-yellow-200",
              "dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800"
            )}
          >
            Warning: This Sign-Out link looks invalid. You can still fill the
            form, but submitting will fail until the link is correct.
          </p>
        )}

        <form className="grid gap-3" onSubmit={handleSubmit}>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="dark:bg-black/40 dark:border-neutral-700"
              disabled={submitting}
              placeholder="you@example.com"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="dark:bg-black/40 dark:border-neutral-700"
              disabled={submitting}
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting || linkInvalid}
            className={clsx(
              "mt-2 rounded-md",
              "bg-neutral-900 hover:bg-neutral-800 text-white",
              "dark:bg-white/10 dark:hover:bg-white/20"
            )}
          >
            {submitting ? "Signing out…" : "Sign Out"}
          </Button>
        </form>
      </div>
    </div>
  );
}
