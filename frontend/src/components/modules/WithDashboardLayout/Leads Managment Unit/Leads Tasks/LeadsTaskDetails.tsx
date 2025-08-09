/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import {
  Users,
  User,
  Calendar,
  CheckCircle,
  Info,
  Hash,
  ListChecks,
  Layers,
  Divide,
  Plus,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useUser } from "@/context/UserContext";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";

import { TaskDetails, getUserNameById } from "@/services/UserService";
import {
  addActivityLeadsTask,
  deleteLeadsTask,
} from "@/services/LMUService/leadsManagement";

import { TLmuTask } from "@/types/lmu/leadsTask.type";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import { toast } from "sonner";

const LeadsTaskDetails = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const { user } = useUser();

  const [mounted, setMounted] = useState(false);
  const [task, setTask] = useState<TLmuTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignedToName, setAssignedToName] = useState("");
  const [createdByName, setCreatedByName] = useState("");

  // Modal state (Add Activity)
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completedLeads, setCompletedLeads] = useState<string>("");
  const [flaggedLeads, setFlaggedLeads] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  // Modal state (Delete confirm)
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await TaskDetails(id as string);

      if (res?.success) {
        setTask(res.data);
        const [assignedTo, createdBy] = await Promise.all([
          getUserNameById(res.data.assignedTo),
          getUserNameById(res.data.createdBy),
        ]);
        setAssignedToName(assignedTo?.data?.name || "N/A");
        setCreatedByName(createdBy?.data?.name || "N/A");
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const percent = task
    ? Math.round((task.completedLeads / task.totalLeads) * 100)
    : 0;

  const isCompleted = (task?.status || "").toLowerCase() === "completed";
  const roleLower = (user?.role || "").toLowerCase();
  console.log(roleLower);
  const isLmuAdmin = roleLower === "lmuadmin";
  const canAddActivity = roleLower !== "coordinator";

  const infoCards = task
    ? [
        {
          label: "Unit",
          value: task.unit,
          icon: <Layers className="w-5 h-5 text-indigo-400" />,
        },
        {
          label: "Type",
          value: task.type,
          icon: <ListChecks className="w-5 h-5 text-green-400" />,
        },
        {
          label: "Multi-task",
          value: task.multiTask ? "Yes" : "No",
          icon: <Divide className="w-5 h-5 text-pink-400" />,
        },
        {
          label: "Goal ID",
          value:
            [
              "coordinator",
              "head",
              "lmuadmin",
              "lmudataleader",
              "lmumember",
            ].includes(roleLower) && task.goalId ? (
              <Link
                href={`/${roleLower}/leads-goals/${task.goalId}`}
                className="text-blue-500 underline hover:text-blue-600"
              >
                {task.goalId}
              </Link>
            ) : (
              task.goalId || "—"
            ),
          icon: <Hash className="w-5 h-5 text-yellow-400" />,
        },
        {
          label: "Created By",
          value: createdByName,
          icon: <User className="w-5 h-5 text-blue-400" />,
        },
        {
          label: "Assigned To",
          value: assignedToName,
          icon: <Users className="w-5 h-5 text-orange-400" />,
        },
        {
          label: "Due Date",
          value: formatToMalaysiaTime(
            task.dueDate as unknown as string,
            "dd MMM yyyy"
          ),
          icon: <Calendar className="w-5 h-5 text-rose-400" />,
        },
        {
          label: "Message",
          value: task?.message || "No message provided",
          icon: <Info className="w-5 h-5 text-cyan-400" />,
        },
      ]
    : [];

  const bgClass = !mounted
    ? "bg-transparent"
    : resolvedTheme === "dark"
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-[#ffffff] text-black";

  if (!mounted) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  if (loading) {
    const isDark = resolvedTheme === "dark";
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <div className="max-w-full mx-auto space-y-10">
          <div className="text-center space-y-2">
            <Skeleton
              className={`mx-auto h-8 w-64 rounded ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
              }`}
            />
            <Skeleton
              className={`mx-auto h-5 w-24 rounded ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 space-y-2 border shadow-sm ${
                  isDark
                    ? "bg-black/30 border-neutral-700"
                    : "bg-white/80 border-neutral-200"
                }`}
              >
                <Skeleton
                  className={`h-4 w-1/3 ${
                    isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
                  }`}
                />
                <Skeleton
                  className={`h-5 w-2/3 ${
                    isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
                  }`}
                />
              </div>
            ))}
          </div>

          <div
            className={`rounded-xl p-6 border space-y-3 shadow-sm ${
              isDark
                ? "bg-black/30 border-neutral-700"
                : "bg-white/80 border-neutral-200"
            }`}
          >
            <Skeleton
              className={`h-5 w-32 ${isDark ? "bg-[#2a2a2a]" : "bg-gray-200"}`}
            />
            <Skeleton
              className={`h-4 w-full rounded-full ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
              }`}
            />
            <Skeleton
              className={`h-4 w-24 ${isDark ? "bg-[#2a2a2a]" : "bg-gray-200"}`}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-10 text-red-500 text-lg">
        Task not found.
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  const onSubmitActivity = async () => {
    const c = Number(completedLeads || 0);
    const f = Number(flaggedLeads || 0);
    const r = remarks.trim();

    if (c < 0 || f < 0) return;
    if (!c && !f && !r) return;
    if (task && c > task.totalLeads - task.completedLeads) {
      toast.warning("Completed leads exceed remaining leads.");
      return;
    }

    const payload = { completedLeads: c, flaggedLeads: f, remarks: r };

    try {
      setSubmitting(true);
      const res = await addActivityLeadsTask(String(id), payload);

      if (res?.success && res?.data) {
        setTask(res.data);
        toast.success("Activity added successfully!");
      } else {
        const fresh = await TaskDetails(String(id));
        if (fresh?.success) setTask(fresh.data);
        toast.error(res?.message || "Failed to add activity.");
      }

      setOpen(false);
      setCompletedLeads("");
      setFlaggedLeads("");
      setRemarks("");
    } catch (e) {
      console.error("Error adding activity:", e);
    } finally {
      setSubmitting(false);
    }
  };
  const onDeleteTask = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone. The task and its activities will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDeleting(true);
          const res = await deleteLeadsTask(String(id));

          if (res?.success) {
            await Swal.fire({
              title: "Deleted!",
              text: res?.message || "Task has been deleted successfully.",
              icon: "success",
              confirmButtonColor: "#3085d6",
            });
            window.history.back();
          } else {
            Swal.fire({
              title: "Failed",
              text: res?.message || "Failed to delete task.",
              icon: "error",
              confirmButtonColor: "#3085d6",
            });
          }
        } catch (e: any) {
          Swal.fire({
            title: "Error",
            text: e?.message || "Failed to delete task.",
            icon: "error",
            confirmButtonColor: "#3085d6",
          });
        } finally {
          setDeleting(false);
          setOpenDelete(false);
        }
      }
    });
  };

  return (
    <div className={`min-h-screen px-6 py-10 ${bgClass} rounded-xl`}>
      <div className="max-w-full mx-auto space-y-10">
        {/* Header */}
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold flex items-center gap-2 justify-center">
            {task.title}
          </h1>
          <span
            className={clsx(
              "inline-block px-4 py-1 mt-2 text-sm font-medium rounded-full",
              isCompleted
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-neutral-200 text-neutral-800 dark:bg-neutral-800/30 dark:text-neutral-300"
            )}
          >
            {task.status}
          </span>

          {/* Admin actions under the centered title */}
          {isLmuAdmin && (
            <div className="flex items-center gap-2 mt-4">
              <Link href={`/${roleLower}/leads-tasks/${id}/update`}>
                <Button
                  className={clsx(
                    "inline-flex items-center gap-2 cursor-pointer py-1 px-6 rounded-md border transition",
                    isDark
                      ? "bg-white/10 hover:bg-white/20 border-neutral-700"
                      : "bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-800"
                  )}
                  aria-label="Edit task"
                >
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setOpenDelete(true)}
                className={clsx(
                  "inline-flex items-center gap-2 rounded-md px-4 cursor-pointer",
                  isDark ? "border-neutral-700" : ""
                )}
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div
          className={clsx(
            "rounded-xl p-6 border",
            isCompleted
              ? "bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-800"
              : "bg-neutral-50 border-neutral-200 dark:bg-black/10 dark:border-neutral-700"
          )}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {infoCards.map((item, index) => (
              <div
                key={index}
                className="rounded-lg p-4 shadow-sm flex items-start gap-4 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700"
              >
                <div className="mt-1">{item.icon}</div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-[15px]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-xl p-6 shadow-sm border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold mb-2">Leads Progress</h2>
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 bg-neutral-800 dark:bg-neutral-300 transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-sm mt-1">
            {task.completedLeads} of {task.totalLeads} completed ({percent}%)
          </p>
        </div>

        {/* Activities */}
        <div className="rounded-xl p-6 shadow-sm border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Activities
            </h2>

            {canAddActivity && (
              <Button
                onClick={() => setOpen(true)}
                className={clsx(
                  "rounded-xl",
                  isDark
                    ? "bg-white/10 hover:bg-white/20"
                    : "bg-neutral-900 hover:bg-neutral-800 text-white"
                )}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            )}
          </div>

          {task.activities.length === 0 ? (
            <p className="text-muted-foreground">No activities yet.</p>
          ) : (
            <div className="space-y-4">
              {task.activities.map((activity, index) => {
                if (typeof activity === "string") {
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4 p-4 border bg-white/80 dark:bg-black/20 border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center gap-2 font-semibold min-w-[140px]">
                        <CheckCircle className="w-5 h-5 text-neutral-400" />
                        Activity #{index + 1}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {activity}
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 p-4 border bg-white/80 dark:bg-black/20 border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-2 font-semibold min-w-[140px] ">
                      <CheckCircle className="w-5 h-5 text-neutral-400" />
                      Activity #{index + 1}
                    </div>
                    <div className="flex items-center gap-6 text-sm ">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {(activity as any).completedLeads} completed
                      </div>
                      <div className="flex items-center gap-1">
                        <Info className="w-4 h-4 text-red-500" />
                        {(activity as any).flaggedLeads} flagged
                      </div>
                    </div>
                    <div className="text-sm truncate max-w-[50%] text-right text-gray-800 dark:text-gray-200">
                      <span className="font-medium">Remarks:</span>{" "}
                      {(activity as any).remarks}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={clsx(
            "sm:max-w-md rounded-2xl border",
            isDark
              ? "bg-black/80 border-neutral-700"
              : "bg-white border-neutral-200"
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-xl">Add Activity</DialogTitle>
            <DialogDescription>
              Update progress for this task.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="completedLeads">Completed Leads</Label>
              <Input
                id="completedLeads"
                type="number"
                min={0}
                value={completedLeads}
                onChange={(e) => setCompletedLeads(e.target.value)}
                placeholder="e.g., 45"
                className={isDark ? "bg-black/40 border-neutral-700" : ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="flaggedLeads">Flagged Leads</Label>
              <Input
                id="flaggedLeads"
                type="number"
                min={0}
                value={flaggedLeads}
                onChange={(e) => setFlaggedLeads(e.target.value)}
                placeholder="e.g., 0"
                className={isDark ? "bg-black/40 border-neutral-700" : ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Short description (what you did/checked)"
                className={isDark ? "bg-black/40 border-neutral-700" : ""}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className={isDark ? "border-neutral-700 text-neutral-300" : ""}
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmitActivity}
              disabled={submitting}
              className={clsx(
                "rounded-xl",
                isDark
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-neutral-900 hover:bg-neutral-800 text-white"
              )}
            >
              {submitting ? "Saving..." : "Save Activity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal (Admin only) */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent
          className={clsx(
            "sm:max-w-md rounded-2xl border",
            isDark
              ? "bg-black/80 border-neutral-700"
              : "bg-white border-neutral-200"
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Delete Task?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. The task and its activities will be
              permanently removed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenDelete(false)}
              className={isDark ? "border-neutral-700 text-neutral-300" : ""}
            >
              Cancel
            </Button>
            <Button
              onClick={onDeleteTask}
              disabled={deleting}
              className={clsx(
                "rounded-xl",
                isDark
                  ? "bg-red-600/80 hover:bg-red-600"
                  : "bg-red-600 hover:bg-red-700 text-white"
              )}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsTaskDetails;
