"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserNameById } from "@/services/UserService";
import {
  Calendar,
  Hash,
  Tags,
  User2,
  History,
  Clock,
  Users,
} from "lucide-react";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import { THRFinanceTask } from "@/types/hr_finance/task.types";
import { getHRFinanceTaskById } from "@/services/HR_FinanceService";

const HrTaskDetails = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<THRFinanceTask | null>(null);
  const [createdByName, setCreatedByName] = useState("");
  const [assignedToName, setAssignedToName] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      const res = await getHRFinanceTaskById(id as string);
      if (res.success) {
        const data = res.data;
        setTask(data);

        const created = await getUserNameById(data.createdBy);
        setCreatedByName(created?.data?.name || "Unknown");

        const assigned = await getUserNameById(data.assignedTo);
        setAssignedToName(assigned?.data?.name || "Unknown");
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

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-black" />;
  if (loading)
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
      icon: <Users className="w-5 h-5 text-purple-400" />,
    },
    {
      label: "Assigned To",
      value: assignedToName,
      icon: <User2 className="w-5 h-5 text-orange-400" />,
    },
    {
      label: "Due Date",
      value: formatToMalaysiaTime(
        task.dueDate as unknown as string,
        "dd MMM yyyy"
      ),
      icon: <Calendar className="w-5 h-5 text-green-400" />,
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
      label: "Updated At",
      value: formatToMalaysiaTime(task.updatedAt as unknown as string),
      icon: <Clock className="w-5 h-5 text-yellow-400" />,
    },
  ];

  return (
    <div className={`min-h-screen px-6 py-10 ${bgClass} rounded-xl`}>
      <div className="max-w-full mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold capitalize">{task.title}</h1>
          <p className="mt-2">
            <span
              className={`inline-block px-4 py-1 text-sm font-medium rounded-full ${
                task.status === "completed"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : task.status === "in-progress"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400"
              }`}
            >
              {task.status}
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
                  <p className="font-medium text-[15px] capitalize">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Details */}
        <div
          className={`rounded-xl p-6 border ${
            isDark
              ? "bg-black/10 border-neutral-700"
              : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">Task Details</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {task.details}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HrTaskDetails;
