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
import {
  getDataBatchById,
  updateDataBatch,
} from "@/services/LMUService/dataManagement";
import { getUserNameById } from "@/services/UserService";
import { TLMUDataBatch, TUpdateDataBatch } from "@/types/lmu/databatch.type";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const DataBatchDetails = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [batch, setBatch] = useState<TLMUDataBatch | null>(null);
  const [creatorName, setCreatorName] = useState("Loading...");
  const { user } = useUser();

  // edit modal state
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [active, setActive] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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

  const canEdit = user?.role === "lmuAdmin" || user?.role === "lmuDataLeader";

  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-[#ffffff] text-black";

  const openEdit = () => {
    if (!batch) return;
    setNewTitle(batch.title || "");
    setActive(Boolean(batch.isActive));
    setOpen(true);
  };

  const saveEdit = async () => {
    if (!batch || !newTitle.trim()) {
      toast.warning("Title is required.");
      return;
    }
    setSaving(true);
    const payload: TUpdateDataBatch = {
      title: newTitle.trim(),
      isActive: active,
    };
    const res = await updateDataBatch(payload, batch._id);
    if (res?.success) {
      toast.success(res?.message || "Data batch updated.");
      setBatch({ ...batch, title: payload.title, isActive: payload.isActive });
      setOpen(false);
    } else {
      toast.error(res?.message || "Failed to update data batch.");
    }
    setSaving(false);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <div className="max-w-full mx-auto space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2 text-center w-full">
              <Skeleton className="mx-auto h-8 w-64 rounded" />
              <Skeleton className="mx-auto h-5 w-24 rounded" />
            </div>
            <div className="w-28" />
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
        {/* Header (centered horizontally at top) */}
        <div className="w-full">
          <div className="mx-auto max-w-3xl flex flex-col items-center gap-3 text-center">
            <h1 className="text-3xl font-bold">{batch.title}</h1>

            <span className="px-3 py-1 rounded-full text-sm font-mono bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300 border border-green-200 dark:border-green-700">
              {batch.type}
            </span>

            {canEdit && (
              <Button
                onClick={openEdit}
                variant="outline"
                className={`${isDark ? "border-neutral-700" : ""} mt-2 px-6`}
              >
                Edit
              </Button>
            )}
          </div>
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

        {/* Linked Tasks */}
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
                      <Link
                        href={`/${user?.role.toLocaleLowerCase()}/data-entry-tasks/${taskId}`}
                      >
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

      {/* Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={isDark ? "bg-neutral-950 text-white" : ""}>
          <DialogHeader>
            <DialogTitle>Edit Data Batch</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="batch-title" className="text-sm">
                Title
              </label>
              <Input
                id="batch-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Updating data batch..."
                disabled={saving}
                className={
                  isDark ? "bg-black/40 border-neutral-700 text-white" : ""
                }
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium">Active</span>
              <Switch
                checked={active}
                onCheckedChange={setActive}
                disabled={saving}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataBatchDetails;
