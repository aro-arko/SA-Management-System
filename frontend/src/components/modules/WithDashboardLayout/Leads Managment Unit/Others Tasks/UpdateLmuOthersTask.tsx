/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { X, UserPlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import {
  getAllUsers,
  TaskDetails,
  getUserNameById,
} from "@/services/UserService";
import { getAllMultitaskings } from "@/services/LMUService/multitaskings";
import { updateLMUOtherTask } from "@/services/LMUService/others tasks"; // keep same path style you used
import { TUpdateLMUOthersTask } from "@/types/lmu/others.type";

type TUserOption = { _id: string; name: string };
type TMultitaskingOption = { _id: string; title: string };

const UpdateLmuOthersTask = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";

  // ---------- page style ----------
  const pageCls = useMemo(
    () =>
      clsx(
        "min-h-screen w-full px-4 py-6 rounded-xl transition-colors duration-300",
        isDark
          ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
          : "bg-white text-black"
      ),
    [isDark]
  );
  const cardCls = useMemo(
    () =>
      clsx(
        "rounded-xl p-6 border space-y-5",
        isDark
          ? "bg-black/30 backdrop-blur-md border-[#333] text-neutral-100"
          : "bg-white/80 backdrop-blur-md border-neutral-200 text-neutral-900"
      ),
    [isDark]
  );
  const fieldCls = useMemo(
    () =>
      clsx(
        "w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
        isDark
          ? "bg-black text-white border-neutral-700"
          : "bg-white border-gray-300"
      ),
    [isDark]
  );

  // ---------- form ----------
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [multiTask, setMultiTask] = useState(false);
  const [multiTaskId, setMultiTaskId] = useState("");
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [status, setStatus] = useState<"in-progress" | "completed">(
    "in-progress"
  );

  // ---------- lookups ----------
  const [loading, setLoading] = useState(true); // initial task load
  const [submitting, setSubmitting] = useState(false);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<TUserOption[]>([]);

  const [loadingMultitaskings, setLoadingMultitaskings] = useState(false);
  const [multitaskings, setMultitaskings] = useState<TMultitaskingOption[]>([]);

  const [loadingManpower, setLoadingManpower] = useState(false);
  const [multiManpowerIds, setMultiManpowerIds] = useState<string[]>([]);

  // merged (LMU active + any manpower-only users)
  const [combinedUsers, setCombinedUsers] = useState<TUserOption[]>([]);
  const [search, setSearch] = useState("");

  // ---------- helpers ----------
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
        return { _id: id, name };
      })
      .filter(Boolean) as TUserOption[];
  };

  // ---------- initial task load ----------
  const loadTask = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await TaskDetails(String(id));
      if (res?.success && res?.data) {
        const t = res.data as any; // TLMUOthersTask-like
        setTitle(t?.title || "");
        setDetails(t?.details || "");
        setMultiTask(Boolean(t?.multiTask));
        setMultiTaskId(t?.multiTaskId ? String(t.multiTaskId) : "");
        setAssignedTo(
          Array.isArray(t?.assignedTo) ? t.assignedTo.map(String) : []
        );
        setStatus(t?.status || "in-progress");
      } else {
        toast.error(res?.message || "Failed to load others task.");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to load others task.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ---------- users / multitaskings / manpower ----------
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

      // fill names if needed
      const needsLookup = mapped.filter(
        (u) => !u.name || u.name === u._id || /^[0-9a-f]{24}$/i.test(u.name)
      );

      let finalList = mapped;
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
        finalList = filled;
      }

      finalList.sort((a, b) => a.name.localeCompare(b.name));
      setUsers(finalList);
    } catch (e: any) {
      setUsers([]);
      toast.error(e?.message || "Failed to fetch LMU members.");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

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

  const fetchManpowerForMultitask = useCallback(async (mtId: string) => {
    if (!mtId) {
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

  // boot
  useEffect(() => {
    loadTask();
    fetchActiveLmuMembers();
    fetchMultitaskings();
  }, [loadTask, fetchActiveLmuMembers, fetchMultitaskings]);

  // when task has multiTask + multiTaskId, load manpower
  useEffect(() => {
    if (multiTask && multiTaskId) fetchManpowerForMultitask(multiTaskId);
    else setMultiManpowerIds([]);
  }, [multiTask, multiTaskId, fetchManpowerForMultitask]);

  // merge LMU + manpower (and ensure currently assigned users are present too)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const map = new Map<string, TUserOption>();
      users.forEach((u) => map.set(u._id, u));

      // add manpower-only users
      const fromManpower = multiTask ? multiManpowerIds : [];
      const missingManpower = fromManpower.filter((id) => !map.has(id));

      // also ensure current assignedTo users are present in the list
      const missingAssigned = assignedTo.filter((id) => !map.has(id));

      const needLookups = Array.from(
        new Set([...missingManpower, ...missingAssigned])
      );
      if (needLookups.length) {
        try {
          const lookups = await Promise.all(
            needLookups.map(async (id) => {
              try {
                const r = await getUserNameById(id);
                const name =
                  r?.data?.name ||
                  [r?.data?.firstName, r?.data?.lastName]
                    .filter(Boolean)
                    .join(" ") ||
                  r?.data?.email ||
                  id;
                return { _id: id, name } as TUserOption;
              } catch {
                return { _id: id, name: id } as TUserOption;
              }
            })
          );
          lookups.forEach((u) => map.set(u._id, u));
        } catch {}
      }

      const merged = Array.from(map.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      if (!cancelled) setCombinedUsers(merged);
    })();
    return () => {
      cancelled = true;
    };
  }, [users, multiTask, multiManpowerIds, assignedTo]);

  // keep assignedTo valid if list changes radically
  useEffect(() => {
    if (!assignedTo.length) return;
    const setIds = new Set(combinedUsers.map((u) => u._id));
    const filtered = assignedTo.filter((id2) => setIds.has(id2));
    if (filtered.length !== assignedTo.length) setAssignedTo(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combinedUsers]);

  // ---------- selection handlers (click to add / chip to remove) ----------
  const addAssignee = (uid: string) => {
    setAssignedTo((prev) => (prev.includes(uid) ? prev : [...prev, uid]));
  };
  const removeAssignee = (uid: string) => {
    setAssignedTo((prev) => prev.filter((x) => x !== uid));
  };

  // filtered lists
  const manpowerUsers = useMemo(
    () =>
      combinedUsers
        .filter((u) => multiManpowerIds.includes(u._id))
        .filter((u) =>
          u.name.toLowerCase().includes(search.trim().toLowerCase())
        ),
    [combinedUsers, multiManpowerIds, search]
  );
  const lmuUsers = useMemo(
    () =>
      combinedUsers
        .filter((u) => !multiManpowerIds.includes(u._id))
        .filter((u) =>
          u.name.toLowerCase().includes(search.trim().toLowerCase())
        ),
    [combinedUsers, multiManpowerIds, search]
  );

  // ---------- submit ----------
  const onSubmit = async () => {
    if (!title.trim()) return toast.warning("Title is required.");
    if (!details.trim()) return toast.warning("Details are required.");
    if (multiTask && !multiTaskId)
      return toast.warning("Please choose a multitasking.");
    if (!assignedTo.length)
      return toast.warning("Please select at least one assignee.");
    if (!status.trim()) return toast.warning("Status is required.");

    const payload: TUpdateLMUOthersTask = {
      title: title.trim(),
      details: details.trim(),
      multiTask,
      multiTaskId: multiTask ? multiTaskId : undefined,
      assignedTo,
      status: status, // already typed as "in-progress" | "completed"
    };

    try {
      setSubmitting(true);
      const res = await updateLMUOtherTask(payload, String(id));
      if (res?.success) {
        toast.success(res?.message || "Others task updated.");
      } else {
        toast.error(res?.message || "Failed to update others task.");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to update others task.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- UI ----------
  if (!mounted) {
    return (
      <div className="min-h-screen w-full px-4 py-6 rounded-xl bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  if (loading) {
    return (
      <div className={pageCls}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto w-60">
              <Skeleton className="h-8 rounded-xl" />
            </div>
            <div className="mx-auto w-72">
              <Skeleton className="h-4 rounded" />
            </div>
          </div>

          <div className="rounded-xl p-6 border bg-gray-50/70 dark:bg-neutral-900/50 backdrop-blur-md border-neutral-200 dark:border-neutral-800 space-y-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className={`h-10 w-full rounded-md ${
                  isDark ? "bg-[#2a2a2a]" : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const selectedMultitaskingTitle =
    multitaskings.find((m) => m._id === multiTaskId)?.title || "";

  return (
    <div className={pageCls}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Update Others Task
        </h1>
        <p className="mt-1 text-sm opacity-80">
          Edit details, linked multitasking, members, and status.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        <div className={cardCls}>
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., LMU Ad hoc meeting"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
              disabled={submitting}
            />
          </div>

          {/* Details */}
          <div className="grid gap-2">
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Add context or instructions…"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
              disabled={submitting}
            />
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
              disabled={submitting}
            >
              <option value="in-progress">in-progress</option>
              <option value="completed">completed</option>
            </select>
          </div>

          {/* Multitasking toggle */}
          <div className="grid gap-2">
            <Label>Is this part of a multitasking?</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const next = !multiTask;
                  setMultiTask(next);
                  if (!next) {
                    setMultiTaskId("");
                    setMultiManpowerIds([]);
                  }
                }}
                className={isDark ? "border-neutral-700" : ""}
                disabled={submitting}
              >
                {multiTask
                  ? "Yes (click to turn off)"
                  : "No (click to turn on)"}
              </Button>
              <span className="text-sm opacity-80">
                {multiTask
                  ? "Manpower list from selected multitasking will be available."
                  : "Only active LMU members are listed."}
              </span>
            </div>
          </div>

          {/* Multitasking picker + title */}
          {multiTask && (
            <div className="grid gap-2">
              <Label htmlFor="multiTaskId">Multitasking</Label>
              <select
                id="multiTaskId"
                value={multiTaskId}
                onChange={(e) => setMultiTaskId(e.target.value)}
                className={fieldCls}
                disabled={submitting || loadingMultitaskings}
              >
                <option value="">
                  {loadingMultitaskings
                    ? "Loading multitaskings…"
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
                  ? "Loading manpower…"
                  : multiManpowerIds.length
                  ? `Manpower found: ${multiManpowerIds.length}`
                  : "No manpower loaded."}
              </p>

              {selectedMultitaskingTitle ? (
                <p className="text-xs opacity-80">
                  Selected multitasking:{" "}
                  <span className="font-medium">
                    {selectedMultitaskingTitle}
                  </span>
                </p>
              ) : null}
            </div>
          )}

          {/* Quick search */}
          <div className="grid gap-2">
            <Label htmlFor="search">Find members</Label>
            <Input
              id="search"
              placeholder="Type a name to filter…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
              disabled={
                submitting || loadingUsers || (multiTask && loadingManpower)
              }
            />
          </div>

          {/* Selected chips */}
          <div className="grid gap-2">
            <Label>Selected Assignees</Label>
            {assignedTo.length ? (
              <div className="flex flex-wrap gap-2">
                {assignedTo.map((uid) => {
                  const u = combinedUsers.find((x) => x._id === uid);
                  const label = u?.name || uid;
                  return (
                    <Badge
                      key={uid}
                      variant="secondary"
                      className={clsx(
                        "flex items-center gap-1 pr-1",
                        isDark ? "bg-white/10 text-white" : ""
                      )}
                    >
                      <span>{label}</span>
                      <button
                        type="button"
                        onClick={() => removeAssignee(uid)}
                        className="ml-1 inline-flex items-center justify-center rounded p-0.5 hover:opacity-80"
                        aria-label={`Remove ${label}`}
                        title={`Remove ${label}`}
                        disabled={submitting}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm opacity-70">No assignees selected yet.</p>
            )}
          </div>

          {/* Picker lists */}
          <div className="grid gap-4">
            {multiTask && (
              <div>
                <div className="flex items-center justify-between">
                  <Label>Multitasking Manpower</Label>
                  <span className="text-xs opacity-70">
                    {manpowerUsers.length} shown
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {manpowerUsers.map((u) => {
                    const chosen = assignedTo.includes(u._id);
                    return (
                      <button
                        key={`mt-${u._id}`}
                        type="button"
                        onClick={() => addAssignee(u._id)}
                        disabled={chosen || submitting}
                        className={clsx(
                          "flex items-center justify-between rounded-md border px-3 py-2 text-left transition",
                          isDark
                            ? "bg-black/40 border-neutral-700"
                            : "bg-white border-gray-300",
                          chosen
                            ? "opacity-60 cursor-not-allowed"
                            : isDark
                            ? "hover:bg-white/10"
                            : "hover:bg-gray-50"
                        )}
                        title={chosen ? "Already selected" : "Add assignee"}
                      >
                        <span className="truncate">{u.name}</span>
                        {!chosen && <UserPlus className="h-4 w-4 opacity-70" />}
                      </button>
                    );
                  })}
                  {!manpowerUsers.length && (
                    <p className="text-sm opacity-70">
                      {loadingManpower
                        ? "Loading manpower…"
                        : "No manpower matches your search."}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <Label>LMU Active Users</Label>
                <span className="text-xs opacity-70">
                  {lmuUsers.length} shown
                </span>
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lmuUsers.map((u) => {
                  const chosen = assignedTo.includes(u._id);
                  return (
                    <button
                      key={`lmu-${u._id}`}
                      type="button"
                      onClick={() => addAssignee(u._id)}
                      disabled={chosen || submitting}
                      className={clsx(
                        "flex items-center justify-between rounded-md border px-3 py-2 text-left transition",
                        isDark
                          ? "bg-black/40 border-neutral-700"
                          : "bg-white border-gray-300",
                        chosen
                          ? "opacity-60 cursor-not-allowed"
                          : isDark
                          ? "hover:bg-white/10"
                          : "hover:bg-gray-50"
                      )}
                      title={chosen ? "Already selected" : "Add assignee"}
                    >
                      <span className="truncate">{u.name}</span>
                      {!chosen && <UserPlus className="h-4 w-4 opacity-70" />}
                    </button>
                  );
                })}
                {!lmuUsers.length && (
                  <p className="text-sm opacity-70">
                    {loadingUsers
                      ? "Loading users…"
                      : "No users match your search."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={onSubmit}
              disabled={submitting}
              className={clsx(
                "rounded-md",
                isDark
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-neutral-900 hover:bg-neutral-800 text-white"
              )}
            >
              {submitting ? "Saving…" : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Reload original values from API
                loadTask();
                // leave lookups as-is; manpower will be refreshed by effect if needed
                setSearch("");
              }}
              className={isDark ? "border-neutral-700 text-neutral-300" : ""}
              disabled={submitting}
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

export default UpdateLmuOthersTask;
