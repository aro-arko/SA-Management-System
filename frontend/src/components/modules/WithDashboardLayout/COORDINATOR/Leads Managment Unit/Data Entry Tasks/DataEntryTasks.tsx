"use client";

import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/utils/Pagination";
import { useTheme } from "next-themes";
import Link from "next/link";
import { getUserNameById } from "@/services/UserService";
import { getAllDataEntryTasks } from "@/services/LMUService/dataManagement";
import DataEntryTaskCard from "./DataEntryTaskCard";
import { TDataEntryTask } from "@/types/lmu/dataentry.type";

const DataEntryTasks = () => {
  const [tasks, setTasks] = useState<TDataEntryTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const query = `page=${currentPage}&limit=10`;
      const res = await getAllDataEntryTasks(query);
      if (res.success) {
        const enriched = await Promise.all(
          res.data.map(async (task: TDataEntryTask) => {
            let user = null;
            if (typeof task.assignedTo === "string") {
              user = await getUserNameById(task.assignedTo);
            } else if (
              task.assignedTo &&
              typeof task.assignedTo === "object" &&
              "_id" in task.assignedTo
            ) {
              const assignedObj = task.assignedTo as { _id: string };
              user = await getUserNameById(assignedObj._id);
            }
            return {
              ...task,
              assigneeName: user?.data?.name || "Unassigned",
            };
          })
        );
        setTasks(enriched);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Failed fetching data entry tasks", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (!mounted) {
    return (
      <div className="min-h-screen px-4 py-6 bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`min-h-screen px-4 py-6 transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
          : "bg-white text-black"
      }`}
    >
      <div className="space-y-6 max-w-full mx-auto">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-xl w-full border shadow-sm p-4 space-y-4 ${
                  isDark
                    ? "bg-black/30 border-neutral-700"
                    : "bg-white/80 border-neutral-200"
                }`}
              >
                {/* Title skeleton */}
                <Skeleton className="h-5 w-2/3 rounded-md" />

                {/* Info rows */}
                <div className="flex flex-wrap gap-4 mt-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div
                      key={j}
                      className="flex gap-2 items-center min-w-[150px]"
                    >
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-16 rounded" />
                        <Skeleton className="h-4 w-24 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-muted-foreground text-center">No tasks found.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Link
                href={`/coordinator/data-entry-tasks/${task._id}`}
                key={task._id}
              >
                <div
                  className={`rounded-xl transition-all cursor-pointer mb-2 ${
                    isDark
                      ? "bg-black/30 backdrop-blur-md border-[#333] text-neutral-100 hover:bg-black/40 hover:border-[#555]"
                      : "bg-white/80 backdrop-blur-md border-neutral-200 text-neutral-900 shadow-sm hover:shadow-md hover:border-neutral-300"
                  }`}
                >
                  <DataEntryTaskCard
                    task={{
                      ...task,
                      assigneeName: task.assigneeName ?? "Unassigned",
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default DataEntryTasks;
