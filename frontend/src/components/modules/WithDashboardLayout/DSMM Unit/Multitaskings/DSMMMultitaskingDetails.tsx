/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
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
  Loader2,
} from "lucide-react";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import { getUserNameById } from "@/services/UserService";
import { TDSMMMultitasking } from "@/types/dsmm/multitasking.type";
import { getDSMMMultitaskingById } from "@/services/DSMMService/multitasking";
import { applyDSMMMultitasking } from "@/services/DSMMService/multitasking";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DSMMMultitaskingDetails = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const { user } = useUser();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const [task, setTask] = useState<TDSMMMultitasking | null>(null);
  const [createdByName, setCreatedByName] = useState("");
  const [manpowerNames, setManpowerNames] = useState<string[]>([]);

  useEffect(() => setMounted(true), []);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDSMMMultitaskingById(id as string);
      if (res.success) {
        const data = res.data as TDSMMMultitasking;
        setTask(data);

        // createdBy (safe)
        if (data.createdBy) {
          const creator = await getUserNameById(data.createdBy);
          setCreatedByName(creator?.data?.name || "Unknown");
        } else {
          setCreatedByName("");
        }

        // manpower names (safe)
        if (Array.isArray(data.manpower) && data.manpower.length > 0) {
          const names = await Promise.all(
            data.manpower.map(async (mp: any) => {
              const u = await getUserNameById(mp.userId);
              return u?.data?.name || "Unknown";
            })
          );
          setManpowerNames(names);
        } else {
          setManpowerNames([]);
        }
      } else {
        setTask(null);
        setCreatedByName("");
        setManpowerNames([]);
      }
    } catch (e) {
      setTask(null);
      setCreatedByName("");
      setManpowerNames([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleApply = async () => {
    if (!id || !task) return;
    setApplying(true);
    try {
      const res = await applyDSMMMultitasking(id as string);
      if (res?.success) {
        toast.success(res?.message || "Applied successfully");
        await refetch();
      } else {
        toast.error(res?.message || "Failed to apply");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong while applying");
    } finally {
      setApplying(false);
    }
  };

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
        Multitasking not found.
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
      label: "Updated At",
      value: formatToMalaysiaTime(task.updatedAt as unknown as string),
      icon: <History className="w-5 h-5 text-gray-400" />,
    },
  ];

  return (
    <div className={`min-h-screen px-6 py-10 rounded-xl ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{task.title}</h1>

          {user?.role !== "coordinator" ? (
            task.status === "active" ? (
              <Button
                onClick={handleApply}
                disabled={applying}
                className={`mt-4 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                  ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/60 text-white"
                      : "bg-blue-500 hover:bg-blue-400 disabled:bg-blue-400/60 text-white"
                  }`}
                aria-busy={applying}
              >
                {applying ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Applying…
                  </span>
                ) : (
                  "Apply"
                )}
              </Button>
            ) : (
              <p className="mt-3 capitalize">
                <span
                  className={`inline-block px-4 py-1 text-sm font-medium rounded-full ${
                    (task.status as string) === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-neutral-200 text-neutral-800 dark:bg-neutral-800/30 dark:text-neutral-300"
                  }`}
                >
                  {task.status}
                </span>
              </p>
            )
          ) : (
            <p className="mt-3">
              <span
                className={`inline-block px-4 py-1 text-sm font-medium rounded-full ${
                  task.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-neutral-200 text-neutral-800 dark:bg-neutral-800/30 dark:text-neutral-300"
                }`}
              >
                {task.status}
              </span>
            </p>
          )}
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
                  <p className="font-medium text-[15px] capitalize">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manpower */}
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
              Total: {manpowerNames.length}
            </span>
          </h2>

          {manpowerNames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {manpowerNames.map((name, idx) => (
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

export default DSMMMultitaskingDetails;
