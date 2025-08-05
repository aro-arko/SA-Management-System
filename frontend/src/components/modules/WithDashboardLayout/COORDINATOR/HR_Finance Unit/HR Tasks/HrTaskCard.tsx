"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Calendar, Tags, Users } from "lucide-react";
import clsx from "clsx";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import { getUserNameById } from "@/services/UserService";
import { THRFinanceTask } from "@/types/hr_finance/task.types";

const HrTaskCard = ({ task }: { task: THRFinanceTask }) => {
  const { title, assignedTo, dueDate, status } = task;

  const [assignedName, setAssignedName] = useState("Loading...");

  useEffect(() => {
    const fetchAssignedUser = async () => {
      if (assignedTo) {
        const res = await getUserNameById(assignedTo);
        setAssignedName(res?.data?.name || "Unknown");
      }
    };

    fetchAssignedUser();
  }, [assignedTo]);

  const statusColor =
    status === "completed" ? "text-green-600" : "text-yellow-500";

  return (
    <Card className="w-full border rounded-lg bg-white/80 dark:bg-black/30 shadow-sm hover:shadow-md transition-shadow mb-2 capitalize">
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-4 px-4 py-2 text-[15px] text-muted-foreground">
        {/* Title */}
        <div className="flex items-center gap-2 overflow-hidden">
          <ClipboardList className="w-5 h-5 text-blue-500 shrink-0" />
          <span className="text-sm text-gray-400 dark:text-gray-400 shrink-0">
            Title
          </span>
          <span className="truncate font-medium text-foreground ml-1">
            {title}
          </span>
        </div>

        {/* Assigned To */}
        <div className="flex items-center gap-2 overflow-hidden">
          <Users className="w-5 h-5 text-purple-500 shrink-0" />
          <span className="text-sm text-gray-400 dark:text-gray-400 shrink-0">
            Assigned
          </span>
          <span className="truncate font-medium text-foreground ml-1">
            {assignedName}
          </span>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-400 dark:text-gray-400 shrink-0">
            Due
          </span>
          <span className="text-sm font-medium text-foreground shrink-0">
            {formatToMalaysiaTime(dueDate as unknown as string)}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 justify-end">
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

export default HrTaskCard;
