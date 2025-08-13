/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { getAllUsers, getUserNameById } from "@/services/UserService";
import {
  getHRFinanceTaskById,
  updateHrFinanceTask,
} from "@/services/HR_FinanceService/HrTask";
import {
  THRFinanceTask,
  TUpdateHrFinanceTask,
} from "@/types/hr_finance/task.types";
import { useUser } from "@/context/UserContext";

// ------------ small helpers ------------
type TUserOption = { _id: string; name: string };
const pad = (n: number) => String(n).padStart(2, "0");
const looksLikeObjectId = (s?: string) => !!s && /^[0-9a-f]{24}$/i.test(s);

const normalizeUsers = (src: any): TUserOption[] => {
  const arr = Array.isArray(src?.data)
    ? src.data
    : Array.isArray(src)
    ? src
    : [];
  return arr
    .map((u: any) => {
      if (!u) return null;
      const _id = String(u?._id || u?.id || "");
      if (!_id) return null;
      const name =
        u?.name ||
        [u?.firstName, u?.lastName].filter(Boolean).join(" ") ||
        u?.email ||
        _id;
      return { _id, name };
    })
    .filter(Boolean) as TUserOption[];
};

// Convert Date/ISO string to `YYYY-MM-DDTHH:mm` for <input type="datetime-local">
const toLocalInput = (dt: string | Date) => {
  const d = new Date(dt);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const UpdateHrTask = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  // ---------- loading flags ----------
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // ---------- form state ----------
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState(""); // datetime-local string
  const [status, setStatus] = useState<"in-progress" | "completed">(
    "in-progress"
  );

  // ---------- lists ----------
  const [users, setUsers] = useState<TUserOption[]>([]);

  // keep original task to support Reset
  const original = useRef<THRFinanceTask | null>(null);

  // ---------- styles ----------
  const pageCls = clsx(
    "min-h-screen w-full px-4 py-6 rounded-xl transition-colors duration-300",
    isDark
      ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
      : "bg-white text-black"
  );
  const cardCls = clsx(
    "max-w-3xl mx-auto rounded-xl p-6 border space-y-5",
    isDark
      ? "bg-black/30 backdrop-blur-md border-[#333] text-neutral-100"
      : "bg-white/80 backdrop-blur-md border-neutral-200 text-neutral-900"
  );
  const fieldCls = clsx(
    "w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
    isDark
      ? "bg-black text-white border-neutral-700"
      : "bg-white border-gray-300"
  );

  // ---------- initial fetch: task + HR_FINANCE users ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);

        // task
        const res = await getHRFinanceTaskById(String(id));
        if (!res?.success) throw new Error("Failed to load task.");
        const data = res.data as THRFinanceTask;
        if (cancelled) return;

        original.current = data;

        setTitle(data.title || "");
        setDetails(data.details || "");
        setAssignedTo(String(data.assignedTo || ""));
        setDueDate(toLocalInput(String(data.dueDate)));
        setStatus((data.status as any) || "in-progress");

        // users (HR_FINANCE)
        setLoadingUsers(true);
        try {
          const q = new URLSearchParams({
            unit: "HR_FINANCE",
            status: "active",
            limit: "1000",
          });
          const uRes = await getAllUsers(q.toString());
          let mapped = normalizeUsers(uRes);

          // resolve entries that still look like raw IDs
          const needsLookup = mapped.filter(
            (u) => !u.name || u.name === u._id || looksLikeObjectId(u.name)
          );
          if (needsLookup.length) {
            mapped = await Promise.all(
              mapped.map(async (u) => {
                if (u.name && u.name !== u._id && !looksLikeObjectId(u.name))
                  return u;
                try {
                  const r = await getUserNameById(u._id);
                  const name =
                    r?.data?.name ||
                    [r?.data?.firstName, r?.data?.lastName]
                      .filter(Boolean)
                      .join(" ") ||
                    r?.data?.email ||
                    u._id;
                  return { ...u, name };
                } catch {
                  return u;
                }
              })
            );
          }
          mapped.sort((a, b) => a.name.localeCompare(b.name));
          if (!cancelled) setUsers(mapped);
        } finally {
          setLoadingUsers(false);
        }
      } catch (e: any) {
        if (!cancelled)
          toast.error(e?.message || "Failed to load HR/Finance task.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const canSave = useMemo(
    () => title.trim() && assignedTo && dueDate && status,
    [title, assignedTo, dueDate, status]
  );

  // ---------- submit (PATCH) ----------
  const onSave = async () => {
    if (!canSave) return;

    // API expects seconds; add :00 if missing
    const due = dueDate.length === 16 ? `${dueDate}:00` : dueDate;

    const payload: TUpdateHrFinanceTask = {
      title: title.trim(),
      details: details.trim(),
      assignedTo,
      dueDate: due,
      status,
    };

    try {
      setSaving(true);
      const res = await updateHrFinanceTask(String(id), payload);
      if (res?.success) {
        toast.success(res?.message || "HR/Finance task updated.");
        const roleSlug = (user?.role || "").toLowerCase();
        // go back to details
        const base = roleSlug ? `/${roleSlug}` : "";
        router.push(`${base}/hr-tasks/${id}`);
      } else {
        const msg =
          res?.message ||
          (Array.isArray(res?.errors)
            ? res.errors.map((e: any) => e.message).join(", ")
            : "") ||
          "Failed to update task.";
        toast.error(msg);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to update task.");
    } finally {
      setSaving(false);
    }
  };

  const onReset = () => {
    const data = original.current;
    if (!data) return;
    setTitle(data.title || "");
    setDetails(data.details || "");
    setAssignedTo(String(data.assignedTo || ""));
    setDueDate(toLocalInput(String(data.dueDate)));
    setStatus((data.status as any) || "in-progress");
  };

  // ---------- hydration guard ----------
  if (!mounted)
    return <div className="min-h-screen w-full px-4 py-6 opacity-0" />;

  if (loading) {
    return (
      <div className={pageCls}>
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  // ---------- UI ----------
  return (
    <div className={pageCls}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Update HR/Finance Task
        </h1>
        <p className="mt-1">Edit details, assignee, due date, and status.</p>
      </div>

      <div className={cardCls}>
        {/* Title */}
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Check all new applications"
            className={isDark ? "bg-black/40 border-neutral-700" : ""}
          />
        </div>

        {/* Details */}
        <div className="grid gap-2">
          <Label htmlFor="details">Details (optional)</Label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Add notes, priorities, or context…"
            className={clsx(
              "min-h-28",
              "w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
              isDark
                ? "bg-black/40 text-white border-neutral-700"
                : "bg-white border-gray-300"
            )}
          />
        </div>

        {/* Assigned To */}
        <div className="grid gap-2">
          <Label htmlFor="assignedTo">Assign To (HR_FINANCE)</Label>
          <select
            id="assignedTo"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className={fieldCls}
            disabled={loadingUsers}
          >
            <option value="">
              {loadingUsers ? "Loading users..." : "Select a user"}
            </option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
          <p className="text-xs opacity-70">
            {loadingUsers
              ? "Fetching active HR/Finance users…"
              : users.length
              ? `Loaded ${users.length} user(s).`
              : "No active HR/Finance users found."}
          </p>
        </div>

        {/* Due Date */}
        <div className="grid gap-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={isDark ? "bg-black/40 border-neutral-700" : ""}
          />
          <p className="text-xs opacity-70">
            Saved in format: <code>YYYY-MM-DDTHH:mm:SS</code> (local time).
          </p>
        </div>

        {/* Status */}
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "in-progress" | "completed")
            }
            className={fieldCls}
          >
            <option value="in-progress">in-progress</option>
            <option value="completed">completed</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={onSave}
            disabled={saving || !canSave}
            className={clsx(
              "rounded-md",
              isDark
                ? "bg-white/10 hover:bg-white/20"
                : "bg-neutral-900 hover:bg-neutral-800 text-white"
            )}
          >
            {saving ? "Saving…" : "Save Changes"}
          </Button>

          <Button
            variant="outline"
            onClick={onReset}
            className={isDark ? "border-neutral-700 text-neutral-300" : ""}
            disabled={saving}
          >
            Reset
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              const roleSlug = (user?.role || "").toLowerCase();
              const base = roleSlug ? `/${roleSlug}` : "";
              router.push(`${base}/hr-tasks/${id}`);
            }}
            className={isDark ? "border-neutral-700 text-neutral-300" : ""}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateHrTask;
