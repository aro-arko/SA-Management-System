"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tags, User2, BarChart, CircleDot } from "lucide-react";
import clsx from "clsx";

type DataEntryTaskCardProps = {
  task: {
    _id: string;
    title: string;
    type: string;
    assigneeName: string;
    schoolTeamTotalLeads: number;
    totalLeads: number;
    status: "in-progress" | "in-checking" | "completed";
  };
};

const statusStyles = {
  "in-progress":
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
  "in-checking":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
};

const DataEntryTaskCard = ({ task }: DataEntryTaskCardProps) => {
  const {
    title,
    type,
    assigneeName,
    schoolTeamTotalLeads,
    totalLeads,
    status,
  } = task;

  return (
    <Card className="w-full bg-white/80 dark:bg-black/30 mb-2">
      <CardContent className="space-y-3 px-4">
        {/* Title at the top */}
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-3 text-[15px] text-muted-foreground">
          <InfoRow
            icon={<Tags className="w-5 h-5 text-indigo-600" />}
            label="Type"
            value={type}
          />
          <InfoRow
            icon={<User2 className="w-5 h-5 text-blue-500" />}
            label="Assigned"
            value={assigneeName}
          />
          <InfoRow
            icon={<BarChart className="w-5 h-5 text-gray-600" />}
            label="Leads"
            value={`${schoolTeamTotalLeads} / ${totalLeads}`}
          />
          <InfoRow
            icon={<CircleDot className="w-5 h-5" />}
            label="Status"
            value={
              <Badge
                className={clsx(
                  "capitalize text-xs px-2 py-0.5",
                  statusStyles[status]
                )}
              >
                {status.replace("-", " ")}
              </Badge>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DataEntryTaskCard;

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
      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        {icon}
        {label}
      </div>
      <div className="font-medium text-foreground text-base">{value}</div>
    </div>
  );
}
