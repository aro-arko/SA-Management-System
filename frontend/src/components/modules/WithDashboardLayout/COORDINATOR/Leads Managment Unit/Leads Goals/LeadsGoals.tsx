"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { TLmuGoal } from "@/types/lmu/goal.type";
import { leadsGoals } from "@/services/LMUService/leadsManagement";
import GoalCard from "./GoalCard";
import GoalCardSkeleton from "./GoalCardSkeleton";
import { Pagination } from "@/utils/Pagination";
import Link from "next/link";

const LeadsGoals = () => {
  const [goals, setGoals] = useState<TLmuGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const query = `page=${currentPage}&limit=10`;
      const res = await leadsGoals(query);

      if (res.success) {
        setGoals(res.data);
      } else {
        setGoals([]);
      }
    } catch (error) {
      console.error("Error fetching goals", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const containerStyle = !mounted
    ? "bg-transparent"
    : resolvedTheme === "dark"
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-[#ffffff] text-black";

  return (
    <div
      className={`space-y-6 px-4 py-6 min-h-screen rounded-xl ${containerStyle}`}
    >
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold tracking-tight">Leads Goals</h1>
        <p className="mt-1">
          Set, monitor, and evaluate goals assigned to student ambassadors.
        </p>
      </div>

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => <GoalCardSkeleton key={i} />)
      ) : goals.length === 0 ? (
        <p className="text-muted-foreground text-center">No goals found.</p>
      ) : (
        goals.map((goal) => (
          <Link href={`/coordinator/leads-goals/${goal._id}`} key={goal._id}>
            <GoalCard goal={goal} />
          </Link>
        ))
      )}

      <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};

export default LeadsGoals;
