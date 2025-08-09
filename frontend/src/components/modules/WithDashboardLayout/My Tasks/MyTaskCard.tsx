"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Building2, Tag, CircleDot } from "lucide-react";
import clsx from "clsx";

type StatusType = "in-progress" | "in-checking" | "completed" | string;

export type TMyTask = {
  _id: string;
  title: string;
  unit: string;
  type: string;
  status: StatusType;
};

const statusStyles: Record<string, string> = {
  "in-progress":
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
  "in-checking":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
};

export default function MyTaskCard({ task }: { task: TMyTask }) {
  const { title, unit, type, status } = task;

  return (
    <Card className="max-w-full border rounded-xl bg-white/80 dark:bg-black/30 shadow-sm hover:shadow-md transition-all">
      <CardContent className="px-4 py-4 text-[15px]">
        {/* One row, each Info takes equal space */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full">
          <Info
            icon={<ClipboardList className="w-5 h-5 text-indigo-500" />}
            label="Title"
            value={
              <span className="font-semibold text-foreground break-words">
                {title}
              </span>
            }
          />
          <Info
            icon={<Building2 className="w-5 h-5 text-emerald-600" />}
            label="Unit"
            value={
              <Badge className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 dark:text-white">
                {unit}
              </Badge>
            }
          />
          <Info
            icon={<Tag className="w-5 h-5 text-purple-500" />}
            label="Type"
            value={
              <Badge className="capitalize text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 dark:text-white">
                {type.replace("-", " ")}
              </Badge>
            }
          />
          <Info
            icon={<CircleDot className="w-5 h-5" />}
            label="Status"
            value={
              <Badge
                className={clsx(
                  "capitalize text-xs px-2 py-0.5",
                  statusStyles[status] ?? "bg-gray-100 dark:bg-gray-800"
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
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {icon}
        {label}
      </div>
      <div className="font-medium text-foreground text-base truncate">
        {value}
      </div>
    </div>
  );
}
