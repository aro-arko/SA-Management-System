/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { UserPlus, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { getAllUsers, getUserNameById } from "@/services/UserService";
import {
  getFixedTimeEventById,
  updateFixedTimeEventById,
} from "@/services/EMUService/fixedTimeEventManagement";
import {
  getEmuMultitaskingById,
  getEmuMultitaskings,
} from "@/services/EMUService/multitaskings";

import { TFixedTimeEvent, TUpdateEventTask } from "@/types/emu/fixedEvent.type";
import { formatToMalaysiaTime } from "@/utils/formatDate";

type TUser = { _id: string; name: string };
type TMulti = { _id: string; title: string };

const nice = (s: string) => (s ?? "").trim();
const todayMY = () =>
  formatToMalaysiaTime(new Date().toISOString(), "yyyy-MM-dd");
const myDateToIso = (yyyyMmDd: string) =>
  new Date(`${yyyyMmDd}T00:00:00+08:00`).toISOString();
const isIdLike = (s?: string) => !!s && /^[0-9a-f]{24}$/i.test(s);

const UpdateEventTask = () => {
  const router = useRouter();
  const { id } = useParams();
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [task, setTask] = useState<TFixedTimeEvent | null>(null);
  const [title, setTitle] = useState("");
  const [multiTask, setMultiTask] = useState(false);
  const [multiTaskId, setMultiTaskId] = useState("");
  const [eventDate, setEventDate] = useState(todayMY());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("17:00");
  const [status, setStatus] = useState<"in-progress" | "completed">(
    "in-progress"
  );

  const [selectedManpower, setSelectedManpower] = useState<string[]>([]);
  const [mtUsersLoading, setMtUsersLoading] = useState(false);
  const [mtUserIds, setMtUserIds] = useState<string[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [emuUsers, setEmuUsers] = useState<TUser[]>([]);
  const [multis, setMultis] = useState<TMulti[]>([]);
  const [multisLoading, setMultisLoading] = useState(false);

  // userId -> name
  const nameCache = useRef(new Map<string, string>());
  const [nameVersion, setNameVersion] = useState(0); // force re-render when names update

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

  const prettyEventDateMYT = useMemo(
    () =>
      formatToMalaysiaTime(`${eventDate}T00:00:00+08:00`, "dd MMM yyyy (EEE)"),
    [eventDate]
  );

  const idToName = (id: string) => nameCache.current.get(id) ?? id;
  const setName = (id: string, name: string) => nameCache.current.set(id, name);

  const fetchNames = async (ids: string[]) => {
    const unknown = ids.filter((uid) => {
      const cached = nameCache.current.get(uid);
      return !cached || cached === uid || isIdLike(cached);
    });
    if (!unknown.length) return;
    await Promise.all(
      unknown.map(async (uid) => {
        try {
          const r = await getUserNameById(uid);
          const name =
            r?.data?.name ||
            [r?.data?.firstName, r?.data?.lastName].filter(Boolean).join(" ") ||
            r?.data?.email ||
            uid;
          setName(uid, name);
        } catch {
          setName(uid, uid);
        }
      })
    );
    setNameVersion((v) => v + 1);
  };

  const normalizeUsers = (src: any): TUser[] => {
    const arr = Array.isArray(src?.data)
      ? src.data
      : Array.isArray(src)
      ? src
      : [];
    return arr
      .map((u: any) => {
        const _id = String(u?._id || u?.id || "");
        if (!_id) return null;
        const name =
          u?.name ||
          [u?.firstName, u?.lastName].filter(Boolean).join(" ") ||
          u?.email ||
          _id;
        setName(_id, name);
        return { _id, name };
      })
      .filter(Boolean) as TUser[];
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getFixedTimeEventById(id as string);
        if (!res?.success) throw new Error("Failed to load event task.");
        const data: TFixedTimeEvent = res.data;
        if (cancelled) return;

        setTask(data);
        setTitle(data.title || "");
        setMultiTask(!!data.multiTask);
        setMultiTaskId(data.multiTaskId || "");
        setStartTime(data.startTime || "10:00");
        setEndTime(data.endTime || "17:00");
        setStatus(data.status === "completed" ? "completed" : "in-progress");
        setEventDate(
          formatToMalaysiaTime(String(data.eventDate), "yyyy-MM-dd")
        );

        if (data.multiTask && data.multiTaskId) {
          setMtUsersLoading(true);
          try {
            const mt = await getEmuMultitaskingById(data.multiTaskId);
            const ids: string[] = Array.isArray(mt?.data?.manpower)
              ? mt.data.manpower
                  .map((m: any) => String(m?.userId))
                  .filter(Boolean)
              : [];
            if (cancelled) return;
            setMtUserIds(ids);
            await fetchNames(ids);
            const pre = Array.isArray(data.selectedManpower)
              ? data.selectedManpower.map(String)
              : [];
            setSelectedManpower(pre);
          } finally {
            setMtUsersLoading(false);
          }
        } else {
          setMtUserIds([]);
          setSelectedManpower(
            Array.isArray(data.selectedManpower)
              ? data.selectedManpower.map(String)
              : []
          );
        }

        setUsersLoading(true);
        getAllUsers(
          new URLSearchParams({
            unit: "EMU",
            status: "active",
            limit: "1000",
          }).toString()
        )
          .then(async (r) => {
            if (cancelled) return;
            const mapped = normalizeUsers(r);
            await fetchNames(mapped.map((u) => u._id));
            const withResolved = mapped
              .map((u) => ({ _id: u._id, name: idToName(u._id) }))
              .sort((a, b) => a.name.localeCompare(b.name));
            setEmuUsers(withResolved);
          })
          .catch(() => setEmuUsers([]))
          .finally(() => setUsersLoading(false));

        setMultisLoading(true);
        getEmuMultitaskings("status=active")
          .then((r) => {
            if (cancelled) return;
            const arr: TMulti[] = Array.isArray(r?.data)
              ? r.data.map((m: any) => ({
                  _id: String(m?._id || ""),
                  title: m?.title || "(Untitled)",
                }))
              : [];
            arr.sort((a, b) => a.title.localeCompare(b.title));
            setMultis(arr);
          })
          .catch(() => setMultis([]))
          .finally(() => setMultisLoading(false));
      } catch (e: any) {
        toast.error(e?.message || "Failed to load event.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!multiTask || !multiTaskId) {
        setMtUserIds([]);
        setSelectedManpower([]);
        return;
      }
      setMtUsersLoading(true);
      try {
        const mt = await getEmuMultitaskingById(multiTaskId);
        const ids: string[] = Array.isArray(mt?.data?.manpower)
          ? mt.data.manpower.map((m: any) => String(m?.userId)).filter(Boolean)
          : [];
        if (cancelled) return;
        setMtUserIds(ids);
        await fetchNames(ids);
        setSelectedManpower([]); // requirement: when changed, refresh to unselected
      } catch (e: any) {
        if (!cancelled) {
          setMtUserIds([]);
          setSelectedManpower([]);
          toast.error(e?.message || "Failed to load multitasking manpower.");
        }
      } finally {
        if (!cancelled) setMtUsersLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [multiTask, multiTaskId]);

  const mtSet = useMemo(() => new Set(mtUserIds), [mtUserIds]);

  const manpowerList: TUser[] = useMemo(
    () =>
      mtUserIds
        .map((id) => ({ _id: id, name: idToName(id) }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [mtUserIds, nameVersion] // re-render when names resolve
  );

  const emuOnlyList: TUser[] = useMemo(() => {
    if (!emuUsers.length) return [];
    // render using cache so names improve after fetchNames
    return emuUsers
      .filter((u) => !mtSet.has(u._id))
      .map((u) => ({ _id: u._id, name: idToName(u._id) }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [emuUsers, mtSet, nameVersion]);

  const toggleSelect = (id: string) =>
    setSelectedManpower((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const removeChip = (id: string) =>
    setSelectedManpower((prev) => prev.filter((x) => x !== id));

  const onSave = async () => {
    if (!nice(title)) return toast.warning("Title is required.");
    if (!nice(eventDate)) return toast.warning("Event date is required.");
    if (!nice(startTime)) return toast.warning("Start time is required.");
    if (!nice(endTime)) return toast.warning("End time is required.");
    if (multiTask && !nice(multiTaskId))
      return toast.warning("Please choose a multitasking.");

    const payload: TUpdateEventTask = {
      title: nice(title),
      multiTask,
      multiTaskId: multiTask ? nice(multiTaskId) : undefined,
      eventDate: myDateToIso(eventDate),
      startTime,
      endTime,
      selectedManpower,
      status,
    };

    try {
      setSaving(true);
      const res = await updateFixedTimeEventById(id as string, payload);
      if (res?.success) {
        toast.success(res?.message || "Event updated.");
        router.push(`/emuadmin/event-tasks/${id}`);
      } else {
        const msg =
          res?.message ||
          (Array.isArray(res?.errors)
            ? res.errors.map((e: any) => e.message).join(", ")
            : "") ||
          "Failed to update event.";
        toast.error(msg);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to update event.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted)
    return <div className="min-h-screen w-full px-4 py-6 opacity-0" />;
  if (loading)
    return (
      <div className={pageCls}>
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  if (!task)
    return (
      <div className={pageCls}>
        <p className="text-red-500">Task not found.</p>
      </div>
    );

  return (
    <div className={pageCls}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Update Event Task</h1>
        <p className="mt-1 text-sm opacity-80">
          Edit details, link to a multitasking, and update manpower & status.
        </p>
      </div>

      <div className={cardCls}>
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={isDark ? "bg-black/40 border-neutral-700" : ""}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-1">
            <Label htmlFor="eventDate">Event Date (MYT)</Label>
            <Input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
            <span className="text-xs opacity-70">
              MYT: {prettyEventDateMYT}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="startTime">Start</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endTime">End</Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className={fieldCls}
          >
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="grid gap-2">
          <Label>Link to Multitasking?</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const next = !multiTask;
                setMultiTask(next);
                if (!next) {
                  setMultiTaskId("");
                  setMtUserIds([]);
                  setSelectedManpower([]);
                }
              }}
              className={isDark ? "border-neutral-700" : ""}
            >
              {multiTask ? "Yes (click to turn off)" : "No (click to turn on)"}
            </Button>
            <span className="text-sm opacity-80">
              {multiTask
                ? "Manpower list will be loaded from the selected multitasking."
                : "No linked multitasking."}
            </span>
          </div>
        </div>

        {multiTask && (
          <div className="grid gap-2">
            <Label htmlFor="multiTaskId">Multitasking</Label>
            <select
              id="multiTaskId"
              value={multiTaskId}
              onChange={(e) => setMultiTaskId(e.target.value)}
              className={fieldCls}
              disabled={multisLoading}
            >
              <option value="">
                {multisLoading
                  ? "Loading multitaskings…"
                  : "Select a multitasking"}
              </option>
              {multis.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title}
                </option>
              ))}
            </select>
            <p className="text-xs opacity-70">
              {mtUsersLoading
                ? "Loading manpower…"
                : mtUserIds.length
                ? `Manpower found: ${mtUserIds.length}`
                : multiTaskId
                ? "No manpower in this multitasking."
                : "Choose a multitasking to load manpower."}
            </p>
          </div>
        )}

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

        {multiTask && (
          <div className="grid gap-4">
            <div>
              <div className="flex items-center justify-between">
                <Label>Multitasking Manpower</Label>
                <span className="text-xs opacity-70">
                  {mtUserIds.length} members
                </span>
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {manpowerList.map((u) => {
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
                })}
                {!mtUserIds.length && (
                  <p className="text-sm opacity-70">
                    {mtUsersLoading
                      ? "Loading manpower…"
                      : "No manpower available."}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label>EMU Active Users</Label>
                <span className="text-xs opacity-70">
                  {usersLoading ? "Loading…" : `${emuOnlyList.length} users`}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {emuOnlyList.map((u) => {
                  const chosen = selectedManpower.includes(u._id);
                  return (
                    <button
                      key={`emu-${u._id}`}
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
                })}
                {!emuOnlyList.length && !usersLoading && (
                  <p className="text-sm opacity-70">No additional EMU users.</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={onSave}
            disabled={saving}
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
            onClick={() => router.push(`/emuadmin/event-tasks/${id}`)}
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

export default UpdateEventTask;
