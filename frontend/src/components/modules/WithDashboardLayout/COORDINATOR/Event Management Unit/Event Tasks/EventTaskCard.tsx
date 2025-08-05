"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ClipboardList, Tags } from "lucide-react";
import clsx from "clsx";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import { TFixedTimeEvent } from "@/types/emu/fixedEvent.type";

const EventTaskCard = ({ task }: { task: TFixedTimeEvent }) => {
  const { title, status, eventDate } = task;

  const statusColor =
    status === "completed" ? "text-green-600" : "text-yellow-500";

  return (
    <Card className="w-full border rounded-lg bg-white/80 dark:bg-black/30 shadow-sm hover:shadow-md transition-shadow mb-2">
      <CardContent className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 px-4 py-2 text-[15px] text-muted-foreground">
        {/* Title */}
        <div className="flex items-center gap-2 min-w-[180px] flex-1 overflow-hidden">
          <ClipboardList className="w-5 h-5 text-blue-500 shrink-0" />
          <span className="text-sm text-gray-400 dark:text-gray-400 shrink-0">
            Title
          </span>
          <span className="truncate font-medium text-foreground ml-1">
            {title}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <Tags className={clsx("w-5 h-5 shrink-0", statusColor)} />
          <span className="text-sm text-gray-400 dark:text-gray-400 shrink-0">
            Status
          </span>
          <span
            className={clsx("text-sm font-medium text-foreground", statusColor)}
          >
            {status === "completed" ? "Completed" : "In Progress"}
          </span>
        </div>

        {/* Event Date */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <Calendar className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-400 dark:text-gray-400 shrink-0">
            Date
          </span>
          <span className="text-sm font-medium text-foreground shrink-0">
            {formatToMalaysiaTime(eventDate as unknown as string)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventTaskCard;
