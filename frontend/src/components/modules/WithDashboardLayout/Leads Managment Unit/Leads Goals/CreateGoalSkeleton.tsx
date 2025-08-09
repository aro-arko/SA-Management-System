"use client";

import { Skeleton } from "@/components/ui/skeleton";

const line = "h-4 rounded";
const chip = "h-8 w-24 rounded-full";
const btn = "h-10 w-32 rounded-xl";

export default function CreateGoalSkeleton() {
  // NOTE: Do NOT reference theme here — keep neutral to avoid flicker
  return (
    <div className="min-h-screen w-full px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto w-60">
            <Skeleton className="h-8 rounded-xl" />
          </div>
          <div className="mx-auto w-72">
            <Skeleton className={line} />
          </div>
        </div>

        <div className="rounded-xl p-6 border bg-gray-50/70 dark:bg-neutral-900/50 backdrop-blur-md border-neutral-200 dark:border-neutral-800 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Type */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-14 rounded" />
            <div className="flex gap-2">
              <Skeleton className={chip} />
              <Skeleton className={chip} />
              <Skeleton className={chip} />
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Skeleton className={btn} />
            <Skeleton className={btn} />
          </div>
        </div>
      </div>
    </div>
  );
}
