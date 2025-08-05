"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, CircleDot, Tags } from "lucide-react";
import clsx from "clsx";
import { TLMUOthersTask } from "@/types/lmu/others.type";

const LmuOthersTaskCard = ({ task }: { task: TLMUOthersTask }) => {
  const {
    title,
    type,
    status = "active",
  } = {
    ...task,
    status: "active", // default since others don't have status field
  };

  const badgeColor = "bg-blue-100 text-blue-800"; // fixed for "Others"
  const statusColor = status === "active" ? "text-green-600" : "text-red-500";

  return (
    <Card className="w-full border rounded-lg bg-white/80 dark:bg-black/30 shadow-sm hover:shadow-md transition-shadow mb-2">
      <CardContent className="grid grid-cols-3 items-center px-4 py-1 text-[15px] text-muted-foreground h-12">
        {/* Title section - left aligned */}
        <div className="flex items-center gap-2 overflow-hidden mr-8">
          <ClipboardList className="w-5 h-5 text-blue-500 shrink-0" />
          <span className="text-sm text-gray-400 dark:text-gray-400 shrink-0">
            Title
          </span>
          <span className="truncate font-medium text-foreground ml-1">
            {title}
          </span>
        </div>

        {/* Type section - center aligned */}
        <div className="flex items-center gap-2 justify-self-center-safe">
          <Tags className="w-5 h-5 text-indigo-500 shrink-0" />
          <span className="text-sm text-gray-400 dark:text-gray-400 shrink-0">
            Type
          </span>
          <Badge
            className={clsx(
              "capitalize text-xs px-2 py-0.5 shrink-0",
              badgeColor
            )}
          >
            {type}
          </Badge>
        </div>

        {/* Status section - right aligned */}
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

export default LmuOthersTaskCard;
