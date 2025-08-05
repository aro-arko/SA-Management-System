"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskDetails, getUserNameById } from "@/services/UserService";
import {
  Hash,
  Tags,
  CircleDot,
  Calendar,
  History,
  User2,
  Users,
  Info,
  Layers,
} from "lucide-react";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import { TLMUOthersTask } from "@/types/lmu/others.type";

const LmuOthersTaskDetails = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<TLMUOthersTask | null>(null);
  const [createdByName, setCreatedByName] = useState("");
  const [assignedNames, setAssignedNames] = useState<string[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      const res = await TaskDetails(id as string);
      if (res?.success) {
        setTask(res.data);

        const createdBy = await getUserNameById(res.data.createdBy);
        setCreatedByName(createdBy?.data?.name || "Unknown");

        const assignedNames = await Promise.all(
          res.data.assignedTo.map(async (userId: string) => {
            const r = await getUserNameById(userId);
            return r?.data?.name || "Unknown";
          })
        );
        setAssignedNames(assignedNames);
      }
      setLoading(false);
    };
    fetchTask();
  }, [id]);

  const isDark = resolvedTheme === "dark";
  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-white text-black";

  if (!mounted) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <div className="space-y-6 max-w-full mx-auto">
          <Skeleton className="h-10 w-2/3 mx-auto rounded-md" />
          <Skeleton className="h-6 w-28 mx-auto rounded-full" />

          <div
            className={`rounded-xl p-6 border ${
              isDark
                ? "bg-black/10 border-neutral-700"
                : "bg-neutral-50 border-neutral-200"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 shadow-sm flex items-start gap-4 border ${
                    isDark
                      ? "bg-black/30 border-neutral-700"
                      : "bg-white/80 border-neutral-200"
                  }`}
                >
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
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

  const infoCards = [
    {
      label: "Title",
      value: task.title,
      icon: <Hash className="w-5 h-5 text-blue-400" />,
    },
    {
      label: "Type",
      value: task.type,
      icon: <Tags className="w-5 h-5 text-indigo-400" />,
    },
    {
      label: "Unit",
      value: task.unit,
      icon: <Layers className="w-5 h-5 text-yellow-500" />,
    },
    {
      label: "Created At",
      value: formatToMalaysiaTime(task.createdAt),
      icon: <Calendar className="w-5 h-5 text-orange-400" />,
    },
    {
      label: "Last Updated",
      value: formatToMalaysiaTime(task.updatedAt),
      icon: <History className="w-5 h-5 text-gray-400" />,
    },
    {
      label: "Created By",
      value: createdByName,
      icon: <User2 className="w-5 h-5 text-cyan-400" />,
    },
    {
      label: "Multitask",
      value: task.multiTask ? "Yes" : "No",
      icon: <CircleDot className="w-5 h-5 text-green-400" />,
    },
    ...(task.details
      ? [
          {
            label: "Details",
            value: task.details,
            icon: <Info className="w-5 h-5 text-purple-400" />,
          },
        ]
      : []),
  ];

  return (
    <div className={`min-h-screen px-6 py-10 rounded-xl ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{task.title}</h1>
          <p className="mt-3">
            <span
              className={`inline-block px-4 py-1 text-sm font-medium rounded-full ${
                task.multiTask
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-neutral-200 text-neutral-800 dark:bg-neutral-800/30 dark:text-neutral-300"
              }`}
            >
              {task.type}
            </span>
          </p>
        </div>

        <div
          className={`rounded-xl p-6 border ${
            isDark
              ? "bg-black/10 border-neutral-700"
              : "bg-neutral-50 border-neutral-200"
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

        {/* Assigned Manpower Section */}
        <div
          className={`rounded-xl p-6 border ${
            isDark
              ? "bg-black/10 border-neutral-700"
              : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">Assigned Members</h2>
          {assignedNames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {assignedNames.map((name, index) => (
                <div
                  key={index}
                  className="rounded-lg p-4 shadow-sm flex items-start gap-4 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700"
                >
                  <Users className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Member</p>
                    <p className="font-medium text-[15px]">{name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No members assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LmuOthersTaskDetails;
