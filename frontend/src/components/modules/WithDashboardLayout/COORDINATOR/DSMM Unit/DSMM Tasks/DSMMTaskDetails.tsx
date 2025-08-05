"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Hash,
  Tags,
  Clock,
  History,
  Users,
  User2,
} from "lucide-react";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import { getUserNameById } from "@/services/UserService";
import { TDSMMTask } from "@/types/dsmm/task.type";
import { getDSMMTaskById } from "@/services/DSMMService";
import Link from "next/link";

const DSMMTaskDetails = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<TDSMMTask | null>(null);
  const [createdByName, setCreatedByName] = useState("");
  const [selectedManpowerNames, setSelectedManpowerNames] = useState<string[]>(
    []
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      const res = await getDSMMTaskById(id as string);
      if (res.success) {
        const data = res.data;
        setTask(data);

        const createdUser = await getUserNameById(data.createdBy);
        setCreatedByName(createdUser?.data?.name || "Unknown");

        if (data.selectedManpower?.length) {
          const names = await Promise.all(
            data.selectedManpower.map(async (userId: string) => {
              const user = await getUserNameById(userId);
              return user?.data?.name || "Unknown";
            })
          );
          setSelectedManpowerNames(names);
        }
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

  const infoCards = task
    ? [
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
          label: "Status",
          value: task.status,
          icon: <Tags className="w-5 h-5 text-yellow-400" />,
        },
        {
          label: "Task Date",
          value: formatToMalaysiaTime(task.taskDate as unknown as string),
          icon: <Calendar className="w-5 h-5 text-green-400" />,
        },
        {
          label: "Start Time",
          value: formatToMalaysiaTime(task.startTime as unknown as string),
          icon: <Clock className="w-5 h-5 text-yellow-400" />,
        },
        {
          label: "End Time",
          value: formatToMalaysiaTime(task.endTime as unknown as string),
          icon: <Clock className="w-5 h-5 text-orange-400" />,
        },
        {
          label: "Created By",
          value: createdByName,
          icon: <User2 className="w-5 h-5 text-cyan-400" />,
        },
        {
          label: "Created At",
          value: formatToMalaysiaTime(task.createdAt as unknown as string),
          icon: <History className="w-5 h-5 text-gray-400" />,
        },
        {
          label: "Last Updated",
          value: formatToMalaysiaTime(task.updatedAt as unknown as string),
          icon: <History className="w-5 h-5 text-gray-400" />,
        },
        {
          label: "Multitask",
          value: task.multiTask ? (
            <Link
              href={`/coordinator/dsmm-task/${task.multiTaskId}`}
              className="text-blue-500 hover:underline"
            >
              {`${task.multiTaskId}`}
            </Link>
          ) : (
            "No"
          ),
          icon: <Tags className="w-5 h-5 text-pink-400" />,
        },
        {
          label: "Details",
          value: task.details,
          icon: <Tags className="w-5 h-5 text-rose-400" />,
        },
      ]
    : [];

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-black" />;

  if (loading) {
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <Skeleton className="h-10 w-3/4 mx-auto rounded-md mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
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
    <div className={`min-h-screen px-6 py-10 ${bgClass} rounded-xl`}>
      <div className="max-w-full mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{task.title}</h1>
          <p className="mt-2">
            <span
              className={`inline-block px-4 py-1 text-sm font-medium rounded-full ${
                task.status === "completed"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              {task.status}
            </span>
          </p>
        </div>

        {/* Info Cards */}
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

        {/* Selected Manpower */}
        <div
          className={`rounded-xl p-6 border ${
            isDark
              ? "bg-black/10 border-neutral-700"
              : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" /> Assigned Manpower
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              Total: {selectedManpowerNames.length}
            </span>
          </h2>

          {selectedManpowerNames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedManpowerNames.map((name, idx) => (
                <div
                  key={idx}
                  className="rounded-lg p-4 shadow-sm flex items-start gap-4 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700"
                >
                  <div className="mt-1 text-purple-500 font-bold">
                    {idx + 1}.
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Member</p>
                    <p className="font-medium text-[15px]">{name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No manpower assigned.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DSMMTaskDetails;
