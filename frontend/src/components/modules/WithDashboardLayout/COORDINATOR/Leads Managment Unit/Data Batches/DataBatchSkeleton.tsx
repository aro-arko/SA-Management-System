"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";

export default function DataBatchCardSkeleton() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Card
      className={clsx(
        "w-full rounded-xl border transition-shadow hover:shadow-md",
        isDark
          ? "bg-black/30 border-neutral-700"
          : "bg-white/80 border-neutral-200"
      )}
    >
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="flex justify-between items-center text-base font-semibold">
          <Skeleton className="h-5 w-2/3 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4 px-4 pb-4 pt-2 text-sm">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="flex items-center gap-2 min-w-[150px]" key={i}>
            <Skeleton className="w-5 h-5 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
