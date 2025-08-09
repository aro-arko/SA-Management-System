"use client";

import { useEffect, useState, useCallback } from "react";
import { leadsTasks } from "@/services/LMUService/leadsManagement";
import { Skeleton } from "@/components/ui/skeleton";
import { TLmuTask } from "@/types/lmu/leadsTask.type";
import FilterTasks from "./FilterTasks";
import TaskCard from "./TaskCard";
import { Pagination } from "@/utils/Pagination";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useUser } from "@/context/UserContext";

const LeadsTasks = () => {
  const [tasks, setTasks] = useState<TLmuTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const query = `page=${currentPage}&limit=10${filterQuery}`;
      const res = await leadsTasks(query);

      if (res.success) {
        setTasks(res.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterQuery]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen w-full px-4 py-6 rounded-xl bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`
        min-h-screen w-full px-4 py-6 rounded-xl transition-colors duration-300
        ${
          isDark
            ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
            : "bg-white text-black"
        }
      `}
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Leads Tasks</h1>
        <p className="mt-1">
          Browse and manage all lead tasks assigned to student ambassadors.
        </p>
      </div>
      <div className="space-y-6 max-w-full mx-auto">
        <FilterTasks
          setFilterQuery={setFilterQuery}
          setCurrentPage={setCurrentPage}
        />

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className={`h-40 w-full rounded-xl ${
                  isDark ? "bg-[#2a2a2a]" : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-muted-foreground text-center">No tasks found.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Link
                href={`/${user?.role.toLocaleLowerCase()}/leads-tasks/${
                  task._id
                }`}
                key={task._id}
              >
                <div
                  className={`rounded-xl transition-all cursor-pointer mb-2  ${
                    isDark
                      ? "bg-black/30 backdrop-blur-md border-[#333] text-neutral-100 hover:bg-black/40 hover:border-[#555]"
                      : "bg-white/80 backdrop-blur-md border-neutral-200 text-neutral-900 hover:shadow-sm hover:border-neutral-300"
                  }`}
                >
                  <TaskCard task={task} />
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

export default LeadsTasks;
