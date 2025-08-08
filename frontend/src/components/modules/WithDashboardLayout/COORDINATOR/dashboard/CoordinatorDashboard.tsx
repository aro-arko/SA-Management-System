"use client";

import { useEffect, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import LeadsGoals from "../Leads Managment Unit/Leads Goals/LeadsGoals";
import DataBatches from "../Leads Managment Unit/Data Batches/DataBatches";
import AllUsers from "../Users/AllUsers";
import { useUser } from "@/context/UserContext";
import LeadsGoalsForDashboard from "./LeadsGoalsForDashboard";
import DataBatchesForDashboard from "./DataBatchesForDashboard";
import AllUsersForDashboard from "./AllUsersForDashboard";

const CoordinatorDashboard = () => {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-white text-black";

  const displayName = useMemo(() => {
    if (!user) return "Welcome";
    const roleCap =
      user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "User";
    return `Welcome, ${roleCap}`;
  }, [user]);

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-black" />;

  return (
    <div className={`min-h-screen px-4 py-8 sm:px-8 ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {displayName}
          </h1>
          <p className="text-sm text-muted-foreground">Coordinator Dashboard</p>
        </div>

        {/* Top row: two cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`rounded-xl p-4 border shadow-sm backdrop-blur ${
              isDark
                ? "bg-black/10 border-neutral-700"
                : "bg-white/80 border-neutral-200"
            }`}
          >
            <h2 className="text-lg font-semibold mb-3">Leads Goals</h2>
            <div className="-mx-1">
              <LeadsGoalsForDashboard />
            </div>
          </div>

          <div
            className={`rounded-xl p-4 border shadow-sm backdrop-blur ${
              isDark
                ? "bg-black/10 border-neutral-700"
                : "bg-white/80 border-neutral-200"
            }`}
          >
            <h2 className="text-lg font-semibold mb-3">Data Batches</h2>
            <div className="-mx-1">
              <DataBatchesForDashboard />
            </div>
          </div>
        </div>

        {/* Full-width All Users */}
        <div
          className={`rounded-xl p-4 border shadow-sm backdrop-blur ${
            isDark
              ? "bg-black/10 border-neutral-700"
              : "bg-white/80 border-neutral-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-3">All Users</h2>
          <AllUsersForDashboard />
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
