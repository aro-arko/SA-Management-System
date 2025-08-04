/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { TaskDetails, getUserNameById } from "@/services/UserService";
import { useParams } from "next/navigation";
import {
  Users,
  User,
  Calendar,
  CheckCircle,
  Info,
  Hash,
  ListChecks,
  Layers,
  Divide,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TLmuTask } from "@/types/lmu/leadsTask.type";
import { useTheme } from "next-themes";

const LeadsTaskDetails = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [task, setTask] = useState<TLmuTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignedToName, setAssignedToName] = useState("");
  const [createdByName, setCreatedByName] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await TaskDetails(id as string);

      if (res?.success) {
        setTask(res.data);
        const [assignedTo, createdBy] = await Promise.all([
          getUserNameById(res.data.assignedTo),
          getUserNameById(res.data.createdBy),
        ]);

        setAssignedToName(assignedTo?.data?.name || "N/A");
        setCreatedByName(createdBy?.data?.name || "N/A");
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const percent = task
    ? Math.round((task.completedLeads / task.totalLeads) * 100)
    : 0;

  const isCompleted = task?.status.toLowerCase() === "completed";

  const infoCards = task
    ? [
        {
          label: "Unit",
          value: task.unit,
          icon: <Layers className="w-5 h-5 text-indigo-400" />,
        },
        {
          label: "Type",
          value: task.type,
          icon: <ListChecks className="w-5 h-5 text-green-400" />,
        },
        {
          label: "Multi-task",
          value: task.multiTask ? "Yes" : "No",
          icon: <Divide className="w-5 h-5 text-pink-400" />,
        },
        {
          label: "Goal ID",
          value: task.goalId,
          icon: <Hash className="w-5 h-5 text-yellow-400" />,
        },
        {
          label: "Created By",
          value: createdByName,
          icon: <User className="w-5 h-5 text-blue-400" />,
        },
        {
          label: "Assigned To",
          value: assignedToName,
          icon: <Users className="w-5 h-5 text-orange-400" />,
        },
        {
          label: "Due Date",
          value: new Date(task.dueDate).toLocaleString(),
          icon: <Calendar className="w-5 h-5 text-rose-400" />,
        },
        {
          label: "Message",
          value: task?.message || "No message provided",
          icon: <Info className="w-5 h-5 text-cyan-400" />,
        },
      ]
    : [];

  const bgClass = !mounted
    ? "bg-transparent"
    : resolvedTheme === "dark"
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-[#ffffff] text-black";

  if (!mounted) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  if (loading) {
    const isDark = resolvedTheme === "dark";

    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Title Skeleton */}
          <div className="text-center space-y-2">
            <Skeleton
              className={`mx-auto h-8 w-64 rounded ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
              }`}
            />
            <Skeleton
              className={`mx-auto h-5 w-24 rounded ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
              }`}
            />
          </div>

          {/* Info Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 space-y-2 border shadow-sm ${
                  isDark
                    ? "bg-black/30 border-neutral-700"
                    : "bg-white/80 border-neutral-200"
                }`}
              >
                <Skeleton
                  className={`h-4 w-1/3 ${
                    isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
                  }`}
                />
                <Skeleton
                  className={`h-5 w-2/3 ${
                    isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Progress Skeleton */}
          <div
            className={`rounded-xl p-6 border space-y-3 shadow-sm ${
              isDark
                ? "bg-black/30 border-neutral-700"
                : "bg-white/80 border-neutral-200"
            }`}
          >
            <Skeleton
              className={`h-5 w-32 ${isDark ? "bg-[#2a2a2a]" : "bg-gray-200"}`}
            />
            <Skeleton
              className={`h-4 w-full rounded-full ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
              }`}
            />
            <Skeleton
              className={`h-4 w-24 ${isDark ? "bg-[#2a2a2a]" : "bg-gray-200"}`}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-10 text-red-500 text-lg">
        Task not found.
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold flex justify-center items-center gap-2">
            {task.title}
          </h1>
          <p className="mt-3">
            <span
              className={`inline-block px-4 py-1 text-sm font-medium rounded-full ${
                isCompleted
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-neutral-200 text-neutral-800 dark:bg-neutral-800/30 dark:text-neutral-300"
              }`}
            >
              {task.status}
            </span>
          </p>
        </div>

        {/* Info Cards */}
        <div
          className={`rounded-xl p-6 border ${
            isCompleted
              ? "bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-800"
              : "bg-neutral-50 border-neutral-200 dark:bg-black/10 dark:border-neutral-700"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {infoCards.map((item, index) => (
              <div
                key={index}
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

        {/* Progress */}
        <div className="rounded-xl p-6 shadow-sm border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold mb-2">Leads Progress</h2>
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 bg-neutral-800 dark:bg-neutral-300 transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-sm mt-1 ">
            {task.completedLeads} of {task.totalLeads} completed ({percent}%)
          </p>
        </div>

        {/* Activities */}
        <div className="rounded-xl p-6 shadow-sm border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 " />
            Activities
          </h2>
          {task.activities.length === 0 ? (
            <p className="text-muted-foreground">No activities yet.</p>
          ) : (
            <div className="space-y-4">
              {task.activities.map((activity, index) => {
                // If activity is a string, render it as a simple list item
                if (typeof activity === "string") {
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4 p-4 border bg-white/80 dark:bg-black/20 border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center gap-2 font-semibold min-w-[140px]">
                        <CheckCircle className="w-5 h-5 text-neutral-400" />
                        Activity #{index + 1}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {activity}
                      </div>
                    </div>
                  );
                }
                // If activity is an object, render its properties
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 p-4 border bg-white/80 dark:bg-black/20 border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-2 font-semibold min-w-[140px] ">
                      <CheckCircle className="w-5 h-5 text-neutral-400" />
                      Activity #{index + 1}
                    </div>
                    <div className="flex items-center gap-6 text-sm ">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {(activity as any).completedLeads} completed
                      </div>
                      <div className="flex items-center gap-1">
                        <Info className="w-4 h-4 text-red-500" />
                        {(activity as any).flaggedLeads} flagged
                      </div>
                    </div>
                    <div className="text-sm truncate max-w-[50%] text-right text-gray-800 dark:text-gray-200">
                      <span className="font-medium">Remarks:</span>{" "}
                      {(activity as any).remarks}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadsTaskDetails;
