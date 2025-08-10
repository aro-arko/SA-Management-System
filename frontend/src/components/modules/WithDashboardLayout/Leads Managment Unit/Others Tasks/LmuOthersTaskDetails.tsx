"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import clsx from "clsx";
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
import { useUser } from "@/context/UserContext";
import { TaskDetails, getUserNameById } from "@/services/UserService";
import { deleteLmuOthersTask } from "@/services/LMUService/others tasks";
import {
  Hash,
  Tags,
  CircleDot,
  Calendar,
  History,
  User2,
  Users,
  Info,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import { TLMUOthersTask } from "@/types/lmu/others.type";
import Swal from "sweetalert2";

const LmuOthersTaskDetails = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const { user } = useUser();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [task, setTask] = useState<TLMUOthersTask | null>(null);
  const [createdByName, setCreatedByName] = useState("");
  const [assignedNames, setAssignedNames] = useState<string[]>([]);

  // Delete confirm modal state
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const res = await TaskDetails(id as string);
        if (res?.success) {
          setTask(res.data);

          const createdBy = await getUserNameById(res.data.createdBy);
          setCreatedByName(createdBy?.data?.name || "Unknown");

          const names = await Promise.all(
            res.data.assignedTo.map(async (userId: string) => {
              const r = await getUserNameById(userId);
              return r?.data?.name || "Unknown";
            })
          );
          setAssignedNames(names);
        } else {
          setTask(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const isDark = resolvedTheme === "dark";
  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-white text-black";

  const onDeleteTask = async () => {
    try {
      setDeleting(true);
      const res = await deleteLmuOthersTask(String(id));

      if (res?.success) {
        await Swal.fire({
          title: "Deleted!",
          text: res?.message || "Task has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        window.history.back();
      } else {
        await Swal.fire({
          title: "Failed",
          text: res?.message || "Failed to delete task.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      await Swal.fire({
        title: "Error",
        text: e?.message || "Failed to delete task.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setDeleting(false);
      setOpenDelete(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <div className="space-y-6 max-w-full mx-auto">
          <Skeleton className="h-10 w-2/3 mx-auto rounded-md" />
          <Skeleton className="h-6 w-28 mx-auto rounded-full" />
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
      icon: <Layers className="w-5 h-5 text-yellow-500" />,
    },
    {
      label: "Status",
      value: task.status,
      icon: <CircleDot className="w-5 h-5 text-gray-500" />,
    },
    {
      label: "Created At",
      value: formatToMalaysiaTime(task.createdAt),
      icon: <Calendar className="w-5 h-5 text-orange-400" />,
    },
    {
      label: "Last Updated",
      value: formatToMalaysiaTime(task.updatedAt),
      icon: <History className="w-5 h-5 text-gray-400" />,
    },
    {
      label: "Created By",
      value: createdByName,
      icon: <User2 className="w-5 h-5 text-cyan-400" />,
    },
    {
      label: "Multitask",
      value: task.multiTask ? (
        <Link
          className="text-blue-500 hover:underline"
          href={`/${user?.role.toLocaleLowerCase()}/lmu-multitaskings/${
            task.multiTaskId
          }`}
        >
          Yes
        </Link>
      ) : (
        "No"
      ),
      icon: <CircleDot className="w-5 h-5 text-green-400" />,
    },
    ...(task.details
      ? [
          {
            label: "Details",
            value: task.details,
            icon: <Info className="w-5 h-5 text-purple-400" />,
          },
        ]
      : []),
  ];

  const isAdmin = user?.role?.toLowerCase() === "lmuadmin";

  return (
    <div className={`min-h-screen px-6 py-10 rounded-xl ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-10">
        {/* Header */}
        <div className="text-center mx-auto">
          <h1 className="text-3xl font-bold">{task.title}</h1>
          <p className="mt-3">
            <span
              className={`inline-block px-4 py-1 text-sm font-medium rounded-full ${
                task.multiTask
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-neutral-200 text-neutral-800 dark:bg-neutral-800/30 dark:text-neutral-300"
              }`}
            >
              {task.type}
            </span>
          </p>

          {isAdmin && (
            <div className="mt-4 flex justify-center gap-3">
              <Link href={`/lmuadmin/lmu-others/${id}/update`}>
                <Button
                  variant="outline"
                  className="px-6 flex items-center gap-2"
                >
                  Edit
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={() => setOpenDelete(true)}
                disabled={deleting}
                className={clsx(
                  "px-6 flex items-center gap-2 border",
                  isDark
                    ? "border-red-500/70 text-red-400 hover:bg-red-900/20"
                    : "border-red-500 text-red-600 hover:bg-red-50"
                )}
                aria-busy={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
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
                  <p className="font-medium text-[15px]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Members */}
        <div
          className={`rounded-xl p-6 border ${
            isDark
              ? "bg-black/10 border-neutral-700"
              : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">Assigned Members</h2>
          {assignedNames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {assignedNames.map((name, index) => (
                <div
                  key={index}
                  className="rounded-lg p-4 shadow-sm flex items-start gap-4 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700"
                >
                  <Users className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Member</p>
                    <p className="font-medium text-[15px]">{name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No members assigned.</p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog (card style) */}
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
              This action cannot be undone. The task and its details will be
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

export default LmuOthersTaskDetails;
