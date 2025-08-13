/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserNameById } from "@/services/UserService";
import {
  Calendar,
  User2,
  Hash,
  Tags,
  Clock,
  History,
  LogIn,
  LogOut,
  Users,
  List,
  Trash2,
  AlertTriangle,
  QrCode,
  Copy,
  Check,
} from "lucide-react";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import {
  getFixedTimeEventById,
  deleteFixedTimeEventById,
} from "@/services/EMUService/fixedTimeEventManagement";
import { TFixedTimeEvent } from "@/types/emu/fixedEvent.type";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Swal from "sweetalert2";
import clsx from "clsx";
import Image from "next/image";

const EventTaskDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { user } = useUser();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<TFixedTimeEvent | null>(null);
  const [createdByName, setCreatedByName] = useState("");
  const [signInNames, setSignInNames] = useState<
    { name: string; time: string }[]
  >([]);
  const [signOutNames, setSignOutNames] = useState<
    { name: string; time: string }[]
  >([]);
  const [selectedManpowerNames, setSelectedManpowerNames] = useState<string[]>(
    []
  );

  // delete dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // QR dialogs
  const [openQRIn, setOpenQRIn] = useState(false);
  const [copiedIn, setCopiedIn] = useState(false);
  const [openQROut, setOpenQROut] = useState(false);
  const [copiedOut, setCopiedOut] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      const res = await getFixedTimeEventById(id as string);
      if (res.success) {
        const data = res.data as TFixedTimeEvent;
        setTask(data);

        const createdUser = await getUserNameById(data.createdBy);
        setCreatedByName(createdUser?.data?.name || "Unknown");

        if (data.selectedManpower?.length) {
          const names = await Promise.all(
            data.selectedManpower.map(async (userId: string) => {
              const u = await getUserNameById(userId);
              return u?.data?.name || "Unknown";
            })
          );
          setSelectedManpowerNames(names);
        }

        if (
          typeof data.signInData === "object" &&
          data.signInData !== null &&
          Array.isArray((data.signInData as any).attendanceRecord) &&
          (data.signInData as any).attendanceRecord.length
        ) {
          const signIns = await Promise.all(
            (data.signInData as any).attendanceRecord.map(
              async (entry: any) => {
                const u = await getUserNameById(entry.userId);
                return {
                  name: u?.data?.name || "Unknown",
                  time: entry.signInTime
                    ? formatToMalaysiaTime(entry.signInTime)
                    : "N/A",
                };
              }
            )
          );
          setSignInNames(signIns);
        }

        if (
          typeof data.signOutData === "object" &&
          data.signOutData !== null &&
          Array.isArray((data.signOutData as any).attendanceRecord) &&
          (data.signOutData as any).attendanceRecord.length
        ) {
          const signOuts = await Promise.all(
            (data.signOutData as any).attendanceRecord.map(
              async (entry: any) => {
                const u = await getUserNameById(entry.userId);
                return {
                  name: u?.data?.name || "Unknown",
                  time: entry.signInTime
                    ? formatToMalaysiaTime(entry.signInTime)
                    : "N/A",
                };
              }
            )
          );
          setSignOutNames(signOuts);
        }
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

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const isEmuAdmin = user?.role === "emuAdmin";

  // Build URLs: /sign-in/<taskId>/<attendanceId> and /sign-out/<taskId>/<attendanceId>
  const signInUrl = useMemo(() => {
    if (!task) return "";
    const attendanceId =
      (task as any)?.signInData?._id || (task as any)?.signInData?.id || "";
    if (!attendanceId) return "";
    return `${origin}/sign-in/${task._id}/${attendanceId}`;
  }, [task, origin]);

  const signOutUrl = useMemo(() => {
    if (!task) return "";
    const attendanceId =
      (task as any)?.signOutData?._id || (task as any)?.signOutData?.id || "";
    if (!attendanceId) return "";
    return `${origin}/sign-out/${task._id}/${attendanceId}`;
  }, [task, origin]);

  const qrInSrc = signInUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
        signInUrl
      )}`
    : "";

  const qrOutSrc = signOutUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
        signOutUrl
      )}`
    : "";

  const onCopyIn = async () => {
    try {
      await navigator.clipboard.writeText(signInUrl);
      setCopiedIn(true);
      setTimeout(() => setCopiedIn(false), 1200);
    } catch {}
  };

  const onCopyOut = async () => {
    try {
      await navigator.clipboard.writeText(signOutUrl);
      setCopiedOut(true);
      setTimeout(() => setCopiedOut(false), 1200);
    } catch {}
  };

  const onDeleteTask = async () => {
    try {
      setDeleting(true);
      const res = await deleteFixedTimeEventById(String(id));
      if (res?.success) {
        await Swal.fire({
          title: "Deleted!",
          text: res?.message || "Event task has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        router.push("/emuadmin/event-tasks");
      } else {
        Swal.fire({
          title: "Failed",
          text: res?.message || "Failed to delete event task.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (e: any) {
      Swal.fire({
        title: "Error",
        text: e?.message || "Failed to delete event task.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setDeleting(false);
      setOpenDelete(false);
    }
  };

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
      label: "Event Date",
      value: formatToMalaysiaTime(
        task.eventDate as unknown as string,
        "dd MMM yyyy (EEE)"
      ),
      icon: <Calendar className="w-5 h-5 text-green-400" />,
    },
    {
      label: "Start Time",
      value: task.startTime,
      icon: <Clock className="w-5 h-5 text-yellow-400" />,
    },
    {
      label: "End Time",
      value: task.endTime,
      icon: <Clock className="w-5 h-5 text-orange-400" />,
    },
    {
      label: "MultiTask",
      value: task.multiTask ? (
        <Link
          className="text-blue-500"
          href={`/emuadmin/emu-multitaskings/${task._id}`}
        >
          {task.multiTaskId}
        </Link>
      ) : (
        "-"
      ),
      icon: <List className="w-5 h-5 text-purple-400" />,
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
  ];

  return (
    <div className={`min-h-screen px-6 py-10 ${bgClass} rounded-xl`}>
      <div className="max-w-full mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">{task.title}</h1>
          <p className="mt-2">
            <span
              className={`inline-block px-4 mt-2 py-1 text-sm font-medium rounded-full ${
                task.status === "completed"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              {task.status}
            </span>
          </p>

          {isEmuAdmin && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Link href={`/emuadmin/event-tasks/${task._id}/update`}>
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
                aria-label="Delete event task"
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
                  <p className="font-medium text-[15px]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Manpower Section */}
        <div
          className={`rounded-xl p-6 border ${
            isDark
              ? "bg-black/10 border-neutral-700"
              : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" /> Selected Manpower
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              Total: {selectedManpowerNames.length}
            </span>
          </h2>

          {selectedManpowerNames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedManpowerNames.map((name, idx) => (
                <div
                  key={idx}
                  className="rounded-lg p-4 shadow-sm flex items-start gap-4 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700"
                >
                  <div className="mt-1 text-purple-500 font-bold">
                    {idx + 1}.
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Member</p>
                    <p className="font-medium text-[15px]">{name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No manpower selected.
            </p>
          )}
        </div>

        {/* Attendance Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sign-In */}
          <div
            className={`rounded-xl p-6 border ${
              isDark
                ? "bg-black/10 border-neutral-700"
                : "bg-neutral-50 border-neutral-200"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <LogIn className="w-5 h-5 text-green-500" /> Sign-In Attendance
              </span>

              {/* Right side: QR (emuAdmin only) + pretty total pill */}
              <div className="flex items-center gap-2">
                {isEmuAdmin && signInUrl ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenQRIn(true)}
                    className={clsx(isDark ? "border-neutral-700" : "")}
                  >
                    <QrCode className="w-4 h-4 mr-1.5" />
                    Show QR
                  </Button>
                ) : null}

                <span
                  className={clsx(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                    isDark
                      ? "bg-white/10 text-white"
                      : "bg-neutral-200 text-neutral-800"
                  )}
                  title="Total sign-ins"
                >
                  <Users className="w-3.5 h-3.5" />
                  {signInNames.length}
                </span>
              </div>
            </h2>

            {signInNames.length > 0 ? (
              <ul className="space-y-2">
                {signInNames.map((entry, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between text-sm font-medium"
                  >
                    <span>{entry.name}</span>
                    <span>{entry.time}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No sign-in records.
              </p>
            )}
          </div>

          {/* Sign-Out */}
          <div
            className={`rounded-xl p-6 border ${
              isDark
                ? "bg-black/10 border-neutral-700"
                : "bg-neutral-50 border-neutral-200"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <LogOut className="w-5 h-5 text-red-500" /> Sign-Out Attendance
              </span>

              <div className="flex items-center gap-2">
                {isEmuAdmin && signOutUrl ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenQROut(true)}
                    className={clsx(isDark ? "border-neutral-700" : "")}
                  >
                    <QrCode className="w-4 h-4 mr-1.5" />
                    Show QR
                  </Button>
                ) : null}

                <span
                  className={clsx(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                    isDark
                      ? "bg-white/10 text-white"
                      : "bg-neutral-200 text-neutral-800"
                  )}
                  title="Total sign-outs"
                >
                  <Users className="w-3.5 h-3.5" />
                  {signOutNames.length}
                </span>
              </div>
            </h2>

            {signOutNames.length > 0 ? (
              <ul className="space-y-2">
                {signOutNames.map((entry, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between text-sm font-medium"
                  >
                    <span>{entry.name}</span>
                    <span>{entry.time}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No sign-out records.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sign-In QR Modal (emuAdmin only) */}
      <Dialog open={openQRIn} onOpenChange={setOpenQRIn}>
        <DialogContent
          className={clsx(
            "sm:max-w-md rounded-2xl border",
            isDark
              ? "bg-black/80 border-neutral-700"
              : "bg-white border-neutral-200"
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-xl">Scan to Sign In</DialogTitle>
            <DialogDescription>
              Scanning this QR will open the attendance sign-in page.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-3 py-2">
            {qrInSrc ? (
              <Image
                src={qrInSrc}
                alt="Sign-in QR"
                className="rounded-xl border"
                width={200}
                height={200}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Sign-in link not available.
              </p>
            )}

            {signInUrl ? (
              <div className="w-full">
                <div className="text-xs mb-1 opacity-70">Direct link</div>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={signInUrl}
                    className={clsx(
                      "w-full px-3 py-2 rounded-md border text-sm",
                      isDark
                        ? "bg-black/40 border-neutral-700"
                        : "bg-white border-neutral-300"
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onCopyIn}
                  >
                    {copiedIn ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              onClick={() => setOpenQRIn(false)}
              className={clsx(
                "rounded-xl",
                isDark
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-neutral-900 hover:bg-neutral-800 text-white"
              )}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sign-Out QR Modal (emuAdmin only) */}
      <Dialog open={openQROut} onOpenChange={setOpenQROut}>
        <DialogContent
          className={clsx(
            "sm:max-w-md rounded-2xl border",
            isDark
              ? "bg-black/80 border-neutral-700"
              : "bg-white border-neutral-200"
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-xl">Scan to Sign Out</DialogTitle>
            <DialogDescription>
              Scanning this QR will open the attendance sign-out page.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-3 py-2">
            {qrOutSrc ? (
              <Image
                src={qrOutSrc}
                alt="Sign-out QR"
                className="rounded-xl border"
                width={200}
                height={200}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Sign-out link not available.
              </p>
            )}

            {signOutUrl ? (
              <div className="w-full">
                <div className="text-xs mb-1 opacity-70">Direct link</div>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={signOutUrl}
                    className={clsx(
                      "w-full px-3 py-2 rounded-md border text-sm",
                      isDark
                        ? "bg-black/40 border-neutral-700"
                        : "bg-white border-neutral-300"
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onCopyOut}
                  >
                    {copiedOut ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              onClick={() => setOpenQROut(false)}
              className={clsx(
                "rounded-xl",
                isDark
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-neutral-900 hover:bg-neutral-800 text-white"
              )}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              Delete Event Task?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. The event task and its records will
              be permanently removed.
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

export default EventTaskDetails;
