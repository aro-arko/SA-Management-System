/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { UserPlus, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { formatToMalaysiaTime } from "@/utils/formatDate";
import { TCreateDsmmTask } from "@/types/dsmm/task.type";
import { createDsmmTask } from "@/services/DSMMService/dsmmtask";
import {
  getDSMMMultitaskings,
  getDSMMMultitaskingById,
} from "@/services/DSMMService/multitasking";
import { getAllUsers, getUserNameById } from "@/services/UserService";

type TOption = { _id: string; title: string };
type TUserOption = { _id: string; name: string };

const nice = (s: string) => (s ?? "").trim();
const looksLikeObjectId = (s?: string) => !!s && /^[0-9a-f]{24}$/i.test(s);

// normalize users from various endpoints
const normalizeUsers = (src: any): TUserOption[] => {
  const arr = Array.isArray(src?.data)
    ? src.data
    : Array.isArray(src)
    ? src
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
        id; // may still be an ID → resolve below
      return { _id: id, name };
    })
    .filter(Boolean) as TUserOption[];
};

// helper: get today as yyyy-MM-dd in MYT
const todayMYDate = () =>
  formatToMalaysiaTime(new Date().toISOString(), "yyyy-MM-dd");

// helper: convert yyyy-MM-dd (interpreted as MYT midnight) to ISO
const myDateToIso = (yyyyMmDd: string) =>
  new Date(`${yyyyMmDd}T00:00:00+08:00`).toISOString();

// safe unwrap for getUserNameById (it may return an error string)
const getSafeDisplayName = async (userId: string) => {
  try {
    const r = await getUserNameById(userId);
    if (typeof r === "string") return userId; // error string fallback
    const name =
      r?.data?.name ||
      [r?.data?.firstName, r?.data?.lastName].filter(Boolean).join(" ") ||
      r?.data?.email ||
      userId;
    return name;
  } catch {
    return userId;
  }
};

