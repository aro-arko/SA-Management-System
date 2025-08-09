/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { getUserNameById, TaskDetails } from "@/services/UserService";
import {
  Calendar,
  User2,
  Hash,
  Info,
  School,
  ListChecks,
  Layers,
  GraduationCap,
  BookMarked,
  Bookmark,
  Users,
  FileText,
  MessageCircle,
  History,
} from "lucide-react";
import { TDataEntryTask } from "@/types/lmu/dataentry.type";
import { formatToMalaysiaTime } from "@/utils/formatDate"; // unchanged
import {
  submitDataReport,
  editDataEntryReport,
} from "@/services/LMUService/dataManagement";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const DataEntryTaskDetails = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<TDataEntryTask | null>(null);
  const [assignedName, setAssignedName] = useState("");

  // modal state
  const [reportOpen, setReportOpen] = useState(false);
  const [reportMode, setReportMode] = useState<"submit" | "edit">("submit");
  const [submitting, setSubmitting] = useState(false);
  const [completedLeads, setCompletedLeads] = useState<string>("");
  const [flaggedLeads, setFlaggedLeads] = useState<string>("");
  const [fileLink, setFileLink] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  useEffect(() => setMounted(true), []);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const res = await TaskDetails(id as string);
      if (res?.success) {
        const taskData = res.data as TDataEntryTask;
        const user = await getUserNameById(taskData.assignedTo);
        setAssignedName(user?.data?.name || "Unassigned");
        setTask(taskData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isDark = resolvedTheme === "dark";

  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-[#ffffff] text-black";

  // Guard formatter so we never pass invalid/empty dates
  const isValidDateString = (v: any) =>
    typeof v === "string" && !Number.isNaN(new Date(v).getTime());

  const safeFormat = (v: any, fmt = "dd MMM yyyy") =>
    isValidDateString(v) ? formatToMalaysiaTime(v, fmt) : "-";

  // Decide which button to show
  const showSubmitButton = useMemo(() => {
    if (!task?.report) return true;
    const sum =
      (task.report.completedLeads ?? 0) + (task.report.flaggedLeads ?? 0);
    const noFile = !task.report.fileLink || task.report.fileLink === "-";
    return sum === 0 && noFile;
  }, [task]);

  // Open modal with mode + prefill if editing
  const openReportModal = (mode: "submit" | "edit") => {
    setReportMode(mode);
    if (mode === "edit" && task?.report) {
      setCompletedLeads(String(task.report.completedLeads ?? ""));
      setFlaggedLeads(String(task.report.flaggedLeads ?? ""));
      setFileLink(task.report.fileLink ?? "");
      setRemarks(task.report.remarks ?? "");
    } else {
      setCompletedLeads("");
      setFlaggedLeads("");
      setFileLink("");
      setRemarks("");
    }
    setReportOpen(true);
  };

  const resetReportForm = () => {
    setCompletedLeads("");
    setFlaggedLeads("");
    setFileLink("");
    setRemarks("");
  };

  const onSubmitReport = async () => {
    const c = Number(completedLeads || 0);
    const f = Number(flaggedLeads || 0);
    const link = (fileLink || "").trim();
    const r = (remarks || "").trim();

    if (c < 0 || f < 0) {
      toast.warning("Counts cannot be negative.");
      return;
    }

    const payload = {
      completedLeads: c,
      flaggedLeads: f,
      fileLink: link,
      remarks: r,
    };

    try {
      setSubmitting(true);

      // Use separate endpoints based on mode
      const res =
        reportMode === "edit"
          ? await editDataEntryReport(String(id), payload)
          : await submitDataReport(String(id), payload);

      if (!res?.success) {
        toast.error(res?.message || "Failed to save report.");
        return;
      }

      // Always refetch to ensure we have the latest server truth
      await fetchTask();

      toast.success(
        reportMode === "edit" ? "Report updated." : "Report submitted."
      );

      // Close & reset
      setReportOpen(false);
      resetReportForm();
    } catch {
      toast.error("Something went wrong while saving the report.");
    } finally {
      setSubmitting(false);
    }
  };

  const infoCards = task && [
    {
      label: "Title",
      value: task.title,
      icon: <Hash className="w-5 h-5 text-indigo-400" />,
    },
    {
      label: "Type",
      value: task.type,
      icon: <ListChecks className="w-5 h-5 text-green-400" />,
    },
    {
      label: "Unit",
      value: task.unit,
      icon: <Layers className="w-5 h-5 text-yellow-400" />,
    },
    {
      label: "School",
      value: task.schoolName,
      icon: <School className="w-5 h-5 text-pink-400" />,
    },
    {
      label: "Assigned To",
      value: assignedName,
      icon: <User2 className="w-5 h-5 text-blue-400" />,
    },
    {
      label: "Due Date",
      value: safeFormat(task.dueDate, "dd MMM yyyy"),
      icon: <Calendar className="w-5 h-5 text-rose-400" />,
    },
    {
      label: "Message",
      value: task.message || "No message provided",
      icon: <Info className="w-5 h-5 text-cyan-400" />,
    },
    {
      label: "Total Leads",
      value: String(task.totalLeads),
      icon: <Users className="w-5 h-5 text-purple-400" />,
    },
    {
      label: "School Team Leads",
      value: String(task.schoolTeamTotalLeads),
      icon: <Users className="w-5 h-5 text-orange-400" />,
    },
    {
      label: "Missing/Extra Leads",
      value: String(task.missingOrExtraLeads ?? 0),
      icon: <Users className="w-5 h-5 text-red-400" />,
    },
    {
      label: "Highest Qualification",
      value: task.highestQualification,
      icon: <GraduationCap className="w-5 h-5 text-lime-400" />,
    },
    {
      label: "Preferred Program",
      value: task.preferredProgram,
      icon: <BookMarked className="w-5 h-5 text-sky-400" />,
    },
    {
      label: "Preferred Intake",
      value: task.preferredIntake,
      icon: <Bookmark className="w-5 h-5 text-fuchsia-400" />,
    },
    {
      label: "School Level",
      value: task.schoolLevel,
      icon: <School className="w-5 h-5 text-emerald-400" />,
    },
    {
      label: "Created At",
      value: safeFormat(task.createdAt, "dd MMM yyyy"),
      icon: <History className="w-5 h-5 text-gray-400" />,
    },
  ];

  const reportCards = task?.report && [
    {
      label: "Completed Leads",
      value: String(task.report.completedLeads ?? 0),
      icon: <FileText className="w-5 h-5 text-green-500" />,
    },
    {
      label: "Flagged Leads",
      value: String(task.report.flaggedLeads ?? 0),
      icon: <Info className="w-5 h-5 text-red-500" />,
    },
    {
      label: "File Link",
      value: task.report.fileLink ? (
        <a
          href={task.report.fileLink}
          target="_blank"
          className="text-blue-500 underline"
        >
          Open File
        </a>
      ) : (
        "—"
      ),
      icon: <FileText className="w-5 h-5 text-indigo-500" />,
    },
    {
      label: "Remarks",
      value: task.report.remarks || "—",
      icon: <MessageCircle className="w-5 h-5 text-orange-400" />,
    },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        {/* keep any skeletons you already had here */}
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

  return (
    <div className={`min-h-screen rounded-xl px-6 py-10 ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold flex justify-center items-center gap-2">
            {task.title}
          </h1>
          <p className="mt-3">
            <span
              className={clsx(
                "inline-block px-4 py-1 text-sm font-medium rounded-full",
                task.status === "completed"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-neutral-200 text-neutral-800 dark:bg-neutral-800/30 dark:text-neutral-300"
              )}
            >
              {task.status}
            </span>
          </p>
        </div>

        {/* Info Cards */}
        <div
          className={clsx(
            "rounded-xl p-6 border",
            task.status === "completed"
              ? "bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-800"
              : "bg-neutral-50 border-neutral-200 dark:bg-black/10 dark:border-neutral-700"
          )}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {infoCards?.map((item, index) => (
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

        {/* Report Section */}
        <div className="rounded-xl p-6 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Report</h2>

            {showSubmitButton ? (
              <Button
                onClick={() => openReportModal("submit")}
                className={clsx(
                  "rounded-xl",
                  isDark
                    ? "bg-white/10 hover:bg-white/20"
                    : "bg-neutral-900 hover:bg-neutral-800 text-white"
                )}
              >
                Submit Report
              </Button>
            ) : (
              <Button
                onClick={() => openReportModal("edit")}
                className={clsx(
                  "rounded-xl",
                  isDark
                    ? "bg-white/10 hover:bg-white/20"
                    : "bg-neutral-900 hover:bg-neutral-800 text-white"
                )}
              >
                Edit Report
              </Button>
            )}
          </div>

          {task.report ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {reportCards?.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg p-4 shadow-sm flex items-start gap-4 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700"
                >
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="font-medium text-[15px]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No report submitted yet.</p>
          )}
        </div>
      </div>

      {/* Submit/Edit Report Modal */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent
          className={clsx(
            "sm:max-w-md rounded-2xl border",
            isDark
              ? "bg-black/80 border-neutral-700"
              : "bg-white border-neutral-200"
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-xl">
              {reportMode === "edit" ? "Edit Report" : "Submit Report"}
            </DialogTitle>
            <DialogDescription>
              Provide the data report for this task.
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
                placeholder="e.g., 105"
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
              <Label htmlFor="fileLink">File Link</Label>
              <Input
                id="fileLink"
                type="url"
                value={fileLink}
                onChange={(e) => setFileLink(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/..."
                className={isDark ? "bg-black/40 border-neutral-700" : ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder='e.g., "school team says 100 but found 101"'
                className={isDark ? "bg-black/40 border-neutral-700" : ""}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportOpen(false)}
              className={isDark ? "border-neutral-700 text-neutral-300" : ""}
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmitReport}
              disabled={submitting}
              className={clsx(
                "rounded-xl",
                isDark
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-neutral-900 hover:bg-neutral-800 text-white"
              )}
            >
              {submitting
                ? "Saving..."
                : reportMode === "edit"
                ? "Save Changes"
                : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataEntryTaskDetails;
