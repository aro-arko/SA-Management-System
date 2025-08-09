"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import clsx from "clsx";

const GoalCardSkeleton = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={clsx(
        "w-full rounded-xl border transition-shadow",
        isDark
          ? "bg-black/30 border-neutral-700"
          : "bg-white/80 border-neutral-200"
      )}
    >
      <div className="px-4 pt-3 pb-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-2/3 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 px-4 pb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-1/3 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalCardSkeleton;