const CreateDsmmTask = () => {
  const { resolvedTheme } = useTheme();

  // --- HYDRATION-SAFE MOUNT GATE ---
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  // -------- form state --------
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const [multiTask, setMultiTask] = useState(false);
  const [multiTaskId, setMultiTaskId] = useState("");

  const [taskDate, setTaskDate] = useState<string>(todayMYDate());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("17:00");

  // optional manpower linked to selected multitasking + DSMM users
  const [selectedManpower, setSelectedManpower] = useState<string[]>([]);

  // -------- dropdown data --------
  const [loadingMultitaskings, setLoadingMultitaskings] = useState(false);
  const [multitaskings, setMultitaskings] = useState<TOption[]>([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<TUserOption[]>([]);

  const [loadingManpower, setLoadingManpower] = useState(false);
  const [mtManpowerIds, setMtManpowerIds] = useState<string[]>([]);

  // name cache
  const nameCache = useRef(new Map<string, string>());
  const [nameVersion, setNameVersion] = useState(0);
  const idToName = (id: string) => nameCache.current.get(id) ?? id;
  const setName = (id: string, name: string) => nameCache.current.set(id, name);

  const fetchNames = async (ids: string[]) => {
    const unknown = ids.filter((uid) => {
      const cached = nameCache.current.get(uid);
      return !cached || cached === uid || looksLikeObjectId(cached);
    });
    if (!unknown.length) return;
    await Promise.all(
      unknown.map(async (uid) => {
        const name = await getSafeDisplayName(uid);
        setName(uid, name);
      })
    );
    setNameVersion((v) => v + 1);
  };

  // -------- styles --------
  const pageCls = clsx(
    "min-h-screen w-full px-4 py-6 rounded-xl transition-colors duration-300",
    isDark
      ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
      : "bg-white text-black"
  );
  const cardCls = clsx(
    "max-w-4xl mx-auto rounded-xl p-6 border space-y-5",
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

  // friendly MYT preview
  const prettyTaskDateMYT = useMemo(
    () =>
      formatToMalaysiaTime(`${taskDate}T00:00:00+08:00`, "dd MMM yyyy (EEE)"),
    [taskDate]
  );

  // -------- data fetching --------
  useEffect(() => {
    // 1) DSMM multitaskings: status=active (title list)
    (async () => {
      setLoadingMultitaskings(true);
      try {
        const res = await getDSMMMultitaskings("status=active");
        const items: TOption[] = Array.isArray(res?.data)
          ? res.data.map((mt: any) => ({
              _id: String(mt?._id || ""),
              title: mt?.title || "(Untitled DSMM Multitasking)",
            }))
          : [];
        items.sort((a, b) => a.title.localeCompare(b.title));
        setMultitaskings(items);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load DSMM multitaskings.");
        setMultitaskings([]);
      } finally {
        setLoadingMultitaskings(false);
      }
    })();

    // 2) Active DSMM users (resolve names even if API returns IDs)
    (async () => {
      setLoadingUsers(true);
      try {
        const q = new URLSearchParams({
          unit: "DSMM",
          status: "active",
          limit: "1000",
        });
        const res = await getAllUsers(q.toString());
        const mapped = normalizeUsers(res);

        // seed cache w/ whatever we have
        mapped.forEach((u) => setName(u._id, u.name));

        // find entries that look like IDs and resolve names
        const needsLookup = mapped.filter(
          (u) => !u.name || u.name === u._id || looksLikeObjectId(u.name)
        );

        if (needsLookup.length) {
          await Promise.all(
            needsLookup.map(async (u) => {
              const name = await getSafeDisplayName(u._id);
              setName(u._id, name);
            })
          );
        }

        // rebuild users with resolved names
        const withNames: TUserOption[] = mapped
          .map((u) => ({ _id: u._id, name: idToName(u._id) }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setUsers(withNames);
        setNameVersion((v) => v + 1);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load DSMM users.");
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);

  // When a multitasking is chosen, fetch **that multitasking** and read manpower[].userId
  useEffect(() => {
    if (!multiTask || !multiTaskId) {
      setMtManpowerIds([]);
      setSelectedManpower((prev) =>
        prev.filter((id) => !mtManpowerIds.includes(id))
      ); // keep user selections made from DSMM list
      return;
    }

    (async () => {
      setLoadingManpower(true);
      try {
        const r = await getDSMMMultitaskingById(multiTaskId);
        const ids: string[] = Array.isArray(r?.data?.manpower)
          ? r.data.manpower.map((m: any) => String(m?.userId)).filter(Boolean)
          : [];
        setMtManpowerIds(ids);
        await fetchNames(ids); // resolve names for display

        // preselect all multitasking manpower (merge with existing selections)
        setSelectedManpower((prev) => {
          const set = new Set(prev);
          ids.forEach((id) => set.add(id));
          return Array.from(set);
        });
      } catch (e: any) {
        toast.error(e?.message || "Failed to load multitasking manpower.");
        setMtManpowerIds([]);
      } finally {
        setLoadingManpower(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiTask, multiTaskId]);

  // computed lists
  const mtSet = useMemo(() => new Set(mtManpowerIds), [mtManpowerIds]);

  const dsmmOnlyList: TUserOption[] = useMemo(() => {
    if (!users.length) return [];
    return users
      .filter((u) => !mtSet.has(u._id)) // exclude MT users to avoid duplicate cards
      .map((u) => ({ _id: u._id, name: idToName(u._id) }))
      .sort((a, b) => a.name.localeCompare(b.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, mtSet, nameVersion]);

  const mtManpowerList: TUserOption[] = useMemo(
    () =>
      mtManpowerIds
        .map((id) => ({ _id: id, name: idToName(id) }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mtManpowerIds, nameVersion]
  );

  const toggleSelect = (id: string) =>
    setSelectedManpower((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const removeChip = (id: string) =>
    setSelectedManpower((prev) => prev.filter((x) => x !== id));

  // -------- submit --------
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!nice(title)) return toast.warning("Title is required.");
    if (!nice(taskDate)) return toast.warning("Task date is required.");
    if (!nice(startTime)) return toast.warning("Start time is required.");
    if (!nice(endTime)) return toast.warning("End time is required.");
    if (multiTask && !nice(multiTaskId))
      return toast.warning("Please choose a multitasking.");

    const startIso = new Date(
      `${taskDate}T${startTime}:00+08:00`
    ).toISOString();
    const endIso = new Date(`${taskDate}T${endTime}:00+08:00`).toISOString();

    if (new Date(endIso).getTime() < new Date(startIso).getTime()) {
      return toast.warning("End time must be after start time.");
    }

    const payload: TCreateDsmmTask = {
      title: nice(title),
      details: nice(details),
      multiTask,
      multiTaskId: multiTask ? nice(multiTaskId) : undefined,
      taskDate: myDateToIso(taskDate),
      startTime: startIso,
      endTime: endIso,
      selectedManpower: selectedManpower, // submit IDs only
      status: "completed",
    };

    try {
      setSubmitting(true);
      const res = await createDsmmTask(payload);

      if (res?.success) {
        toast.success(res?.message || "DSMM task created.");
        // reset
        setTitle("");
        setDetails("");
        setMultiTask(false);
        setMultiTaskId("");
        setMtManpowerIds([]);
        setSelectedManpower([]);
        setTaskDate(todayMYDate());
        setStartTime("10:00");
        setEndTime("17:00");
      } else {
        const msg =
          res?.message ||
          (Array.isArray(res?.errors)
            ? res.errors.map((e: any) => e.message).join(", ")
            : "") ||
          "Failed to create DSMM task.";
        toast.error(msg);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to create DSMM task.");
    } finally {
      setSubmitting(false);
    }
  };

  // ======= HYDRATION PLACEHOLDER =======
  if (!mounted) {
    return <div className="min-h-screen w-full px-4 py-6 opacity-0" />;
  }

  // -------- UI --------
  return (
    <div className={pageCls}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create DSMM Task</h1>
        <p className="mt-1">
          Fixed-time DSMM task with optional multitasking link and manpower.
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
            placeholder="e.g., DSMM Multitasking Part 1.0"
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
            placeholder="Add notes, objectives, or context…"
            className={clsx(
              fieldCls,
              isDark ? "bg-black/40 border-neutral-700" : "",
              "min-h-28"
            )}
          />
        </div>

        {/* Task Date (MYT) */}
        <div className="grid gap-1">
          <Label htmlFor="taskDate">Task Date (MYT)</Label>
          <Input
            id="taskDate"
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            className={isDark ? "bg-black/40 border-neutral-700" : ""}
          />
          <span className="text-xs opacity-70">MYT: {prettyTaskDateMYT}</span>
        </div>

        {/* Start & End Time */}
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
          </div>
        </div>

        {/* Multitasking toggle + dropdown (controls only the Multitasking section) */}
        <div className="grid gap-2">
          <Label>Link to a DSMM Multitasking?</Label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const next = !multiTask;
                setMultiTask(next);
                if (!next) {
                  // turning off: clear multitasking-specific state
                  setMultiTaskId("");
                  setSelectedManpower((prev) =>
                    prev.filter((id) => !mtManpowerIds.includes(id))
                  );
                  setMtManpowerIds([]);
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
                ? "We’ll include manpower from the selected multitasking."
                : "No multitasking link."}
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
                ? "Loading manpower…"
                : mtManpowerIds.length
                ? `Manpower found: ${mtManpowerIds.length}`
                : multiTaskId
                ? "No manpower in this multitasking."
                : "Choose a multitasking to load manpower."}
            </p>
          </div>
        )}

        {/* Selected Manpower chips (always visible) */}
        <div className="grid gap-2">
          <Label>Selected Manpower</Label>
          {selectedManpower.length ? (
            <div className="flex flex-wrap gap-2">
              {selectedManpower.map((uid) => (
                <Badge
                  key={uid}
                  variant="secondary"
                  className={clsx(
                    "flex items-center gap-1 pr-1",
                    isDark ? "bg-white/10 text-white" : ""
                  )}
                >
                  <span>{idToName(uid)}</span>
                  <button
                    type="button"
                    onClick={() => removeChip(uid)}
                    className="ml-1 inline-flex items-center justify-center rounded p-0.5 hover:opacity-80"
                    aria-label={`Remove ${idToName(uid)}`}
                    title={`Remove ${idToName(uid)}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm opacity-70">No members selected.</p>
          )}
        </div>

        {/* Multitasking manpower (ONLY when toggle is on) */}
        {multiTask && (
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Multitasking Manpower</Label>
              <span className="text-xs opacity-70">
                {loadingManpower
                  ? "Loading…"
                  : `${mtManpowerList.length} members`}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mtManpowerList.length ? (
                mtManpowerList.map((u) => {
                  const chosen = selectedManpower.includes(u._id);
                  return (
                    <button
                      key={`mt-${u._id}`}
                      type="button"
                      onClick={() => toggleSelect(u._id)}
                      className={clsx(
                        "flex items-center justify-between rounded-md border px-3 py-2 text-left transition",
                        isDark
                          ? "bg-black/40 border-neutral-700"
                          : "bg-white border-gray-300",
                        chosen
                          ? "opacity-70"
                          : isDark
                          ? "hover:bg-white/10"
                          : "hover:bg-gray-50"
                      )}
                      title={chosen ? "Unselect member" : "Select member"}
                    >
                      <span className="truncate">{u.name}</span>
                      {!chosen && <UserPlus className="h-4 w-4 opacity-70" />}
                    </button>
                  );
                })
              ) : (
                <p className="text-sm opacity-70">
                  {loadingManpower
                    ? "Loading manpower…"
                    : "No manpower available in this multitasking."}
                </p>
              )}
            </div>
          </div>
        )}

        {/* DSMM Active Users (ALWAYS visible) */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label>DSMM Active Users</Label>
            <span className="text-xs opacity-70">
              {loadingUsers ? "Loading…" : `${dsmmOnlyList.length} users`}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {dsmmOnlyList.length
              ? dsmmOnlyList.map((u) => {
                  const chosen = selectedManpower.includes(u._id);
                  return (
                    <button
                      key={`dsmm-${u._id}`}
                      type="button"
                      onClick={() => toggleSelect(u._id)}
                      className={clsx(
                        "flex items-center justify-between rounded-md border px-3 py-2 text-left transition",
                        isDark
                          ? "bg-black/40 border-neutral-700"
                          : "bg-white border-gray-300",
                        chosen
                          ? "opacity-70"
                          : isDark
                          ? "hover:bg-white/10"
                          : "hover:bg-gray-50"
                      )}
                      title={chosen ? "Unselect member" : "Select member"}
                    >
                      <span className="truncate">{u.name}</span>
                      {!chosen && <UserPlus className="h-4 w-4 opacity-70" />}
                    </button>
                  );
                })
              : !loadingUsers && (
                  <p className="text-sm opacity-70">No DSMM users available.</p>
                )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={onSubmit}
            disabled={submitting}
            variant="outline"
            className={clsx(
              "rounded-md",
              isDark
                ? "bg-white/10 hover:bg-white/20"
                : "bg-neutral-900 hover:bg-neutral-800 text-white"
            )}
          >
            {submitting ? "Creating…" : "Create DSMM Task"}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setTitle("");
              setDetails("");
              setMultiTask(false);
              setMultiTaskId("");
              setMtManpowerIds([]);
              setSelectedManpower([]);
              setTaskDate(todayMYDate());
              setStartTime("10:00");
              setEndTime("17:00");
            }}
            className={isDark ? "border-neutral-700 text-neutral-300" : ""}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateDsmmTask;
