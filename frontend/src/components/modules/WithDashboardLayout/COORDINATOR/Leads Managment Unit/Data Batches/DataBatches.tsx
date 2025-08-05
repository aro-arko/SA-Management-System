"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { Pagination } from "@/utils/Pagination";
import { getAllDataBatches } from "@/services/LMUService/dataManagement";
import { TLMUDataBatch } from "@/types/lmu/databatch.type";
import DataBatchCardSkeleton from "./DataBatchSkeleton";
import DataBatchCard from "./DataBatchCard";
import Link from "next/link";

const DataBatches = () => {
  const [batches, setBatches] = useState<TLMUDataBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    const query = `page=${currentPage}&limit=10`;
    const res = await getAllDataBatches(query);
    if (res.success) {
      setBatches(res.data);
    } else {
      setBatches([]);
    }
    setLoading(false);
  }, [currentPage]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const containerStyle = !mounted
    ? "bg-transparent"
    : resolvedTheme === "dark"
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-[#ffffff] text-black";

  return (
    <div className={`space-y-6 px-4 py-6 min-h-screen ${containerStyle}`}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Data Batches</h1>
        <p className="mt-1">
          View and manage all LMU data batches created for entry and evaluation.
        </p>
      </div>

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <DataBatchCardSkeleton key={i} />
        ))
      ) : batches.length === 0 ? (
        <p className="text-muted-foreground text-center">
          No data batches found.
        </p>
      ) : (
        batches.map((batch) => (
          <Link key={batch._id} href={`/coordinator/data-batches/${batch._id}`}>
            <DataBatchCard batch={batch} />
          </Link>
        ))
      )}

      <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};

export default DataBatches;
