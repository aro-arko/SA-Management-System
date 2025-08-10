/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Loader2,
} from "lucide-react";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import { TLMUMultitasking } from "@/types/lmu/multitasking.type";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { applyLmuMultitasking } from "@/services/LMUService/multitaskings";

const MultitaskingDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const [task, setTask] = useState<TLMUMultitasking | null>(null);
  const [createdByName, setCreatedByName] = useState<string>("");
  const [manpowerNames, setManpowerNames] = useState<string[]>([]);
  const { user } = useUser();

  useEffect(() => setMounted(true), []);

  const refetchTask = useCallback(async () => {
    setLoading(true);
    try {
      const res = await TaskDetails(id as string);

      if (res?.success) {
        const taskData: TLMUMultitasking = res.data;
        setTask(taskData);

        // createdBy name
        if (taskData.createdBy) {
          const userRes = await getUserNameById(taskData.createdBy);
          setCreatedByName(userRes?.data?.name || "Unknown");
        } else {
          setCreatedByName("");
        }

        // manpower names
        if (Array.isArray(taskData.manpower) && taskData.manpower.length > 0) {
          const names = await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            taskData.manpower.map(async (mp: any) => {
              const r = await getUserNameById(mp.userId);
              return r?.data?.name || "Unknown";
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
    } catch (err) {
      setTask(null);
      setCreatedByName("");
      setManpowerNames([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetchTask();
  }, [refetchTask]);

  const handleApply = async () => {
    if (!id || !task) return;
    setApplying(true);
    try {
      const res = await applyLmuMultitasking(id as string);
      if (res?.success) {
        toast.success(res?.message || "Applied successfully");
        await refetchTask();
      } else {
        toast.error(res?.message || "Failed to apply");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong while applying");
    } finally {
      setApplying(false);
    }
  };

  const bgClass = !mounted
    ? "bg-transparent"
    : resolvedTheme === "dark"
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-white text-black";

  const isDark = resolvedTheme === "dark";

  const isAdminOrDataLeader = (() => {
    const role = user?.role?.toLowerCase?.() || "";
    return role === "lmuadmin" || role === "lmudataleader";
  })();

  if (!mounted) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <div className="max-w-full mx-auto space-y-10">
          {/* Title + Status */}
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

          {/* Info Cards */}
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

          {/* Manpower Section */}
          <div
            className={`rounded-xl p-6 border ${
              isDark
                ? "bg-black/10 border-neutral-700"
                : "bg-neutral-50 border-neutral-200"
            }`}
          >
            <Skeleton
              className={`h-6 w-40 mb-4 rounded-md ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
              }`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
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
      label: "Status",
      value: task.status,
      icon: <CircleDot className="w-5 h-5 text-green-400" />,
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
  ];

  return (
    <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{task.title}</h1>

          {isAdminOrDataLeader ? (
            // Edit button for lmuAdmin / lmuDataLeader
            <Button
              onClick={() =>
                router.push(
                  `/${user?.role.toLocaleLowerCase()}/lmu-multitaskings/${id}/update`
                )
              }
              variant="outline"
              className={`mt-4 px-6 py-2 rounded-md cursor-pointer text-sm font-medium  transition-colors duration-200
                ${
                  isDark
                    ? "bg-yellow-600 hover:bg-yellow-500 text-white"
                    : "bg-yellow-500 hover:bg-yellow-400 text-white"
                }`}
            >
              Edit Now
            </Button>
          ) : task.status === "active" ? (
            // Apply button for other roles when active
            <Button
              onClick={handleApply}
              disabled={applying}
              className={`mt-4 px-6 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors duration-200
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
            // Status pill when not active
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
                  <p className="font-medium text-[15px]">{item.value}</p>
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
          <h2 className="text-lg font-semibold mb-4">Manpower</h2>
          {manpowerNames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {manpowerNames.map((name, index) => (
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
            <p className="text-muted-foreground">No manpower assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultitaskingDetails;
