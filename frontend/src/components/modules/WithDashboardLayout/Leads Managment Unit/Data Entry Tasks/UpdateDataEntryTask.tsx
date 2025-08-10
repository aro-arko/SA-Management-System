/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

import { updateDataEntryTask } from "@/services/LMUService/dataManagement";
import {
  TaskDetails,
  getAllUsers,
  getUserNameById,
} from "@/services/UserService";
import {
  TUpdateDataEntryTask,
  TDataEntryTask,
} from "@/types/lmu/dataentry.type";

type UserOption = { _id: string; name: string };

const pad = (n: number) => String(n).padStart(2, "0");
const toInputLocal = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

export default function UpdateDataEntryTask() {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // users
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // multitask
  const [multiTaskId, setMultiTaskId] = useState<string>("");
  const [multiManpowerIds, setMultiManpowerIds] = useState<string[]>([]);
  const [loadingManpower, setLoadingManpower] = useState(false);

  // merged
  const [combinedUsers, setCombinedUsers] = useState<UserOption[]>([]);

  // form fields
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState(""); // datetime-local value
  const [schoolTeamTotalLeads, setSchoolTeamTotalLeads] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [highestQualification, setHighestQualification] = useState("");
  const [preferredProgram, setPreferredProgram] = useState("");
  const [preferredIntake, setPreferredIntake] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "in-progress" | "in-checking" | "completed"
  >("in-progress");

  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

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

  // ---------- load task + users ----------
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await TaskDetails(String(id));
        if (res?.success) {
          const t = res.data as TDataEntryTask;
          if (cancelled) return;

          setTitle(t.title || "");
          setAssignedTo(t.assignedTo || "");
          setDueDate(toInputLocal(t.dueDate as unknown as string));
          setSchoolTeamTotalLeads(String(t.schoolTeamTotalLeads ?? ""));
          setCampaignId(t.campaignId || "");
          setHighestQualification(t.highestQualification || "");
          setPreferredProgram(t.preferredProgram || "");
          setPreferredIntake(t.preferredIntake || "");
          setSchoolLevel(t.schoolLevel || "");
          setSchoolName(t.schoolName || "");
          setMessage(t.message || "");
          setStatus((t.status as any) || "in-progress");

          // 👇 detect multitaskId present on task and load manpower
          const mtId = (t as any)?.multiTaskId
            ? String((t as any).multiTaskId)
            : "";
          setMultiTaskId(mtId);

          if (mtId) {
            setLoadingManpower(true);
            try {
              const mtRes = await TaskDetails(mtId);
              if (mtRes?.success && Array.isArray(mtRes?.data?.manpower)) {
                const ids = mtRes.data.manpower
                  .map((m: any) => String(m?.userId))
                  .filter(Boolean);
                setMultiManpowerIds(ids);
              } else {
                setMultiManpowerIds([]);
              }
            } catch {
              setMultiManpowerIds([]);
            } finally {
              setLoadingManpower(false);
            }
          } else {
            setMultiManpowerIds([]);
          }
        } else {
          toast.error(res?.message || "Failed to load task.");
        }
      } catch (e: any) {
        toast.error(e?.message || "Failed to load task.");
      } finally {
        if (!cancelled) setLoading(false);
      }

      // users
      try {
        setLoadingUsers(true);
        const q = new URLSearchParams({
          unit: "LMU",
          status: "active",
          limit: "1000",
        });
        const resU = await getAllUsers(q.toString());
        let list: UserOption[] = (
          Array.isArray(resU?.data) ? resU.data : []
        ).map((u: any) => ({
          _id: String(u?._id),
          name: u?.name || u?.email || String(u?._id),
        }));

        // fill names if needed
        const needs = list.filter(
          (u) => !u.name || /^[0-9a-f]{24}$/i.test(u.name)
        );
        if (needs.length) {
          const filled = await Promise.all(
            list.map(async (u) => {
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
          list = filled;
        }

        list.sort((a, b) => a.name.localeCompare(b.name));
        if (!cancelled) setUsers(list);
      } catch (e: any) {
        if (!cancelled) setUsers([]);
        toast.error(e?.message || "Failed to load users.");
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ---------- merge LMU users + multitasking manpower (add missing) ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const map = new Map<string, UserOption>();
      users.forEach((u) => map.set(u._id, u));

      // if task has multiTaskId, ensure those manpower users exist in list
      const missing = multiTaskId
        ? multiManpowerIds.filter((uid) => !map.has(uid))
        : [];
      if (missing.length) {
        try {
          const lookups = await Promise.all(
            missing.map(async (uid) => {
              try {
                const r = await getUserNameById(uid);
                const name =
                  r?.data?.name ||
                  [r?.data?.firstName, r?.data?.lastName]
                    .filter(Boolean)
                    .join(" ") ||
                  r?.data?.email ||
                  uid;
                return { _id: uid, name } as UserOption;
              } catch {
                return { _id: uid, name: uid } as UserOption;
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
  }, [users, multiTaskId, multiManpowerIds]);

  // keep assignedTo valid if lists change
  useEffect(() => {
    if (assignedTo && !combinedUsers.find((u) => u._id === assignedTo))
      setAssignedTo("");
  }, [combinedUsers, assignedTo]);

  // ---------- submit ----------
  const onSubmit = async () => {
    if (!title.trim()) return toast.warning("Title is required.");
    if (!assignedTo) return toast.warning("Please choose an assignee.");
    if (!schoolTeamTotalLeads || Number(schoolTeamTotalLeads) <= 0)
      return toast.warning("School team total leads must be greater than 0.");
    if (!dueDate) return toast.warning("Due date is required.");

    const dueIso = dueDate.length >= 16 ? `${dueDate}:00` : dueDate;
    const due = new Date(dueIso);

    const payload: TUpdateDataEntryTask = {
      title: title.trim(),
      assignedTo,
      dueDate: due,
      schoolTeamTotalLeads: Number(schoolTeamTotalLeads),
      campaignId: campaignId.trim(),
      highestQualification: highestQualification.trim(),
      preferredProgram: preferredProgram.trim(),
      preferredIntake: preferredIntake.trim(),
      schoolLevel: schoolLevel.trim(),
      schoolName: schoolName.trim(),
      message: message.trim(),
      status,
    };

    try {
      setSaving(true);
      const res = await updateDataEntryTask(payload, String(id));
      if (res?.success) toast.success(res?.message || "Task updated.");
      else toast.error(res?.message || "Failed to update task.");
    } catch (e: any) {
      toast.error(e?.message || "Failed to update task.");
    } finally {
      setSaving(false);
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
            {Array.from({ length: 6 }).map((_, i) => (
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

  return (
    <div className={pageCls}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Update Data Entry Task
        </h1>
        <p className="mt-1 text-sm opacity-80">
          Edit task details and save changes.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        <div className={cardCls} aria-busy={saving} aria-live="polite">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Data Entry Task — Week 2"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
              disabled={saving}
            />
          </div>

          {/* Assign To (multitask manpower group first if exists) */}
          <div className="grid gap-2">
            <Label htmlFor="assignedTo">Assign To</Label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className={fieldCls}
              disabled={saving || loadingUsers || loadingManpower}
            >
              <option value="">
                {loadingUsers || loadingManpower
                  ? "Loading options…"
                  : "Select a user"}
              </option>

              {multiTaskId && multiManpowerIds.length > 0 && (
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
            {multiTaskId ? (
              <p className="text-xs opacity-70">
                Multitasking ID: {/* <Link href={}> */}
                <span className="font-mono">{multiTaskId}</span>
                {/* </Link> */}
              </p>
            ) : null}
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
              disabled={saving}
            />
          </div>

          {/* School Team Total Leads */}
          <div className="grid gap-2">
            <Label htmlFor="schoolTeamTotalLeads">
              School Team Total Leads
            </Label>
            <Input
              id="schoolTeamTotalLeads"
              type="number"
              min={1}
              value={schoolTeamTotalLeads}
              onChange={(e) => setSchoolTeamTotalLeads(e.target.value)}
              placeholder="e.g., 150"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
              disabled={saving}
            />
          </div>

          {/* Campaign / Academic */}
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
                placeholder="e.g., SMK Taman Connaught"
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
              placeholder="Optional note for the assignee"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
              disabled={saving}
            />
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className={fieldCls}
              disabled={saving}
            >
              <option value="in-progress">In Progress</option>
              <option value="in-checking">In Checking</option>
              <option value="completed">Completed</option>
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
                TaskDetails(String(id))
                  .then(async (res) => {
                    if (res?.success) {
                      const t = res.data as TDataEntryTask;
                      setTitle(t.title || "");
                      setAssignedTo(t.assignedTo || "");
                      setDueDate(toInputLocal(t.dueDate as unknown as string));
                      setSchoolTeamTotalLeads(
                        String(t.schoolTeamTotalLeads ?? "")
                      );
                      setCampaignId(t.campaignId || "");
                      setHighestQualification(t.highestQualification || "");
                      setPreferredProgram(t.preferredProgram || "");
                      setPreferredIntake(t.preferredIntake || "");
                      setSchoolLevel(t.schoolLevel || "");
                      setSchoolName(t.schoolName || "");
                      setMessage(t.message || "");
                      setStatus((t.status as any) || "in-progress");

                      // refresh multitask context on reset as well
                      const mtId = (t as any)?.multiTaskId
                        ? String((t as any).multiTaskId)
                        : "";
                      setMultiTaskId(mtId);
                      if (mtId) {
                        setLoadingManpower(true);
                        try {
                          const mtRes = await TaskDetails(mtId);
                          if (
                            mtRes?.success &&
                            Array.isArray(mtRes?.data?.manpower)
                          ) {
                            const ids = mtRes.data.manpower
                              .map((m: any) => String(m?.userId))
                              .filter(Boolean);
                            setMultiManpowerIds(ids);
                          } else setMultiManpowerIds([]);
                        } catch {
                          setMultiManpowerIds([]);
                        } finally {
                          setLoadingManpower(false);
                        }
                      } else {
                        setMultiManpowerIds([]);
                      }
                    }
                  })
                  .finally(() => setLoading(false));
              }}
              className={isDark ? "border-neutral-700 text-neutral-300" : ""}
              disabled={saving}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
