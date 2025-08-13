/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getAllUsers, getUserNameById } from "@/services/UserService";
import { createHRFinanceTask } from "@/services/HR_FinanceService/HrTask";
import { TCreateHrFinanceTask } from "@/types/hr_finance/task.types";
import { useRouter } from "next/navigation";

type TUserOption = { _id: string; name: string };

const pad = (n: number) => String(n).padStart(2, "0");
const defaultDueLocal = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(23, 59, 0, 0);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

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

const CreateHrTask = () => {
  const { resolvedTheme } = useTheme();

  // --- HYDRATION-SAFE THEME GATE ---
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  // form state
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState(defaultDueLocal());

  // users
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<TUserOption[]>([]);

  const router = useRouter();

  // styles
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

  // fetch HR_FINANCE users and resolve names if needed
  useEffect(() => {
    (async () => {
      setLoadingUsers(true);
      try {
        const q = new URLSearchParams({
          unit: "HR_FINANCE",
          status: "active",
          limit: "1000",
        });
        const res = await getAllUsers(q.toString());
        const mapped = normalizeUsers(res);

        const needsLookup = mapped.filter(
          (u) => !u.name || u.name === u._id || looksLikeObjectId(u.name)
        );

        if (needsLookup.length) {
          const resolved = await Promise.all(
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
          resolved.sort((a, b) => a.name.localeCompare(b.name));
          setUsers(resolved);
        } else {
          mapped.sort((a, b) => a.name.localeCompare(b.name));
          setUsers(mapped);
        }
      } catch (e: any) {
        setUsers([]);
        toast.error(e?.message || "Failed to load HR/Finance users.");
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const canSubmit = useMemo(
    () => title.trim() && assignedTo && dueDate,
    [title, assignedTo, dueDate]
  );

  const onSubmit = async () => {
    if (!title.trim()) return toast.warning("Title is required.");
    if (!assignedTo) return toast.warning("Please select an assignee.");
    if (!dueDate) return toast.warning("Due date is required.");

    const due = dueDate.length === 16 ? `${dueDate}:00` : dueDate; // ensure :SS

    const payload: TCreateHrFinanceTask = {
      title: title.trim(),
      details: details.trim(),
      assignedTo,
      dueDate: due,
    };

    try {
      setSubmitting(true);
      const res = await createHRFinanceTask(payload);
      if (res?.success) {
        toast.success(res?.message || "HR/Finance task created.");
        setTitle("");
        setDetails("");
        setAssignedTo("");
        setDueDate(defaultDueLocal());
        router.push("/hrfinanceadmin/hr-tasks");
      } else {
        const msg =
          res?.message ||
          (Array.isArray(res?.errors)
            ? res.errors.map((e: any) => e.message).join(", ")
            : "") ||
          "Failed to create HR/Finance task.";
        toast.error(msg);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to create HR/Finance task.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- prevent theme mismatch during SSR/CSR hydration ---
  if (!mounted) {
    return <div className="min-h-screen w-full px-4 py-6 opacity-0" />;
  }

  return (
    <div className={pageCls}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Create HR/Finance Task
        </h1>
        <p className="mt-1">
          Assign a task to an HR_FINANCE member with a due date.
        </p>
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
              fieldCls,
              isDark ? "bg-black/40 border-neutral-700" : "",
              "min-h-28"
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

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={onSubmit}
            disabled={submitting || !canSubmit}
            className={clsx(
              "rounded-md",
              isDark
                ? "bg-white/10 hover:bg-white/20"
                : "bg-neutral-900 hover:bg-neutral-800 text-white"
            )}
          >
            {submitting ? "Creating…" : "Create Task"}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setTitle("");
              setDetails("");
              setAssignedTo("");
              setDueDate(defaultDueLocal());
            }}
            className={isDark ? "border-neutral-700 text-neutral-300" : ""}
            disabled={submitting}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateHrTask;
