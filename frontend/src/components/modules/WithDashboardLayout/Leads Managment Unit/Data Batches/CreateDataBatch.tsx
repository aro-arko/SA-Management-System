"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createDataBatch } from "@/services/LMUService/dataManagement";
import clsx from "clsx";

export default function CreateDataBatch() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const saveBatch = async () => {
    if (!title.trim()) return toast.warning("Title is required.");
    setLoading(true);
    const res = await createDataBatch({ title: title.trim() });
    if (res?.success) {
      toast.success(res.message || "Batch created");
    } else {
      toast.error(res.message || "Failed to create batch");
    }
    if (res?.success) setTitle("");
    setLoading(false);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-10 w-72 rounded-md" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-4 py-10 rounded-xl ${
        isDark
          ? "bg-gradient-to-b from-black to-[#170303] text-white"
          : "bg-white text-black"
      }`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto space-y-4"
      >
        <h1 className="text-3xl font-bold text-center">Create Data Batch</h1>
        <Label>Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Batch Aug Week 2"
          disabled={loading}
        />
        <div className="flex gap-2 pt-2">
          <Button
            onClick={saveBatch}
            variant="outline"
            className={clsx(
              "rounded-md",
              isDark
                ? "bg-white/10 hover:bg-white/20"
                : "bg-neutral-900 hover:bg-neutral-800 text-white"
            )}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setTitle("")}
            disabled={loading}
          >
            Reset
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
