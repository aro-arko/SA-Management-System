/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { addDays } from "date-fns";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getAllUsers,
  TaskDetails,
  getUserNameById,
} from "@/services/UserService";
import {
  createLeadsTask,
  leadsGoals,
} from "@/services/LMUService/leadsManagement";

import { TCreateLeadsTask, TUserOption } from "@/types/lmu/leadsTask.type";
import { getAllMultitaskings } from "@/services/LMUService/multitaskings";

const pad = (n: number) => String(n).padStart(2, "0");

type TGoalOption = { _id: string; title: string };
type TMultitaskingOption = { _id: string; title: string };

const CreateLeadsTask = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";

  // Form State
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"whatsapp" | "email" | "calling" | "other">(
    "whatsapp"
  );
  const [goalId, setGoalId] = useState<string>("");
  const [multiTask, setMultiTask] = useState<boolean>(false);
  const [multiTaskId, setMultiTaskId] = useState<string>("");
  const [totalLeads, setTotalLeads] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = addDays(new Date(), 1);
    d.setHours(23, 59, 0, 0);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [message, setMessage] = useState("");

  // Users / Manpower
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<TUserOption[]>([]);
  const [multiManpowerIds, setMultiManpowerIds] = useState<string[]>([]);
  const [loadingManpower, setLoadingManpower] = useState(false);

  // Goals
  const [goals, setGoals] = useState<TGoalOption[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(false);

  // Multitaskings
  const [multitaskings, setMultitaskings] = useState<TMultitaskingOption[]>([]);
  const [loadingMultitaskings, setLoadingMultitaskings] = useState(false);

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

  // fetching
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

  const fetchManpowerForMultitask = useCallback(async (mtId: string) => {
    if (!mtId || mtId.length < 10) {
      setMultiManpowerIds([]);
      return;
    }
    setLoadingManpower(true);
    try {
      const res = await TaskDetails(mtId);
      if (res?.success && Array.isArray(res?.data?.manpower)) {
        setMultiManpowerIds(
          res.data.manpower.map((m: any) => String(m?.userId)).filter(Boolean)
        );
      } else setMultiManpowerIds([]);
    } catch (e: any) {
      setMultiManpowerIds([]);
      toast.error(e?.message || "Failed to fetch multitasking manpower.");
    } finally {
      setLoadingManpower(false);
    }
  }, []);

  const fetchGoals = useCallback(async () => {
    setLoadingGoals(true);
    try {
      const res = await leadsGoals("isActive=true&limit=50");
      if (res?.success && Array.isArray(res?.data)) {
        const mapped: TGoalOption[] = res.data.map((g: any) => ({
          _id: String(g?._id || ""),
          title: g?.title || "(Untitled Goal)",
        }));
        mapped.sort((a, b) => a.title.localeCompare(b.title));
        setGoals(mapped);
      } else {
        setGoals([]);
        toast.info("No active goals found.");
      }
    } catch (err: any) {
      setGoals([]);
      toast.error(err?.message || "Failed to fetch goals.");
    } finally {
      setLoadingGoals(false);
    }
  }, []);

  //  (status=active)
  const fetchMultitaskings = useCallback(async () => {
    setLoadingMultitaskings(true);
    try {
      const res = await getAllMultitaskings("status=active");
      if (res?.success && Array.isArray(res?.data)) {
        const mapped: TMultitaskingOption[] = res.data.map((mt: any) => ({
          _id: String(mt?._id || ""),
          title: mt?.title || "(Untitled Multitasking)",
        }));
        mapped.sort((a, b) => a.title.localeCompare(b.title));
        setMultitaskings(mapped);
      } else {
        setMultitaskings([]);
        toast.info("No active multitaskings found.");
      }
    } catch (err: any) {
      setMultitaskings([]);
      toast.error(err?.message || "Failed to fetch multitaskings.");
    } finally {
      setLoadingMultitaskings(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveLmuMembers();
    fetchGoals();
    fetchMultitaskings();
  }, [fetchActiveLmuMembers, fetchGoals, fetchMultitaskings]);

  useEffect(() => {
    if (multiTask && multiTaskId) fetchManpowerForMultitask(multiTaskId);
    else setMultiManpowerIds([]);
  }, [multiTask, multiTaskId, fetchManpowerForMultitask]);

  // merge users + multitasking manpower names (dedup)
  const [combinedUsers, setCombinedUsers] = useState<TUserOption[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const map = new Map<string, TUserOption>();
      users.forEach((u) => map.set(u._id, u));
      if (multiTask && multiManpowerIds.length) {
        const missing = multiManpowerIds.filter((id) => !map.has(id));
        if (missing.length) {
          try {
            const lookups = await Promise.all(
              missing.map(async (id) => {
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
          } catch {}
        }
      }
      const sorted = Array.from(map.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      if (!cancelled) setCombinedUsers(sorted);
    })();
    return () => {
      cancelled = true;
    };
  }, [users, multiTask, multiManpowerIds]);

  useEffect(() => {
    if (assignedTo && !combinedUsers.find((u) => u._id === assignedTo))
      setAssignedTo("");
  }, [combinedUsers, assignedTo]);

  const [submitting, setSubmitting] = useState(false);

  // ---------- submit ----------
  const onSubmit = async () => {
    if (!title.trim()) return toast.warning("Title is required.");
    if (!type) return toast.warning("Type is required.");
    if (multiTask && !multiTaskId.trim())
      return toast.warning("Please choose a Multitasking.");
    if (!totalLeads || Number(totalLeads) <= 0)
      return toast.warning("Total leads must be greater than 0.");
    if (!assignedTo) return toast.warning("Please select an assignee.");
    if (!dueDate) return toast.warning("Due date is required.");

    const payload: TCreateLeadsTask = {
      title: title.trim(),
      type,
      goalId: goalId?.trim() ? goalId.trim() : undefined,
      multiTask,
      multiTaskId: multiTask ? multiTaskId.trim() : undefined, // comes from dropdown
      totalLeads: Number(totalLeads),
      assignedTo,
      // "YYYY-MM-DDTHH:mm:ss"
      dueDate: new Date(dueDate).toISOString().slice(0, 19),
      message: message.trim(),
    };

    try {
      setSubmitting(true);
      const res = await createLeadsTask(payload);

      if (res?.success) {
        toast.success(res?.message || "Leads task created.");
        // reset
        setTitle("");
        setType("whatsapp");
        setGoalId("");
        setMultiTask(false);
        setMultiTaskId("");
        setTotalLeads("");
        setAssignedTo("");
        setMessage("");
        setMultiManpowerIds([]);
      } else {
        const msg =
          res?.message ||
          (Array.isArray(res?.errors)
            ? res.errors.map((e: any) => e.message).join(", ")
            : "") ||
          "Failed to create task.";
        toast.error(msg);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to create task.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen w-full px-4 py-6 rounded-xl bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  return (
    <div className={pageCls}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create Leads Task</h1>
        <p className="mt-1">
          Assign a WhatsApp / Email / Calling task to a member.
        </p>
      </div>

      <div className="space-y-6 max-w-full mx-auto">
        <div className={cardCls}>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., WhatsApp follow-up for Batch A"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className={fieldCls}
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="calling">Calling</option>
            </select>
          </div>

          {/* Goal dropdown by title */}
          <div className="grid gap-2">
            <Label htmlFor="goalId">Goal (optional)</Label>
            <select
              id="goalId"
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
              className={fieldCls}
              disabled={loadingGoals}
            >
              <option value="">
                {loadingGoals ? "Loading goals..." : "Select a goal (optional)"}
              </option>
              {goals.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.title}
                </option>
              ))}
            </select>
            <p className="text-xs opacity-70">
              Showing active goals (limit 50). Sorted by title A→Z.
            </p>
          </div>

          {/* Multitasking toggle + dropdown by title */}
          <div className="grid gap-2">
            <Label>Is this part of a multitasking?</Label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setMultiTask((v) => !v);
                  // clear selection and manpower when toggling off
                  if (multiTask) {
                    setMultiTaskId("");
                    setMultiManpowerIds([]);
                  }
                }}
                className={clsx(
                  "px-4 py-2 rounded-md text-sm border transition",
                  multiTask
                    ? isDark
                      ? "bg-white/10 border-white/20"
                      : "bg-neutral-900 text-white border-neutral-800"
                    : isDark
                    ? "bg-black/40 border-neutral-700"
                    : "bg-white border-gray-300"
                )}
              >
                {multiTask ? "Yes (toggle off)" : "No (toggle on)"}
              </button>
              <span className="text-sm opacity-80">
                {multiTask
                  ? "Includes manpower from the selected Multitasking."
                  : "Only active LMU members will be listed."}
              </span>
            </div>
          </div>

          {multiTask && (
            <div className="grid gap-2">
              <Label htmlFor="multitasking">Multitasking</Label>
              <select
                id="multitasking"
                value={multiTaskId}
                onChange={(e) => setMultiTaskId(e.target.value)}
                className={fieldCls}
                disabled={loadingMultitaskings}
              >
                <option value="">
                  {loadingMultitaskings
                    ? "Loading multitaskings..."
                    : "Select a multitasking"}
                </option>
                {multitaskings.map((mt) => (
                  <option key={mt._id} value={mt._id}>
                    {mt.title}
                  </option>
                ))}
              </select>
              <p className="text-xs opacity-70">
                {loadingManpower
                  ? "Loading manpower from multitasking…"
                  : multiManpowerIds.length
                  ? `Manpower found: ${multiManpowerIds.length}`
                  : "No manpower loaded yet."}
              </p>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="totalLeads">Total Leads</Label>
            <Input
              id="totalLeads"
              type="number"
              min={1}
              value={totalLeads}
              onChange={(e) => setTotalLeads(e.target.value)}
              placeholder="e.g., 100"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="assignedTo">Assign To</Label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className={fieldCls}
              disabled={loadingUsers || (multiTask && loadingManpower)}
            >
              <option value="">
                {loadingUsers || (multiTask && loadingManpower)
                  ? "Loading users…"
                  : combinedUsers.length
                  ? "Select a user"
                  : "No users available"}
              </option>
              {combinedUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
            <p className="text-xs opacity-70">
              {multiTask
                ? "Active LMU members + Multitasking manpower"
                : "Active LMU members"}
            </p>
          </div>

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

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={onSubmit}
              disabled={submitting}
              className={clsx(
                "rounded-xl",
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
                setType("whatsapp");
                setGoalId("");
                setMultiTask(false);
                setMultiTaskId("");
                setTotalLeads("");
                setAssignedTo("");
                setMessage("");
                setMultiManpowerIds([]);
              }}
              className={isDark ? "border-neutral-700 text-neutral-300" : ""}
            >
              Reset
            </Button>
          </div>
        </div>

        {(loadingUsers || (multiTask && loadingManpower)) && (
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

export default CreateLeadsTask;
