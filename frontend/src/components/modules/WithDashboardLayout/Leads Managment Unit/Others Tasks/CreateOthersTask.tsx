/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { X, UserPlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge"; // If not available, replace with a span

import {
  getAllUsers,
  TaskDetails,
  getUserNameById,
} from "@/services/UserService";
import { getAllMultitaskings } from "@/services/LMUService/multitaskings";
import { createLMUOtherTask } from "@/services/LMUService/others tasks";

type TCreateLMUOthersTask = {
  title: string;
  details: string;
  multiTask: boolean;
  multiTaskId?: string;
  assignedTo: string[];
};

type TUserOption = { _id: string; name: string };
type TMultitaskingOption = { _id: string; title: string };

const CreateOthersTask = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";

  // ---------- form ----------
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [multiTask, setMultiTask] = useState(false);
  const [multiTaskId, setMultiTaskId] = useState("");
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // ---------- lookups ----------
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<TUserOption[]>([]);

  const [loadingMultitaskings, setLoadingMultitaskings] = useState(false);
  const [multitaskings, setMultitaskings] = useState<TMultitaskingOption[]>([]);

  const [loadingManpower, setLoadingManpower] = useState(false);
  const [multiManpowerIds, setMultiManpowerIds] = useState<string[]>([]);

  // Merged list (LMU active + any manpower members not in LMU active)
  const [combinedUsers, setCombinedUsers] = useState<TUserOption[]>([]);

  // simple search
  const [search, setSearch] = useState("");

  // ---------- styles ----------
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

  // ---------- fetchers ----------
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

      if (!(finalList.length || needsLookup.length))
        toast.info("No active LMU members found.");
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

  useEffect(() => {
    fetchActiveLmuMembers();
    fetchMultitaskings();
  }, [fetchActiveLmuMembers, fetchMultitaskings]);

  useEffect(() => {
    if (multiTask && multiTaskId) fetchManpowerForMultitask(multiTaskId);
    else setMultiManpowerIds([]);
  }, [multiTask, multiTaskId, fetchManpowerForMultitask]);

  // merge users + multitask manpower (fetch any missing userIds from manpower)
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
      }

      const merged = Array.from(map.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      if (!cancelled) setCombinedUsers(merged);
    })();
    return () => {
      cancelled = true;
    };
  }, [users, multiTask, multiManpowerIds]);

  // keep selection valid
  useEffect(() => {
    if (!assignedTo.length) return;
    const setIds = new Set(combinedUsers.map((u) => u._id));
    const filtered = assignedTo.filter((id) => setIds.has(id));
    if (filtered.length !== assignedTo.length) setAssignedTo(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combinedUsers]);

  // ---------- selection handlers (click to add / chip to remove) ----------
  const addAssignee = (id: string) => {
    setAssignedTo((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };
  const removeAssignee = (id: string) => {
    setAssignedTo((prev) => prev.filter((x) => x !== id));
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

    const payload: TCreateLMUOthersTask = {
      title: title.trim(),
      details: details.trim(),
      multiTask,
      multiTaskId: multiTask ? multiTaskId : undefined,
      assignedTo,
    };

    try {
      setSubmitting(true);
      const res = await createLMUOtherTask(payload);
      if (res?.success) {
        toast.success(res?.message || "Others task created.");
        // reset
        setTitle("");
        setDetails("");
        setMultiTask(false);
        setMultiTaskId("");
        setAssignedTo([]);
        setMultiManpowerIds([]);
      } else {
        toast.error(res?.message || "Failed to create others task.");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to create others task.");
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

  const selectedMultitaskingTitle =
    multitaskings.find((m) => m._id === multiTaskId)?.title || "";

  return (
    <div className={pageCls}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Create Others Task
        </h1>
        <p className="mt-1 text-sm opacity-80">
          Create an ad-hoc LMU task. You can link it to a multitasking to pull
          its manpower.
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
                            ? isDark
                              ? "opacity-60 cursor-not-allowed"
                              : "opacity-60 cursor-not-allowed"
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
                          ? isDark
                            ? "opacity-60 cursor-not-allowed"
                            : "opacity-60 cursor-not-allowed"
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
              {submitting ? "Creating…" : "Create Task"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setTitle("");
                setDetails("");
                setMultiTask(false);
                setMultiTaskId("");
                setAssignedTo([]);
                setMultiManpowerIds([]);
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

export default CreateOthersTask;
