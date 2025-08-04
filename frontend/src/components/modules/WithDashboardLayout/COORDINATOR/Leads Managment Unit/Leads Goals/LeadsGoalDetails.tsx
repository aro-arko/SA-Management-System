"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { getLeadsGoalById } from "@/services/LMUService/leadsManagement";
import { getUserNameById } from "@/services/UserService";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClipboardList,
  CircleDot,
  CheckCircle,
  Clock,
  BarChart,
  ListChecks,
  User,
  Calendar,
} from "lucide-react";
import { TLmuGoal } from "@/types/lmu/goal.type";

const LeadsGoalDetails = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState<TLmuGoal | null>(null);
  const [creatorName, setCreatorName] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchGoalDetails = async () => {
      try {
        const res = await getLeadsGoalById(id as string);
        if (res.success) {
          setGoal(res.data);
          const creator = await getUserNameById(res.data.createdBy);
          setCreatorName(creator?.data?.name || "N/A");
        }
      } catch (error) {
        console.error("Error fetching goal details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGoalDetails();
  }, [id]);

  const isDark = resolvedTheme === "dark";
  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-white text-black";

  if (!mounted || loading) {
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <Skeleton className="mx-auto h-8 w-64 rounded" />
            <Skeleton className="mx-auto h-5 w-24 rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-lg p-4 space-y-2 border shadow-sm ${
                  isDark
                    ? "bg-black/30 border-neutral-700"
                    : "bg-white/80 border-neutral-200"
                }`}
              >
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="text-center py-10 text-red-500 text-lg">
        Goal not found.
      </div>
    );
  }

  const infoCards = [
    {
      label: "Type",
      value: goal.type,
      icon: <ListChecks className="w-5 h-5 text-green-400" />,
    },
    {
      label: "Completed",
      value: goal.completed,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    {
      label: "Remaining",
      value: goal.remaining,
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
    },
    {
      label: "Total",
      value: goal.total,
      icon: <BarChart className="w-5 h-5 text-blue-500" />,
    },
    {
      label: "Tasks Linked",
      value: goal.tasks.length,
      icon: <ClipboardList className="w-5 h-5 text-purple-500" />,
    },
    {
      label: "Status",
      value: goal.isActive ? "Active" : "Inactive",
      icon: (
        <CircleDot
          className={`w-5 h-5 ${
            goal.isActive ? "text-green-600" : "text-red-500"
          }`}
        />
      ),
    },
    {
      label: "Created By",
      value: creatorName,
      icon: <User className="w-5 h-5 text-blue-400" />,
    },
    {
      label: "Created At",
      value: new Date(goal.createdAt).toLocaleString(),
      icon: <Calendar className="w-5 h-5 text-rose-400" />,
    },
  ];

  return (
    <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold flex justify-center items-center gap-2">
            <ClipboardList className="w-8 h-8 text-neutral-400" />
            {goal.title}
          </h1>
          <p className="mt-2 text-muted-foreground">{goal.type} Goal</p>
        </div>

        <div
          className={`rounded-xl p-6 border shadow-sm ${
            isDark
              ? "bg-black/30 border-neutral-700"
              : "bg-white/80 border-neutral-200"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {infoCards.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg p-4 shadow-sm flex items-start gap-4 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700"
              >
                <div className="mt-1">{item.icon}</div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-[15px]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsGoalDetails;
