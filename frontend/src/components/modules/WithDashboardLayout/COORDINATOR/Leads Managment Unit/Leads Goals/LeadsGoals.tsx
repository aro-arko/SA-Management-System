"use client";

import { useEffect, useState, useCallback } from "react";
import { TLmuGoal } from "@/types/lmu/goal.type";
import { leadsGoals } from "@/services/LMUService/leadsManagement";
import GoalCard from "./GoalCard";
import GoalCardSkeleton from "./GoalCardSkeleton";
import { Pagination } from "@/utils/Pagination";

const LeadsGoals = () => {
  const [goals, setGoals] = useState<TLmuGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const query = `page=${currentPage}&limit=10`; // Add pagination query
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

  return (
    <div className="space-y-6">
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => <GoalCardSkeleton key={i} />)
      ) : goals.length === 0 ? (
        <p className="text-muted-foreground text-center">No goals found.</p>
      ) : (
        goals.map((goal) => <GoalCard key={goal._id} goal={goal} />)
      )}

      <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};

export default LeadsGoals;
