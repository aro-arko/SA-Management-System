"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { Pagination } from "@/utils/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import EventTaskCard from "./EventTaskCard";
import { TFixedTimeEvent } from "@/types/emu/fixedEvent.type";
import { getAllFixedTimeEvents } from "@/services/EMUService/fixedTimeEventManagement";
import { useUser } from "@/context/UserContext";

const EventTasks = () => {
  const [tasks, setTasks] = useState<TFixedTimeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();

  useEffect(() => setMounted(true), []);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const query = `page=${currentPage}&limit=10${
        searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
      }`;

      const res = await getAllFixedTimeEvents(query);
      if (res.success) {
        setTasks(res.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Failed to fetch event tasks", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-black" />;

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`min-h-screen px-4 py-6 transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
          : "bg-white text-black"
      }`}
    >
      <div className="max-w-full mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Event Tasks</h1>
          <p className="mt-1">List of scheduled fixed-time events</p>

          <div className="mt-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search by title"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full px-4 py-2 rounded-md border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? "bg-black text-white border-neutral-700"
                  : "bg-white border-gray-300"
              }`}
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className={`h-28 w-full rounded-xl ${
                  isDark ? "bg-[#2a2a2a]" : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-muted-foreground text-center">No events found.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Link
                href={`/${user?.role.toLocaleLowerCase()}/event-tasks/${
                  task._id
                }`}
                key={task._id}
              >
                <EventTaskCard task={task} />
              </Link>
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default EventTasks;
