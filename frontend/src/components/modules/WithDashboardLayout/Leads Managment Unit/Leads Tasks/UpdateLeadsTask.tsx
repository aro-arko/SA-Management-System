/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  TaskDetails,
  getUserNameById,
  getAllUsers,
} from "@/services/UserService";
import { updateLeadsTask } from "@/services/LMUService/leadsManagement";

import type { TLmuTask, TUserOption } from "@/types/lmu/leadsTask.type";

/* utils */
const pad = (n: number) => String(n).padStart(2, "0");
const formatForInput = (dateLike?: string | Date) => {
  if (!dateLike) return "";
  const d = new Date(dateLike);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};
const toApiTimestamp = (input: string) =>
  new Date(input).toISOString().slice(0, 19);

const normalizeUsersResponse = (res: any): TUserOption[] => {
  const arr = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res)
    ? res
    : [];
  return arr
    .map((u: any) => {
      if (!u) return null;
      const id = String(u?._id || u?.id || "");
      if (!id) return null;
      const name =
        u?.name ||
        [u?.firstName, u?.lastName].filter(Boolean).join(" ") ||
        u?.email ||
        id;
      return { _id: id, name, meta: u } as TUserOption;
    })
    .filter(Boolean) as TUserOption[];
};

const UpdateLeadsTask = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // server task
  const [loadingTask, setLoadingTask] = useState(true);
  const [task, setTask] = useState<TLmuTask | null>(null);

  // form
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [message, setMessage] = useState("");

  // multitasking manpower (fetch first)
  const [loadingManpower, setLoadingManpower] = useState(false);
  const [multiManpowerIds, setMultiManpowerIds] = useState<string[]>([]);

  // users (LMU active)
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<TUserOption[]>([]);

  // combined list for dropdown
  const [combinedUsers, setCombinedUsers] = useState<TUserOption[]>([]);

  const [saving, setSaving] = useState(false);

  /* 1) fetch task */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingTask(true);
      try {
        const res = await TaskDetails(String(id));
        if (!cancelled && res?.success && res?.data) {
          const t = res.data as TLmuTask;
          setTask(t);
          setTitle(t.title || "");
          setAssignedTo(String(t.assignedTo || ""));
          setDueDate(formatForInput(t.dueDate as unknown as string));
          setMessage(t.message || "");
        }
      } catch (e: any) {
        toast.error(e?.message || "Failed to load task.");
      } finally {
        if (!cancelled) setLoadingTask(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  /* 2) fetch multitasking manpower FIRST (if applicable) */
  const fetchManpowerForMultitask = useCallback(async (mtId: string) => {
    if (!mtId || mtId.length < 10) {
      setMultiManpowerIds([]);
      return;
    }
    setLoadingManpower(true);
    try {
      // You used TaskDetails(mtId) earlier to get "manpower" for multitasking
      const res = await TaskDetails(mtId);
      if (res?.success && Array.isArray(res?.data?.manpower)) {
        const ids = res.data.manpower
          .map((m: any) => String(m?.userId))
          .filter(Boolean);
        setMultiManpowerIds(ids);
      } else {
        setMultiManpowerIds([]);
      }
    } catch (e: any) {
      setMultiManpowerIds([]);
      toast.error(e?.message || "Failed to fetch multitasking manpower.");
    } finally {
      setLoadingManpower(false);
    }
  }, []);

  // Trigger manpower fetch once we know the task
  useEffect(() => {
    if (!task) return;
    if (task.multiTask && (task as any).multiTaskId) {
      fetchManpowerForMultitask(String((task as any).multiTaskId));
    } else {
      setMultiManpowerIds([]);
    }
  }, [task, fetchManpowerForMultitask]);

  /* 3) then fetch active LMU users (your logic) */
  const fetchActiveLmuMembers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const q = new URLSearchParams({
        unit: "LMU",
        status: "active",
        limit: "1000",
      });
      const res = await getAllUsers(q.toString());
      const mapped = normalizeUsersResponse(res);

      const needsLookup = mapped.filter(
        (u) => !u.name || u.name === u._id || /^[0-9a-f]{24}$/i.test(u.name)
      );

      if (needsLookup.length) {
        const filled = await Promise.all(
          mapped.map(async (u) => {
            if (u.name && u.name !== u._id && !/^[0-9a-f]{24}$/i.test(u.name))
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
        filled.sort((a, b) => a.name.localeCompare(b.name));
        setUsers(filled);
      } else {
        mapped.sort((a, b) => a.name.localeCompare(b.name));
        setUsers(mapped);
      }

      if (!(mapped.length || needsLookup.length))
        toast.info("No active LMU members found.");
    } catch (e: any) {
      setUsers([]);
      toast.error(e?.message || "Failed to fetch LMU members.");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // fetch users AFTER (or in parallel with) manpower; order guaranteed by separate effects
  useEffect(() => {
    fetchActiveLmuMembers();
  }, [fetchActiveLmuMembers]);

  /* 4) combine: manpower IDs + user list (dedup + name lookup for missing) */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const map = new Map<string, TUserOption>();

      // start with LMU active users
      users.forEach((u) => map.set(u._id, u));

      // ensure all manpower IDs are present (lookup names if needed)
      if (multiManpowerIds.length) {
        const missingIds = multiManpowerIds.filter((id) => !map.has(id));
        if (missingIds.length) {
          try {
            const lookups = await Promise.all(
              missingIds.map(async (id) => {
                const r = await getUserNameById(id);
                const name =
                  r?.data?.name ||
                  [r?.data?.firstName, r?.data?.lastName]
                    .filter(Boolean)
                    .join(" ") ||
                  r?.data?.email ||
                  id;
                return { _id: id, name } as TUserOption;
              })
            );
            lookups.forEach((u) => map.set(u._id, u));
          } catch {
            // ignore lookup errors
          }
        }
      }

      const sorted = Array.from(map.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      if (!cancelled) setCombinedUsers(sorted);

      // keep assignedTo valid
      if (assignedTo && !sorted.find((u) => u._id === assignedTo)) {
        setAssignedTo("");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [users, multiManpowerIds, assignedTo]);

  /* update */
  const onUpdate = async () => {
    if (!title.trim()) return toast.warning("Title is required.");
    if (!assignedTo) return toast.warning("Please select an assignee.");
    if (!dueDate) return toast.warning("Due date is required.");

    const payload = {
      title: title.trim(),
      assignedTo,
      dueDate: toApiTimestamp(dueDate),
      message: message.trim(),
    };

    try {
      setSaving(true);
      const res = await updateLeadsTask(String(id), payload as any);
      if (res?.success) {
        toast.success(res?.message || "Task updated successfully.");
        const fresh = await TaskDetails(String(id));
        if (fresh?.success) setTask(fresh.data);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onResetToServer = () => {
    if (!task) return;
    setTitle(task.title || "");
    setAssignedTo(String(task.assignedTo || ""));
    setDueDate(formatForInput(task.dueDate as unknown as string));
    setMessage(task.message || "");
  };

  /* UI */
  const pageCls = clsx(
    "min-h-screen w-full px-4 py-6 rounded-xl transition-colors duration-300",
    isDark
      ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
      : "bg-white text-black"
  );
  const cardCls = clsx(
    "rounded-xl p-6 border space-y-5",
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

  if (!mounted) {
    return (
      <div className="min-h-screen w-full px-4 py-6 rounded-xl bg-gray-100 dark:bg-black" />
    );
  }

  if (loadingTask) {
    const sk = (c = "") =>
      clsx(
        "h-10 w-full rounded-xl",
        isDark ? "bg-[#2a2a2a]" : "bg-gray-100",
        c
      );
    return (
      <div className={pageCls}>
        <div className="max-w-full mx-auto space-y-6">
          <Skeleton className={sk()} />
          <Skeleton className={sk()} />
          <Skeleton className={sk()} />
          <Skeleton className={sk()} />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className={pageCls}>
        <div className="max-w-3xl mx-auto">
          <p className="text-red-500">Task not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={pageCls}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Update Leads Task</h1>
        <p className="mt-1 text-sm opacity-80">
          Assign from multitasking manpower first, then LMU users
          (de-duplicated).
        </p>
      </div>

      <div className="space-y-6 max-w-full mx-auto">
        <div className={cardCls}>
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., WhatsApp for Arko (Wens Task 1)"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
          </div>

          {/* Assign To (multitasking manpower + LMU users) */}
          <div className="grid gap-2">
            <Label htmlFor="assignedTo">Assign To</Label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className={fieldCls}
              disabled={loadingManpower || loadingUsers}
            >
              <option value="">
                {loadingManpower || loadingUsers
                  ? "Loading options…"
                  : combinedUsers.length
                  ? "Select a user"
                  : "No users available"}
              </option>

              {/* Show manpower users first if you want visual grouping */}
              {multiManpowerIds.length > 0 && (
                <optgroup
                  label={`Multitasking Manpower (${multiManpowerIds.length})`}
                >
                  {combinedUsers
                    .filter((u) => multiManpowerIds.includes(u._id))
                    .map((u) => (
                      <option key={`mt-${u._id}`} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                </optgroup>
              )}

              <optgroup label="LMU Active Users">
                {combinedUsers
                  .filter((u) => !multiManpowerIds.includes(u._id))
                  .map((u) => (
                    <option key={`lmu-${u._id}`} value={u._id}>
                      {u.name}
                    </option>
                  ))}
              </optgroup>
            </select>

            <p className="text-xs opacity-70">
              {loadingManpower
                ? "Loading multitasking manpower…"
                : multiManpowerIds.length
                ? `Manpower found: ${multiManpowerIds.length}`
                : "No multitasking manpower loaded."}
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
          </div>

          {/* Message */}
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Short note for the assignee"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={onUpdate}
              disabled={saving}
              className={clsx(
                "rounded-xl",
                isDark
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-neutral-900 hover:bg-neutral-800 text-white"
              )}
            >
              {saving ? "Saving…" : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (!task) return;
                setTitle(task.title || "");
                setAssignedTo(String(task.assignedTo || ""));
                setDueDate(formatForInput(task.dueDate as unknown as string));
                setMessage(task.message || "");
              }}
              className={isDark ? "border-neutral-700 text-neutral-300" : ""}
            >
              Reset to Server
            </Button>
          </div>
        </div>

        {(loadingUsers || loadingManpower) && (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton
                key={i}
                className={`h-12 w-full rounded-xl ${
                  isDark ? "bg-[#2a2a2a]" : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateLeadsTask;
