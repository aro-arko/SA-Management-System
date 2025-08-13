/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { getEmuMultitaskings } from "@/services/EMUService/multitaskings";
import {
  getAllUsers,
  getUserNameById,
  TaskDetails,
} from "@/services/UserService";
import { createEventTask } from "@/services/EMUService/fixedTimeEventManagement";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import { TCreateEventTask } from "@/types/emu/fixedEvent.type";

type TOption = { _id: string; title: string };
type TUserOption = { _id: string; name: string };

const nice = (s: string) => s.trim();

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
        id;
      return { _id: id, name };
    })
    .filter(Boolean) as TUserOption[];
};

// helper: get today as yyyy-MM-dd in MYT using your util
const todayMYDate = () =>
  formatToMalaysiaTime(new Date().toISOString(), "yyyy-MM-dd");

// helper: convert yyyy-MM-dd (interpreted as MYT midnight) to ISO
const myDateToIso = (yyyyMmDd: string) =>
  new Date(`${yyyyMmDd}T00:00:00+08:00`).toISOString();

const CreateEventTask = () => {
  const { resolvedTheme } = useTheme();

  // --- HYDRATION-SAFE MOUNT GATE ---
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // only compute theme after mount to avoid SSR mismatch
  const isDark = mounted && resolvedTheme === "dark";

  // -------- form state --------
  const [title, setTitle] = useState("");
  const [multiTask, setMultiTask] = useState(false);
  const [multiTaskId, setMultiTaskId] = useState("");

  // use MYT for the date value
  const [eventDate, setEventDate] = useState<string>(todayMYDate());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("17:00");

  // optional: allow selecting manpower (pre-fills from selected multitasking)
  const [selectedManpower, setSelectedManpower] = useState<string[]>([]);

  // -------- dropdown data --------
  const [loadingMultitaskings, setLoadingMultitaskings] = useState(false);
  const [multitaskings, setMultitaskings] = useState<TOption[]>([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<TUserOption[]>([]);

  const [loadingManpower, setLoadingManpower] = useState(false);
  const [mtManpowerIds, setMtManpowerIds] = useState<string[]>([]);

  // -------- styles --------
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

  // friendly MYT preview like "10 Aug 2025 (Sun)"
  const prettyEventDateMYT = useMemo(
    () =>
      formatToMalaysiaTime(`${eventDate}T00:00:00+08:00`, "dd MMM yyyy (EEE)"),
    [eventDate]
  );

  // -------- data fetching --------
  useEffect(() => {
    // 1) EMU multitaskings: status=active
    (async () => {
      setLoadingMultitaskings(true);
      try {
        const res = await getEmuMultitaskings("status=active");
        const items: TOption[] = Array.isArray(res?.data)
          ? res.data.map((mt: any) => ({
              _id: String(mt?._id || ""),
              title: mt?.title || "(Untitled Multitasking)",
            }))
          : [];
        items.sort((a, b) => a.title.localeCompare(b.title));
        setMultitaskings(items);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load EMU multitaskings.");
        setMultitaskings([]);
      } finally {
        setLoadingMultitaskings(false);
      }
    })();

    // 2) Active EMU users (for name resolution + optional selection)
    (async () => {
      setLoadingUsers(true);
      try {
        const q = new URLSearchParams({
          unit: "EMU",
          status: "active",
          limit: "1000",
        });
        const res = await getAllUsers(q.toString());
        const mapped = normalizeUsers(res);
        mapped.sort((a, b) => a.name.localeCompare(b.name));
        setUsers(mapped);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load EMU users.");
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!multiTask || !multiTaskId) {
      setMtManpowerIds([]);
      setSelectedManpower([]);
      return;
    }

    (async () => {
      setLoadingManpower(true);
      try {
        const res = await TaskDetails(multiTaskId);
        const ids: string[] = Array.isArray(res?.data?.manpower)
          ? res.data.manpower.map((m: any) => String(m?.userId)).filter(Boolean)
          : [];
        setMtManpowerIds(ids);
        setSelectedManpower(ids); // preselect all
      } catch (e: any) {
        toast.error(e?.message || "Failed to load multitasking manpower.");
        setMtManpowerIds([]);
        setSelectedManpower([]);
      } finally {
        setLoadingManpower(false);
      }
    })();
  }, [multiTask, multiTaskId]);

  // Fill missing names on-demand
  useEffect(() => {
    if (!mtManpowerIds.length) return;
    (async () => {
      const known = new Set(users.map((u) => u._id));
      const missing = mtManpowerIds.filter((id) => !known.has(id));
      if (!missing.length) return;

      try {
        const fetched = await Promise.all(
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
        const merged = [...users, ...fetched].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setUsers(merged);
      } catch {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mtManpowerIds]);

  const manpowerName = useMemo(() => {
    const map = new Map(users.map((u) => [u._id, u.name]));
    return (id: string) => map.get(id) ?? id;
  }, [users]);

  // -------- submit --------
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!nice(title)) return toast.warning("Title is required.");
    if (!nice(eventDate)) return toast.warning("Event date is required.");
    if (!nice(startTime)) return toast.warning("Start time is required.");
    if (!nice(endTime)) return toast.warning("End time is required.");
    if (multiTask && !nice(multiTaskId))
      return toast.warning("Please choose a multitasking.");

    // Convert MYT date to ISO so backend gets the correct intended day
    const eventDateIso = myDateToIso(eventDate);

    const payload: TCreateEventTask = {
      title: nice(title),
      multiTask,
      multiTaskId: multiTask ? nice(multiTaskId) : undefined,
      eventDate: eventDateIso,
      startTime,
      endTime,
    };

    try {
      setSubmitting(true);
      const res = await createEventTask(payload);

      if (res?.success) {
        toast.success(res?.message || "Event task created.");
        // reset
        setTitle("");
        setMultiTask(false);
        setMultiTaskId("");
        setEventDate(todayMYDate());
        setStartTime("10:00");
        setEndTime("17:00");
        setSelectedManpower([]);
        setMtManpowerIds([]);
      } else {
        const msg =
          res?.message ||
          (Array.isArray(res?.errors)
            ? res.errors.map((e: any) => e.message).join(", ")
            : "") ||
          "Failed to create event task.";
        toast.error(msg);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to create event task.");
    } finally {
      setSubmitting(false);
    }
  };

  // ======= HYDRATION PLACEHOLDER (prevents flash/mismatch) =======
  if (!mounted) {
    // Invisible but preserves layout to avoid jumps
    return (
      <div className="min-h-screen w-full px-4 py-6 opacity-0">
        {/* neutral/invisible placeholder per your preference */}
      </div>
    );
  }

  // -------- UI --------
  return (
    <div className={pageCls}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create Event Task</h1>
        <p className="mt-1">
          Fixed-time EMU event with optional Multitasking link.
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
            placeholder="e.g., Open Day Cycle 2.1"
            className={isDark ? "bg-black/40 border-neutral-700" : ""}
          />
        </div>

        {/* Event Date (MYT) */}
        <div className="grid gap-1">
          <Label htmlFor="eventDate">Event Date (MYT)</Label>
          <Input
            id="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className={isDark ? "bg-black/40 border-neutral-700" : ""}
          />
          <span className="text-xs opacity-70">MYT: {prettyEventDateMYT}</span>
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

        {/* MultiTask toggle */}
        <div className="grid gap-2">
          <Label>Link to an EMU Multitasking?</Label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setMultiTask((v) => !v);
                if (multiTask) {
                  setMultiTaskId("");
                  setMtManpowerIds([]);
                  setSelectedManpower([]);
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
                ? "We’ll include manpower from the selected Multitasking."
                : "No multitasking link."}
            </span>
          </div>
        </div>

        {/* Multitasking dropdown */}
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
          </div>
        )}

        {/* Optional: choose manpower (shows names; passes IDs) */}
        {multiTask && mtManpowerIds.length > 0 && (
          <div className="grid gap-2">
            <Label htmlFor="manpower">Manpower (optional)</Label>
            <select
              id="manpower"
              multiple
              value={selectedManpower}
              onChange={(e) => {
                const opts = Array.from(e.target.selectedOptions).map(
                  (o) => o.value
                );
                setSelectedManpower(opts);
              }}
              className={clsx(fieldCls, "min-h-28")}
              disabled={loadingManpower || loadingUsers}
            >
              {mtManpowerIds.map((id) => (
                <option key={id} value={id}>
                  {manpowerName(id)}
                </option>
              ))}
            </select>
            <p className="text-xs opacity-70">
              We display names here, but the IDs will be sent in the payload.
            </p>
          </div>
        )}

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
            {submitting ? "Creating…" : "Create Event Task"}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setTitle("");
              setMultiTask(false);
              setMultiTaskId("");
              setMtManpowerIds([]);
              setSelectedManpower([]);
              setEventDate(todayMYDate());
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

export default CreateEventTask;
