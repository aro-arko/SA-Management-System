"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ClipboardList, Tags } from "lucide-react";
import clsx from "clsx";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import { TDSMMTask } from "@/types/dsmm/task.type";

const DSMMTaskCard = ({ task }: { task: TDSMMTask }) => {
  const { title, status, taskDate } = task;

  const statusColor =
    status === "completed" ? "text-green-600" : "text-yellow-500";

  return (
    <Card className="w-full border rounded-lg bg-white/80 dark:bg-black/30 shadow-sm hover:shadow-md transition-shadow mb-2">
      <CardContent className="flex flex-wrap sm:flex-nowrap items-center gap-4 px-4 py-2 text-[15px] text-muted-foreground">
        {/* Title - Left */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px] overflow-hidden">
          <ClipboardList className="w-5 h-5 text-blue-500 shrink-0" />
          <span className="text-sm text-gray-400 dark:text-gray-400 shrink-0">
            Title
          </span>
          <span className="truncate font-medium text-foreground ml-1">
            {title}
          </span>
        </div>

        {/* Date - Center */}
        <div className="flex items-center gap-2 justify-center flex-1 min-w-[200px] text-center">
          <Calendar className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-400 dark:text-gray-400">Date</span>
          <span className="text-sm font-medium text-foreground">
            {formatToMalaysiaTime(taskDate as unknown as string)}
          </span>
        </div>

        {/* Status - Right */}
        <div className="flex items-center gap-2 justify-end flex-1 min-w-[200px]">
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
      </CardContent>
    </Card>
  );
};

export default DSMMTaskCard;
