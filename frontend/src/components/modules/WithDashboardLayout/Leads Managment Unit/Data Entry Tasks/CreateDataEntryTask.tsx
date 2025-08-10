/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { toast } from "sonner";
import { addDays } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

import {
  createDataEntryTask,
  getAllDataBatches,
} from "@/services/LMUService/dataManagement";
import {
  getAllUsers,
  getUserNameById,
  TaskDetails,
} from "@/services/UserService";
import { getAllMultitaskings } from "@/services/LMUService/multitaskings";

import { TCreateDataEntryTask } from "@/types/lmu/dataentry.type";

type BatchOption = { _id: string; title: string };
type UserOption = { _id: string; name: string };
type MultitaskOption = { _id: string; title: string };

const pad = (n: number) => String(n).padStart(2, "0");

export default function CreateDataEntryTask() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  // lookups
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [multitasks, setMultitasks] = useState<MultitaskOption[]>([]);
  const [multiManpowerIds, setMultiManpowerIds] = useState<string[]>([]);

  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMultitasks, setLoadingMultitasks] = useState(true);
  const [loadingManpower, setLoadingManpower] = useState(false);

  // NEW: merged list that includes missing manpower users
  const [combinedUsers, setCombinedUsers] = useState<UserOption[]>([]);

  // form
  const [title, setTitle] = useState("");
  const [batchId, setBatchId] = useState<string>("");
  const [multiTask, setMultiTask] = useState<boolean>(false);
  const [multiTaskId, setMultiTaskId] = useState<string>("");

  const [assignedTo, setAssignedTo] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = addDays(new Date(), 1);
    d.setHours(23, 59, 0, 0);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  const [schoolTeamTotalLeads, setSchoolTeamTotalLeads] = useState<string>("");
  const [campaignId, setCampaignId] = useState("");
  const [highestQualification, setHighestQualification] = useState("");
  const [preferredProgram, setPreferredProgram] = useState("");
  const [preferredIntake, setPreferredIntake] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [message, setMessage] = useState("");

  const [saving, setSaving] = useState(false);

  // styles
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

  // --- fetchers ---
  useEffect(() => {
    (async () => {
      try {
        setLoadingBatches(true);
        const res = await getAllDataBatches("isActive=true&limit=200");
        const opts: BatchOption[] = Array.isArray(res?.data)
          ? res.data
              .map((b: any) => ({
                _id: String(b?._id),
                title: b?.title || "(Untitled)",
              }))
              .sort((a: BatchOption, b: BatchOption) =>
                a.title.localeCompare(b.title)
              )
          : [];
        setBatches(opts);
      } catch (e: any) {
        setBatches([]);
        toast.error(e?.message || "Failed to load batches.");
      } finally {
        setLoadingBatches(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoadingUsers(true);
        const q = new URLSearchParams({
          unit: "LMU",
          status: "active",
          limit: "1000",
        });
        const res = await getAllUsers(q.toString());
        const base: UserOption[] = (
          Array.isArray(res?.data) ? res.data : []
        ).map((u: any) => ({
          _id: String(u?._id),
          name: u?.name || u?.email || String(u?._id),
        }));

        // Fill missing names if needed
        const needs = base.filter(
          (u) => !u.name || /^[0-9a-f]{24}$/i.test(u.name)
        );
        if (needs.length) {
          const fixed = await Promise.all(
            base.map(async (u) => {
              if (u.name && !/^[0-9a-f]{24}$/i.test(u.name)) return u;
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
          fixed.sort((a, b) => a.name.localeCompare(b.name));
          setUsers(fixed);
        } else {
          base.sort((a, b) => a.name.localeCompare(b.name));
          setUsers(base);
        }
      } catch (e: any) {
        setUsers([]);
        toast.error(e?.message || "Failed to load users.");
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoadingMultitasks(true);
        const res = await getAllMultitaskings("status=active");
        const opts: MultitaskOption[] = Array.isArray(res?.data)
          ? res.data
              .map((mt: any) => ({
                _id: String(mt?._id),
                title: mt?.title || "(Untitled MT)",
              }))
              .sort((a: BatchOption, b: BatchOption) =>
                a.title.localeCompare(b.title)
              )
          : [];
        setMultitasks(opts);
      } catch (e: any) {
        setMultitasks([]);
        toast.error(e?.message || "Failed to load multitaskings.");
      } finally {
        setLoadingMultitasks(false);
      }
    })();
  }, []);

  const loadManpower = useCallback(async (mtId: string) => {
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
      toast.error(e?.message || "Failed to load manpower.");
    } finally {
      setLoadingManpower(false);
    }
  }, []);

  useEffect(() => {
    if (multiTask && multiTaskId) loadManpower(multiTaskId);
    else setMultiManpowerIds([]);
  }, [multiTask, multiTaskId, loadManpower]);

  // ✅ Merge LMU users with multitask manpower (fetch missing IDs and include them)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const map = new Map<string, UserOption>();
      users.forEach((u) => map.set(u._id, u));

      // add missing manpower users
      const missing = multiTask
        ? multiManpowerIds.filter((id) => !map.has(id))
        : [];

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
                return { _id: id, name } as UserOption;
              } catch {
                return { _id: id, name: id } as UserOption;
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
  }, [users, multiTask, multiManpowerIds]);

  // keep assignedTo valid if lists change
  useEffect(() => {
    if (assignedTo && !combinedUsers.find((u) => u._id === assignedTo))
      setAssignedTo("");
  }, [combinedUsers, assignedTo]);

  // --- submit ---
  const onSubmit = async () => {
    if (!title.trim()) return toast.warning("Title is required.");
    if (!batchId) return toast.warning("Please choose a batch.");
    if (multiTask && !multiTaskId)
      return toast.warning("Please choose a multitasking.");
    if (!assignedTo) return toast.warning("Please choose an assignee.");
    if (!schoolTeamTotalLeads || Number(schoolTeamTotalLeads) <= 0)
      return toast.warning("Total leads must be greater than 0.");
    if (!dueDate) return toast.warning("Due date is required.");

    const dueIso = dueDate.length >= 16 ? `${dueDate}:00` : dueDate;

    const payload: TCreateDataEntryTask = {
      title: title.trim(),
      batchId,
      multiTask,
      multiTaskId: multiTask ? multiTaskId : undefined,
      assignedTo,
      dueDate: dueIso as any, // "YYYY-MM-DDTHH:mm:00"
      schoolTeamTotalLeads: Number(schoolTeamTotalLeads),
      campaignId: campaignId.trim(),
      highestQualification: highestQualification.trim(),
      preferredProgram: preferredProgram.trim(),
      preferredIntake: preferredIntake.trim(),
      schoolLevel: schoolLevel.trim(),
      schoolName: schoolName.trim(),
      message: message.trim(),
    };

    try {
      setSaving(true);
      const res = await createDataEntryTask(payload);
      if (res?.success) {
        toast.success(res?.message || "Data entry task created.");
        // reset
        setTitle("");
        setBatchId("");
        setMultiTask(false);
        setMultiTaskId("");
        setAssignedTo("");
        const d = addDays(new Date(), 1);
        d.setHours(23, 59, 0, 0);
        setDueDate(
          `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
            d.getDate()
          )}T${pad(d.getHours())}:${pad(d.getMinutes())}`
        );
        setSchoolTeamTotalLeads("");
        setCampaignId("");
        setHighestQualification("");
        setPreferredProgram("");
        setPreferredIntake("");
        setSchoolLevel("");
        setSchoolName("");
        setMessage("");
        setMultiManpowerIds([]);
      } else {
        toast.error(res?.message || "Failed to create task.");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to create task.");
    } finally {
      setSaving(false);
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
        <h1 className="text-3xl font-bold tracking-tight">
          Create Data Entry Task
        </h1>
        <p className="mt-1 text-sm opacity-80">
          Assign a data entry task and set all required details.
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
              placeholder="e.g., Data Entry Task for Batch 05/25"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
              disabled={saving}
            />
          </div>

          {/* Batch */}
          <div className="grid gap-2">
            <Label htmlFor="batchId">Batch</Label>
            <select
              id="batchId"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className={fieldCls}
              disabled={saving || loadingBatches}
            >
              <option value="">
                {loadingBatches ? "Loading…" : "Select a batch"}
              </option>
              {batches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.title}
                </option>
              ))}
            </select>
            <p className="text-xs opacity-70">
              Showing active batches (isActive=true).
            </p>
          </div>

          {/* Multitask toggle + picker */}
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
                disabled={saving}
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

          {multiTask && (
            <div className="grid gap-2">
              <Label htmlFor="multiTaskId">Multitasking</Label>
              <select
                id="multiTaskId"
                value={multiTaskId}
                onChange={(e) => setMultiTaskId(e.target.value)}
                className={fieldCls}
                disabled={saving || loadingMultitasks}
              >
                <option value="">
                  {loadingMultitasks
                    ? "Loading multitaskings…"
                    : "Select a multitasking"}
                </option>
                {multitasks.map((mt) => (
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
            </div>
          )}

          {/* Assigned To (multitask manpower first, then others) */}
          <div className="grid gap-2">
            <Label htmlFor="assignedTo">Assign To</Label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className={fieldCls}
              disabled={
                saving || loadingUsers || (multiTask && loadingManpower)
              }
            >
              <option value="">
                {loadingUsers || (multiTask && loadingManpower)
                  ? "Loading options…"
                  : "Select a user"}
              </option>

              {multiTask && multiManpowerIds.length > 0 && (
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
          </div>

          {/* Due date */}
          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
              disabled={saving}
            />
          </div>

          {/* Total leads */}
          <div className="grid gap-2">
            <Label htmlFor="totalLeads">Total Leads</Label>
            <Input
              id="totalLeads"
              type="number"
              min={1}
              value={schoolTeamTotalLeads}
              onChange={(e) => setSchoolTeamTotalLeads(e.target.value)}
              placeholder="e.g., 150"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
              disabled={saving}
            />
          </div>

          {/* Campaign / academic info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="campaignId">Campaign ID</Label>
              <Input
                id="campaignId"
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                placeholder="e.g., GZXCMB"
                className={isDark ? "bg-black/40 border-neutral-700" : ""}
                disabled={saving}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="highestQualification">
                Highest Qualification
              </Label>
              <Input
                id="highestQualification"
                value={highestQualification}
                onChange={(e) => setHighestQualification(e.target.value)}
                placeholder="e.g., SPM"
                className={isDark ? "bg-black/40 border-neutral-700" : ""}
                disabled={saving}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preferredProgram">Preferred Program</Label>
              <Input
                id="preferredProgram"
                value={preferredProgram}
                onChange={(e) => setPreferredProgram(e.target.value)}
                placeholder="e.g., FDBAA"
                className={isDark ? "bg-black/40 border-neutral-700" : ""}
                disabled={saving}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preferredIntake">
                Preferred Intake (YYYY-MM)
              </Label>
              <Input
                id="preferredIntake"
                value={preferredIntake}
                onChange={(e) => setPreferredIntake(e.target.value)}
                placeholder="e.g., 2026-02"
                className={isDark ? "bg-black/40 border-neutral-700" : ""}
                disabled={saving}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="schoolLevel">School Level</Label>
              <Input
                id="schoolLevel"
                value={schoolLevel}
                onChange={(e) => setSchoolLevel(e.target.value)}
                placeholder="e.g., Form 5"
                className={isDark ? "bg-black/40 border-neutral-700" : ""}
                disabled={saving}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="schoolName">School Name</Label>
              <Input
                id="schoolName"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g., SEKOLAH MENENGAH KEBANGSAAN TAMAN CONNAUGHT"
                className={isDark ? "bg-black/40 border-neutral-700" : ""}
                disabled={saving}
              />
            </div>
          </div>

          {/* Message */}
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Normal testing for data entry task creation"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
              disabled={saving}
            />
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
              {saving ? "Creating…" : "Create Task"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setTitle("");
                setBatchId("");
                setMultiTask(false);
                setMultiTaskId("");
                setAssignedTo("");
                setSchoolTeamTotalLeads("");
                setCampaignId("");
                setHighestQualification("");
                setPreferredProgram("");
                setPreferredIntake("");
                setSchoolLevel("");
                setSchoolName("");
                setMessage("");
                setMultiManpowerIds([]);
              }}
              className={isDark ? "border-neutral-700 text-neutral-300" : ""}
              disabled={saving}
            >
              Reset
            </Button>
          </div>
        </div>

        {(loadingBatches ||
          loadingUsers ||
          (multiTask && loadingManpower) ||
          loadingMultitasks) && (
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
}
