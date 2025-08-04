import { useEffect, useState } from "react";
import { TLmuTask } from "@/types/lmu/leadsTask.type";
import { getUserNameById } from "@/services/UserService";
import { formatToMalaysiaTime } from "@/utils/formatDate";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User2, CircleDot, BarChart, Tags } from "lucide-react";
import clsx from "clsx";

const TaskCard = ({ task }: { task: TLmuTask }) => {
  const {
    type,
    dueDate,
    totalLeads,
    remainingLeads,
    assignedTo,
    status,
    createdBy,
  } = task;

  const [creatorName, setCreatorName] = useState("Loading...");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = await getUserNameById(createdBy);
        setCreatorName(user.data.name || "Unknown");
      } catch {
        setCreatorName(createdBy.slice(0, 6) + "..." + createdBy.slice(-4));
      }
    };
    fetchUserName();
  }, [createdBy]);

  const statusColor =
    status === "completed" ? "text-green-600" : "text-yellow-600";
  const statusLabel = status === "completed" ? "Completed" : "In Progress";

  const badgeColors = {
    whatsapp: "bg-green-50 text-green-700",
    call: "bg-blue-50 text-blue-700",
    email: "bg-purple-50 text-purple-700",
    default: "bg-gray-100 text-gray-800",
  };

  const badgeStyle =
    badgeColors[type as keyof typeof badgeColors] || badgeColors.default;

  return (
    <Card className="w-full border rounded-lg bg-white/80 dark:bg-black/30 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-3 px-4 py-2 text-[15px] text-muted-foreground">
        <InfoRow
          icon={<User2 className="w-5 h-5 text-blue-500" />}
          label="Assigned"
          value={
            assignedTo?.firstName
              ? `${assignedTo.firstName} ${assignedTo.lastName}`
              : "Unknown"
          }
        />
        <InfoRow
          icon={<CalendarDays className="w-5 h-5 text-purple-500" />}
          label="Due"
          value={formatToMalaysiaTime(
            dueDate as unknown as string,
            "dd MMM yy"
          )}
        />
        <InfoRow
          icon={<BarChart className="w-5 h-5 text-gray-600" />}
          label="Leads"
          value={`${totalLeads} / ${remainingLeads}`}
        />
        <InfoRow
          icon={<Tags className="w-5 h-5 text-indigo-600" />}
          label="Type"
          value={
            <Badge
              className={clsx("capitalize text-xs px-2 py-0.5", badgeStyle)}
            >
              {type}
            </Badge>
          }
        />
        <InfoRow
          icon={<CircleDot className={clsx("w-5 h-5", statusColor)} />}
          label="Status"
          value={
            <span className={clsx("text-sm", statusColor)}>{statusLabel}</span>
          }
        />
      </CardContent>
    </Card>
  );
};

export default TaskCard;

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 min-w-[150px]">
      <div className="flex items-center gap-1 text-sm text-gray-500">
        {icon}
        {label}
      </div>
      <div className="font-medium text-foreground text-base">{value}</div>
    </div>
  );
}
