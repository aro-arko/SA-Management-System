/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import clsx from "clsx";
import Swal from "sweetalert2";

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

import {
  Calendar,
  Hash,
  Tags,
  User2,
  History,
  Clock,
  Users,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import { formatToMalaysiaTime } from "@/utils/formatDate";
import { getUserNameById } from "@/services/UserService";
import { THRFinanceTask } from "@/types/hr_finance/task.types";
import {
  getHRFinanceTaskById,
  deleteHRFinanceTask,
} from "@/services/HR_FinanceService/HrTask";
import { useUser } from "@/context/UserContext";

const HrTaskDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { user } = useUser();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<THRFinanceTask | null>(null);
  const [createdByName, setCreatedByName] = useState("");
  const [assignedToName, setAssignedToName] = useState("");

  // delete dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      const res = await getHRFinanceTaskById(id as string);
      if (res.success) {
        const data = res.data as THRFinanceTask;
        setTask(data);

        if (data.createdBy) {
          const created = await getUserNameById(data.createdBy);
          setCreatedByName(created?.data?.name || "Unknown");
        } else setCreatedByName("Unknown");

        if (data.assignedTo) {
          const assigned = await getUserNameById(data.assignedTo);
          setAssignedToName(assigned?.data?.name || "Unknown");
        } else setAssignedToName("Unknown");
      }
      setLoading(false);
    };

    fetchTask();
  }, [id]);

  const isDark = resolvedTheme === "dark";
  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-white text-black";

  const roleSlug = (user?.role || "").toLowerCase();
  const isHrFinanceAdmin = roleSlug === "hrfinanceadmin";

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-black" />;

  if (loading)
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <Skeleton className="h-10 w-3/4 mx-auto rounded-md mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );

  if (!task) {
    return (
      <div className="text-center py-10 text-red-500 text-lg">
        Task not found.
      </div>
    );
  }

  const infoCards = [
    {
      label: "Title",
      value: task.title,
      icon: <Hash className="w-5 h-5 text-blue-400" />,
    },
    {
      label: "Type",
      value: task.type,
      icon: <Tags className="w-5 h-5 text-indigo-400" />,
    },
    {
      label: "Unit",
      value: task.unit,
      icon: <Users className="w-5 h-5 text-purple-400" />,
    },
    {
      label: "Assigned To",
      value: assignedToName,
      icon: <User2 className="w-5 h-5 text-orange-400" />,
    },
    {
      label: "Due Date",
      value: formatToMalaysiaTime(
        task.dueDate as unknown as string,
        "dd MMM yyyy"
      ),
      icon: <Calendar className="w-5 h-5 text-green-400" />,
    },
    {
      label: "Created By",
      value: createdByName,
      icon: <User2 className="w-5 h-5 text-cyan-400" />,
    },
    {
      label: "Created At",
      value: formatToMalaysiaTime(task.createdAt as unknown as string),
      icon: <History className="w-5 h-5 text-gray-400" />,
    },
    {
      label: "Updated At",
      value: formatToMalaysiaTime(task.updatedAt as unknown as string),
      icon: <Clock className="w-5 h-5 text-yellow-400" />,
    },
  ];

  const onDeleteTask = async () => {
    if (!task?._id) return;
    try {
      setDeleting(true);
      const res = await deleteHRFinanceTask(task._id);
      if (res?.success) {
        await Swal.fire({
          title: "Deleted!",
          text:
            res?.message || "HR/Finance task has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        router.push(`/${roleSlug}/hr-tasks`);
      } else {
        await Swal.fire({
          title: "Failed",
          text: res?.message || "Failed to delete HR/Finance task.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (e: any) {
      await Swal.fire({
        title: "Error",
        text: e?.message || "Failed to delete HR/Finance task.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setDeleting(false);
      setOpenDelete(false);
    }
  };

  return (
    <div className={`min-h-screen px-6 py-10 ${bgClass} rounded-xl`}>
      <div className="max-w-full mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold capitalize break-words">
            {task.title}
          </h1>
          <p className="mt-2">
            <span
              className={`inline-block px-4 py-1 text-sm font-medium rounded-full ${
                task.status === "completed"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : task.status === "in-progress"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400"
              }`}
            >
              {task.status}
            </span>
          </p>

          {isHrFinanceAdmin && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Link href={`/${roleSlug}/hr-tasks/${task._id}/update`}>
                <Button className="px-6 font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700">
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
                aria-label="Delete HR/Finance task"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div
          className={`rounded-xl p-6 border ${
            isDark
              ? "bg-black/10 border-neutral-700"
              : "bg-neutral-50 border-neutral-200"
          }`}
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
                  <p className="font-medium text-[15px] capitalize break-words">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Details */}
        <div
          className={`rounded-xl p-6 border ${
            isDark
              ? "bg-black/10 border-neutral-700"
              : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">Task Details</h2>
          <p className="text-sm leading-6 text-muted-foreground whitespace-pre-wrap">
            {task.details}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
              Delete HR/Finance Task?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. The task and its records will be
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

export default HrTaskDetails;
