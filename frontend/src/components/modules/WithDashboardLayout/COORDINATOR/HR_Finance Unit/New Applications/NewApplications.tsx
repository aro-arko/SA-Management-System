"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/utils/Pagination";
import NewApplicationCard from "./NewApplicationCard";
import { TNewApplication } from "@/types/hr_finance/newapplication.type";
import { getNewApplications } from "@/services/HR_FinanceService/New Application";

const NewApplications = () => {
  const [applications, setApplications] = useState<TNewApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const query = `page=${currentPage}&limit=10${
        searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
      }`;

      const res = await getNewApplications(query);
      if (res.success) setApplications(res.data);
      else setApplications([]);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
            New Applications
          </h1>
          <p className="mt-1">Manage and review newly submitted applications</p>

          <div className="mt-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search by name, email or ID"
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
        ) : applications.length === 0 ? (
          <p className="text-muted-foreground text-center">
            No applications found.
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <NewApplicationCard key={app._id} application={app} />
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default NewApplications;
