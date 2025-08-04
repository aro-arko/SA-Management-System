"use client";

import { useEffect, useState } from "react";
import { TLmuGoal } from "@/types/lmu/goal.type";
import { getUserNameById } from "@/services/UserService";
import { useTheme } from "next-themes";
import clsx from "clsx";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Puzzle,
  BarChart,
  CircleDot,
  User2,
} from "lucide-react";

export default function GoalCard({ goal }: { goal: TLmuGoal }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [creatorName, setCreatorName] = useState("Loading...");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const res = await getUserNameById(goal.createdBy);
        setCreatorName(res?.data?.name || "Unknown");
      } catch {
        const shortId =
          goal.createdBy.slice(0, 6) + "..." + goal.createdBy.slice(-4);
        setCreatorName(shortId);
      }
    };
    fetchName();
  }, [goal.createdBy]);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const statusColor = goal.isActive ? "text-green-600" : "text-red-500";
  const statusIcon = goal.isActive ? (
    <CircleDot className="text-green-600 w-4 h-4" />
  ) : (
    <CircleDot className="text-red-500 w-4 h-4" />
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
          <span className="truncate">{goal.title}</span>
          <Badge className={clsx("capitalize text-xs px-2 py-0.5", badgeStyle)}>
            {goal.type}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 px-4text-sm">
        <InfoRow
          icon={<CheckCircle className="text-green-600 w-4 h-4" />}
          label="Completed"
          value={goal.completed}
        />
        <InfoRow
          icon={<Clock className="text-yellow-500 w-4 h-4" />}
          label="Remaining"
          value={goal.remaining}
        />
        <InfoRow
          icon={<BarChart className="text-blue-500 w-4 h-4" />}
          label="Total"
          value={goal.total}
        />
        <InfoRow
          icon={<Puzzle className="text-purple-500 w-4 h-4" />}
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
