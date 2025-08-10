"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User2,
  BarChart,
  CircleDot,
  Calendar,
  Building2,
  School,
} from "lucide-react";
import clsx from "clsx";
import { formatToMalaysiaTime } from "@/utils/formatDate";

type DataEntryTaskCardProps = {
  task: {
    _id: string;
    schoolName: string;
    schoolLevel: string;
    assigneeName: string;
    schoolTeamTotalLeads: number;
    totalLeads: number;
    status: "in-progress" | "in-checking" | "completed";
    dueDate: string;
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
    schoolName,
    schoolLevel,
    assigneeName,
    schoolTeamTotalLeads,
    totalLeads,
    status,
    dueDate,
  } = task;

  return (
    <Card className="w-full border rounded-lg bg-white/80 dark:bg-black/30 shadow-sm hover:shadow-md transition-shadow mb-2">
      <CardContent className="px-4 text-[15px] text-muted-foreground">
        {/* Top Row - Other Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-3">
          <InfoRow
            icon={<User2 className="w-5 h-5 text-blue-500" />}
            label="Assigned"
            value={assigneeName}
          />
          <InfoRow
            icon={<School className="w-5 h-5 text-purple-500" />}
            label="Level"
            value={
              <Badge className="capitalize text-xs px-2 py-0.5 bg-gray-100 text-black dark:bg-gray-800 dark:text-white">
                {schoolLevel}
              </Badge>
            }
          />
          <InfoRow
            icon={<BarChart className="w-5 h-5 text-gray-600" />}
            label="Leads"
            value={`${schoolTeamTotalLeads} / ${totalLeads}`}
          />
          <InfoRow
            icon={<Calendar className="w-5 h-5 text-rose-500" />}
            label="Due Date"
            value={formatToMalaysiaTime(dueDate, "dd MMM yyyy")}
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

        {/* Bottom Row - School Name Full Width */}
        <div className="mt-3">
          <InfoRow
            icon={<Building2 className="w-5 h-5 text-emerald-600" />}
            label="School"
            value={
              <span className="block font-medium text-foreground text-base break-words">
                {schoolName}
              </span>
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
