/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getEmuMultitaskingById,
  updateEmuMultitasking,
} from "@/services/EMUService/multitaskings";

// ---------- Types ----------
type TEmuMultitasking = {
  _id: string;
  title: string;
  eventDate: string; // ISO
  startTime: string; // ISO
  endTime: string; // ISO
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
};

type TUpdatePayload = {
  title: string;
  eventDate: string; // ISO
  startTime: string; // ISO
  endTime: string; // ISO
  status: "active" | "inactive";
};

// ---------- Tiny helpers (no change to your utils/formatDate.ts) ----------
const toDateInputValue = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const toTimeInputValue = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const combineDateAndTimeToISO = (dateStr: string, timeStr: string) => {
  // Interpret as LOCAL time and return ISO (UTC) via toISOString()
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0);
  return dt.toISOString();
};

const UpdateEmuMultitasking = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(""); // YYYY-MM-DD (local)
  const [startTime, setStartTime] = useState(""); // HH:mm (local)
  const [endTime, setEndTime] = useState(""); // HH:mm (local)
  const [status, setStatus] = useState<"active" | "inactive">("active");

  useEffect(() => setMounted(true), []);
  const isDark = useMemo(
    () => mounted && resolvedTheme === "dark",
    [mounted, resolvedTheme]
  );

  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-white text-black";

  const fieldCls = clsx(
    "w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
    isDark
      ? "bg-black text-white border-neutral-700"
      : "bg-white border-gray-300"
  );

  // ---------- Load existing ----------
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await getEmuMultitaskingById(String(id));
        if (!res?.success || !res?.data) {
          toast.error(res?.message || "Failed to load EMU multitasking.");
          return;
        }
        if (cancelled) return;

        const mt = res.data as TEmuMultitasking;
        setTitle(mt.title ?? "");
        setStatus((mt.status as "active" | "inactive") ?? "active");

        // Pre-fill date (from startTime if available) and times
        const baseISO = mt.startTime || mt.eventDate;
        setEventDate(toDateInputValue(baseISO));
        setStartTime(toTimeInputValue(mt.startTime));
        setEndTime(toTimeInputValue(mt.endTime));
      } catch (e: any) {
        toast.error(e?.message || "Failed to load EMU multitasking.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ---------- Submit ----------
  const onSubmit = async () => {
    if (!title.trim()) return toast.warning("Title is required.");
    if (!eventDate) return toast.warning("Event date is required.");
    if (!startTime) return toast.warning("Start time is required.");
    if (!endTime) return toast.warning("End time is required.");

    const startISO = combineDateAndTimeToISO(eventDate, startTime);
    const endISO = combineDateAndTimeToISO(eventDate, endTime);

    if (new Date(endISO).getTime() <= new Date(startISO).getTime()) {
      return toast.warning("End time must be later than start time.");
    }

    // Match your sample payload: eventDate = startTime instant
    const payload: TUpdatePayload = {
      title: title.trim(),
      eventDate: startISO,
      startTime: startISO,
      endTime: endISO,
      status,
    };

    try {
      setSaving(true);
      const res = await updateEmuMultitasking(String(id), payload);
      if (res?.success) {
        toast.success(res?.message || "EMU multitasking updated.");
      } else {
        toast.error(res?.message || "Failed to update EMU multitasking.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong while updating.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-black transition-colors duration-300" />
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <div className="max-w-full mx-auto space-y-10">
          <div className="text-center space-y-3">
            <Skeleton
              className={`mx-auto h-10 w-3/4 sm:w-1/2 rounded-md ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
              }`}
            />
            <Skeleton
              className={`mx-auto h-6 w-24 rounded-full ${
                isDark ? "bg-[#2a2a2a]" : "bg-gray-200"
              }`}
            />
          </div>

          <div
            className={`rounded-xl p-6 ${
              isDark
                ? "bg-black/10 border-neutral-700"
                : "bg-neutral-50 border-neutral-200"
            }`}
          >
            <div className="grid gap-4 max-w-xl mx-auto">
              {Array.from({ length: 5 }).map((_, i) => (
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
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Update EMU Multitasking</h1>
          <p className="mt-3 text-sm opacity-80">
            Modify title, date & time, and status, then save your changes.
          </p>
        </div>

        {/* Form */}
        <div>
          <div className="grid gap-4 max-w-xl mx-auto">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Checking emu multitasking update"
                disabled={saving}
                className={isDark ? "bg-black/40 border-neutral-700" : ""}
              />
            </div>

            {/* Event Date */}
            <div className="grid gap-2">
              <Label htmlFor="eventDate">Event Date</Label>
              <input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                disabled={saving}
                className={fieldCls}
              />
            </div>

            {/* Start Time */}
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={saving}
                className={fieldCls}
              />
            </div>

            {/* End Time */}
            <div className="grid gap-2">
              <Label htmlFor="endTime">End Time</Label>
              <input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={saving}
                className={fieldCls}
              />
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "active" | "inactive")
                }
                disabled={saving}
                className={fieldCls}
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={onSubmit}
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
                onClick={() => {
                  setLoading(true);
                  getEmuMultitaskingById(String(id))
                    .then((res) => {
                      if (res?.success && res?.data) {
                        const mt = res.data as TEmuMultitasking;
                        setTitle(mt.title ?? "");
                        setStatus(
                          (mt.status as "active" | "inactive") ?? "active"
                        );
                        const baseISO = mt.startTime || mt.eventDate;
                        setEventDate(toDateInputValue(baseISO));
                        setStartTime(toTimeInputValue(mt.startTime));
                        setEndTime(toTimeInputValue(mt.endTime));
                      }
                    })
                    .finally(() => setLoading(false));
                }}
                disabled={saving}
                className={isDark ? "border-neutral-700 text-neutral-300" : ""}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmuMultitasking;
