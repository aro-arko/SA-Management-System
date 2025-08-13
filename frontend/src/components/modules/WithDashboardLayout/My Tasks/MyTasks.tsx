/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/utils/Pagination";
import { getMyTasks } from "@/services/UserService"; // your index:// getMyTasks
import MyTaskCard, { TMyTask } from "./MyTaskCard";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function MyTasks() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TMyTask[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<
    "all" | "in-progress" | "in-checking" | "completed"
  >("all");
  const { user } = useUser();

  useEffect(() => setMounted(true), []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", String(limit));
      if (searchTerm) params.set("search", searchTerm);
      if (status) params.set("status", status);

      const res = await getMyTasks(params.toString());

      if (res?.success && Array.isArray(res.data)) {
        setTasks(
          res.data.map((d: any) => ({
            _id: d._id,
            title: d.title,
            unit: d.unit,
            type: d.type,
            status: d.status,
          }))
        );
      } else {
        setTasks([]);
      }
    } catch (e) {
      console.error("Failed to fetch my tasks:", e);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, searchTerm, status]);

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
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="mt-1 text-sm opacity-80">
            Your assigned tasks across units, neatly organized.
          </p>

          {/* Controls */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Search by task title"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={clsx(
                "w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
                isDark
                  ? "bg-black text-white border-neutral-700"
                  : "bg-white border-gray-300"
              )}
            />

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as any);
                setCurrentPage(1);
              }}
              className={clsx(
                "w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
                isDark
                  ? "bg-black text-white border-neutral-700"
                  : "bg-white border-gray-300"
              )}
            >
              <option value="all">All statuses</option>
              <option value="in-progress">In progress</option>
              <option value="in-checking">In checking</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={clsx(
                "w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
                isDark
                  ? "bg-black text-white border-neutral-700"
                  : "bg-white border-gray-300"
              )}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>
        </header>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={clsx(
                  "w-full border rounded-xl shadow-sm transition-shadow px-4 py-4",
                  isDark
                    ? "bg-black/30 border-neutral-700"
                    : "bg-white/80 border-neutral-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <Skeleton className="h-5 w-28 rounded-md" />
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-center text-muted-foreground">No tasks found.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const t = (task.type || "").toLowerCase();

              let href: string | null = null;

              if (["whatsapp", "email", "calling"].includes(t)) {
                href = `/${user?.role?.toLocaleLowerCase()}/leads-tasks/${
                  task._id
                }`;
              } else if (t === "data-entry") {
                href = `/${user?.role?.toLocaleLowerCase()}/data-entry-tasks/${
                  task._id
                }`;
              } else if (t === "others" && task.unit === "LMU") {
                href = `/${user?.role?.toLocaleLowerCase()}/lmu-others/${
                  task._id
                }`;
              } else if (t === "event") {
                href = `/${user?.role?.toLocaleLowerCase()}/event-tasks/${
                  task._id
                }`;
              } else if (t === "task" && task.unit === "DSMM") {
                href = `/${user?.role?.toLocaleLowerCase()}/dsmm-tasks/${
                  task._id
                }`;
              }

              return href ? (
                <Link
                  key={task._id}
                  href={href}
                  className="block rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <MyTaskCard task={task} />
                </Link>
              ) : (
                <MyTaskCard key={task._id} task={task} />
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}
