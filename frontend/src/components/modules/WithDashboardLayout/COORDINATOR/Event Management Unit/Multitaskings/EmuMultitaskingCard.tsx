"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Calendar, CircleDot } from "lucide-react";
import clsx from "clsx";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import { TEMUMultitasking } from "@/types/emu/multitasking.type";

const EmuMultitaskingCard = ({ task }: { task: TEMUMultitasking }) => {
  const { title, eventDate, status } = task;

  const statusColor = status === "active" ? "text-green-600" : "text-red-500";

  return (
    <Card className="w-full border rounded-lg bg-white/80 dark:bg-black/30 shadow-sm hover:shadow-md transition-shadow mb-2">
      <CardContent className="grid grid-cols-3 items-center px-4 py-1 text-[15px] text-muted-foreground h-12">
        {/* Title section */}
        <div className="flex items-center gap-2 overflow-hidden mr-8">
          <ClipboardList className="w-5 h-5 text-blue-500 shrink-0" />
          <span className="text-sm text-gray-400 dark:text-gray-400 shrink-0">
            Title
          </span>
          <span className="truncate font-medium text-foreground ml-1">
            {title}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 justify-self-center">
          <Calendar className="w-5 h-5 text-green-500 shrink-0" />
          <span className="text-sm text-gray-400 dark:text-gray-400 shrink-0">
            Date
          </span>
          <span className="text-sm font-medium text-foreground shrink-0">
            {formatToMalaysiaTime(eventDate as unknown as string)}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 justify-self-end">
          <CircleDot className={clsx("w-5 h-5 shrink-0", statusColor)} />
          <span className="text-sm text-gray-400 dark:text-gray-400 shrink-0">
            Status
          </span>
          <span className={clsx("text-sm font-medium shrink-0", statusColor)}>
            {status}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmuMultitaskingCard;
