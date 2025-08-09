/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import GoalUpdateSkeleton from "./GoalUpdateSkeleton";
import { updateLeadsGoal } from "@/services/LMUService/leadsManagement";
import { getLeadsGoalById } from "@/services/LMUService/leadsManagement";
import { TUpdateLeadsGoal, TLmuGoal } from "@/types/lmu/goal.type";

const GoalUpdate = () => {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) ?? "";

  // hydration guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  // loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TUpdateLeadsGoal["type"]>("whatsapp");
  const [isActive, setIsActive] = useState<boolean>(true);

  // keep original to allow reset
  const [original, setOriginal] = useState<{
    title: string;
    type: TUpdateLeadsGoal["type"];
    isActive: boolean;
  } | null>(null);

  // styles
  const pageCls = useMemo(
    () =>
      clsx(
        "min-h-screen w-full px-4 py-6 rounded-xl transition-colors duration-300",
        isDark
          ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
          : "bg-white text-black"
      ),
    [isDark]
  );

  const cardCls = useMemo(
    () =>
      clsx(
        "rounded-xl p-6 border space-y-6 shadow-sm",
        isDark
          ? "bg-black/30 backdrop-blur-md border-[#333] text-neutral-100"
          : "bg-white/80 backdrop-blur-md border-neutral-200 text-neutral-900"
      ),
    [isDark]
  );

  const fieldCls = useMemo(
    () =>
      clsx(
        "w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
        isDark
          ? "bg-black text-white border-neutral-700"
          : "bg-white border-gray-300"
      ),
    [isDark]
  );

  const chipCls = (active: boolean) =>
    clsx(
      "px-3 py-1.5 text-sm rounded-full border transition",
      active
        ? isDark
          ? "bg-white/15 border-white/25"
          : "bg-neutral-900 text-white border-neutral-800"
        : isDark
        ? "bg-black/40 border-neutral-700 hover:bg-black/30"
        : "bg-white border-gray-300 hover:bg-gray-50"
    );

  const validate = () => {
    if (!title.trim()) {
      toast.warning("Title is required.");
      return false;
    }
    if (!type) {
      toast.warning("Type is required.");
      return false;
    }
    return true;
  };

  const loadGoal = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getLeadsGoalById(id);
      const ok = res?.success ?? false;
      const data: TLmuGoal | undefined = res?.data;

      if (!ok || !data) {
        toast.error(res?.message || "Failed to load goal.");
      } else {
        setTitle(data.title ?? "");
        setType((data.type as TUpdateLeadsGoal["type"]) ?? "whatsapp");
        setIsActive(Boolean(data.isActive));
        setOriginal({
          title: data.title ?? "",
          type: (data.type as TUpdateLeadsGoal["type"]) ?? "whatsapp",
          isActive: Boolean(data.isActive),
        });
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to load goal.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (mounted) loadGoal();
  }, [mounted, loadGoal]);

  const onSubmit = async () => {
    if (!validate()) return;
    try {
      setSubmitting(true);
      const payload: TUpdateLeadsGoal = {
        title: title.trim(),
        type,
        isActive,
      };
      const res = await updateLeadsGoal(id, payload);
      if (res?.success) {
        toast.success(res?.message || "Goal updated successfully.");
        setOriginal({ title: payload.title, type: payload.type, isActive });
        // Optionally navigate back:
        // router.back();
      } else {
        const msg =
          res?.message ||
          (Array.isArray(res?.errors)
            ? res.errors.map((e: any) => e.message).join(", ")
            : "") ||
          "Failed to update goal.";
        toast.error(msg);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to update goal.");
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    if (!original) return;
    setTitle(original.title);
    setType(original.type);
    setIsActive(original.isActive);
  };

  // Hydration-safe + fetch loading skeletons
  if (!mounted || loading) return <GoalUpdateSkeleton />;

  return (
    <div className={pageCls}>
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Update Leads Goal</h1>
        <p className="mt-1 text-sm opacity-80">
          Edit the goal’s title, type, and activation status.
        </p>
      </motion.div>

      <motion.div
        className="space-y-6 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
      >
        <div className={cardCls} aria-busy={submitting} aria-live="polite">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Testing title for whatsapp to calling"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
              disabled={submitting}
            />
          </div>

          {/* Type */}
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={chipCls(type === "whatsapp")}
                onClick={() => setType("whatsapp")}
                disabled={submitting}
              >
                WhatsApp
              </button>
              <button
                type="button"
                className={chipCls(type === "email")}
                onClick={() => setType("email")}
                disabled={submitting}
              >
                Email
              </button>
              <button
                type="button"
                className={chipCls(type === "calling")}
                onClick={() => setType("calling")}
                disabled={submitting}
              >
                Calling
              </button>
            </div>

            {/* Select fallback for keyboard users */}
            <select
              id="type"
              value={type}
              onChange={(e) =>
                setType(e.target.value as TUpdateLeadsGoal["type"])
              }
              className={clsx(fieldCls, "mt-2")}
              disabled={submitting}
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="calling">Calling</option>
            </select>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="isActive" className="cursor-pointer">
              Active
            </Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={submitting}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={onSubmit}
              disabled={submitting}
              className={clsx(
                "rounded-xl",
                isDark
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-neutral-900 hover:bg-neutral-800 text-white"
              )}
            >
              {submitting ? "Saving…" : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={onReset}
              disabled={submitting || !original}
              className={isDark ? "border-neutral-700 text-neutral-300" : ""}
            >
              Reset
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              disabled={submitting}
              className="opacity-80"
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GoalUpdate;
