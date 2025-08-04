"use client";

import { useTheme } from "next-themes";
import clsx from "clsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  CircleDot,
  ClipboardList,
  ListChecks,
  ListPlus,
  User2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getUserNameById } from "@/services/UserService";
import { TLMUDataBatch } from "@/types/lmu/databatch.type";

export default function DataBatchCard({ batch }: { batch: TLMUDataBatch }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [creatorName, setCreatorName] = useState("Loading...");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const res = await getUserNameById(batch.createdBy);
        setCreatorName(res?.data?.name || "Unknown");
      } catch {
        const shortId =
          batch.createdBy.slice(0, 6) + "..." + batch.createdBy.slice(-4);
        setCreatorName(shortId);
      }
    };
    fetchName();
  }, [batch.createdBy]);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const badgeStyle =
    batch.type === "data-entry"
      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
      : "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300";

  const statusIcon = batch.isActive ? (
    <CircleDot className="text-green-600 w-4 h-4" />
  ) : (
    <CircleDot className="text-red-500 w-4 h-4" />
  );

  const statusText = batch.isActive ? "Active" : "Inactive";

  return (
    <Card
      className={clsx(
        "w-full rounded-xl border transition-shadow hover:shadow-md",
        isDark
          ? "bg-black/30 border-neutral-700 text-white"
          : "bg-white/80 border-neutral-200 text-black"
      )}
    >
      <CardHeader className="px-4">
        <CardTitle className="flex justify-between items-center text-base font-semibold">
          <span className="truncate">{batch.title}</span>
          <Badge className={clsx("capitalize text-xs px-2 py-0.5", badgeStyle)}>
            {batch.type}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 px-4 text-sm">
        <InfoRow
          icon={<ListPlus className="text-blue-500 w-4 h-4" />}
          label="Assigned Sets"
          value={batch.assignedSets}
        />
        <InfoRow
          icon={<ListChecks className="text-yellow-500 w-4 h-4" />}
          label="Submitted Sets"
          value={batch.submittedSets}
        />
        <InfoRow
          icon={<ClipboardList className="text-green-600 w-4 h-4" />}
          label="Completed Sets"
          value={batch.completedSets}
        />
        <InfoRow
          icon={<BarChart className="text-purple-500 w-4 h-4" />}
          label="Leads"
          value={`${batch.expectedTotalLeads} / ${batch.completedLeads}`}
        />
        <InfoRow icon={statusIcon} label="Status" value={statusText} />
        <InfoRow
          icon={<User2 className="text-gray-500 w-4 h-4" />}
          label="Created By"
          value={creatorName}
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
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
