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
import clsx from "clsx";

const DataEntryTasks = () => {
  const [tasks, setTasks] = useState<TDataEntryTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // NEW: search field
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const query = `page=${currentPage}&limit=10${
        searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
      }`;
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
  }, [currentPage, searchTerm]);

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
      className={clsx(
        "min-h-screen px-4 py-6 transition-colors duration-300 rounded-xl",
        isDark
          ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
          : "bg-white text-black"
      )}
    >
      <div className="space-y-6 max-w-full mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold tracking-tight">
            Data Entry Tasks
          </h1>
          <p className="mt-1">
            Manage data entry assignments for student ambassador records.
          </p>

          <div className="mt-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search by school name or level"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset pagination on new search
              }}
              className={clsx(
                "w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
                isDark
                  ? "bg-black text-white border-neutral-700"
                  : "bg-white border-gray-300"
              )}
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={clsx(
                  "w-full border rounded-lg shadow-sm transition-shadow px-4 py-2",
                  isDark
                    ? "bg-black/30 border-neutral-700"
                    : "bg-white/80 border-neutral-200"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-3 text-[15px]">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={clsx(
                        "w-full border rounded-lg shadow-sm transition-shadow px-4 py-5",
                        isDark
                          ? "bg-black/30 border-neutral-700"
                          : "bg-white/80 border-neutral-200"
                      )}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-4 text-[15px]">
                        {Array.from({ length: 3 }).map((_, j) => (
                          <div
                            key={j}
                            className="flex items-center gap-2 min-w-[160px]"
                          >
                            <Skeleton className="w-6 h-6 rounded-full" />
                            <div className="space-y-1.5">
                              <Skeleton className="h-3 w-16 rounded-md" />
                              <Skeleton className="h-4 w-24 rounded-md" />
                            </div>
                          </div>
                        ))}
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
                  className={clsx(
                    "rounded-xl transition-all cursor-pointer",
                    isDark
                      ? "bg-black/30 backdrop-blur-md border-[#333] text-neutral-100 hover:bg-black/40 hover:border-[#555]"
                      : "bg-white/80 backdrop-blur-md border-neutral-200 text-neutral-900 hover:shadow-sm hover:border-neutral-300"
                  )}
                >
                  <DataEntryTaskCard
                    task={{
                      ...task,
                      assigneeName: task.assigneeName ?? "Unassigned",
                      dueDate:
                        typeof task.dueDate === "string"
                          ? task.dueDate
                          : task.dueDate?.toISOString?.() ?? "",
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
