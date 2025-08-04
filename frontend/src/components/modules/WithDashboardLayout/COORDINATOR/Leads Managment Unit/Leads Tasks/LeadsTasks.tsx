"use client";

import { useEffect, useState, useCallback } from "react";
import { leadsTasks } from "@/services/LMUService/leadsManagement";
import { Skeleton } from "@/components/ui/skeleton";
import { TLmuTask } from "@/types/lmu/leadsTask.type";
import FilterTasks from "./FilterTasks";
import TaskCard from "./TaskCard";
import { Pagination } from "@/utils/Pagination";

const LeadsTasks = () => {
  const [tasks, setTasks] = useState<TLmuTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  return (
    <div className="space-y-6">
      <FilterTasks
        setFilterQuery={setFilterQuery}
        setCurrentPage={setCurrentPage}
      />

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-muted-foreground text-center">No tasks found.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};

export default LeadsTasks;
