"use client";

import { useEffect, useState } from "react";
import { TLmuGoal } from "@/types/lmu/goal.type";
import { leadsGoals } from "@/services/LMUService/leadsManagement";
import GoalCard from "./GoalCard";
import GoalCardSkeleton from "./GoalCardSkeleton";

const LeadsGoals = () => {
  const [goals, setGoals] = useState<TLmuGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      try {
        const res = await leadsGoals();
        if (res?.success) {
          setGoals(res.data);
        }
        console.log(res);
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  return (
    <div className="">
      {loading
        ? Array.from({ length: 3 }).map((_, i) => <GoalCardSkeleton key={i} />)
        : goals.map((goal) => <GoalCard key={goal._id} goal={goal} />)}
    </div>
  );
};

export default LeadsGoals;
