"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { TLmuGoal } from "@/types/lmu/goal.type";
import { leadsGoals } from "@/services/LMUService/leadsManagement";
import GoalCardSkeleton from "../Leads Managment Unit/Leads Goals/GoalCardSkeleton";
import GoalCard from "../Leads Managment Unit/Leads Goals/GoalCard";
import { Button } from "@/components/ui/button";

const LeadsGoalsForDashboard = () => {
  const [goal, setGoal] = useState<TLmuGoal | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOneGoal = useCallback(async () => {
    try {
      setLoading(true);
      const res = await leadsGoals(`page=1&limit=1`);
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setGoal(res.data[0]);
      } else {
        setGoal(null);
      }
    } catch (err) {
      console.error("Error fetching goals:", err);
      setGoal(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOneGoal();
  }, [fetchOneGoal]);

  return (
    <div className="w-full">
      {loading ? (
        <GoalCardSkeleton />
      ) : !goal ? (
        <p className="text-sm text-muted-foreground">No goals found.</p>
      ) : (
        <Link href={`/coordinator/leads-goals/${goal._id}`}>
          <GoalCard goal={goal} />
        </Link>
      )}

      <div className="mt-4 flex justify-center">
        <Link href="/coordinator/leads-goals" passHref>
          <Button>View All Goals</Button>
        </Link>
      </div>
    </div>
  );
};

export default LeadsGoalsForDashboard;
