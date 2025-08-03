"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
// import {
//   CheckCircle,
//   Clock,
//   Puzzle,
//   User2,
//   BarChart,
//   CalendarDays,
//   CircleDot,
// } from "lucide-react";

export default function GoalCardSkeleton() {
  return (
    <Card className="w-full max-w-full mx-auto mb-4 rounded-xl border bg-white dark:bg-[#0f0f0f] shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-start gap-2">
          <Skeleton className="h-5 w-3/5 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
