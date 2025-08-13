/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Hash,
  Calendar,
  History,
  User2,
  CircleDot,
  Users,
  Loader2,
} from "lucide-react";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import { getUserNameById } from "@/services/UserService";
import {
  getEmuMultitaskingById,
  applyEmuMultitasking,
} from "@/services/EMUService/multitaskings";
import { TEMUMultitasking } from "@/types/emu/multitasking.type";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import clsx from "clsx";

const EmuMultitaskingDetails = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const [task, setTask] = useState<TEMUMultitasking | null>(null);
  const [createdByName, setCreatedByName] = useState("");
  const [manpowerNames, setManpowerNames] = useState<string[]>([]);
  const { user } = useUser();

  useEffect(() => setMounted(true), []);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEmuMultitaskingById(id as string);
      if (res?.success) {
        const data: TEMUMultitasking = res.data;
        setTask(data);

        // created by
        if (data.createdBy) {
          const createdByRes = await getUserNameById(data.createdBy);
          setCreatedByName(createdByRes?.data?.name || "Unknown");
        } else {
          setCreatedByName("");
        }

        // manpower
        if (Array.isArray(data.manpower) && data.manpower.length > 0) {
          const names = await Promise.all(
            data.manpower.map(async (mp: any) => {
              const userRes = await getUserNameById(mp.userId);
              return userRes?.data?.name || "Unknown";
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      const res = await applyEmuMultitasking(id as string);
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
  const isEmuAdmin =
    typeof user?.role === "string" && user.role.toLowerCase() === "emuadmin";

  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-white text-black";

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-black" />;

  if (loading) {
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <div className="max-w-full mx-auto space-y-10">
          <div className="text-center space-y-3">
            <Skeleton className="mx-auto h-10 w-3/4 sm:w-1/2 rounded-md" />
            <Skeleton className="mx-auto h-6 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-xl" />
            ))}
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
      label: "Event Date",
      value: formatToMalaysiaTime(task.eventDate as unknown as string),
      icon: <Calendar className="w-5 h-5 text-green-400" />,
    },
    {
      label: "Start Time",
      value: formatToMalaysiaTime(task.startTime as unknown as string),
      icon: <Calendar className="w-5 h-5 text-yellow-400" />,
    },
    {
      label: "End Time",
      value: formatToMalaysiaTime(task.endTime as unknown as string),
      icon: <Calendar className="w-5 h-5 text-orange-400" />,
    },
    {
      label: "Status",
      value: task.status,
      icon: <CircleDot className="w-5 h-5 text-green-400" />,
    },
    {
      label: "Created At",
      value: formatToMalaysiaTime(task.createdAt as unknown as string),
      icon: <History className="w-5 h-5 text-gray-400" />,
    },
    {
      label: "Created By",
      value: createdByName,
      icon: <User2 className="w-5 h-5 text-cyan-400" />,
    },
  ];

  const statusPillCls = clsx(
    "inline-block px-4 py-1 text-sm font-medium rounded-full mt-2",
    task.status === "active"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : "bg-neutral-200 text-neutral-800 dark:bg-neutral-800/30 dark:text-neutral-300"
  );

  return (
    <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">{task.title}</h1>
          <p className="mt-3">
            <span className={statusPillCls}>{task.status}</span>
          </p>

          {/* Action row: emuAdmin -> Edit, others -> Apply */}
          <div className="mt-4 flex items-center justify-center">
            {isEmuAdmin ? (
              <Link href={`/emuadmin/emu-multitaskings/${id}/update`}>
                <Button
                  className={clsx(
                    "px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                    isDark
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-blue-500 hover:bg-blue-400 text-white"
                  )}
                >
                  Edit
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleApply}
                disabled={applying || task.status !== "active"}
                className={clsx(
                  "px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                  isDark
                    ? "bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/60 text-white"
                    : "bg-blue-500 hover:bg-blue-400 disabled:bg-blue-400/60 text-white"
                )}
                aria-busy={applying}
                title={
                  task.status !== "active"
                    ? "Applications are closed for this multitasking"
                    : undefined
                }
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
            )}
          </div>
        </div>

        {/* Info Section */}
        <div
          className={`rounded-xl p-6 border ${
            isDark
              ? "bg-black/10 border-neutral-700"
              : "bg-neutral-50 border-neutral-200"
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
                  <p className="font-medium capitalize text-[15px]">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manpower Section */}
        <div
          className={`rounded-xl p-6 border ${
            isDark
              ? "bg-black/10 border-neutral-700"
              : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Manpower
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
                  <Users className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Member</p>
                    <p className="font-medium text-[15px]">{name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No manpower assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmuMultitaskingDetails;
