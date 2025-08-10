/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { toast } from "sonner";

import { useUser } from "@/context/UserContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { createLmuMultitasking } from "@/services/LMUService/multitaskings";
import { TCreateLMUMultitasking } from "@/types/lmu/multitasking.type";

const CreateMultitasking = () => {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<TCreateLMUMultitasking["type"]>("whatsapp");

  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  // role-based type options (admin: all; data leader: only data-entry)
  const typeOptions: TCreateLMUMultitasking["type"][] = useMemo(() => {
    if (user?.role === "lmuAdmin") {
      return ["whatsapp", "calling", "email", "data-entry", "others"];
    }
    if (user?.role === "lmuDataLeader") {
      return ["data-entry"];
    }
    return [];
  }, [user?.role]);

  // pick sensible default when role changes
  useEffect(() => {
    if (typeOptions.length) {
      setType(typeOptions[0]);
    } else {
      setType("whatsapp");
    }
  }, [typeOptions]);

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

  const onSubmit = async () => {
    if (!title.trim()) return toast.warning("Title is required.");
    if (!typeOptions.length)
      return toast.warning(
        "You don't have permission to create a multitasking."
      );
    if (!type) return toast.warning("Type is required.");

    const payload: TCreateLMUMultitasking = {
      title: title.trim(),
      type,
    };

    try {
      setSaving(true);
      const res = await createLmuMultitasking(payload);
      if (res?.success) {
        toast.success(res?.message || "Multitasking created.");
        setTitle("");
        setType(typeOptions[0]);
      } else {
        toast.error(res?.message || "Failed to create multitasking.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong while creating.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  return (
    <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Multitasking</h1>
          <p className="mt-3 text-sm opacity-80">
            Start a new multitasking with the correct type.
          </p>
        </div>

        {/* Form Card (same vibe as details page) */}
        <div>
          <div className="grid gap-4 max-w-xl mx-auto">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., WhatsApp Training"
                disabled={saving}
                className={isDark ? "bg-black/40 border-neutral-700" : ""}
              />
            </div>

            {/* Type */}
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as TCreateLMUMultitasking["type"])
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
                  ? "Admins can create WhatsApp, Calling, Email, Data-entry, or Others."
                  : user?.role === "lmuDataLeader"
                  ? "Data leaders can only create Data-entry multitaskings."
                  : "You may not have permissions to create a multitasking."}
              </p>
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
                {saving ? "Creating…" : "Create"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setTitle("");
                  if (typeOptions.length) setType(typeOptions[0]);
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

export default CreateMultitasking;
