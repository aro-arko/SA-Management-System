"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getAllDataBatches } from "@/services/LMUService/dataManagement";
import { TLMUDataBatch } from "@/types/lmu/databatch.type";
import DataBatchCardSkeleton from "../Leads Managment Unit/Data Batches/DataBatchSkeleton";
import DataBatchCard from "../Leads Managment Unit/Data Batches/DataBatchCard";
import { Button } from "@/components/ui/button";

const DataBatchesForDashboard = () => {
  const [batch, setBatch] = useState<TLMUDataBatch | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOneBatch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllDataBatches(`page=1&limit=1`);
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setBatch(res.data[0]);
      } else {
        setBatch(null);
      }
    } catch (err) {
      console.error("Error fetching data batches:", err);
      setBatch(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOneBatch();
  }, [fetchOneBatch]);

  return (
    <div className="w-full">
      {loading ? (
        <DataBatchCardSkeleton />
      ) : !batch ? (
        <p className="text-sm text-muted-foreground">No data batches found.</p>
      ) : (
        <Link href={`/coordinator/data-batches/${batch._id}`}>
          <DataBatchCard batch={batch} />
        </Link>
      )}

      <div className="mt-4 flex justify-center">
        <Link href="/coordinator/data-batches" passHref>
          <Button>View All Batches</Button>
        </Link>
      </div>
    </div>
  );
};

export default DataBatchesForDashboard;
