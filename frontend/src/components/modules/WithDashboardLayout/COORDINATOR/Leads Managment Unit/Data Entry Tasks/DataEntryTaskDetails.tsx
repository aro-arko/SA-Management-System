"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserNameById, TaskDetails } from "@/services/UserService";
import {
  Calendar,
  User2,
  Hash,
  Info,
  School,
  ListChecks,
  Layers,
  GraduationCap,
  BookMarked,
  Bookmark,
  Users,
  FileText,
  MessageCircle,
  History,
  CheckCircle,
} from "lucide-react";
import { TDataEntryTask } from "@/types/lmu/dataentry.type";
import { formatToMalaysiaTime } from "@/utils/formatDate";

const DataEntryTaskDetails = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<TDataEntryTask | null>(null);
  const [assignedName, setAssignedName] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      const res = await TaskDetails(id as string);

      if (res?.success) {
        const taskData = res.data;
        const user = await getUserNameById(taskData.assignedTo);
        setAssignedName(user?.data?.name);
        setTask(taskData);
      }

      setLoading(false);
    };

    fetchTask();
  }, [id]);

  const bgClass = !mounted
    ? "bg-transparent"
    : resolvedTheme === "dark"
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-[#ffffff] text-black";

  const isDark = resolvedTheme === "dark";

  const infoCards = task
    ? [
        {
          label: "Title",
          value: task.title,
          icon: <Hash className="w-5 h-5 text-indigo-400" />,
        },
        {
          label: "Type",
          value: task.type,
          icon: <ListChecks className="w-5 h-5 text-green-400" />,
        },
        {
          label: "Unit",
          value: task.unit,
          icon: <Layers className="w-5 h-5 text-yellow-400" />,
        },
        {
          label: "School",
          value: task.schoolName,
          icon: <School className="w-5 h-5 text-pink-400" />,
        },
        {
          label: "Assigned To",
          value: assignedName,
          icon: <User2 className="w-5 h-5 text-blue-400" />,
        },
        {
          label: "Due Date",
          value: formatToMalaysiaTime(
            task.dueDate as unknown as string,
            "dd MMM yyyy"
          ),
          icon: <Calendar className="w-5 h-5 text-rose-400" />,
        },
        {
          label: "Message",
          value: task.message || "No message provided",
          icon: <Info className="w-5 h-5 text-cyan-400" />,
        },
        {
          label: "Total Leads",
          value: task.totalLeads.toString(),
          icon: <Users className="w-5 h-5 text-purple-400" />,
        },
        {
          label: "School Team Leads",
          value: task.schoolTeamTotalLeads.toString(),
          icon: <Users className="w-5 h-5 text-orange-400" />,
        },
        {
          label: "Missing/Extra Leads",
          value: (task.missingOrExtraLeads ?? 0).toString(),
          icon: <Users className="w-5 h-5 text-red-400" />,
        },
        {
          label: "Highest Qualification",
          value: task.highestQualification,
          icon: <GraduationCap className="w-5 h-5 text-lime-400" />,
        },
        {
          label: "Preferred Program",
          value: task.preferredProgram,
          icon: <BookMarked className="w-5 h-5 text-sky-400" />,
        },
        {
          label: "Preferred Intake",
          value: task.preferredIntake,
          icon: <Bookmark className="w-5 h-5 text-fuchsia-400" />,
        },
        {
          label: "School Level",
          value: task.schoolLevel,
          icon: <School className="w-5 h-5 text-emerald-400" />,
        },
        {
          label: "Created At",
          value: formatToMalaysiaTime(task.createdAt as unknown as string),
          icon: <History className="w-5 h-5 text-gray-400" />,
        },
      ]
    : [];

  const reportCards = task?.report
    ? [
        {
          label: "Completed Leads",
          value: task.report.completedLeads.toString(),
          icon: <CheckCircle className="w-5 h-5 text-green-400" />,
        },
        {
          label: "Flagged Leads",
          value: (task.report.flaggedLeads ?? 0).toString(),
          icon: <Info className="w-5 h-5 text-red-400" />,
        },
        {
          label: "File Link",
          value: (
            <a
              href={task.report.fileLink}
              target="_blank"
              className="text-blue-500 underline"
            >
              Open File
            </a>
          ),
          icon: <FileText className="w-5 h-5 text-indigo-400" />,
        },
        {
          label: "Remarks",
          value: task.report.remarks,
          icon: <MessageCircle className="w-5 h-5 text-orange-400" />,
        },
      ]
    : [];

  if (!mounted) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <div className="max-w-full mx-auto space-y-10">
          {/* Skeleton Title */}
          <div className="text-center space-y-3">
            <Skeleton
              className={`mx-auto h-10 w-3/4 sm:w-1/2 rounded-md ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
              }`}
            />
            <Skeleton
              className={`mx-auto h-6 w-24 rounded-full ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
              }`}
            />
          </div>

          {/* Info Card Skeletons */}
          <div
            className={`rounded-xl p-6 border ${
              isDark
                ? "bg-black/10 border-neutral-700"
                : "bg-neutral-50 border-neutral-200"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 shadow-sm flex items-start gap-4 border ${
                    isDark
                      ? "bg-black/30 border-neutral-700"
                      : "bg-white/80 border-neutral-200"
                  }`}
                >
                  <Skeleton
                    className={`w-6 h-6 rounded-full ${
                      isDark ? "bg-[#2a2a2a]" : "bg-gray-300"
                    }`}
                  />
                  <div className="space-y-2 w-full">
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
                </div>
              ))}
            </div>
          </div>

          {/* Report Section Skeleton */}
          <div
            className={`rounded-xl p-6 border ${
              isDark
                ? "bg-black/10 border-neutral-700"
                : "bg-neutral-50 border-neutral-200"
            }`}
          >
            <Skeleton
              className={`h-6 w-32 mb-4 rounded-md ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
              }`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 shadow-sm flex items-start gap-4 border ${
                    isDark
                      ? "bg-black/30 border-neutral-700"
                      : "bg-white/80 border-neutral-200"
                  }`}
                >
                  <Skeleton
                    className={`w-6 h-6 rounded-full ${
                      isDark ? "bg-[#2a2a2a]" : "bg-gray-300"
                    }`}
                  />
                  <div className="space-y-2 w-full">
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
                </div>
              ))}
            </div>
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
    <div className={`min-h-screen rounded-xl px-6 py-10 ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold flex justify-center items-center gap-2">
            {task.title}
          </h1>
          <p className="mt-3">
            <span
              className={`inline-block px-4 py-1 text-sm font-medium rounded-full ${
                task.status === "completed"
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
            task.status === "completed"
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

        {/* Report Cards */}
        {task.report && (
          <div className="rounded-xl p-6 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold mb-4">Report Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {reportCards.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg p-4 shadow-sm flex items-start gap-4 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700"
                >
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="font-medium text-[15px]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataEntryTaskDetails;
