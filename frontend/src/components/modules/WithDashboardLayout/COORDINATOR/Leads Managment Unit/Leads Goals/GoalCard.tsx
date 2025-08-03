"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TLmuGoal } from "@/types/lmu/goal.type";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import clsx from "clsx";
import {
  CheckCircle,
  Clock,
  Puzzle,
  User2,
  BarChart,
  CalendarDays,
  CircleDot,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getUserNameById } from "@/services/UserService";

export default function GoalCard({ goal }: { goal: TLmuGoal }) {
  const [creatorName, setCreatorName] = useState("Loading...");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = await getUserNameById(goal.createdBy);
        setCreatorName(user.data.name || "Unknown");
        console.log(user);
      } catch {
        setCreatorName(
          goal.createdBy.slice(0, 6) + "..." + goal.createdBy.slice(-4)
        );
      }
    };
    fetchUserName();
  }, [goal.createdBy]);

  const statusColor = goal.isActive ? "text-green-600" : "text-red-500";
  const statusIcon = goal.isActive ? (
    <CircleDot className="text-green-600 w-5 h-5" />
  ) : (
    <CircleDot className="text-red-500 w-5 h-5" />
  );

  const typeColorVariant = {
    whatsapp: "bg-green-50 text-green-700",
    call: "bg-blue-50 text-blue-700",
    email: "bg-purple-50 text-purple-700",
    default: "bg-gray-100 text-gray-800",
  };

  const badgeStyle =
    typeColorVariant[goal.type as keyof typeof typeColorVariant] ||
    typeColorVariant.default;

  return (
    <Card className="w-full max-w-full mx-auto rounded-xl border bg-white dark:bg-[#0f0f0f] shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-start gap-2">
          <div className="text-lg font-semibold leading-snug">{goal.title}</div>
          <Badge
            className={clsx(
              "capitalize text-xs font-medium px-2 py-0.5",
              badgeStyle
            )}
          >
            {goal.type}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm text-muted-foreground">
        <InfoRow
          icon={<CheckCircle className="text-green-600 w-5 h-5" />}
          label="Completed"
          value={goal.completed}
        />
        <InfoRow
          icon={<Clock className="text-yellow-500 w-5 h-5" />}
          label="Remaining"
          value={goal.remaining}
        />
        <InfoRow
          icon={<BarChart className="text-blue-500 w-5 h-5" />}
          label="Total"
          value={goal.total}
        />
        <InfoRow
          icon={<Puzzle className="text-purple-500 w-5 h-5" />}
          label="Tasks Linked"
          value={goal.tasks.length}
        />
        <InfoRow
          icon={statusIcon}
          label="Status"
          value={
            <span className={statusColor}>
              {goal.isActive ? "Active" : "Inactive"}
            </span>
          }
        />
        <InfoRow
          icon={<User2 className="text-gray-600 w-5 h-5" />}
          label="Created By"
          value={creatorName}
        />
        <InfoRow
          icon={<CalendarDays className="text-gray-600 w-5 h-5" />}
          label="Created At"
          value={formatToMalaysiaTime(goal.createdAt, "dd MMM yyyy, hh:mm a")}
        />
      </CardContent>
    </Card>
  );
}

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
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}
