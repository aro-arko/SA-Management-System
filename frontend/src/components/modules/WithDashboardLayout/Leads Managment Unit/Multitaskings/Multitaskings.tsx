"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { Pagination } from "@/utils/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import MultitaskingCard from "./MultitaskingCard";
import { getAllMultitaskings } from "@/services/LMUService/multitaskings";
import { TLMUMultitasking } from "@/types/lmu/multitasking.type";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

const Multitaskings = () => {
  const [tasks, setTasks] = useState<TLMUMultitasking[]>([]);
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

      const res = await getAllMultitaskings(query);
      if (res.success) {
        setTasks(res.data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Failed to fetch multitaskings", err);
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
          <h1 className="text-3xl font-bold tracking-tight">
            Leads Management Unit - Multitaskings
          </h1>
          <p className="mt-1">Browse all multitasking operations</p>

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
          <p className="text-muted-foreground text-center">
            No multitaskings found.
          </p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Link
                href={`/${user?.role.toLocaleLowerCase()}/lmu-multitaskings/${
                  task._id
                }`}
                key={task._id}
              >
                <MultitaskingCard task={task} />
              </Link>
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default Multitaskings;
