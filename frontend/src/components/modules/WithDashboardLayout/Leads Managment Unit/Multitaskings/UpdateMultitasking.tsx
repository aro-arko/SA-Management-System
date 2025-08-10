/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { toast } from "sonner";

import { useUser } from "@/context/UserContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { updateLmuMultitasking } from "@/services/LMUService/multitaskings";
import { TaskDetails } from "@/services/UserService";

type TUpdateLMUMultitasking = {
  title: string;
  type: "whatsapp" | "calling" | "email" | "data-entry" | "others";
  status: "active" | "inactive";
};

type TMultitasking = {
  _id: string;
  title: string;
  type: TUpdateLMUMultitasking["type"];
  status: TUpdateLMUMultitasking["status"];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
};

const UpdateMultitasking = () => {
  const { id } = useParams();
  const { user } = useUser();
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TUpdateLMUMultitasking["type"]>("whatsapp");
  const [status, setStatus] =
    useState<TUpdateLMUMultitasking["status"]>("active");

  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  // role-based type options (admin: all; data leader: only data-entry)
  const typeOptions: TUpdateLMUMultitasking["type"][] = useMemo(() => {
    if (user?.role === "lmuAdmin") {
      return ["whatsapp", "calling", "email", "data-entry", "others"];
    }
    if (user?.role === "lmuDataLeader") {
      return ["data-entry"];
    }
    return []; // other roles: nothing available
  }, [user?.role]);

  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-white text-black";

  const fieldCls = clsx(
    "w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
    isDark
      ? "bg-black text-white border-neutral-700"
      : "bg-white border-gray-300"
  );

  // fetch existing multitasking
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await TaskDetails(String(id)); // used for multitasking details in your app
        if (!res?.success || !res?.data) {
          toast.error(res?.message || "Failed to load multitasking.");
          return;
        }
        const mt = res.data as TMultitasking;
        if (cancelled) return;

        setTitle(mt.title || "");
        setStatus((mt.status as any) || "active");

        // if user has restricted options, clamp the type to the first allowed
        if (typeOptions.length === 1 && typeOptions[0] === "data-entry") {
          setType("data-entry");
        } else {
          setType((mt.type as any) || "whatsapp");
        }
      } catch (e: any) {
        toast.error(e?.message || "Failed to load multitasking.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, typeOptions]);

  const onSubmit = async () => {
    if (!title.trim()) return toast.warning("Title is required.");
    if (!typeOptions.length) {
      return toast.warning("You don't have permission to update the type.");
    }

    const payload: TUpdateLMUMultitasking = {
      title: title.trim(),
      type,
      status,
    };

    try {
      setSaving(true);
      const res = await updateLmuMultitasking(String(id), payload);
      if (res?.success) {
        toast.success(res?.message || "Multitasking updated.");
      } else {
        toast.error(res?.message || "Failed to update multitasking.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong while updating.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <div className="max-w-full mx-auto space-y-10">
          <div className="text-center space-y-3">
            <Skeleton
              className={`mx-auto h-10 w-3/4 sm:w-1/2 rounded-md ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
              }`}
            />
            <Skeleton
              className={`mx-auto h-6 w-24 rounded-full ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
              }`}
            />
          </div>

          <div
            className={`rounded-xl p-6 ${
              isDark
                ? "bg-black/10 border-neutral-700"
                : "bg-neutral-50 border-neutral-200"
            }`}
          >
            <div className="grid gap-4 max-w-xl mx-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`h-10 w-full rounded-md ${
                    isDark ? "bg-[#2a2a2a]" : "bg-gray-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Update Multitasking</h1>
          <p className="mt-3 text-sm opacity-80">
            Modify title, type, and status, then save your changes.
          </p>
        </div>

        {/* Form (keeps the same vibe as your create page) */}
        <div>
          <div className="grid gap-4 max-w-xl mx-auto">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., new testing for lmu multitasking calling 1 update..."
                disabled={saving}
                className={isDark ? "bg-black/40 border-neutral-700" : ""}
              />
            </div>

            {/* Type (role-restricted) */}
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as TUpdateLMUMultitasking["type"])
                }
                disabled={saving || !typeOptions.length}
                className={fieldCls}
              >
                {typeOptions.length ? (
                  typeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))
                ) : (
                  <option value="">No types available</option>
                )}
              </select>
              <p className="text-xs opacity-70">
                {user?.role === "lmuAdmin"
                  ? "Admins can set WhatsApp, Calling, Email, Data-entry, or Others."
                  : user?.role === "lmuDataLeader"
                  ? "Data leaders can only set Data-entry."
                  : "You may not have permissions to change the type."}
              </p>
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                disabled={saving}
                className={fieldCls}
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={onSubmit}
                disabled={saving || !typeOptions.length}
                className={clsx(
                  "rounded-md",
                  isDark
                    ? "bg-white/10 hover:bg-white/20"
                    : "bg-neutral-900 hover:bg-neutral-800 text-white"
                )}
              >
                {saving ? "Saving…" : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // quick reload current values
                  setLoading(true);
                  TaskDetails(String(id))
                    .then((res) => {
                      if (res?.success && res?.data) {
                        const mt = res.data as TMultitasking;
                        setTitle(mt.title || "");
                        setStatus((mt.status as any) || "active");
                        if (
                          typeOptions.length === 1 &&
                          typeOptions[0] === "data-entry"
                        ) {
                          setType("data-entry");
                        } else {
                          setType((mt.type as any) || "whatsapp");
                        }
                      }
                    })
                    .finally(() => setLoading(false));
                }}
                disabled={saving}
                className={isDark ? "border-neutral-700 text-neutral-300" : ""}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateMultitasking;
