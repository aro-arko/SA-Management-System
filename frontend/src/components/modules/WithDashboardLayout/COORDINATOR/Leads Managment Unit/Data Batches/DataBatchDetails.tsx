"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ListChecks,
  CircleDot,
  CheckCircle,
  ClipboardList,
  User,
  Calendar,
  BarChart2,
} from "lucide-react";
import Link from "next/link";
import { getDataBatchById } from "@/services/LMUService/dataManagement";
import { getUserNameById } from "@/services/UserService";
import { TLMUDataBatch } from "@/types/lmu/databatch.type";
import { formatToMalaysiaTime } from "@/utils/formatDate";

const DataBatchDetails = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [batch, setBatch] = useState<TLMUDataBatch | null>(null);
  const [creatorName, setCreatorName] = useState("Loading...");

  useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDataBatchById(id as string);
        if (res.success) {
          setBatch(res.data);

          const creator = await getUserNameById(res.data.createdBy);
          setCreatorName(creator?.data?.name || "Unknown");
        }
      } catch (err) {
        console.error("Error fetching data batch details", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-[#ffffff] text-black";

  if (!mounted) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <div className="max-w-full mx-auto space-y-10">
          <div className="text-center space-y-2">
            <Skeleton className="mx-auto h-8 w-64 rounded" />
            <Skeleton className="mx-auto h-5 w-24 rounded" />
          </div>
          <div
            className={`rounded-xl p-6 border shadow-sm ${
              isDark
                ? "bg-black/30 border-neutral-700"
                : "bg-white/80 border-neutral-200"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-4 space-y-2 border shadow-sm ${
                    isDark
                      ? "bg-black/30 border-neutral-700"
                      : "bg-white/80 border-neutral-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <div className="space-y-1 w-full">
                      <Skeleton className="h-3 w-1/3 rounded" />
                      <Skeleton className="h-4 w-2/3 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-10 text-red-500 text-lg">
        Data batch not found.
      </div>
    );
  }

  const infoCards = [
    {
      label: "Type",
      value: batch.type || "N/A",
      icon: <ListChecks className="w-5 h-5 text-green-400" />,
    },
    {
      label: "Assigned Sets",
      value: batch.assignedSets ?? "N/A",
      icon: <ClipboardList className="w-5 h-5 text-blue-500" />,
    },
    {
      label: "Submitted Sets",
      value: batch.submittedSets ?? "N/A",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    {
      label: "Completed Sets",
      value: batch.completedSets ?? "N/A",
      icon: <BarChart2 className="w-5 h-5 text-indigo-500" />,
    },
    {
      label: "Expected Leads",
      value: batch.expectedTotalLeads ?? "N/A",
      icon: <BarChart2 className="w-5 h-5 text-purple-500" />,
    },
    {
      label: "Completed Leads",
      value: batch.completedLeads ?? "N/A",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    {
      label: "Status",
      value: batch.isActive ? "Active" : "Inactive",
      icon: (
        <CircleDot
          className={`w-5 h-5 ${
            batch.isActive ? "text-green-600" : "text-red-500"
          }`}
        />
      ),
    },
    {
      label: "Created By",
      value: creatorName,
      icon: <User className="w-5 h-5 text-sky-500" />,
    },
    {
      label: "Created At",
      value: formatToMalaysiaTime(batch.createdAt),
      icon: <Calendar className="w-5 h-5 text-rose-400" />,
    },
  ];

  return (
    <div className={`min-h-screen rounded-xl px-6 py-10 ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{batch.title}</h1>
          <p className="mt-4 text-muted-foreground">
            <span className="px-3 py-1 rounded-full text-sm font-mono bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300 border border-green-200 dark:border-green-700">
              {batch.type}
            </span>
          </p>
        </div>

        {/* Info Cards */}
        <div
          className={`rounded-xl p-6 border shadow-sm ${
            isDark
              ? "bg-black/30 border-neutral-700"
              : "bg-white/80 border-neutral-200"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {infoCards.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg p-4 shadow-sm flex items-start gap-4 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700"
              >
                <div className="mt-1">{item.icon}</div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-[15px] break-all">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linked Tasks Section */}
        {batch.tasks?.length > 0 && (
          <div
            className={`rounded-xl p-6 border shadow-sm ${
              isDark
                ? "bg-black/30 border-neutral-700"
                : "bg-white/80 border-neutral-200"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Linked Task IDs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {batch.tasks.map((taskId: string, idx: number) => (
                <div
                  key={idx}
                  className="rounded-lg p-4 shadow-sm flex items-start gap-4 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700"
                >
                  <ClipboardList className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Task ID</p>
                    <p className="font-medium text-[15px] break-all">
                      <Link href={`/coordinator/data-entry-tasks/${taskId}`}>
                        {taskId}
                      </Link>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataBatchDetails;
